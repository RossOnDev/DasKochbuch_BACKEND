import {RoleRepository} from "@repositories/RoleRepository";
import {NextFunction, Request, Response} from "express";
import {Role} from "@models/Role";
import {StatusCodes} from "http-status-codes";
import {RoleDto} from "@models/Dto/RoleDto";

export class RoleController {
	private static readonly ROLE_REPOSITORY = new RoleRepository();

	constructor() {
	}

	public static async getRoles(req: Request, res: Response, next: NextFunction) {
		try {
			const withDeleted = !!req.query.withDeleted
			const roles = await RoleController.ROLE_REPOSITORY.getRoles(withDeleted);
			const rolesDto = roles.map(role => role.toDto());
			res.json(rolesDto);
		} catch (error: any) {
			next(error);
		}
	}

	public static async getRoleById(req: Request, res: Response, next: NextFunction) {
		try {
			const withDeleted = !!req.query.withDeleted
			const role = await RoleController.ROLE_REPOSITORY.getRoleById(Number(req.params.id), withDeleted);
			if (role) res.json(role.toDto());
			else res.sendStatus(StatusCodes.NOT_FOUND);
		} catch (error: any) {
			next(error);
		}
	}

	public static async createRole(req: Request, res: Response, next: NextFunction) {
		try {
			const roleDto: RoleDto = req.body;
			const role = Role.fromDto(roleDto);
			await RoleController.ROLE_REPOSITORY.createRole(role);

			res.sendStatus(StatusCodes.CREATED)
		} catch (error: any) {
			next(error);
		}
	}

	public static async updateRole(req: Request, res: Response, next: NextFunction) {
		try {
			const roleDto: RoleDto = req.body;
			const role = Role.fromDto(roleDto);
			await RoleController.ROLE_REPOSITORY.updateRole(role);

			res.sendStatus(StatusCodes.OK);
		} catch (error: any) {
			next(error);
		}
	}

	public static async deleteRole(req: Request, res: Response, next: NextFunction) {
		try {
			await RoleController.ROLE_REPOSITORY.deleteRole(Number(req.params.id));
			res.sendStatus(StatusCodes.OK);
		} catch (error: any) {
			next(error);
		}
	}
}