import {Request, Response, Router} from "express";
import {UserRouter} from "@routes/UserRouter";
import {RoleRouter} from "@routes/RoleRouter";
import {RecipeRouter} from "@routes/RecipeRouter";
import {CategoryRouter} from "@routes/CategoryRouter";
import {AuthRouter} from "@routes/AuthRouter";
import {AuthMiddleware} from "@middlewares/AuthMiddleware";
import FileRouter from "@routes/FileRouter";

export class RouterManager {
	public router;

	constructor() {
		this.router = Router();
		this.initRoutes();
	}

	public defaultFallback(req: Request, res: Response) {
		res.sendStatus(404);
	}

	private initRoutes() {
		this.router.get("/", (req, res) => {
			res.send("<p>Das Kochbuch is up and running</p>")
		})

		const userRouter = new UserRouter();
		this.router.use("/users", AuthMiddleware.isAdmin, userRouter.router);

		const roleRouter = new RoleRouter();
		this.router.use("/roles", roleRouter.router);

		const recipeRouter = new RecipeRouter();
		this.router.use("/recipes", recipeRouter.router);

		const categoryRouter = new CategoryRouter();
		this.router.use("/categories", categoryRouter.router);

		const authRouter = new AuthRouter();
		this.router.use("/auth", authRouter.router);

		const fileRouter = new FileRouter();
		this.router.use("/files", fileRouter.router);
	}
}