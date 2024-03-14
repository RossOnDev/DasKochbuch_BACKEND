import {Router} from "express";
import {AuthMiddleware} from "@middlewares/AuthMiddleware";
import FileController from "../controller/FileController";

export default class FileRouter {
	public router;

	constructor() {
		this.router = Router()
		this.initRoutes();
	}

	private initRoutes() {
		this.router.get("/", AuthMiddleware.isAdmin, FileController.getFiles);
		this.router.post("/", AuthMiddleware.isAdmin, FileController.updateFile);
		this.router.put("/", AuthMiddleware.isAdmin, FileController.createFile);

		this.router.get("/:id", FileController.getFileById);
		this.router.delete("/:id", AuthMiddleware.isAdmin, FileController.deleteFile);
	}
}