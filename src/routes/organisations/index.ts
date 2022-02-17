
import { Router, NextFunction, Request, Response } from 'express';
import { getOrganisationById } from '../../database/DBQuery'
import addUserDetails from "../../middleware/addUserDetails"
import authenticate from "../../middleware/authenticate.middleware"

function checkIfParameterExists(request: Request, response: Response, next: NextFunction) {
    const queryFunctions: any = {
        orgId: getOrganisationById,
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

// Organizations
import organisation from "./../no-auth/organisations";
router.use("/", organisation);

// CAMPAIGNS
import campaign from "../authentication/campaign";
router.use("/:orgId(\\d+)/campaigns",
    checkIfParameterExists,
    authenticate,
    addUserDetails,
    campaign);

// CONTENTS
import contents from "../authentication/contents";
router.use("/:orgId(\\d+)/contents",
    checkIfParameterExists,
    authenticate,
    addUserDetails,
    contents);

// DEVICES
import devices from "../authentication/devices";
router.use("/:orgId(\\d+)/devices",
    checkIfParameterExists,
    authenticate,
    addUserDetails,
    devices);


export default router;