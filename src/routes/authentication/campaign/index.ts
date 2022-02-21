import { Router, NextFunction, Request, Response } from 'express';
import validationMiddleware from '../../../middleware/validation.middleware'
import { BasicCampaignDto } from './campaign.dto'
import * as controller from './controller';

const router = Router({ mergeParams: true });

// helper function
router.post("/", validationMiddleware(BasicCampaignDto, false), controller.createOne)

router.get("/", controller.getAll)

router.get("/:id(\\d+)", controller.getOne)

router.put("/:id(\\d+)", validationMiddleware(BasicCampaignDto, false), controller.updateOne)

router.delete("/:id(\\d+)", controller.deleteOne)
export default router;