import {BaseEntity} from "@models/BaseEntity";
import {Column, Entity} from "typeorm";
import {randomUUID} from "crypto";
import {FileDto} from "@models/Dto/FileDto";

@Entity()
export class File extends BaseEntity {
	@Column("varchar")
	public readonly name: string;
	@Column("varchar")
	public readonly type: string;
	@Column("varchar")
	public readonly path?: string;
	@Column("bigint")
	public readonly size: number;

	constructor(name: string, type: string, path: string | undefined, size: number, id: number = 0) {
		super();
		this.id = id;
		this.name = name;
		this.type = type;
		this.path = path;
		this.size = size;
	}

	public toDto(): FileDto {
		return {
			id: this.id,
			path: this.path,
			type: this.type,
			name: this.name,
			size: this.size,
			deletedAt: this.deletedAt?.toISOString(),
			updatedAt: this.updatedAt.toISOString(),
			createdAt: this.createdAt.toISOString()
		}
	}

	public static fromDto(dto: FileDto) {
		return new File(
			dto.name,
			dto.type,
			dto.path,
			dto.size,
			dto.id
		)
	}
}