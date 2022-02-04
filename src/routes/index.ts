import * as express from "express";
import addUserDetails from "../middlewares/addUserDetails"
import authenticate from "../middlewares/authenticate.middleware"
// routers

const router = express.Router();

// middleware

// Auth
import login from "./no-auth/login";
router.use("/login", login);

// no auth
import resolutions from "./no-auth/resolutions";
router.use("/resolutions", resolutions);

import countries from "./no-auth/countries";
router.use("/countries", countries);

import signup from "./no-auth/sign-up";
router.use("/signup", signup);

// Organizations
import organisation from "./no-auth/organisations";
router.use("/organisation", organisation);

// CAMPAIGNS
import campaign from "./authentication/campaign";
router.use("/organisation/:orgId(\\d+)/campaigns", authenticate, addUserDetails, campaign);

// no route found
router.use("/", function (req, res) {
    // res.status(404).render('404.jade');
    res.status(404).json({ message: 'Route  not found', status: 404 });
});

export default router;