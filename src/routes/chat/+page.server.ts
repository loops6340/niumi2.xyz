import { getAllUsersData } from '$lib/db.js';
import { sendCode, sendMessage } from '$lib/server/discord-chat.js';
import { fail } from '@sveltejs/kit';
import jwt from 'jsonwebtoken'

export const load = async () => {

	const { data, error } = await getAllUsersData()

	if (error) {
		return {
			users: null
		}
	}

	return {
		users: data?.map(user => ({ name: user.name, avatarURL: user.avatar_url }))
	}
};

export const actions = {
	sendMessage: async ({ request, cookies }) => {
		
        const data = await request.formData();

		try {
            const content = data.get("content") as string
            const file = data.get("file") as File
            let author = data.get("author") as string

			const accessToken = cookies.get("access_token")
			if (accessToken) {
				const data = jwt.decode(accessToken) as jwt.JwtPayload;
				author = data.name
			}
			if (!content && file.size === 0) {
          		return fail(400, {
            		invalid: true,
            		message: "Debes escribir algo, o mandar algún archivo...",
          		})
			}

            await sendMessage(content, file, author)
		} catch (error) {
			return fail(422, {
				description: 'Ocurrió un error',
			    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
			    //@ts-expect-error
                error: error.message
			});
		}
	},
	sendCode: async ({ request, cookies }) => {
		
        const data = await request.formData();

		try {
            const content = data.get("content") as string
            let author = data.get("author") as string
			const filename = data.get("filename") as string

			
			const accessToken = cookies.get("access_token")
			if (accessToken) {
				const data = jwt.decode(accessToken) as jwt.JwtPayload;
				author = data.name
			}

            await sendCode(content, filename, author || "anonimo")
		} catch (error) {
			return fail(422, {
				description: 'Ocurrió un error',
			    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
			    //@ts-expect-error
                error: error.message
			});
		}
	},
};
