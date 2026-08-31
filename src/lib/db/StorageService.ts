import type { SupabaseClient } from '@supabase/supabase-js';
import path from 'node:path';

export default class StorageService {
	private supabaseClient: SupabaseClient;
	constructor(supabaseClient: SupabaseClient) {
		this.supabaseClient = supabaseClient;
	}

	async uploadAvatar(file: File) {
		const { data, error } = await this.supabaseClient.storage
			.from('niumi')
			.upload(path.join('/avatars/', file.name + '_' + crypto.randomUUID()), file);
		console.log(data, error);
		return { data, error };
	}

	getPublicURL(path: string) {
		const url = this.supabaseClient.storage.from('niumi').getPublicUrl(path);
		return url.data.publicUrl;
	}

	async uploadFile(file: File) {
		const { data, error } = await this.supabaseClient.storage
			.from('niumi')
			.upload(path.join('/files/', file.name + '_' + crypto.randomUUID()), file);
		return { data, error };
	}

	async removeFile(path: string) {
		const { data, error } = await this.supabaseClient.storage
			.from('niumi').remove([path])
		return { data, error };
	}

	async exists(path: string) {
		const { data, error } = await this.supabaseClient.storage
			.from('niumi').exists(path)
		return { data, error };
	}

}
