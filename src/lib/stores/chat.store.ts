import { writable } from 'svelte/store';
import ChatService, { ChatsService } from '$lib/db/ChatService';
import type { SupabaseClient } from '@supabase/supabase-js';
import type { Chat, Message } from '$lib/db/types';

export type MessageState = Message & { pending?: boolean; readed?: boolean };

export const messages = writable<MessageState[]>([]);

export const chats = writable<Chat[]>([]);

type UIWindowsNames = 'chatsLeftSection' | 'chatSection' | 'chatRightPanel';

export const UIWindowHierarchy = writable<
	{
		active: boolean;
		name: UIWindowsNames;
	}[]
>([
	{
		name: 'chatsLeftSection',
		active: true
	},
	{
		name: 'chatSection',
		active: false
	},
	{
		name: 'chatRightPanel',
		active: false
	},
]);

export class UIWindowHierarchyStore {
	static setShowFullPanel(name: UIWindowsNames) {
		UIWindowHierarchy.update((windows) => {
			console.log("xd")

			return windows.map((window) => {
				if (window.name === name) {
					window.active = true;
				} else {
					window.active = false;
				}
				return window;
			});
		});
	}
	static setShowPreviousPanel(name: UIWindowsNames) {
		switch (name) {
			case 'chatSection':
				this.setShowFullPanel('chatsLeftSection');
				break;
			case 'chatRightPanel':
				this.setShowFullPanel('chatSection');
		}
	}
	static getVisibility(
		name: UIWindowsNames,
		windows: {
			active: boolean;
			name: UIWindowsNames;
		}[]
	) {
		return windows.find((w) => w.name === name)!.active;
	}
	static getVisibilityClasses(		name: UIWindowsNames,
		windows: {
			active: boolean;
			name: UIWindowsNames;
		}[]) {
			return this.getVisibility(name, windows) ? "max-md:w-full " : "max-md:hidden"
		}
}

export class MessagesStore {
	unshift(value: MessageState) {
		messages.update((messages) => [{ ...value, readed: false }, ...messages]);
	}

	async load(supabaseClient: SupabaseClient, chatId: string) {
		const chatService = new ChatService(supabaseClient, chatId);
		const { data, error } = await chatService.getMessages();
		if (error) {
			throw error;
		}
		messages.set(data!.reverse());
	}

	set(index: number, message: Partial<MessageState>) {
		messages.update((msgs) => {
			const updated = [...msgs];
			updated[index] = {
				...updated[index],
				...message
			};
			return updated;
		});
	}
}

export class ChatStore {
	chatId: string;
	constructor(chatId: string) {
		this.chatId = chatId;
	}

	addUnreadedMessage() {
		chats.update((chats) =>
			chats.map((chat) => {
				if (chat.id === this.chatId) {
					chat.unreaded_messages++;
				}
				return chat;
			})
		);
	}

	async viewMessages(supabase: SupabaseClient) {
		const chatService = new ChatService(supabase, this.chatId);
		await chatService.readMessages();

		chats.update((chats) =>
			chats.map((chat) => {
				if (chat.id === this.chatId) {
					chat.unreaded_messages = 0;
				}
				return chat;
			})
		);
	}

	changeLastMessage(message: Message) {
		chats.update((chats) => {
			const index = chats.findIndex((chat) => chat.id === this.chatId);
			chats[index] = {
				...chats[index],
				...{ last_message: message }
			};
			return chats;
		});
	}
}

export class ChatsStore {
	async load(supabase: SupabaseClient) {
		const chatsService = new ChatsService(supabase);
		const { data, error } = await chatsService.getAll();

		// set name and photo in DM Chat

		const { data: userData, error: userError } = await supabase.auth.getUser();

		if (userError) {
			alert('sesión expirada');
		}

		if (!error) {
			for (const chat of data) {
				if (!chat.name) {
					chat.name = chat.members?.find((member) => member.id !== userData.user?.id)?.name || '';
					chat.photo_url =
						chat.members?.find((member) => member.id !== userData.user?.id)?.avatar_url || '';
				}
			}

			chats.set(data);
			this.order();
		}
	}

	async loadWithoutResetUnreadedMessages(supabase: SupabaseClient) {
		const chatsService = new ChatsService(supabase);
		const { data, error } = await chatsService.getAll();

		// set name and photo in DM Chat

		const { data: userData, error: userError } = await supabase.auth.getUser();

		if (userError) {
			alert('sesión expirada');
		}

		if (!error) {
			chats.update((chats) => {
				for (const chat of data) {
					if (!chat.name) {
						chat.name = chat.members?.find((member) => member.id !== userData.user?.id)?.name || '';
						chat.photo_url =
							chat.members?.find((member) => member.id !== userData.user?.id)?.avatar_url || '';
					}
					const c = chats.find((c) => chat.id === c.id)?.unreaded_messages;
					console.log('ac', c);
					if (c !== undefined) chat.unreaded_messages = c;
				}
				console.log('dc', data);
				return data;
			});
			this.order();
		}
	}
	order() {
		chats.update((chats) =>
			chats.sort((a, b) => {
				return (
					new Date(b.last_message?.created_at || 0).getTime() -
					new Date(a.last_message?.created_at || 0).getTime()
				);
			})
		);
	}
}
