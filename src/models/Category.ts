import {Column, Entity, OneToMany} from "typeorm";
import {randomUUID} from "crypto";
import {BaseEntity} from "@models/BaseEntity";
import {CategoryDto} from "@models/Dto/CategoryDto";
import {Recipe} from "@models/Recipe";

@Entity()
export class Category extends BaseEntity {
	@Column("text")
	public readonly name: string;

	constructor(name: string, id: number = 0) {
		super();
		this.id = id;
		this.name = name;
	}

	public toDto(): CategoryDto {
		return {
			id: this.id,
			name: this.name,
			createdAt: this.createdAt.toISOString(),
			updatedAt: this.updatedAt.toISOString(),
			deletedAt: this.deletedAt?.toISOString()
		}
	}

	public static fromDto(dto: CategoryDto) {
		return new Category(
			dto.name,
			dto.id
		)
	}
}