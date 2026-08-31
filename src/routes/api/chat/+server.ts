import { type RequestHandler } from '@sveltejs/kit';
import ChatService from '$lib/db/ChatService'
import { UserService } from '$lib/db/UserService';


export const GET: RequestHandler = async ({ locals }) => {


    const chatService = new ChatService(locals.supabase, 1)
    const userService = new UserService(locals.supabase);

	// const beforeId = url.searchParams.get('before');

    // let data: Message[];

    // if (beforeId === null) {
    //     data = await getMostsRecent()
    // } else {
    //     data = await getBefore(beforeId)
    // }

    const messages = await chatService.getMessages();

    if (messages.error) {
        return new Response()
    }
    
    const users = await userService.getAllUsersData()

    if (users.error) {
        return new Response()
    }

    return new Response(JSON.stringify(messages));
};