import request from 'superagent'
import cookie from 'cookies-js'

const default_headers = () => {
  return {
    Accept: 'application/json',
    'X-CSRF-Token': cookie.get('_csrf_token')
  }
}

// taken from superagent:
// /lib/node/utils.js
const parse_link_header = response => {
  if (!response.header.link) {
    return null
  }
  return response.header.link.split(/ *, */).reduce(function(obj, str) {
    var parts = str.split(/ *; */)
    var url = parts[0].slice(1, -1)
    var rel = parts[1].split(/ *= */)[1].slice(1, -1)
    obj[rel] = url
    return obj
  }, {})
}

const urlbase = '/api/v1/canvas_spaces'

const api = {
  validate_field(field, value, cb, headers = default_headers()) {
    const validation_url = `${urlbase}/validate/${field}/${value}`
    request.get(validation_url).set(headers).end((err, response) => {
      cb(response.body)
    })
  },

  create_space(data, cb, headers = default_headers()) {
    request
      .post(`${urlbase}/groups`)
      .set(headers)
      .send(data)
      .end((err, response) => {
        cb(response)
      })
  },

  get_spaces(cb, headers = default_headers()) {
    request.get(`${urlbase}/groups`).set(headers).end((err, response) => {
      cb(response.body)
    })
  },

  update_space(data, cb, headers = default_headers()) {
    delete data.avatar_url
    request
      .put(`${urlbase}/groups/${data.id}`)
      .set(headers)
      .send(data)
      .end((err, response) => {
        if (err) {
          cb(err.response.body, response.body)
        } else {
          cb(null, response.body)
        }
      })
  },

  delete_space(data, cb, headers = default_headers()) {
    request
      .del(`${urlbase}/groups/${data.id}`)
      .set(headers)
      .send(data)
      .end((err, response) => {
        cb(err, response)
      })
  },

  get_spaces_for_user(user_id, cb, per_page = 10, headers = default_headers()) {
    request
      .get(`${urlbase}/users/self/groups`)
      .query({ per_page })
      .set(headers)
      .end((err, response) => {
        const { body } = response
        const links = parse_link_header(response)
        cb(body, links)
      })
  },

  load_url(url, cb, headers = default_headers()) {
    request.get(url).set(headers).end((err, response) => {
      const { body } = response
      const links = parse_link_header(response)
      cb(body, links)
    })
  }
}

export default api
