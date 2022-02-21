import { Router, NextFunction, Request, Response } from 'express';
import validationMiddleware from '../../../middleware/validation.middleware'
import * as controller from './controller';
import dto from './devices.dto';

import { upload } from '../../../utils/upload';

const router = Router({ mergeParams: true });

// create new device
router.post("/",
    validationMiddleware(dto, false),
    controller.createOne
)

// get all devices
router.get("/", controller.getAll)

// get one device
router.get("/:id(\\d+)", controller.getOne)

// update
router.put("/:id(\\d+)",
    controller.updateOne)

// // update
// router.delete("/:id(\\d+)",
//     controller.deleteOne)

export default router;