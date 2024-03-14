import {AppDataSource} from "../DbConnection";
import {User} from "@models/User";
import {HttpException} from "../exceptions/HttpException";
import {StatusCodes} from "http-status-codes";

export class UserRepository {
	private repository = AppDataSource.getRepository(User);

	constructor() {
	}

	public async getUsers(withDeleted: boolean = false) {
		try {
			return await this.repository.find({
				relations: ["roles"],
				withDeleted: withDeleted
			});
		} catch (error: any) {
			throw error.toString();
		}
	}

	public async getUserById(userId: number, widthDeleted: boolean = false) {
		try {
			return await this.repository.findOne({
				where: {
					id: userId
				},
				relations: ["roles"],
				withDeleted: widthDeleted
			})
		} catch (error: any) {
			throw error.toString();
		}
	}

	public async getUserByLogin(username: string, password: string) {
		try {
			return await this.repository.findOne({
				where: {
					username: username,
					password: password
				},
				relations: ["roles"]
			})
		} catch (error: any) {
			throw error.toString();
		}
	}

	public async createUser(user: User) {
		const dbUser = await this.repository.findOne({
			where: [
				{ id: user.id },
				{ username: user.username }
			]
		});

		if (dbUser) {
			throw new HttpException(StatusCodes.CONFLICT, "Duplicate entry");
		}

		try {
			const entityUser = this.repository.create(user);
			await this.repository.save(entityUser);

			return entityUser;
		} catch (error: any) {
			throw error.toString();
		}
	}

	public async updateUser(user: User) {
		const dbUser = await this.getUserById(user.id);
		if (!dbUser) {
			throw new HttpException(StatusCodes.CONFLICT, "User with ID does not exist")
		}
		user.password = dbUser.password;

		try {
			return await this.repository.save(user);
		} catch (error: any) {
			throw error.toString();
		}
	}

	public async updatePassword(userId: number, password: string) {
		const dbUser = await this.getUserById(userId);
		if (!dbUser) {
			throw new HttpException(StatusCodes.CONFLICT, "User with ID does not exist")
		}

		try {
			await this.repository.createQueryBuilder()
				.update(User)
				.set({
					password: password
				})
				.where("id = :id", { id: userId })
				.execute()
		} catch (error: any) {
			throw error.toString();
		}
	}

	public async deleteUser(userId: string) {
		try {
			return await this.repository.softDelete(userId);
		} catch (error: any) {
			throw error.toString();
		}
	}
}