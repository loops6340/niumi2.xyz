import StorageService from '$lib/db/StorageService';
import type { PostgrestError, SupabaseClient } from '@supabase/supabase-js';
import type { Chat, Message } from './types';
interface MessageDataProps {
	id: string;
	content: string;
	authorId: string;
	attachments?: File[];
}

export class ChatsService {
	supabaseClient: SupabaseClient;
	constructor(supabaseClient: SupabaseClient) {
		this.supabaseClient = supabaseClient;
	}

	async getAll() {
		const { data, error } = await this.supabaseClient.from('chats').select(`
            *,
            last_message:messages!last_message_id(
                *,
                author:profiles(*)
            ),
            members:profiles(*)
        `);
		const { data: uData } = await this.supabaseClient.rpc("get_unreaded_messages")
		for (let i = 0; i < (data?.length || 0); i++) {
			for (const uChat of uData) {
				if (data?.[i].id === uChat.chat_id) {
					data![i].unreaded_messages = uChat.unreaded_messages;
				}
			}
		}

		console.log(error, data);
		return { data: data, error } as { data: Chat[]; error: PostgrestError };
	}

	getChat(id: string) {
		return new ChatService(this.supabaseClient, id);
	}

	// CURRENT USER ACCOUNT WITH 
	
	async getDMChat(user_id: string) {
		const { data, error } = await this.supabaseClient
			.from('users_chats')
			.select('*, chat:chats!inner(type, id)')
			.filter('chat.type', 'eq', '1')
			.eq('user_id', user_id);
		if (error) {
			return { error: error };
		}

		if (data.length > 0) return { data: data[0].chat, error: null };
		return { data: null, error: null };
	}

	async DMChatExists(user_id: string) {
		const { data, error } = await this.supabaseClient
			.from('users_chats')
			.select('chat:chats!inner(type)')
			.filter('chat.type', 'eq', '1')
			.eq('user_id', user_id);
		if (error) {
			return { error: error };
		}

		if (data.length !== 0) return { data: true, error: null };
		return { data: false, error: null };
	}

	//




	async createDMChat(user1: string, withUser: string) {
		if (user1 == withUser) {
			return { error: true };
		}
		const id = crypto.randomUUID();
		const { error } = await this.supabaseClient.from('chats').insert({
			id,
			type: 1
		});

		if (error) {
			return { error };
		}

		const { error: user1Error } = await this.supabaseClient.from('users_chats').insert({
			chat_id: id,
			user_id: user1
		});

		if (error) {
			return { error: user1Error };
		}

		const { error: user2Error } = await this.supabaseClient.from('users_chats').insert({
			chat_id: id,
			user_id: withUser
		});

		if (user2Error) {
			return { error: user2Error };
		}
		return { id, error: null };
	}

	async getMessage(id: string) {
		const result = await this.supabaseClient
			.from('messages')
			.select(
				`
            id,
            content,
            created_at,
            chat_id,
            author:profiles(*),
            attachments:attachments(id, filename, url, created_at)
        `
			)
			.eq('id', id)
			.single();
		return result;
	}

	async joinToDMChat(chatId: string) {
		const { data: userData } = await this.supabaseClient.auth.getUser();

		const { error } = await this.supabaseClient.from('users_chats').insert({
			chat_id: chatId,
			user_id: userData.user?.id
		});

		if (error) {
			return { error: error };
		}
	}
}

export default class ChatService {
	supabaseClient: SupabaseClient;
	chatId: string;
	constructor(supabaseClient: SupabaseClient, chatId: string) {
		this.chatId = chatId;
		this.supabaseClient = supabaseClient;
	}

	async update({ lastMessageId, lastMessageTimestamp }: { lastMessageId: string, lastMessageTimestamp: string }) {
		const { data, error } = await this.supabaseClient
			.from('chats')
			.update({
				last_message_id: lastMessageId,
				last_message_timestamp: lastMessageTimestamp
			})
			.eq('id', this.chatId);
		return { data, error };
	}

	async getMessages() {
		const result = await this.supabaseClient
			.from('messages')
			.select(
				`
            id,
            content,
            created_at,
            chat_id,
            author:profiles!inner(id, name, avatar_url, created_at),
            attachments:attachments(id, filename, url, created_at, id)
        `
			)
			.eq('chat_id', this.chatId);

		return result as { data: Message[] | null; error: PostgrestError | null };
	}

	async sendMessage({ id, content, authorId, attachments }: MessageDataProps) {
		const { data: messageData, error } = await this.supabaseClient
			.from('messages')
			.insert({
				id,
				content,
				author_id: authorId,
				chat_id: this.chatId
			})
			.select()
			.single();

		if (error) return { error };

		if (attachments) {
			const storageService = new StorageService(this.supabaseClient);
			const { data: fileData, error: fileError } = await storageService.uploadFile(attachments[0]);

			if (fileError) return { error: fileError };

			const { error } = await this.supabaseClient.from('attachments').insert({
				filename: attachments[0].name,
				url: storageService.getPublicURL(fileData!.path),
				author_id: authorId,
				message_id: messageData.id
			});

			if (error) {
				const { error: removeFileError } = await storageService.removeFile(fileData!.path);
				const { error: removeMessageError } = await this.removeMessage(messageData.id);
				if (removeFileError) return { data: messageData, fileData, error: removeFileError };
				if (removeMessageError) return { data: messageData, fileData, error: removeMessageError };
				return { fileData, error };
			}
		}

		const messageFinalData = await this.supabaseClient
			.from('messages')
			.select(
				`
            *,
            author:profiles(*),
            attachments:attachments(*)
        `
			)
			.eq('id', messageData.id)
			.single();

		if (attachments) return { data: messageFinalData.data, error: error };

		return { data: messageFinalData.data, error };
	}

	async removeMessage(id: string) {
		const { data, error } = await this.supabaseClient.from('messages').delete().eq('id', id);
		return { data, error };
	}

	async readMessages() {
		const { error } = await this.supabaseClient.rpc("read_messages", { p_chat_id: this.chatId })
		return { error }
	}
}
