import {AppDataSource} from "../DbConnection";
import {Role} from "@models/Role";
import {In} from "typeorm";

export class RoleRepository {
	private repository = AppDataSource.getRepository(Role);

	constructor() {
	}

	public async getRoles(withDeleted: boolean = false) {
		try {
			return await this.repository.find({
				withDeleted: withDeleted
			});
		} catch (error: any) {
			throw error.toString();
		}
	}

	public async getRolesByIds(roleIds: number[]) {
		try {
			return await this.repository.findBy({
				id: In(roleIds)
			})
		} catch (error: any) {
			throw error.toString();
		}
	}

	public async getRoleById(roleId: number, withDeleted: boolean = false) {
		try {
			return await this.repository.findOne({
				where: {
					id: roleId
				},
				withDeleted: withDeleted
			})
		} catch (error: any) {
			throw error.toString();
		}
	}

	public async createRole(role: Role) {
		const dbRole = await this.getRoleById(role.id);
		if (dbRole) {
			throw "Duplicate entry";
		}

		try {
			const entityRole = this.repository.create(role);
			await this.repository.save(entityRole);

			return entityRole;
		} catch (error: any) {
			throw error.toString();
		}
	}

	public async updateRole(role: Role) {
		try {
			return await this.repository.save(role);
		} catch (error: any) {
			throw error.toString();
		}
	}

	public async deleteRole(roleId: number) {
		try {
			return await this.repository.delete(roleId);
		} catch (error: any) {
			throw error.toString();
		}
	}
}