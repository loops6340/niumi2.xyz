import { type RequestHandler } from '@sveltejs/kit';
import ChatService from '$lib/db/ChatService'

export const POST: RequestHandler = async ({ locals, request }) => {

    const chatService = new ChatService(locals.supabase, 1)
    const { data, error } = await locals.supabase.auth.getUser()
    
    if (error) {
        return new Response()
    }

    const formData = await request.formData()
    
    const content = formData.get("content") as string;
    const file = formData.get("file") as File;

    const message = await chatService.sendMessage({
        authorId: data.user.id,
        content,
        attachments: file instanceof File && file.size > 0 ? [file] : undefined
    })
    console.log(message.data)
    return new Response(JSON.stringify(message.data));
};