import axios from 'axios';
import FormDataServer from 'form-data';
import { Readable } from 'stream';
import { Routes } from 'discord-api-types/v10';
import { TOKEN, CHANNEL_ID } from '$env/static/private';

export interface Message {
	pending: boolean;
	type: number;
	content: string;
	mentions: unknown[];
	mention_roles: unknown[];
	attachments: Attachment[];
	embeds: unknown[];
	timestamp: string;
	edited_timestamp: null;
	flags: number;
	components: unknown[];
	id: string;
	channel_id: string;
	author: Author;
	pinned: boolean;
	mention_everyone: boolean;
	tts: boolean;
}

export interface Author {
	id: string;
	username: string;
	avatar: string;
	discriminator: string;
	public_flags: number;
	flags: number;
	bot?: boolean;
	banner: null;
	accent_color: null;
	global_name: null | string;
	avatar_decoration_data: null;
	collectibles: null;
	display_name_styles: null;
	banner_color: null;
	clan: Clan | null;
	primary_guild: Clan | null;
}

interface Clan {
	identity_guild_id: string;
	identity_enabled: boolean;
	tag: string;
	badge: string;
}

export interface Attachment {
	id: string;
	filename: string;
	size: number;
	url: string;
	proxy_url: string;
	content_type: string;
	content_scan_version: number;
}


const sendCode = async (content: string, filename: string, author: string) => {
	const form = new FormDataServer();
	const buffer = Buffer.from(content, 'utf-8');
	const stream = Readable.from(buffer);

	form.append(
		'payload_json',
		JSON.stringify({ content: author ? `{${author}}:${filename}` : filename })
	);

	form.append('files[0]', stream, `${filename}.java`);

	await axios.post(`https://discord.com/api/v10/channels/${CHANNEL_ID}/messages`, form, {
		headers: {
			...form.getHeaders(),
			Authorization: `Bot ${TOKEN}`
		}
	});
};

const sendMessage = async (content: string, file: File, author: string) => {
	try {
		let stream: Readable = new Readable();

		const form = new FormDataServer();

		if (file) {
			if (file.size !== 0) {
				console.log(file, typeof(file))
				const fileArrayBuffer = await file.arrayBuffer();
				const buffer = Buffer.from(fileArrayBuffer);
				stream = Readable.from(buffer);
			}

			if (file.size !== 0) {
				form.append('files[0]', stream, `${file.name}`);
			}
		}
		form.append(
			'payload_json',
			JSON.stringify({ content: author ? `{${author}}: ${content}` : content })
		);

		await axios.post(`https://discord.com/api/v10/channels/${CHANNEL_ID}/messages`, form, {
			headers: {
				...form.getHeaders(),
				Authorization: `Bot ${TOKEN}`
			}
		});
	} catch (e) {
		console.log(e);
		return new Error('Limite excedido');
	}
};

async function baseRequest(url: string) {
	return await axios(url, {
		headers: {
			Authorization: `Bot ${TOKEN}`
		}
	});
}

async function getMostsRecent() {
	const mensajes = await baseRequest(
		`https://discord.com/api/v10${Routes.channelMessages(CHANNEL_ID!)}`
	);
	return mensajes.data as Message[];
}

async function getBefore(id: string) {
	const mensajes = await baseRequest(
		`https://discord.com/api/v10${Routes.channelMessages(CHANNEL_ID!)}?before=${id}`
	);
	return mensajes.data as Message[];
}

export { sendMessage, sendCode, getMostsRecent, getBefore };
