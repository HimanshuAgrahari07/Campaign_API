import { Router, NextFunction, Request, Response } from 'express';
import * as controller from './controller';
const multer = require('multer')
import { upload } from '../../../utils/upload';

const router = Router({ mergeParams: true });

router.post("/",
    upload('contents').single('attachment'),
    controller.createOne)

router.get("/", controller.getAll)

export default router;