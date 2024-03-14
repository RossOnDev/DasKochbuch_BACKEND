import {NextFunction, Request, Response} from "express";
import {StatusCodes} from "http-status-codes";
import {CategoryRepository} from "@repositories/CategoryRepository";
import {Category} from "@models/Category";
import {CategoryDto} from "@models/Dto/CategoryDto";

export class CategoryController {
	private static readonly CATEGORY_REPOSITORY = new CategoryRepository();

	constructor() {
	}

	public static async getCategories(req: Request, res: Response, next: NextFunction) {
		try {
			const categories = await CategoryController.CATEGORY_REPOSITORY.getCategories();
			const categoriesDto = categories.map(cat => cat.toDto());
			res.json(categoriesDto);
		} catch (error: any) {
			next(error);
		}
	}

	public static async getCategoryById(req: Request, res: Response, next: NextFunction) {
		try {
			const category = await CategoryController.CATEGORY_REPOSITORY.getCategoryById(Number(req.params.id));
			if (category) {
				res.json(category.toDto());
			}
			else {
				res.sendStatus(StatusCodes.NOT_FOUND);
			}
		} catch (error: any) {
			next(error);
		}
	}

	public static async createCategory(req: Request, res: Response, next: NextFunction) {
		try {
			const categoryDto: CategoryDto = req.body;
			const category = Category.fromDto(categoryDto);
			await CategoryController.CATEGORY_REPOSITORY.createCategory(category);

			res.sendStatus(StatusCodes.CREATED)
		} catch (error: any) {
			next(error);
		}
	}

	public static async updateCategory(req: Request, res: Response, next: NextFunction) {
		try {
			const categoryDto: CategoryDto = req.body;
			const category = Category.fromDto(categoryDto);
			await CategoryController.CATEGORY_REPOSITORY.updateCategory(category);

			res.sendStatus(StatusCodes.OK);
		} catch (error: any) {
			next(error);
		}
	}

	public static async deleteCategory(req: Request, res: Response, next: NextFunction) {
		try {
			await CategoryController.CATEGORY_REPOSITORY.deleteCategory(Number(req.params.id));
			res.sendStatus(StatusCodes.OK);
		} catch (error: any) {
			next(error);
		}
	}
}