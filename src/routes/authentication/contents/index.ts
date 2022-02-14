import { Router, NextFunction, Request, Response } from 'express';
import * as controller from './controller';

const router = Router({ mergeParams: true });


router.post("/",
    controller.createOne)

router.get("/", controller.getAll)

export default router;