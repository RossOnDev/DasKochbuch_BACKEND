import {NextFunction, Request, Response} from "express";
import CookieHelper from "@utils/CookieHelper";
import {StatusCodes} from "http-status-codes";
import {AuthHelper} from "@utils/AuthHelper";
import {JsonWebTokenError} from "jsonwebtoken";

export class AuthMiddleware {
	public static isLoggedIn(req: Request, res: Response, next: NextFunction) {
		const authCookie = req.cookies[CookieHelper.AUTH_COOKIE_NAME];
		if (!authCookie) return res.sendStatus(StatusCodes.UNAUTHORIZED);
		try {
			AuthHelper.validateToken(authCookie);
			return next();
		} catch (error: any) {
			if (error instanceof JsonWebTokenError) {
				return res.status(StatusCodes.UNAUTHORIZED).send(error.message);
			}

			return next(error);
		}
	}

	public static async isAdmin(req: Request, res: Response, next: NextFunction) {
		const authCookie = req.cookies[CookieHelper.AUTH_COOKIE_NAME];

		if (!authCookie) return res.sendStatus(StatusCodes.UNAUTHORIZED);

		let userToken;
		try {
			userToken = AuthHelper.validateToken(authCookie);
		} catch (error: any) {
			if (error instanceof JsonWebTokenError) {
				return res.status(StatusCodes.UNAUTHORIZED).send(error.message);
			}

			return next(error);
		}

		try {
			const isAdmin = await AuthHelper.isAdmin(userToken.userId);
			if (isAdmin) {
				return next();
			}
			else {
				return res.sendStatus(StatusCodes.UNAUTHORIZED);
			}
		} catch (error: any) {
			return next(error);
		}
	}
}
