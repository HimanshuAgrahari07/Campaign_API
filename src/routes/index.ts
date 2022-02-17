import * as express from "express";
import addUserDetails from "../middleware/addUserDetails"
import authenticate from "../middleware/authenticate.middleware"
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

import organisation from "./organisations";
router.use("/organisation", organisation);

import content from "./no-auth/content";
router.use("/content", content);

// no route found
router.use("/", function (req, res) {
    // res.status(404).render('404.jade');
    res.status(404).json({ message: 'Route  not found', status: 404 });
});

export default router;