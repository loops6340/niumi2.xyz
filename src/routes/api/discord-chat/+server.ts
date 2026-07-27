import { getBefore, getMostsRecent, type Message } from '$lib/server/discord-chat';
import { type RequestHandler } from '@sveltejs/kit';



export const GET: RequestHandler = async ({ url }) => {
	const beforeId = url.searchParams.get('before');

    let data: Message[];

    if (beforeId === null) {
        data = await getMostsRecent()
    } else {
        data = await getBefore(beforeId)
    }
    
	return new Response(JSON.stringify(data));
};