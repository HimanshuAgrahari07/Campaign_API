import { Router } from 'express';
import * as controller from './controller';
import ChangePasswordDto from './change-password.dto';
import addUserDetails from "../../../middleware/addUserDetails"
import authenticate from "../../../middleware/authenticate.middleware"
import validationMiddleware from '../../../middleware/validation.middleware'

const router = Router({ mergeParams: true });

router.put("/",
    validationMiddleware(ChangePasswordDto),
    authenticate,
    addUserDetails,
    controller.update)

export default router;