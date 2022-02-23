import { use, expect } from 'chai';
import chaiHttp from 'chai-http';
import { beforeEach } from 'mocha';
import { getNoAuth } from "../utils.mjs";

use(chaiHttp);

describe('SET UP TEST', () => {
    before(() => {
    });

    after(() => {
    });

    it("should check for backend running", async () => {
        const res = await getNoAuth(`/utilities/health-check`);
        expect(res.status).to.equal("alive");
    });
})