import {AppDataSource} from "../DbConnection";
import {Category} from "@models/Category";

export class CategoryRepository {
	private repository = AppDataSource.getRepository(Category);

	constructor() {
	}

	public async getCategories() {
		try {
			return await this.repository.find();
		} catch (error: any) {
			throw error.toString();
		}
	}

	public async getCategoryById(id: number) {
		try {
			return await this.repository.findOne({
				where: {
					id: id
				}
			})
		} catch (error: any) {
			throw error.toString();
		}
	}

	public async createCategory(category: Category) {
		const dbRole = await this.getCategoryById(category.id);
		if (dbRole) throw "Duplicate entry";

		try {
			const entityRole = this.repository.create(category);
			await this.repository.save(entityRole);

			return entityRole;
		} catch (error: any) {
			throw error.toString();
		}
	}

	public async updateCategory(category: Category) {
		try {
			return await this.repository.save(category);
		} catch (error: any) {
			throw error.toString();
		}
	}

	public async deleteCategory(categoryId: number) {
		try {
			return await this.repository.delete(categoryId);
		} catch (error: any) {
			throw error.toString();
		}
	}
}