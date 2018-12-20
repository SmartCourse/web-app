const fetch = require('node-fetch')
const app = require('../../src')
const supertest = require('supertest')(app)
const { expect } = require('chai')

before(() => {
    return fetch('https://www.googleapis.com/identitytoolkit/v3/relyingparty/verifyPassword?key=AIzaSyANscpcUrt-ECaX8lqu3vQTtEyggcZ_7X4',
        {
            'credentials': 'omit',
            'headers': {},
            'referrer': 'http://localhost:8080/login',
            'referrerPolicy': 'no-referrer-when-downgrade',
            'body': '{"email":"backendtest@test.com","password":"backendtest","returnSecureToken":true}',
            'method': 'POST',
            'mode': 'cors'
        })
        .then((res) => res.json())
        .then((data) => {
            global.idToken = data.idToken
            return supertest.post('/api/user')
                .set('Accept', 'application/json')
                .set('Authorization', `Bearer ${global.idToken}`)
<<<<<<< HEAD
                .send({ displayName: 'BackendTester', degree: 'B. Testing', gradYear: 2018 })
=======
                .send({ displayName: 'BackendTester', degree: 'B. Arts', gradYear: 2018 })
>>>>>>> dev
        })
})

describe('Course route testing', () => {
    describe('GET /api/course', () => {
        let request
        before(() => {
            request = supertest
                .get('/api/course')
                .set('Accept', 'application/json')
                .expect('Content-Type', /json/)
                .expect(200)
            return request
        })

        it('returns exactly 3006 courses', () =>
            request.then(({ body }) =>
                expect(body.length).to.equal(3006))
        )

        it('has the correct code', () =>
            request.then(({ body }) =>
                expect(body.filter(c => c.code === 'ACCT1501').length).to.equal(1))
        )

        it('has the correct courseName', () =>
            request.then(({ body }) =>
                expect(body.filter(c => c.name === 'Accounting and Financial Management 1A').length).to.equal(1))
        )
    })

    describe('GET /api/course/ACCT1501', () => {
        let request
        before(() => {
            request = supertest
                .get('/api/course/ACCT1501')
                .set('Accept', 'application/json')
                .expect(200)
            return request
        })

        it('has the correct courseCode', () =>
            request.then(({ body }) =>
                expect(body.code).to.equal('ACCT1501'))
        )

        it('has the correct name', () =>
            request.then(({ body }) =>
                expect(body.name).to.equal('Accounting and Financial Management 1A'))
        )

        it('has the correct tag', () =>
            request.then(({ body }) =>
                expect(body.tags).to.equal('acct1501,accounting and financial management 1a,acct,accounting,undergraduate,accounting'))
        )
    })

    describe('POST /api/course/ACCT1501/question', () => {
        let request

        before(() => {
            request = supertest
                .post('/api/course/ACCT1501/question')
                .set('Accept', 'application/json')
                .set('Authorization', `Bearer ${global.idToken}`)
                .send({ body: 'testu', title: 'jeff' })

            return request
        })

<<<<<<< HEAD
        it('returns the question we POSTed', () =>
            request.then(({ body }) =>
                expect(body.title).to.equal('jeff')
            )
        )

        it('returns the question we POSTed', () =>
            request.then(({ body }) =>
                expect(body.body).to.equal('testu')
            )
=======
        it('returns correct status', () =>
            request.expect(201)
>>>>>>> dev
        )

        it('returns correct Location', () => {
            expect(request.res.headers.location).to.equal('/api/course/ACCT1501/question/15031')
        })

        describe('new record exists', () => {
            let followUp

            before(() => {
                followUp = supertest
                    .get('/api/course/ACCT1501/question/15031')
                    .set('Accept', 'application/json')
                    .expect(200)

                return followUp
            })

            it('has the correct title', () =>
                followUp.then(({ body }) => {
                    expect(body.title).to.equal('jeff')
                })
            )

            it('has the correct body', () =>
                followUp.then(({ body }) => {
                    expect(body.body).to.equal('testu')
                })
            )
        })
    })

    describe('GET /api/course/ACCT1501/questions', () => {
        let request

        before(() => {
            request = supertest
                .get('/api/course/ACCT1501/questions')
                .set('Accept', 'application/json')
                .expect('Content-Type', /json/)
                .expect(200)
            return request
        })

        it('correct number of questions', () =>
            request.then(({ body }) =>
<<<<<<< HEAD
                expect(body.data.length).to.equal(5))
=======
                expect(body.data.length).to.equal(6))
>>>>>>> dev
        )

        it('question has a title', () =>
            request.then(({ body }) =>
                expect(body.data[0].title).is.a('string'))
        )

        it('question has a body', () =>
            request.then(({ body }) =>
                expect(body.data[0].body).is.a('string'))
        )

        it('question has a course id', () =>
            request.then(({ body }) =>
<<<<<<< HEAD
                expect(body.data[0].code).to.equal('ACCT1501'))
=======
                expect(body.data[0].courseID).to.equal(1))
>>>>>>> dev
        )
    })

    describe('POST /api/course/COMP4920/review', () => {
        let request
        const form = {
            title: 'I\'m a real boy',
            body: 'barry is good',
            enjoy: 3,
            recommend: 0,
            workload: 2,
            teaching: 1,
            difficulty: 1
        }

        before(() => {
            request = supertest
                .post('/api/course/COMP4920/review')
                .set('Accept', 'application/json')
                .set('Authorization', `Bearer ${global.idToken}`)
                .send(form)
<<<<<<< HEAD
                .expect('Content-Type', /json/)
                .expect(200)
            return request
        })

        it('review has correct title', () =>
            request.then(({ body }) =>
                expect(body.title).to.equal(form.title)
            )
        )

        it('review has correct body', () =>
            request.then(({ body }) =>
                expect(body.body).to.equal(form.body)
            )
        )
=======

            return request
        })

        it('returns correct status', () => {
            request.expect(201)
        })

        it('returns correct Location', () => {
            expect(request.res.headers.location).to.equal('/api/course/COMP4920/review/9019')
        })

        describe('Review created correctly', () => {
            let followUp

            before(() => {
                followUp = supertest
                    .get('/api/course/COMP4920/review/9019')
                    .set('Accept', 'application/json')
                    .expect(200)

                return followUp
            })

            it('has the correct title', () =>
                followUp.then(({ body }) => {
                    expect(body.title).to.equal(form.title)
                })
            )

            it('has the correct body', () =>
                followUp.then(({ body }) => {
                    expect(body.body).to.equal(form.body)
                })
            )

            it('has the correct recommend', () =>
                followUp.then(({ body }) => {
                    expect(body.recommend).to.equal(form.recommend)
                })
            )
        })
>>>>>>> dev
    })

    describe('GET /api/course/ACCT1511/reviews', () => {
        let request

        before(() => {
            request = supertest
                .get('/api/course/ACCT1511/reviews')
                .set('Accept', 'application/json')
                .expect('Content-Type', /json/)
                .expect(200)

            return request
        })

        it('Returns a list of reviews with meta fields', () =>
            request.then(({ body }) =>
                expect(body.meta).is.a('object'))
        )

        it('Returns a list of reviews', () =>
            request.then(({ body }) =>
                expect(body.data).is.a('array'))
        )

        it('review[0] has good code', () =>
            request.then(({ body }) =>
<<<<<<< HEAD
                expect(body.data[0].body).is.a('string'))
=======
                expect(body.data[0].code).to.equal('ACCT1511'))
>>>>>>> dev
        )

        it('review[0] has a course id', () =>
            request.then(({ body }) =>
<<<<<<< HEAD
                expect(body.data[0].code).is.a('string'))
=======
                expect(body.data[0].courseID).is.a('number'))
>>>>>>> dev
        )
    })
})