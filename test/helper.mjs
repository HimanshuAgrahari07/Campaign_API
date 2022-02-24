import moment from "moment";
import _ from "lodash";

import fs from "fs";
import path from "path";

import { postWithHeaders, putNoAuth, uploadWithHeaders, postNoAuth } from "./utils.mjs";
import { generateUserWithNewOrg, generateUserWithExistingOrg } from "./testData.mjs";

export async function createUserForNewOrg(userRecord) {
    let req;

    if (userRecord) {
        req = userRecord
    } else {
        req = generateUserWithNewOrg()
    }

    const res = await postNoAuth(`/signup`, req, true);
    return { req, res };
}

export async function createUserForExistingOrg(organisationId, userRecord) {
    let req;

    if (userRecord) {
        req = userRecord
    } else {
        req = generateUserWithExistingOrg(organisationId);
    }

    const res = await postNoAuth(`/signup`, req, true);
    return { req, res };
}