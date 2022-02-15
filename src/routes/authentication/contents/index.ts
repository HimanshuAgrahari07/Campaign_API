import { Router, NextFunction, Request, Response } from 'express';
import * as controller from './controller';
import { upload } from '../../../utils/upload';

const router = Router({ mergeParams: true });

// create new content
router.post("/",
    upload('contents').single('attachment'),
    controller.createOne)

// get all contents
router.get("/", controller.getAll)

// get one contents
router.get("/:id(\\d+)", controller.getOne)

// update
router.put("/:id(\\d+)",
    upload('contents').single('attachment'),
    controller.updateOne)

export default router;