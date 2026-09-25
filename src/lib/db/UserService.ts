import type { SupabaseClient } from '@supabase/supabase-js';

interface EditUserDataProps {
	id: string;
	name?: string;
	password?: string;
	avatarURL?: string;
}

export class UserService {
	async getUserByName(name: string) {
		const { data, error } = await this.getProfilesTable().select("*").eq('name', name).single()
		return { data, error }
	}
	supabaseClient: SupabaseClient;
	constructor(supabaseClient: SupabaseClient) {
		this.supabaseClient = supabaseClient;
	}

	private getProfilesTable() {
 		return this.supabaseClient.from("profiles")
	}

	async editUserData(data: EditUserDataProps) {
		const { error } = await this.getProfilesTable()
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

		const { error: profilesError } = await this.supabaseClient.from("profiles").insert({
			name,
        })
		if (profilesError) console.log(profilesError)

		return { error }
	}

    async getUser(id: string) {
        const query = this.getProfilesTable().select().eq("id", id);

		const { data, error } = await query

        return { data: data?.[0], error: error } 
    }
	
}