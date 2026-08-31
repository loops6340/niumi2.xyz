import { writable } from "svelte/store";
import ChatService, { type Message } from "$lib/db/ChatService";
import type { SupabaseClient } from "@supabase/supabase-js";

export type MessageState = Message & { pending?: boolean }

export const messages = writable<MessageState[]>([])

class MessagesList {
    unshift(value: MessageState) {
        messages.update(messages => [value, ...messages])
    }

    async load(supabaseClient: SupabaseClient, id: number) {
        const chatService = new ChatService(supabaseClient, id);
        const { data, error } = await chatService.getMessages();
        if (error) {
            throw error;
        }
        messages.set(data!.reverse())
    }

    async set(index: number, message: MessageState) {
        messages.update((msgs) => {
            msgs[index] = message;
            return msgs;
        })
    }
}

// class ChatsList {
//     unshift(value: MessageState) {
//         chats.update(messages => [value, ...messages])
//     }

//     async load(supabaseClient: SupabaseClient, id: number) {
//         const chatService = new ChatService(supabaseClient, id);
//         const { data, error } = await chatService.getMessages();
//         if (error) {
//             throw error;
//         }
//         messages.set(data!.reverse())
//     }

//     async set(index: number, message: MessageState) {
//         messages.update((msgs) => {
//             msgs[index] = message;
//             return msgs;
//         })
//     }
// }

export default class ChatStore {
    messages: MessagesList
	constructor() {
        this.messages = new MessagesList()
	}
}

