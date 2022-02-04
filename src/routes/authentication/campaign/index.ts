import { Router, NextFunction, Request, Response } from 'express';
import SignInDto from '../../../dtos/signin.dto';
import validationMiddleware from '../../../middlewares/validation.middleware'
import CampaignDto from './campaign.dto'
import * as controller from './controller';

const router = Router({ mergeParams: true });

// helper function
router.post("", validationMiddleware(CampaignDto, false), controller.createOne)

export default router;