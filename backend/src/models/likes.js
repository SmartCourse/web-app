const { TABLE_NAMES: { LIKES, USERS, QUESTIONS, REVIEWS, COMMENTS } } = require('./constants')

/* All inputs should be validated in this class that are likes related */
class Likes {
    constructor(db) {
        console.log('initialising ORM Likes object')
        this.db = db
    }

    /*
     * Get likes
     */
    getLikes({ type, id }) {
        return this.db
<<<<<<< HEAD
            .query(`SELECT SUM(value) as sum FROM ${LIKES} WHERE objectType=? AND objectID=?`,
                [type, id])
            .then(({ sum }) => ({ likes: sum || 0 }))
=======
            .run(`SELECT SUM(value) as sum FROM ${LIKES}
            WHERE objectType=@objectType AND objectID=@objectID`,
            {
                [LIKES]: { objectType: type, objectID: id }
            })
            .then(([{ sum }]) => ({ likes: sum || 0 }))
>>>>>>> dev
    }

    /*
     * Get likes for a specific user
     */
    getUserLiked({ type, id, userID }) {
        return this.db
<<<<<<< HEAD
            .query(`SELECT value AS userLiked FROM ${LIKES} WHERE objectType=? AND objectID=? AND userID=?`,
                [type, id, userID])
            .then(({ userLiked = 0 } = {}) => ({ userLiked }))
=======
            .run(`SELECT value AS userLiked FROM ${LIKES}
            WHERE objectType=@objectType AND objectID=@objectID AND userID=@userID`,
            {
                [LIKES]: { objectType: type, objectID: id, userID }
            })
            .then(([{ userLiked = 0 } = {}]) => ({ userLiked }))
>>>>>>> dev
    }

    /*
     * Put likes
     */
    putLikes({ type, id, userID, value }) {
<<<<<<< HEAD
        // Stuff to update likes
        const data = {
            objectType: type,
            objectID: id,
            userID,
            value
        }
        const insertValues = Object.values(data)
        const insertColumns = Object.keys(data)
        const insertPlaceholders = insertColumns.map(_ => '?').join()
        const updateLikes = `REPLACE INTO ${LIKES} (${insertColumns}) VALUES (${insertPlaceholders})`

        // Stuff to update reputation
        const creatorTable = (type === QUESTIONS || type === REVIEWS) ? type : COMMENTS
        const updateReputation = `UPDATE ${USERS}
        SET reputation = (SELECT reputation FROM ${USERS} WHERE id = ?) + ?
        WHERE id = ?`

        // Classic
        return Promise.all([
            this.db.query(`SELECT * FROM ${LIKES} WHERE objectType=? AND objectID=? AND userID=?`,
                [type, id, userID]),
            this.db.query(`SELECT userID FROM ${creatorTable} WHERE id = ?`,
                [id])
        ])
            .then(([originalLike, creator]) => {
                const oldLike = (originalLike && originalLike.value) || 0
                const creatorID = creator.userID
                const repChange = creatorID !== userID ? (value - oldLike) : 0
                return Promise.all([
                    this.db.run(updateLikes, [...insertValues]),
                    this.db.run(updateReputation, [creatorID, repChange, creatorID])
                ])
                    .then(() => this.getLikes({ type, id }))
            })
=======
        // For upsert
        let updatePreviousLike = false
        const updateLikesSql = `UPDATE ${LIKES} SET
            objectType = @objectType,
            objectID = @objectID,
            userID = @userID,
            value = @value
            WHERE objectType = @objectType AND objectID = @objectID AND userID = @userID`
        const insertLikesSql = `INSERT INTO ${LIKES} (objectType, objectID, userID, value)
            VALUES (@objectType, @objectID, @userID, @value)`

        // The table to get the creatorID from
        const objectTable = (type === QUESTIONS || type === REVIEWS) ? type : COMMENTS

        // Get past data to prevent malicious upvoting
        return Promise.all([
            this.db
                .run(`SELECT value FROM ${LIKES}
                    WHERE objectType = @objectType AND objectID = @objectID AND userID = @userID`,
                {
                    [LIKES]: { objectType: type, objectID: id, userID }
                }),
            this.db
                .run(`SELECT userID FROM ${objectTable}
                    WHERE id = @id`,
                {
                    [objectTable]: { id }
                })
        ])
            .then(([oldLike, creatorID]) => {
                updatePreviousLike = oldLike.length
                return {
                    oldLike: oldLike.length ? oldLike[0].value : 0,
                    creatorID: creatorID[0].userID
                }
            })
            // Update the likes and users table
            .then(({ oldLike, creatorID }) => Promise.all([
                this.db
                    .run(updatePreviousLike ? updateLikesSql : insertLikesSql,
                        {
                            [LIKES]: {
                                objectType: type,
                                objectID: id,
                                userID,
                                value
                            }
                        }),
                this.db
                    .run(`UPDATE ${USERS}
                        SET reputation = reputation + @value
                        WHERE id = @id`,
                    {
                        [LIKES]: { value: creatorID === userID ? 0 : value - oldLike },
                        [USERS]: { id: creatorID }
                    })
            ]))
            .then(() => this.getLikes({ type, id }))
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
        return (Singleton = Singleton ? Singleton : new Likes(require('./db'))) // eslint-disable-line
    }
    /* to allow injection */
    return new Likes(db)
}
