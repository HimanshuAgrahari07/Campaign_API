import { Router, NextFunction, Request, Response } from 'express';
import { createError, ErrorType } from '../../../errors/createError';
import validationMiddleware from '../../../middleware/validation.middleware'
import CampaignDto from './campaign.dto'
import * as controller from './controller';

const router = Router({ mergeParams: true });

// helper function
router.post("/", validationMiddleware(CampaignDto, false), controller.createOne)

router.get("/", controller.getAll)

router.get("/:id(\\d+)", controller.getOne)

export default router;