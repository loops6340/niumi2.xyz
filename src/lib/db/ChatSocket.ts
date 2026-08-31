import type { SupabaseClient } from '@supabase/supabase-js';
import type { Message } from './ChatService';
class ChatSocket {
	private supabaseClient: SupabaseClient;
	constructor(supabaseClient: SupabaseClient) {
		this.supabaseClient = supabaseClient;
	}
	on(event: 'message', cb: (props: { data: Message }) => void) {
		const channel = this.supabaseClient
			.channel('table-db-changes')
			.on(
				'postgres_changes',
				{
					event: '*',
					schema: 'public',
					table: 'Messages'
				},
				(payload) => {
					cb({ data: payload.new as Message });
				}
			)
			.subscribe();
		return channel;
	}
}

export default ChatSocket