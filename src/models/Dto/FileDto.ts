import {BaseEntityDto} from "@models/Dto/BaseEntityDto";

export interface FileDto extends BaseEntityDto {
	name: string;
	type: string;
	path?: string;
	size: number;
	blob?: string;
}