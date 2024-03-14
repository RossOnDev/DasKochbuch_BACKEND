import {createHash} from "crypto";
import process from "process";
import jwt, {Secret} from "jsonwebtoken";
import {UserRepository} from "@repositories/UserRepository";

export class AuthHelper {
	public static generateHash(text: string) {
		return createHash('sha256').update(text).digest('hex');
	}

	public static generateToken(userId: number, username: string) {
		return jwt.sign({username: username, userId: userId}, process.env.TOKEN_SECRET as Secret, {expiresIn: '1d'});
	}

	public static validateToken(token: string) {
		type TokenType = {username: string, userId: number, exp: number, iat: number};
		return jwt.verify(token, process.env.TOKEN_SECRET as string) as TokenType;
	}

	public static async isAdmin(userId: number) {
		const userRepository = new UserRepository();
		const user = await userRepository.getUserById(userId);
		if (!user) throw "User doesn't exist";

		return !!user.roles.find(role => role.isAdmin);
	}
}