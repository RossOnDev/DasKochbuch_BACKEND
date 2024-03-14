import {BaseEntityDto} from "@models/Dto/BaseEntityDto";

export interface RoleDto extends BaseEntityDto {
	name: string,
	description: string,
	isAdmin: boolean
}