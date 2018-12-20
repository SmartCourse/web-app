<<<<<<< HEAD
const path = require('path')
const sqlite3 = require('sqlite3')
const { insertDB, insertUniqueDB, updateDB } = require('./js/tables')

// init db
require('./init_sql')

const DB_NAME = process.env.NODE_ENV === 'production'
    ? path.join(__dirname, '../../../db/smartcourse.db') : path.join(__dirname, './test.db')

console.log('init:', DB_NAME)
=======
const { Connection, Request } = require('tedious')
const { DB_CONFIG, MAX_CONNECTIONS } = require('./config')
const { TABLE_COLUMNS, PRODUCTION } = require('../constants')
const {
    sqlTables,
    sqlUniversity,
    sqlFaculties,
    sqlDegrees,
    sqlSubjects,
    sqlCourses,
    sqlQuestions,
    sqlReviews,
    sqlComments,
    sqlLikes,
    sqlUsers,
    unswDataInitialised,
    testDataInitialised
} = require('./init_sql')

>>>>>>> dev
/**
 * Very slight abstraction over the direct sql queries.
 * This object can be instantiated once and then all queries are assumed to be
 * already filtered at this point.
 * @param {string} databaseName The name of the db if it needs to be passed in.
 */
class DB {
<<<<<<< HEAD
    constructor(databaseName) {
        this._db = new sqlite3.Database(databaseName, sqlite3.OPEN_READWRITE,
            (err) => {
                if (err) {
                    console.error(err)
                } else {
                    console.log(`Opened database: ${databaseName}`)
                }
            }
        )
=======
    constructor() {
        // Immediately start root connection process
        this.connections = [new Connection(DB_CONFIG)]

        // Setup a pool of other connections
        for (let i = 1; i < MAX_CONNECTIONS; i++) {
            const connection = new Connection(DB_CONFIG)
            connection.on('connect', (err) => {
                if (err) throw Error('Couldn\'t connect to DB')
                this.connections.push(connection)
            })
        }
>>>>>>> dev
    }

    async init() {
        return new Promise((resolve, reject) => {
            // Database initialisation benchmarking
            const timeList = [Date.now() / 1000]

            // Do the initialisation
            const [connection] = this.connections

            connection.on('connect', (err) => {
                if (err) reject(err)

                // Create the database and initialise data with no dependencies.
                const request = new Request(sqlTables(), async (err) => {
                    if (err) reject(err)

                    // Initialise with UNSW data
                    if (!await unswDataInitialised(connection)) {
                        await sqlUniversity(connection)
                        await sqlFaculties(connection)
                        await sqlDegrees(connection)
                        await sqlSubjects(connection)
                        await sqlCourses(connection)
                    }

                    // Initialise test databases
                    if (!PRODUCTION && !await testDataInitialised(connection)) {
                        await sqlQuestions(connection)
                        await sqlReviews(connection)
                        await sqlComments(connection)
                        await sqlLikes(connection)
                        await sqlUsers(connection)
                    }

                    // Log completion time
                    timeList.push(Date.now() / 1000)
                    console.log(`Done creating database! (${((timeList[1] - timeList[0])).toFixed(3)})`)

                    // Done
                    resolve()
                })
                connection.execSql(request)
            })
        })
    }

<<<<<<< HEAD
    insertUnique(table, data) {
        return insertUniqueDB(this._db, table, data)
    }

    update(table, data, conditions) {
        return updateDB(this._db, table, data, conditions)
    }

    deleteDB () {
        return Promise.resolve(false)
    }

    run (query, params = []) {
        return new Promise((resolve, reject) => {
            this._db.run(
                query,
                params,
                (err) => { err ? reject(err) : resolve(true) }
            )
        })
    }

    query(query, params = []) {
=======
    delete() {
        return Promise.resolve(false)
    }

    async run(sql, params = {}) {
>>>>>>> dev
        return new Promise((resolve, reject) => {
            // TODO - something more elegant?
            while (this.connections.length === 0) {
                console.log('Not enough connections')
            }
            const connection = this.connections.pop()

            // Make the request
            const request = new Request(sql, (err, rowCount, rows) => {
                this.connections.push(connection)

                if (err) reject(err)

                // Returning the result
                const reducer = (row, column) => {
                    row[column.metadata.colName] = column.value
                    return row
                }

                rows ? resolve(rows.map(row => row.reduce(reducer, {})))
                    : resolve([])
            })

            Object.keys(params).forEach(table =>
                Object.keys(params[table]).forEach(param =>
                    request.addParameter(param, TABLE_COLUMNS[table][param].type,
                        params[table][param])
                )
            )

            // Do the request
            connection.execSql(request)
        })
    }

    close() {
        this.connections.forEach((connection) => connection.close())
    }
}

module.exports = new DB()