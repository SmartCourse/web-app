const { TABLE_NAMES: { DEGREES, SUBJECTS, FACULTIES } } = require('./constants')

/* All inputs should be validated in this class that are subject related */
class Uni {
    constructor(db) {
        console.log('initialising ORM subject object')
        this.db = db
    }

    /**
     * TODO add 'uni' param, add paging
     * @returns a list of courses
     */
    getSubjects() {
        return this.db
<<<<<<< HEAD:backend/src/models/uni.js
            .queryAll(`SELECT * FROM ${SUBJECTS}`)
=======
            .run(`SELECT * FROM ${SUBJECTS}`)
>>>>>>> dev:backend/src/models/uni.js
    }

    getDegrees() {
        return this.db
<<<<<<< HEAD:backend/src/models/uni.js
            .queryAll(`SELECT * FROM ${DEGREES}`)
=======
            .run(`SELECT * FROM ${DEGREES}`)
>>>>>>> dev:backend/src/models/uni.js
    }

    getFaculties() {
        return this.db
<<<<<<< HEAD:backend/src/models/uni.js
            .queryAll(`SELECT * FROM ${FACULTIES}`)
=======
            .run(`SELECT * FROM ${FACULTIES}`)
>>>>>>> dev:backend/src/models/uni.js
    }
}

let Singleton = null

/**
 * @param {object} db defaults to the db instance
 */
module.exports = function(db) {
    if (!db) {
        /* app environment, dev or prod */
        return (Singleton = Singleton ? Singleton : new Uni(require('./db'))) // eslint-disable-line
    }
    /* to allow injection */
    return new Uni(db)
}
