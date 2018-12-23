import APIError from './errors'
import { getAuthHeaders } from './auth'
import axios from 'axios'

const API_URL = 'http://127.0.0.1:3000/api' /*process && process.env && process.env.NODE_ENV === 'development'
  ? 'http://localhost:3000/api' : (process.env.NODE_ENV === 'staging'
    ? 'https://smartcourse-staging.azurewebsites.net/api'
    : 'https://smartcourse.me/api')
  */

async function responseCheck(res) {
  if (res.ok) {
    // check if body, else rely on headers
    return res.status === 200 ? res.data : res.headers.get('X-ID')
  } else if (res.status >= 500) {
    throw new APIError('Server Error')
  } else {
    // if 400s response json is probably sent to explain problem
    const err = await res.data
    throw new APIError(err.message, err.code)
  }
}

let request

export function createApi(store) {
  request = function (path, { headers, method, data }) {
    // eventually add cors and auth headers
    const url = `${API_URL}${path}`
    const auth = store.getters['auth/userAuthObject']
    data = data ? JSON.stringify(data) : null
    headers = {
      'Content-Type': 'application/json',
      ...headers
    }

    // creds always required for POST, PUT, DELETE
    // NB. for mvp allow people to slip through here
    // even if not logged on
    if (!headers.Authorization && auth) {
      return getAuthHeaders(auth)
        // simple request or non-simple?
        .then(options => method === 'GET' ? axios(url, {
          headers: {
            ...options.headers
          }
        }) : axios(url, {
          headers: {
            ...options.headers,
            ...headers
          },
          data,
          method
        }))
    }

    return axios(url, {
      headers,
      method,
      data
    })
  }
}

/**
 * A GET request
 * @param   {string} path     The relative path for the api call.
 * @param   {object} options  Any options being passed to the req, eg. auth
 * @returns {Promise}         The relevant request
 */
export const get = (path, options) =>
  request(path, { ...options, method: 'GET' })
    .then(responseCheck)

/**
 * A POST request, used to create an entry in the db
 * @param   {string} path     The relative path for the api call.
 * @param   {object} options  Any options being passed to the req, eg. auth
 * @returns {Promise}         The relevant request
 */
export const post = (path, options) =>
  request(path, { ...options, method: 'POST' })
    .then(responseCheck)

/**
 * A PUT request, used to update the db
 * @param   {string} path     The relative path for the api call.
 * @param   {object} options  Any options being passed to the req, eg. auth
 * @returns {Promise}         The relevant request
 */
export const put = (path, options) =>
  request(path, { ...options, method: 'PUT' })
    .then(responseCheck)

export const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms))
