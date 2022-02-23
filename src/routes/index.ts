import * as express from "express";
// routers

const router = express.Router();

import login from "./no-auth/login";
router.use("/login", login);

import signup from "./no-auth/sign-up";
router.use("/signup", signup);

import change_password from "./authentication/change-password";
router.use("/change_password", change_password);

import reset_password from "./authentication/reset-password";
router.use("/reset_password", reset_password);

import resolutions from "./no-auth/resolutions";
router.use("/resolutions", resolutions);

import countries from "./no-auth/countries";
router.use("/countries", countries);

import organisation from "./organisations";
router.use("/organisation", organisation);

import content from "./no-auth/content";
router.use("/content", content);

// no route found
router.use("/", function (req, res) {
    res.status(404).json({ message: 'Route  not found', status: 404 });
});

export default router;