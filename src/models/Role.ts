import {Column, Entity, PrimaryGeneratedColumn} from "typeorm";
import * as crypto from "crypto";
import {RoleDto} from "@models/Dto/RoleDto";
import {BaseEntity} from "@models/BaseEntity";

@Entity()
export class Role extends BaseEntity {
	@Column("text")
	public readonly name: string;
	@Column("text")
	public readonly description: string;
	@Column("boolean")
	public readonly isAdmin: boolean;

	constructor(name: string, description: string, isAdmin: boolean = false, id: number = 0) {
		super();
		this.id = id;
		this.name = name;
		this.isAdmin = isAdmin;
		this.description = description;
	}

	public toDto(): RoleDto {
		return {
			id: this.id,
			name: this.name,
			description: this.description,
			isAdmin: this.isAdmin,
			createdAt: this.createdAt.toISOString(),
			updatedAt: this.updatedAt.toISOString(),
			deletedAt: this.deletedAt?.toISOString()
		}
	}

	public static fromDto(dto: RoleDto) {
		return new Role(
			dto.name,
			dto.description,
			dto.isAdmin,
			dto.id
		)
	}
}