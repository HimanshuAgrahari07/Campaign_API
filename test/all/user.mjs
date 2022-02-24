import { use, expect, should } from 'chai';
import chaiHttp from 'chai-http';
import { beforeEach, before, after } from 'mocha';
import { getNoAuth, postNoAuth } from "../utils.mjs";
import * as helper from "../helper.mjs";

describe('User', () => {

  before(() => {
  });

  after(() => {
  });

  it("should register", async () => {
    // register adult user
    const rr = await helper.createUserForNewOrg();
    const response = rr.res
    expect(response).to.have.property('data').which.includes.all.keys(
      'id',
      'email',
      'firstName',
      'lastName',
      'role',
      'mobile',
      'countryId',
      'organisationId',
      'createdAt',
      'updatedAt',
      'organisation',
      'country',
      'confirmed',
    );
  });

  it("should register and sign in", async () => {
    // register adult user
    const rr = await helper.createUserForNewOrg();
    const userInfo = rr.req

    const req = {
      email: userInfo.email,
      password: userInfo.password,
    };

    // login adult user
    const loginResponse = await postNoAuth(`/login`, req);
    expect(loginResponse.status).to.equal(200);
    expect(loginResponse).to.have.property('data').which.includes.all.keys(
      'id',
      'email',
      'firstName',
      'lastName',
      'role',
      'mobile',
      'countryId',
      'organisationId',
      'createdAt',
      'updatedAt',
      'organisation',
      'country',
    )
  });

  it("should register for existing orgs", async () => {
    // register adult user
    const rrCreateNewUser = await helper.createUserForNewOrg();
    const firstSignUpUserInfo = rrCreateNewUser.res.data;

    const secondSignUpRR = await helper.createUserForExistingOrg(firstSignUpUserInfo.organisationId);
    expect(secondSignUpRR.res.status).to.be.equal(200);
    expect(secondSignUpRR.res).to.have.property('data').which.includes.all.keys(
      'id',
      'organisation',
      'country'
    )
  });

  it("should fail register due to duplicate email", async () => {
    // register adult user
    const rrCreateNewUser = await helper.createUserForNewOrg();
    const firstReq = rrCreateNewUser.req;
    const firstRes = rrCreateNewUser.res;

    // try signup for same email again

    // differ mobile than previous
    const mobile = `${Math.floor(Math.random() * 100000)}`.padStart(10, "0");

    const request = {
      ...firstReq,
      mobile
    }

    const responseNew = await postNoAuth(`/signup`, request, true);
    expect(responseNew).to.have.property('statusCode').which.equals(400);
    expect(responseNew).to.have.property('enum').which.equals('EMAIL_TAKEN');
  });

  it("should fail register due to duplicate phone", async () => {
    // register adult user
    const rrCreateNewUser = await helper.createUserForNewOrg();
    const firstReq = rrCreateNewUser.req;

    // try signup for same phone again

    // differ mobile than previous
    const email = `fake${Math.floor(Math.random() * 100000)}@gmail.com`;

    const request = {
      ...firstReq,
      email
    }

    const responseNew = await postNoAuth(`/signup`, request, true);
    expect(responseNew).to.have.property('statusCode').which.equals(400);
    expect(responseNew).to.have.property('enum').which.equals('PHONE_NUMBER_TAKEN');
  });
})