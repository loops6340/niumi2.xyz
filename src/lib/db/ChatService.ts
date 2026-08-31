import StorageService from '$lib/db/StorageService';
import type { PostgrestError, SupabaseClient } from '@supabase/supabase-js';

interface MessageDataProps {
	content: string;
    authorId: string;
    attachments?: File[]
}

export interface Attachment {
    filename: string;
    url: string;
    id: number,
}

export interface User {
    id: string;
    name: string;
    avatar_url: string;
    created_at: string;
}

export interface Message {
    id: string;
    content: string;
    created_at: string;
    user: User;
    attachments: Attachment[]
}

export default class ChatService {
	supabaseClient: SupabaseClient;
    chatId: number;
	constructor(supabaseClient: SupabaseClient, chatId: number) {
        this.chatId = chatId
		this.supabaseClient = supabaseClient;
	}

    async getMessages() {
        const result = await this.supabaseClient.from("Messages").select(`
            id,
            content,
            created_at,
            user:Profiles!inner(id, name, avatar_url, created_at),
            attachments:Attachments(id, filename, url, created_at, id)
        `)
        .eq("chat_id", this.chatId)
        
        return result as { data: Message[] | null, error: PostgrestError | null};
    }

	async sendMessage({ content, authorId, attachments }: MessageDataProps) {
        const { data: messageData, error } = await this.supabaseClient.from("Messages").insert({
            content,
            author_id: authorId,
            chat_id: this.chatId
        }).select().single();

        if (error) return { error }
        
        if (attachments) {
            const storageService = new StorageService(this.supabaseClient)
            const { data: fileData, error: fileError } = await storageService.uploadFile(attachments[0])
            
            if (fileError) return { error: fileError };

            const { error } = await this.supabaseClient.from("Attachments").insert({
                filename: attachments[0].name,
                url: storageService.getPublicURL(fileData!.path),
                author_id: authorId,
                message_id: messageData.id
            })

            if (error) {
              const { error: removeFileError } = await storageService.removeFile(fileData!.path)
              const { error: removeMessageError } = await this.removeMessage(messageData.id)
              if (removeFileError) return { data: messageData, fileData, error: removeFileError }
              if (removeMessageError) return { data: messageData, fileData, error: removeMessageError }
              return { fileData, error }  
            } 
        }

        const messageFinalData = await this.supabaseClient.from("Messages").select(`
            *,
            author:Profiles(*),
            attachments:Attachments(*)
        `).eq("id", messageData.id).single();

        if (attachments) return { data: messageFinalData.data, error: error }

        return { data: messageFinalData.data, error }
	}

    async removeMessage(id: string) {
        const { data, error } = await this.supabaseClient.from("Messages").delete().eq("id", id);
        return { data, error }
    }
}