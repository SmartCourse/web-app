const {
    DONT_RECOMMEND,
    RECOMMEND,
    MIN_ENJOY,
    MAX_ENJOY,
    MIN_OPTION,
    MAX_OPTION,
<<<<<<< HEAD
    TABLE_NAMES: { REVIEWS }
=======
    TABLE_NAMES: { REVIEWS, COURSES, COMMENTS }
>>>>>>> dev
} = require('./constants')

/* All inputs should be validated in this class that are review related */
class Review {
    constructor(db) {
        console.log('initialising ORM Review object')
        this.db = db
    }

    /**
     * Gets specific review corresponding to an id.
     * @param   {number}  id   Required id param.
     * @returns {object}
     */
    getReview(id) {
        return this.db
<<<<<<< HEAD
            .query(`SELECT * FROM ${REVIEWS} WHERE id=?`, [id])
=======
            .run(`SELECT * FROM ${REVIEWS} WHERE id=@id`,
                {
                    [REVIEWS]: { id }
                })
            .then(([row]) => row || {})
>>>>>>> dev
    }

    /**
     * @param   {string}  code          The code of the course
     * @param   {number}  pageNumber    The page number for which we want to get questions.
     * @returns {Array}
     */
    getReviews(code, pageNumber, pageSize) {
<<<<<<< HEAD
        const offset = (pageSize * pageNumber) - pageSize
        return this.db
            .queryAll(`SELECT * FROM ${REVIEWS} WHERE code=? ORDER BY timestamp DESC LIMIT ?, ?`,
                [code, offset, pageSize])
=======
        if (isNaN(pageNumber) || isNaN(pageSize)) {
            throw Error('Invalid paging values')
        }
        const offset = (pageSize * pageNumber) - pageSize
        return this.db
            .run(`SELECT r.*, cou.code, (SELECT COUNT(com.reviewID)
                FROM ${COMMENTS} com
                WHERE com.reviewID = r.id) as numResponses
            FROM ${REVIEWS} r
            JOIN ${COURSES} cou ON cou.code = @code 
            WHERE r.courseID=cou.id
            ORDER BY r.timestamp DESC
            OFFSET ${offset} ROWS
            FETCH NEXT ${pageSize} ROWS ONLY`,
            {
                [COURSES]: { code }
            })
    }

    /**
     * Gets the total number of reviews for a course
     * @param   {string} code        The code of the course
     * @returns {object}
     */
    getReviewCount(code) {
        return this.db
            .run(`SELECT COUNT(*) AS COUNT FROM ${REVIEWS} r
            WHERE r.courseID=(SELECT c.id FROM ${COURSES} c WHERE c.code=@code)`,
            {
                [COURSES]: { code }
            })
            .then(([row]) => row || { COUNT: 0 })
>>>>>>> dev
    }

    /**
     * Gets the total number of reviews for a course
     * @param   {string} code        The code of the course
     * @returns {object}
     */
    getReviewCount(code) {
        return this.db
            .queryAll(`SELECT COUNT() FROM ${REVIEWS} WHERE code=?`,
                [code])
    }

    /**
     * @param {string} code  The code of the course.
     * @param {object} data  controller passed in object which should
     *                       contain the user data (probs eventually from an auth token)
     */
    postReview(code, { title, body, recommend, enjoy, difficulty, teaching, workload, userID }) {
        if (recommend !== DONT_RECOMMEND && recommend !== RECOMMEND) throw Error('Invalid recommend value')
        if (enjoy < MIN_ENJOY || enjoy > MAX_ENJOY) throw Error('Invalid enjoy value')

        ;[difficulty, teaching, workload].forEach(item => {
            if (item < MIN_OPTION || item > MAX_OPTION) throw Error('Invalid difficulty, teaching or workload value')
        })

        // insert review, get review, update course ratings
        return this.db
<<<<<<< HEAD
            .insert(REVIEWS, { code, userID, title, body, recommend, enjoy, difficulty, teaching, workload })
            .then((reviewID) => this.getReview(reviewID))
=======
            .run(`INSERT INTO ${REVIEWS} (courseID, userID, title, body, recommend, enjoy, difficulty, teaching, workload)
                SELECT id, @userID, @title, @body, @recommend, @enjoy, @difficulty, @teaching, @workload
                FROM courses
                WHERE code=@code;
                SELECT @@identity AS id`,
            {
                [REVIEWS]: { userID, title, body, recommend, enjoy, difficulty, teaching, workload },
                [COURSES]: { code }
            })
            .then(([{ id }]) => id)
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
        return (Singleton = Singleton ? Singleton : new Review(require('./db'))) // eslint-disable-line
    }
    /* to allow injection */
    return new Review(db)
}
