import FileRepository from "@repositories/FileRepository";
import {NextFunction, Request, Response} from "express";
import {StatusCodes} from "http-status-codes";
import {FileDto} from "@models/Dto/FileDto";
import {File} from "@models/File";
import {unlink, writeFile} from "node:fs";
import * as path from "path";

export default class FileController {
	private static readonly FILE_REPOSITORY = new FileRepository();
	private static readonly FILES_PATH = path.join(__dirname, "..", "..");

	public static async getFiles(req: Request, res: Response, next: NextFunction) {
		try {
			const files = await FileController.FILE_REPOSITORY.getFiles();
			res.json(files.map(file => file.toDto()));
		} catch (error: any) {
			next(error);
		}
	}

	public static async getFileById(req: Request, res: Response, next: NextFunction) {
		try {
			const recipe = await FileController.FILE_REPOSITORY.getFilesById(Number(req.params.id));
			if (recipe) {
				res.json(recipe.toDto());
			}
			else {
				res.sendStatus(StatusCodes.NOT_FOUND);
			}
		} catch (error: any) {
			next(error);
		}
	}

	public static async updateFile(req: Request, res: Response, next: NextFunction) {
		try {
			const fileDto: FileDto = req.body;
			const file = File.fromDto(fileDto);
			await FileController.FILE_REPOSITORY.updateFile(file);

			res.sendStatus(StatusCodes.OK);
		} catch (error) {
			next(error);
		}
	}

	public static async createFile(req: Request, res: Response, next: NextFunction) {
		try {
			const fileDto: FileDto = req.body;
			const blob = fileDto.blob;
			if (!blob) {
				res.status(StatusCodes.BAD_REQUEST).json({
					"message": "Can not create file without content"
				})
				return;
			}

			const filePath = path.join("files", "covers", `${new Date().getTime()}-${fileDto.name}`);
			const buffer = Buffer.from(blob, 'base64');
			writeFile(path.join(FileController.FILES_PATH, filePath), buffer, async function (error) {
				if (error) {
					next(error);
					return;
				}
				else {
					const file = new File(fileDto.name, fileDto.type, filePath, fileDto.size)
					const createdFile = await FileController.FILE_REPOSITORY.createFile(file);

					res.status(StatusCodes.CREATED).json(createdFile.toDto());
					return;
				}
			});

		} catch (error: any) {
			next(error);
		}
	}

	public static async deleteFile(req: Request, res: Response, next: NextFunction) {
		try {
			const fileId = Number(req.params.id);
			const file = await FileController.FILE_REPOSITORY.getFilesById(fileId);
			if (!file) {
				res.sendStatus(StatusCodes.NOT_FOUND);
				return;
			}

			await FileController.FILE_REPOSITORY.deleteFile(fileId);
			unlink(`./${file.path}`, (err) => {
				if (err) {
					next(err.message);
					return;
				}

				res.sendStatus(StatusCodes.OK)
			})
		} catch (error: any) {
			next(error);
		}
	}
}