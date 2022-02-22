import { Router } from 'express';
import * as controller from './controller';
const router = Router({ mergeParams: true });

router.get("/uid/:uid", controller.getOne)

export default router;