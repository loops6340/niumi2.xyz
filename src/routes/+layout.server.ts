import type { LayoutServerLoad } from './$types';
import jwt from "jsonwebtoken";

export const load: LayoutServerLoad = async ({ cookies }) => {

	const accessToken = cookies.get("access_token")
	if (accessToken) {
		const data = jwt.decode(accessToken) as jwt.JwtPayload;
		console.log(data)
		return {
			user: data || null
		};
	}
	console.log("refrescado")

	return {
		user: null
	}
};