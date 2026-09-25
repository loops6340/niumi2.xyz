import type { SupabaseClient } from '@supabase/supabase-js';
class ChatSocket {
	private supabaseClient: SupabaseClient;
	constructor(supabaseClient: SupabaseClient) {
		this.supabaseClient = supabaseClient;
	}
	on<T>(event: 'message' | 'attachmentAdded' | 'joinedChat', cb: (props: { data: T }) => void) {
		switch (event) {
			case 'message': {
				const channel = this.supabaseClient
					.channel('table-db-changes')
					.on(
						'postgres_changes',
						{
							event: '*',
							schema: 'public',
							table: 'messages'
						},
						(payload) => {
							cb({ data: payload.new as T });
						}
					)
					.subscribe();
				return channel;
			}
			case "attachmentAdded": {
				const channel = this.supabaseClient
					.channel('attachment-db-changes')
					.on(
						'postgres_changes',
						{
							event: '*',
							schema: 'public',
							table: 'attachments'
						},
						(payload) => {
							cb({ data: payload.new as T });
						}
					)
					.subscribe();
				return channel;
			}
			case "joinedChat": {
				const channel = this.supabaseClient
					.channel('joined-db-changes')
					.on(
						'postgres_changes',
						{
							event: '*',
							schema: 'public',
							table: 'users_chats'
						},
						(payload) => {
							cb({ data: payload.new as T });
						}
					)
					.subscribe();
				return channel;
			}
		}
	}
}

export default ChatSocket;
