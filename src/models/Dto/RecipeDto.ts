import {BaseEntityDto} from "@models/Dto/BaseEntityDto";
import {CategoryDto} from "@models/Dto/CategoryDto";
import {FileDto} from "@models/Dto/FileDto";

export interface RecipeDto extends BaseEntityDto {
	title: string,
	content: string,
	roles: number[],
	category?: CategoryDto,
	imageCover?: FileDto
}