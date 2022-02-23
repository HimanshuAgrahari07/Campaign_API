import { use, expect } from 'chai';
import chaiHttp from 'chai-http';
import { beforeEach, before, after } from 'mocha';
import { getNoAuth, postNoAuth } from "../utils.mjs";
import * as helper from "../helper.mjs";

describe('User', () => {

  before(() => {
  });

  after(() => {
  });

  it("should register and sign in", async () => {
    // register adult user
    const rr = await helper.createUserForNewOrganisation();
    const signupResponse = rr.res
    const userInfo = rr.req

    expect(signupResponse).to.haveOwnProperty("data");
    expect(signupResponse.data).to.haveOwnProperty("id");
    expect(signupResponse.data).to.haveOwnProperty("organisation");
    expect(signupResponse.data).to.haveOwnProperty("country");

    const req = {
      email: userInfo.email,
      password: userInfo.password,
    };

    // login adult user
    const loginResponse = await postNoAuth(`/login`, req);
    expect(loginResponse).to.haveOwnProperty("data");

    const loginData = loginResponse.data;
    expect(loginData).to.haveOwnProperty("token");
    expect(loginData).to.haveOwnProperty("refreshToken");
    expect(loginData).to.haveOwnProperty("id");
    expect(loginData).to.haveOwnProperty("organisation");
    expect(loginData).to.haveOwnProperty("country");
  });

  // it("should sign in", async () => {
  //   const req = {
  //     email: userInfo.email,
  //     password: userInfo.password,
  //   };

  //   // login adult user
  //   const loginResponse = await postNoAuth(`/login`, req);
  //   expect(loginResponse).to.haveOwnProperty("data");

  //   const loginData = loginResponse.data;
  //   expect(loginData).to.haveOwnProperty("token");
  //   expect(loginData).to.haveOwnProperty("refreshToken");
  //   expect(loginData).to.haveOwnProperty("id");
  //   expect(loginData).to.haveOwnProperty("organisation");
  //   expect(loginData).to.haveOwnProperty("country");
  // });

  it("should register for existing orgs", async () => {
    // register adult user
    const rr = await helper.createUserForNewOrganisation();
    const signupResponse = rr.res
    const userInfo = rr.req
    
    const rr = await helper.createUserForExistingOrg(userInfo.organisationId);
    console.log('existing orgs >>> ', JSON.stringify(rr, null, 2));
    expect(rr.res.statusCode).to.be.equal(200);

    const signupResponse = rr.res

    expect(signupResponse).to.haveOwnProperty("data");
    expect(signupResponse.data).to.haveOwnProperty("id");
    expect(signupResponse.data).to.haveOwnProperty("organisation");
    expect(signupResponse.data).to.haveOwnProperty("country");
  });

  it("should fail register due to duplicate email", async () => {
    // register adult user
    const signupResponse = await helper.createUserForExistingOrg({
      ...userInfo,
      mobile: Math.floor(Math.random() * 1000000000),
    });
    console.log('duplicate email >>> ', JSON.stringify(signupResponse, null, 2));

    expect(signupResponse.statusCode).to.be.equal(400);
    expect(signupResponse.enum).to.be('EMAIL_TAKEN');
  });

  it("should fail register due to duplicate phone", async () => {
    // register adult user
    const randNo = () => Math.floor(Math.random() * 1000);
    const signupResponse = await helper.createUserForExistingOrg({
      ...userInfo,
      email: `test${randNo()}@gmail${randNo()}.com`,
    });
    console.log('duplicate phone >>> ', JSON.stringify(signupResponse, null, 2));

    expect(signupResponse.statusCode).to.be.equal(400);
    expect(signupResponse.enum).to.be('PHONE_NUMBER_TAKEN');
  });
})