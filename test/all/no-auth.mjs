import { use } from 'chai';
import { expect } from 'chai';
import chaiHttp from 'chai-http';
import { beforeEach } from 'mocha';
import { getNoAuth } from "../utils.mjs";

use(chaiHttp);

describe('No Auth', () => {
    let app;

    before(() => {
    });

    after(() => {
    });

    describe('GET /resolutions', () => {
        it('should return 200 OK with resolutions', async () => {
            const res = await getNoAuth(`/resolutions`)
            expect(res.status).to.equal(200);
            expect(res.data).to.be.an('array');
            expect(res.data).length.to.be.greaterThan(0);

        })

        it('should have valid resolutions', async () => {
            const res = await getNoAuth(`/resolutions`)
            const resolutions = res.data;

            expect(res.status).to.equal(200);
            expect(resolutions).to.be.an('array');
            resolutions.forEach(resolution => {
                expect(resolution).to.have.property('id').and.to.be.a('number');
                expect(resolution).to.have.property('resolutionType').and.to.be.a('string');
                expect(resolution).to.have.property('commonName').and.to.be.a('string');
                expect(resolution).to.have.property('aspectRatio').and.to.be.a('string');
                expect(resolution).to.have.property('pixelSize').and.to.be.a('string');
            })
        })

    })

    describe('GET /countries', () => {
        it('should return 200 OK with countries', async () => {
            const res = await getNoAuth(`/countries`)
            expect(res.status).to.equal(200);
            expect(res.data).to.be.an('array');
            expect(res.data).length.to.be.greaterThan(0);

        })

        it('should have valid countries', async () => {
            const res = await getNoAuth(`/countries`)
            const countries = res.data;

            expect(res.status).to.equal(200);
            expect(countries).to.be.an('array');
            countries.forEach(country => {
                expect(country).to.have.property('id').and.to.be.a('number');
                expect(country).to.have.property('countryName').and.to.be.a('string');
                expect(country).to.have.property('countryCode').and.to.be.a('string');
                expect(country).to.have.property('phoneCode').and.to.be.a('string');
            })
        })

    })
})