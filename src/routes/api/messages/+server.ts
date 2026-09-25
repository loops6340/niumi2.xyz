import { type RequestHandler } from '@sveltejs/kit';
import ChatService from '$lib/db/ChatService'

export const POST: RequestHandler = async ({ locals, request }) => {

    const { data, error } = await locals.supabase.auth.getUser()
    
    if (error) {
        return new Response()
    }

    const formData = await request.formData()
    const chatId = formData.get("chat_id") as string
    console.log("chat_id", chatId)

    const chatService = new ChatService(locals.supabase, chatId)
    
    const content = formData.get("content") as string;
    const file = formData.get("file") as File;
    const id = formData.get("id") as string;
    const message = await chatService.sendMessage({
        id,
        authorId: data.user.id,
        content,
        attachments: file instanceof File && file.size > 0 ? [file] : undefined,
    })
    console.log(message.data, message.error)
    return new Response(JSON.stringify(message.data));
};