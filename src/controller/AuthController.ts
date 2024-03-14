import {UserRepository} from "@repositories/UserRepository";
import {NextFunction, Request, Response} from "express";
import {StatusCodes} from "http-status-codes";
import {AuthHelper} from "@utils/AuthHelper";
import {JsonWebTokenError} from "jsonwebtoken";

export class AuthController {
	private static readonly USER_REPOSITORY = new UserRepository();

	public static async getUserByLogin(req: Request, res: Response, next: NextFunction) {
		try {
			const {username, password} = req.body;
			if (!username || !password) {
				res.sendStatus(StatusCodes.UNPROCESSABLE_ENTITY)
				return;
			}

			const user = await AuthController.USER_REPOSITORY.getUserByLogin(username, AuthHelper.generateHash(password));
			if (user) {
				res.json({
					user: user.toDto(),
					token: AuthHelper.generateToken(user.id, user.username)
				})
			}
			else {
				res.sendStatus(StatusCodes.NOT_FOUND);
			}
		} catch (error: any) {
			next(error)
		}
	}

	public static async isTokenValid(req: Request, res: Response, next: NextFunction) {
		try {
			const {token} = req.body;
			if (!token) {
				res.sendStatus(StatusCodes.UNPROCESSABLE_ENTITY);
				return;
			}

			const validatedToken = AuthHelper.validateToken(token);
			const user = await AuthController.USER_REPOSITORY.getUserById(validatedToken.userId);
			if (!user) {
				res.sendStatus(StatusCodes.CONFLICT);
				return;
			}

			res.json(user.toDto());
		} catch (error: any) {
			if (error instanceof JsonWebTokenError) {
				res.status(StatusCodes.UNAUTHORIZED).send(error.message);
				return;
			}

			next(error);
		}
	}
}