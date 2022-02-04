import { Router } from 'express';
import * as controller from './controller';
const router = Router();

router.get("/:orgId(\\d+)", controller.getOne)

export default router;