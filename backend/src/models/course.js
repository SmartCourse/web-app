<<<<<<< HEAD
const { TABLE_NAMES: { COURSES, REVIEWS } } = require('./constants')
=======
const { TABLE_NAMES: { COURSES, SUBJECTS, REVIEWS } } = require('./constants')
>>>>>>> dev

/* All inputs should be validated in this class that are course related */
class Course {
    constructor(db) {
        console.log('initialising ORM Course object')
        this.db = db
    }

    /**
     * TODO add 'uni' param, add paging
     * @returns a list of courses
     */
    getCourses() {
        return this.db
<<<<<<< HEAD
            .queryAll(`SELECT * FROM ${COURSES}`)
=======
            .run(`SELECT * FROM ${COURSES}`)
>>>>>>> dev
    }

    /**
     * Gets all the courses belonging to a specific subject.
     * @param {string}
     * @returns {Array}    List of courses.
     */
    getCoursesBySubject(code) {
        return this.db
<<<<<<< HEAD
            .queryAll(`SELECT * FROM ${COURSES} WHERE subjectCode = ?`, [subjCode])
=======
            .run(`SELECT c.* FROM ${COURSES} as c
                JOIN ${SUBJECTS} s ON s.code=@code
                WHERE c.subjectID=s.id`,
            {
                [SUBJECTS]: { code }
            })
>>>>>>> dev
    }

    /**
     * Gets a course instance from the DB.
     * @returns {object}    Info specific to single course.
     */
    getCourse(code) {
        return this.updateCourseRatings(code)
<<<<<<< HEAD
            .then(() => this.db.query(`SELECT * FROM ${COURSES} WHERE code=?`, [code]))
=======
            .then(() => this.db
                .run(`SELECT * FROM ${COURSES} WHERE code=@code`,
                    {
                        [COURSES]: { code }
                    }))
            .then(([row]) => row || {})
>>>>>>> dev
    }

    updateCourseRatings(code) {
        // recommend is just count(all recommended)/count(all reviews)
        // others are mean(values - 1)*(100/2) for all values > 0
        // ^ we need to subtract 1 from each value when taking the mean to get it in 0-2 (or 0-4) range
        // ^ we take this mean and divide by 2 or 4 (range is 0-2 or 0-4) to get a normalised value
        // ^ multiply by 100 so we have an integer percentage (we do this at an early step however, to avoid floating point biz)
        return this.db
            .run(`UPDATE ${COURSES}
                    SET
<<<<<<< HEAD
                      recommend = (SELECT CASE WHEN COUNT(*)==0 THEN -1 ELSE SUM(recommend)*100/COUNT(*) END FROM ${REVIEWS} WHERE code==$code),
                      enjoy = (SELECT CASE WHEN COUNT(*)==0 THEN 0 ELSE SUM(enjoy-1)*100/(4*COUNT(*)) END FROM ${REVIEWS} WHERE code==$code),
                      difficulty = (SELECT CASE WHEN COUNT(*)==0 THEN 0 ELSE SUM(difficulty-1)*100/(2*COUNT(*)) END FROM ${REVIEWS} WHERE code==$code AND difficulty > 0),
                      teaching = (SELECT CASE WHEN COUNT(*)==0 THEN 0 ELSE SUM(teaching-1)*100/(2*COUNT(*)) END FROM ${REVIEWS} WHERE code==$code AND teaching > 0),
                      workload = (SELECT CASE WHEN COUNT(*)==0 THEN 0 ELSE SUM(workload-1)*100/(2*COUNT(*)) END FROM ${REVIEWS} WHERE code==$code AND workload > 0)
                    WHERE code=$code;`
            , { $code: code })
=======
                      recommend = (SELECT CASE WHEN COUNT(*)=0 THEN -1 ELSE SUM(recommend)*100/COUNT(*) END FROM ${REVIEWS} WHERE code=@code),
                      enjoy = (SELECT CASE WHEN COUNT(*)=0 THEN 0 ELSE SUM(enjoy-1)*100/(4*COUNT(*)) END FROM ${REVIEWS} WHERE code=@code),
                      difficulty = (SELECT CASE WHEN COUNT(*)=0 THEN 0 ELSE SUM(difficulty-1)*100/(2*COUNT(*)) END FROM ${REVIEWS} WHERE code=@code AND difficulty > 0),
                      teaching = (SELECT CASE WHEN COUNT(*)=0 THEN 0 ELSE SUM(teaching-1)*100/(2*COUNT(*)) END FROM ${REVIEWS} WHERE code=@code AND teaching > 0),
                      workload = (SELECT CASE WHEN COUNT(*)=0 THEN 0 ELSE SUM(workload-1)*100/(2*COUNT(*)) END FROM ${REVIEWS} WHERE code=@code AND workload > 0)
                    WHERE code=@code;`,
            {
                [COURSES]: { code }
            })
>>>>>>> dev
    }
}

let Singleton = null

/**
 * @param {object} db defaults to the db instance
 */
module.exports = function(db) {
    if (!db) {
        /* app environment, dev or prod */
        return (Singleton = Singleton ? Singleton : new Course(require('./db'))) // eslint-disable-line
    }
    /* to allow injection */
    return new Course(db)
}