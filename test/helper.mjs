import moment from "moment";
import _ from "lodash";

import fs from "fs";
import path from "path";

import { postWithHeaders, putNoAuth, uploadWithHeaders, postNoAuth } from "./utils.mjs";
import { generateUserWithNewOrganisation, generateUserWithExistingOrganisation, generateOrganisation } from "./testData.mjs";

export async function createUserForNewOrganisation(userRecord) {
    let user;

    if (userRecord) {
        user = userRecord
    } else {
        user = generateUserWithNewOrganisation()
    }
    
    const req = { ...user };
    const res = await postNoAuth(`/signup`, req, true);
    return { req, res };
}

export async function createUserForExistingOrg(organisationId) {
    const user = generateUserWithExistingOrganisation(organisationId)
    const req = { ...user };
    const res = await postNoAuth(`/signup`, req);
    return { req, res };
}