import { sendCode } from '$lib/server/discord-chat.js';
import { fail } from '@sveltejs/kit';
import jwt from 'jsonwebtoken'

export const actions = {
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
