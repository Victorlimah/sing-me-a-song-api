import { Router } from "express";

import * as controller from "../controllers/testController.js";

const testsRouter = Router();

testsRouter.post("/reset-database", controller.resetDatabase);
testsRouter.post("/seed-database", controller.seedDatabase);
testsRouter.post("/seed-lowScoreSong", controller.seedLowScoreSong);

export default testsRouter;
