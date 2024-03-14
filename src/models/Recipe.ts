import {Role} from "@models/Role";
import {Column, Entity, JoinTable, ManyToMany, ManyToOne} from "typeorm";
import {Category} from "@models/Category";
import {randomUUID} from "crypto";
import {BaseEntity} from "@models/BaseEntity";
import {RecipeDto} from "@models/Dto/RecipeDto";
import {RoleRepository} from "@repositories/RoleRepository";
import {File} from "@models/File";

@Entity()
export class Recipe extends BaseEntity {
	@Column("text")
	public readonly title: string;
	@Column("text")
	public readonly content: string;
	@ManyToMany(() => Role, {cascade: true})
	@JoinTable()
	public readonly role: Role[];
	@ManyToOne(() => Category, (cat) => cat.id, {cascade: true, onDelete: "CASCADE"})
	public readonly category?: Category;
	@ManyToOne(() => File, (file) => file.id, {cascade: true})
	public readonly imageCover?: File;

	constructor(title: string, content: string, role: Role[], category?: Category, imageCover?: File, id: number = 0) {
		super();
		this.id = id;
		this.title = title;
		this.content = content;
		this.role = role;
		this.category = category;
		this.imageCover = imageCover;
	}

	public toDto(): RecipeDto {
		return {
			id: this.id,
			title: this.title,
			category: this.category?.toDto(),
			roles: this.role.map(role => role.id),
			content: this.content,
			imageCover: this.imageCover?.toDto(),
			deletedAt: this.deletedAt?.toISOString(),
			updatedAt: this.updatedAt.toISOString(),
			createdAt: this.createdAt.toISOString()
		}
	}

	public static async fromDto(dto: RecipeDto) {
		const rolesRepository = new RoleRepository();
		const roles = await rolesRepository.getRolesByIds(dto.roles);
		const category = dto.category ? Category.fromDto(dto.category) : undefined;
		const imageCover = dto.imageCover ? File.fromDto(dto.imageCover) : undefined;

		return new Recipe(
			dto.title,
			dto.content,
			roles,
			category,
			imageCover,
			dto.id
		)
	}
}