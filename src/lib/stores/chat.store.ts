import { writable } from "svelte/store";
import ChatService, { ChatsService } from "$lib/db/ChatService";
import type { SupabaseClient } from "@supabase/supabase-js";
import type { Chat, Message } from "$lib/db/types";

export type MessageState = Message & { pending?: boolean }

export const messages = writable<MessageState[]>([])


export const chats = writable<Chat[]>([])

export class MessagesStore {
    chatId: string;
    constructor(chatId: string) {
        this.chatId = chatId;
    }

    unshift(value: MessageState) {
        messages.update(messages => [value, ...messages])
    }

    async load(supabaseClient: SupabaseClient) {
        const chatService = new ChatService(supabaseClient, this.chatId);
        const { data, error } = await chatService.getMessages();
        if (error) {
            throw error;
        }
        messages.set(data!.reverse())
    }

    set(index: number, message: Partial<MessageState>) {
        messages.update((msgs) => {
            const updated = [...msgs];
            updated[index] = {
                ...updated[index],
                ...message
            };
            return updated;
        })
    }


   
  
}

export class ChatStore {
    chatId: string;
    constructor(chatId: string) {
        this.chatId = chatId;
    }
    
    changeLastMessage(message: Message) {
        chats.update(chats => {
            const index = chats.findIndex(chat => chat.id === this.chatId)
            chats[index] = {
                ...chats[index],
                ...{ last_message: message }
            }
            return chats;
        })
    }
}

export class ChatsStore {
    async load(supabase: SupabaseClient) {
        const chatsService = new ChatsService(supabase)
        const { data, error } = await chatsService.getAll()
        
        // set name and photo in DM Chat

        const { data: userData, error: userError } = await supabase.auth.getUser()

        if (userError) {
            alert("sesión expirada")
        }

        for (const chat of data) {
            if (!chat.name) {
                chat.name = chat.members?.find(member => member.id !== userData.user?.id)?.name || ''
                chat.photo_url = chat.members?.find(member => member.id !== userData.user?.id)?.avatar_url || ''
            }
        }
        
        if (!error) {
            chats.set(data)
        }
    }
}

