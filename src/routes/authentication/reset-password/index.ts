import { Router } from 'express';
import * as controller from './controller';
import ResetPasswordDto from './reset-password.dto';
import addUserDetails from "../../../middleware/addUserDetails"
import validationMiddleware from '../../../middleware/validation.middleware'

const router = Router({ mergeParams: true });

router.put("/",
    validationMiddleware(ResetPasswordDto),
    addUserDetails,
    controller.reset_password)

router.get("/:token",
    controller.reset_password_complete)

export default router;