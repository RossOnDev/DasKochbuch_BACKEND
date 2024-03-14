import dotenv from "dotenv";
import {DataSource} from "typeorm";
import process from "process";
import {User} from "@models/User";
import {Role} from "@models/Role";
import {Category} from "@models/Category";
import {Recipe} from "@models/Recipe";
import {File} from "@models/File";

dotenv.config();

export function initDataSource()
{
	AppDataSource.initialize()
		.then(() => console.log(`✨  Connected to DataSource[${process.env.DB_DATABASE}]`))
		.catch((error) => console.log(error));
}

export const AppDataSource = new DataSource({
	type: "mysql",
	host: process.env.DB_HOST,
	port: parseInt(process.env.DB_PORT as string),
	username: process.env.DB_USERNAME,
	password: process.env.DB_PASSWORD,
	database: process.env.DB_DATABASE,
	synchronize: true, // !! DO NOT SET TO TRUE IN PROD !!
	logging: false,
	entities: [
		User,
		Role,
		Category,
		Recipe,
		File
	],
	subscribers: [],
	migrations: [],
})