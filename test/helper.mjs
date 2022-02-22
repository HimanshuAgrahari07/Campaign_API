const moment = require("moment");
const uuid = require("uuid");
const qs = require("qs");
const _ = require("lodash");

const fs = require("fs");
const path = require("path");

const { postWithHeaders, putNoAuth, uploadWithHeaders } = require("./utils");
const {
    generateUserWithNewOrganisation,
    generateUserWithExistingOrganisation,
    generateOrganisation
} = require("./testData")

exports.createUser = async () => {
    const user = generateUserWithNewOrganisation()
    const req = { ...user };
    const res = await putNoAuth(`signup`, req);
    return { req, res };
};

exports.createUserForExistingOrg = async () => {
    const user = generateUserWithExistingOrganisation()
    const req = { ...user };
    const res = await putNoAuth(`signup`, req);
    return { req, res };
};