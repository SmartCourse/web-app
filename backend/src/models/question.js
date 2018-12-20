<<<<<<< HEAD
const { TABLE_NAMES: { QUESTIONS, COMMENTS } } = require('./constants')
=======
const { TABLE_NAMES: { QUESTIONS, COMMENTS, COURSES } } = require('./constants')
>>>>>>> dev

/* All inputs should be validated in this class that are question related */
class Question {
    constructor(db) {
        console.log('initialising ORM Question object')
        this.db = db
    }

    /**
     * Gets specific question corresponding to an id.
     * @param   {id}      questionID Required id param.
     * @returns {object}             Single question
     */
<<<<<<< HEAD
    getQuestion(questionID) {
        return this.db.query(`SELECT * FROM ${QUESTIONS} WHERE id=?`, [questionID])
=======
    getQuestion(id) {
        return this.db
            .run(`SELECT * FROM ${QUESTIONS} WHERE id=@id`,
                {
                    [QUESTIONS]: { id }
                })
            .then(([row]) => row || {})
>>>>>>> dev
    }

    /**
     * Get a specific page of questions for a course
     * @param   {string} code        The code of the course
     * @param   {number} pageNumber  The page number for which we want to get questions.
     * @returns {object}
     */
    getQuestions(code, pageNumber, pageSize) {
<<<<<<< HEAD
        const offset = (pageSize * pageNumber) - pageSize
        return this.db
            .queryAll(`select q.*, COUNT(c.questionID) AS numAnswers 
                from ${QUESTIONS} q 
                JOIN ${COMMENTS} c 
                on c.questionID = q.id
                where q.code = ? 
                GROUP BY c.questionID
                ORDER BY q.timestamp DESC
                LIMIT ?, ?`,
            [code, offset, pageSize])
    }

    getQuestionsByUserID(uid, limit = 10) {
        return this.db
            .queryAll(`SELECT q.*, COUNT(c.questionID) AS numAnswers
                FROM ${QUESTIONS} q
                JOIN ${COMMENTS} c ON c.questionID = q.id
                WHERE q.userID=?
                GROUP BY questionID
                ORDER BY timestamp DESC
                LIMIT ?`,
            [uid, limit])
=======
        if (isNaN(pageNumber) || isNaN(pageSize)) {
            throw Error('Invalid paging values')
        }
        const offset = (pageSize * pageNumber) - pageSize
        return this.db
            .run(`SELECT q.*, cou.code, (SELECT COUNT(com.questionID)
            FROM ${COMMENTS} com
            WHERE com.questionID = q.id) as numAnswers
            FROM ${QUESTIONS} q
            JOIN ${COURSES} cou on cou.code = @code
            WHERE courseID = cou.id
            ORDER BY q.timestamp DESC
            OFFSET ${offset} ROWS
            FETCH NEXT ${pageSize} ROWS ONLY`,
            {
                [COURSES]: { code }
            })
    }

    getQuestionsByUserID(userID, limit = 10) {
        if (isNaN(limit)) {
            throw Error('Invalid limit value')
        }
        return this.db
            .run(`SELECT * FROM ${QUESTIONS}
                WHERE userID=@userID
                ORDER BY timestamp DESC
                OFFSET 0 ROWS
                FETCH NEXT ${limit} ROWS ONLY`,
            {
                [QUESTIONS]: { userID }
            })
>>>>>>> dev
    }

    /**
     * Gets the total number of questions for a course
     * @param   {string} code        The code of the course duh
     * @returns {object}
     */
    getQuestionCount(code) {
        return this.db
<<<<<<< HEAD
            .queryAll(`SELECT COUNT() FROM ${QUESTIONS} WHERE code=?`,
                [code])
=======
            .run(`SELECT COUNT(*) AS COUNT FROM ${QUESTIONS}
                WHERE courseID=(SELECT id FROM ${COURSES} WHERE code=@code)`,
            {
                [COURSES]: { code }
            })
            .then(([row]) => row || { COUNT: 0 })
>>>>>>> dev
    }

    /**
     * Post a question.
     * @param {string}  code  The code of the course
     * @param {object}  data      controller passed in object which should
     *                       contain the user data (probs eventually from an auth token)
     */
    postQuestion(code, { userID, title, body }) {
        return this.db
<<<<<<< HEAD
            .insert(QUESTIONS, { code, userID, title, body })
            .then((questionID) => this.getQuestion(questionID))
=======
            .run(`INSERT INTO ${QUESTIONS} (courseID, userID, title, body)
                SELECT id, @userID, @title, @body
                FROM courses
                WHERE code=@code;
                SELECT @@identity AS id`,
            {
                [QUESTIONS]: { userID, title, body },
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
        return (Singleton = Singleton ? Singleton : new Question(require('./db'))) // eslint-disable-line
    }
    /* to allow injection */
    return new Question(db)
}
