import {AppDataSource} from "../DbConnection";
import {File} from "@models/File";

export default class FileRepository {
	private repository = AppDataSource.getRepository(File);

	constructor() {
	}


	public async getFiles() {
		try {
			return await this.repository.find();
		} catch (error: any) {
			throw error.toString();
		}
	}

	public async getFilesById(fileId: number) {
		try {
			return await this.repository.findOne({
				where: {
					id: fileId
				}
			})
		} catch (error: any) {
			throw error.toString();
		}
	}

	public async updateFile(file: File) {
		try {
			return this.repository.save(file);
		} catch (error: any) {
			throw error.toString();
		}
	}

	public async createFile(file: File) {
		const dbFile = await this.getFilesById(file.id);
		if (dbFile) throw "Duplicate entry";

		try {
			const entityFile = this.repository.create(file);
			await this.repository.save(entityFile);

			return entityFile;
		} catch (error: any) {
			throw error.toString();
		}
	}

	public async deleteFile(fileId: number) {
		try {
			return await this.repository.delete(fileId);
		} catch (error: any) {
			throw error.toString();
		}
	}
}