import {NextFunction, Request, Response} from "express";
import {UserRepository} from "@repositories/UserRepository";
import {UserDto} from "@models/Dto/UserDto";
import {User} from "@models/User";
import {StatusCodes} from "http-status-codes";
import {HttpException} from "../exceptions/HttpException";
import {AuthHelper} from "@utils/AuthHelper";

export class UserController {
	private static readonly USER_REPOSITORY = new UserRepository();

	public static async getUsers(req: Request, res: Response, next: NextFunction) {
		try {
			const withDeleted = !!req.query.withDeleted;
			const users = await UserController.USER_REPOSITORY.getUsers(withDeleted);
			const usersDto = users.map(user => user.toDto());
			res.json(usersDto);
		} catch (error: any) {
			next(error);
		}
	}

	public static async getUserById(req: Request, res: Response, next: NextFunction) {
		try {
			const withDeleted = !!req.query.withDeleted
			const user = await UserController.USER_REPOSITORY.getUserById(Number(req.params.id), withDeleted);
			if (user) {
				res.json(user.toDto())
			}
			else {
				res.sendStatus(StatusCodes.NOT_FOUND);
			}
		} catch (error: any) {
			next(error)
		}
	}

	public static async createUser(req: Request, res: Response, next: NextFunction) {
		try {
			const userDto: UserDto = req.body;
			const user = await User.fromDto(userDto);

			await UserController.USER_REPOSITORY.createUser(user);

			res.sendStatus(StatusCodes.CREATED)
		} catch (error: any) {
			console.log(error)

			if (error instanceof HttpException) {
				res.status(error.status).json(error.toDto())
				return;
			}

			next(error)
		}
	}

	public static async updateUser(req: Request, res: Response, next: NextFunction) {
		try {
			const userDto: UserDto = req.body;
			const user = await User.fromDto(userDto);
			await UserController.USER_REPOSITORY.updateUser(user);

			res.sendStatus(StatusCodes.OK);
		} catch (error: any) {
			if (error.includes("ER_DUP_ENTRY")) {
				res.status(StatusCodes.CONFLICT).json({"message": error})
			}

			next(error)
		}
	}

	public static async updatePassword(req: Request, res: Response, next: NextFunction) {
		try {
			const userId = Number(req.params.id);
			let password = req.body.password;

			if (!password) {
				res.status(StatusCodes.UNPROCESSABLE_ENTITY).json({"message": "Kein Passwort mitgeliefert"})
				return;
			}

			password = AuthHelper.generateHash(password);
			await UserController.USER_REPOSITORY.updatePassword(userId, password);

			res.sendStatus(StatusCodes.OK);
		} catch (error: any) {
			next(error);
		}
	}

	public static async deleteUser(req: Request, res: Response, next: NextFunction) {
		try {
			const userId = req.params.id;
			await UserController.USER_REPOSITORY.deleteUser(userId);

			res.sendStatus(StatusCodes.OK);
		} catch (error: any) {
			next(error)
		}
	}
}