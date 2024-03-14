import {BaseEntityDto} from "@models/Dto/BaseEntityDto";

export interface UserDto extends BaseEntityDto {
	username: string,
	password?: string,
	roles: number[]
}