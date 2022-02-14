import { Router, NextFunction, Request, Response } from 'express';
import { createError, ErrorType } from '../../../errors/createError';
import { getOrganisationById } from '../../../database/DBQuery';
import validationMiddleware from '../../../middlewares/validation.middleware'
import CampaignDto from './campaign.dto'
import * as controller from './controller';

function checkIfParameterExists(request: Request, response: Response, next: NextFunction) {
    const queryFunctions: any = {
        orgId: getOrganisationById
    }

    Object.keys(request.params).forEach(async (param) => {
        const functionToCall = queryFunctions[param];
        const responseFromDB = await functionToCall(Number(request.params[param]));
        const checkIfExists = responseFromDB.length > 0;
        if (!checkIfExists) {
            // return next(createError({...ErrorType.RESOURCE_NOT_FOUND, message: `${param} with ${request.params[param]} not found`}));
            return response.status(404).json({ message: `${param} with ${request.params[param]} not found`, status: 404 })
        }
    })

    next();
}

const router = Router({ mergeParams: true });

// helper function
router.post("", validationMiddleware(CampaignDto, false), checkIfParameterExists, controller.createOne)

router.get("", controller.getAll)

export default router;