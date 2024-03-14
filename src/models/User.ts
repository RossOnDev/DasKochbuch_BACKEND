import {Column, Entity, JoinTable, ManyToMany} from "typeorm";
import {Role} from "@models/Role";
import * as crypto from "crypto";
import {UserDto} from "@models/Dto/UserDto";
import {BaseEntity} from "@models/BaseEntity";
import {AuthHelper} from "@utils/AuthHelper";
import {RoleRepository} from "@repositories/RoleRepository";

@Entity()
export class User extends BaseEntity {
	@Column("text", {unique: true})
	public username: string;
	@Column("text")
	public password: string;
	@ManyToMany(() => Role, {cascade: true, onDelete: "CASCADE"})
	@JoinTable()
	public roles: Role[];

	constructor(username: string, password: string, roles: Role[], id: number = 0) {
		super();
		this.id = id;
		this.username = username;
		this.password = password;
		this.roles = roles;
	}

	public toDto(): UserDto {
		const roleIds = this.roles.map(role => role.id);

		return {
			id: this.id,
			username: this.username,
			roles: roleIds,
			createdAt: this.createdAt.toISOString(),
			updatedAt: this.updatedAt.toISOString(),
			deletedAt: this.deletedAt?.toISOString()
		}
	}

	public static async fromDto(dto: UserDto) {
		const rolesRepository = new RoleRepository();
		const roles = dto.roles ? await rolesRepository.getRolesByIds(dto.roles) : [];

		const password = dto.password ? AuthHelper.generateHash(dto.password) : "";
		return new User(dto.username, password, roles, dto.id);
	}
}