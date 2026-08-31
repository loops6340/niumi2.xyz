import type { SupabaseClient } from '@supabase/supabase-js';
import type { Database } from './db.types';

interface EditUserDataProps {
	id: string;
	name?: string;
	password?: string;
	avatarURL?: string;
}

export class UserService {
	supabaseClient: SupabaseClient<Database>;
	constructor(supabaseClient: SupabaseClient) {
		this.supabaseClient = supabaseClient;
	}

	private getProfilesTable() {
 		return this.supabaseClient.from("Profiles")
	}

	async editUserData(data: EditUserDataProps) {
		const { error } = await this.supabaseClient
			.from('Profiles')
			.update({ avatar_url: data.avatarURL })
			.eq('id', data.id);
		return { error };
	}

	async getAllUsersData() {
		const { data, error } = await this.getProfilesTable().select();
		return { data, error };
	}

	async registerUser(name: string, password: string) {
		const { error } = await this.supabaseClient.auth.signUp({
            email: `${name.split(" ").join("-")}@niumi.xyz`,
            password: password,
            options: {
            emailRedirectTo: 'https://example.com/welcome',
          },
        })
		return { error }
	}

    async getUser(id: string) {
        const query = this.getProfilesTable().select().eq("id", id);

		const { data, error } = await query

        return { data: data?.[0], error: error } 
    }
	
}