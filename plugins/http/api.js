import {Http, PublicHttp} from "./http";

const c = new Http()
const pc = new PublicHttp()

export class AuthApi {

  get cli() {
    return c
  }

  cabinet = {

    delete(id) {
      return c.delete(`/api/cabinet/${id}`)
    },

    getById(id) {
      return c.get(`/api/cabinet/${id}`)
    },

    list(query, page, size, sort) {
      return c.get(`/api/cabinet?query=${query}&page=${page ? page : 0}&size=${size ? size : 10}&sort=${sort ? sort : 'cdt,desc'}`)
    },

    listAll() {
      return c.get(`/api/cabinet/list`)
    },

    patch(id, body) {
      return c.patch(`/api/cabinet/${id}`, body)
    },

    save(body) {
      return c.post(`/api/cabinet`, body)
    },

    update(id, body) {
      return c.put(`/api/cabinet/${id}`, body)
    }
  }

  example = {

    delete(id) {
      return c.delete(`/api/example/${id}`)
    },

    getById(id) {
      return c.get(`/api/example/${id}`)
    },

    listAll(query, page, size, sort) {
      return c.get(`/api/example?query=${query}&page=${page ? page : 0}&size=${size ? size : 10}&sort=${sort ? sort : 'cdt,desc'}`)
    },

    patch(id, body) {
      return c.patch(`/api/example/${id}`, body)
    },

    save(body) {
      return c.post(`/api/example`, body)
    },

    update(id, body) {
      return c.put(`/api/example/${id}`, body)
    }
  }

  exampleDict = {

    delete(dictId) {
      return c.delete(`/api/dict/example?dictId=${dictId}`)
    },

    listAll() {
      return c.get(`/api/dict/example`)
    },

    save(body) {
      return c.post(`/api/dict/example`, body)
    }
  }

  instrument = {

    delete(id) {
      return c.delete(`/api/instrument/${id}`)
    },

    getById(id) {
      return c.get(`/api/instrument/${id}`)
    },

    list(query, page, size, sort) {
      return c.get(`/api/instrument?query=${query}&page=${page ? page : 0}&size=${size ? size : 10}&sort=${sort ? sort : 'cdt,desc'}`)
    },

    listAll() {
      return c.get(`/api/instrument/list`)
    },

    patch(id, body) {
      return c.patch(`/api/instrument/${id}`, body)
    },

    save(body) {
      return c.post(`/api/instrument`, body)
    },

    update(id, body) {
      return c.put(`/api/instrument/${id}`, body)
    }
  }

  lesson = {

    delete(id) {
      return c.delete(`/api/lesson/${id}`)
    },

    getById(id) {
      return c.get(`/api/lesson/${id}`)
    },

    list(query, page, size, sort) {
      return c.get(`/api/lesson?query=${query}&page=${page ? page : 0}&size=${size ? size : 10}&sort=${sort ? sort : 'cdt,desc'}`)
    },

    listAll() {
      return c.get(`/api/lesson/list`)
    },

    patch(id, body) {
      return c.patch(`/api/lesson/${id}`, body)
    },

    save(body) {
      return c.post(`/api/lesson`, body)
    },

    search(query) {
      return c.get(`/api/lesson/search?query=${query}`)
    },

    update(id, body) {
      return c.put(`/api/lesson/${id}`, body)
    }
  }

  menu = {

    menu() {
      return c.get(`/api/menu`)
    }
  }

  message = {

    send(body) {
      return c.post(`/api/message`, body)
    },

    test(dto) {
      return c.post(`/api/message/test?dto=${dto}`)
    }
  }

  notification = {

    delete(id) {
      return c.delete(`/api/notification/${id}`)
    },

    getById(id) {
      return c.get(`/api/notification/${id}`)
    },

    list(query, page, size, sort) {
      return c.get(`/api/notification?query=${query}&page=${page ? page : 0}&size=${size ? size : 10}&sort=${sort ? sort : 'cdt,desc'}`)
    },

    listAll() {
      return c.get(`/api/notification/list`)
    },

    patch(id, body) {
      return c.patch(`/api/notification/${id}`, body)
    },

    save(body) {
      return c.post(`/api/notification`, body)
    },

    update(id, body) {
      return c.put(`/api/notification/${id}`, body)
    }
  }

  permission = {

    list() {
      return c.get(`/api/permission`)
    }
  }

  role = {

    delete(roleId) {
      return c.delete(`/api/role?roleId=${roleId}`)
    },

    findAllRsql(query, page, size, sort) {
      return c.get(`/api/role/rsql?query=${query}&page=${page ? page : 0}&size=${size ? size : 10}&sort=${sort ? sort : 'cdt,desc'}`)
    },

    list() {
      return c.get(`/api/role`)
    },

    listPermissions() {
      return c.get(`/api/role/permissions`)
    },

    listRoleWithUnit() {
      return c.get(`/api/role/unit`)
    },

    save(body) {
      return c.post(`/api/role`, body)
    }
  }

  session = {

    delete(id) {
      return c.delete(`/api/session/${id}`)
    },

    getById(id) {
      return c.get(`/api/session/${id}`)
    },

    list(query, page, size, sort) {
      return c.get(`/api/session?query=${query}&page=${page ? page : 0}&size=${size ? size : 10}&sort=${sort ? sort : 'cdt,desc'}`)
    },

    listAll() {
      return c.get(`/api/session/list`)
    },

    patch(id, body) {
      return c.patch(`/api/session/${id}`, body)
    },

    save(body) {
      return c.post(`/api/session`, body)
    },

    update(id, body) {
      return c.put(`/api/session/${id}`, body)
    }
  }

  student = {

    delete(id) {
      return c.delete(`/api/student/${id}`)
    },

    getById(id) {
      return c.get(`/api/student/${id}`)
    },

    list(query, page, size, sort) {
      return c.get(`/api/student?query=${query}&page=${page ? page : 0}&size=${size ? size : 10}&sort=${sort ? sort : 'cdt,desc'}`)
    },

    listAll() {
      return c.get(`/api/student/list`)
    },

    patch(id, body) {
      return c.patch(`/api/student/${id}`, body)
    },

    save(body) {
      return c.post(`/api/student`, body)
    },

    update(id, body) {
      return c.put(`/api/student/${id}`, body)
    }
  }

  user = {

    block(id) {
      return c.post(`/api/user/block?id=${id}`)
    },

    current() {
      return c.get(`/api/user/current`)
    },

    delete(id) {
      return c.delete(`/api/user?id=${id}`)
    },

    getUserById(id) {
      return c.get(`/api/user/byId?id=${id}`)
    },

    getUsers(query, page, size, sort) {
      return c.get(`/api/user?query=${query}&page=${page ? page : 0}&size=${size ? size : 10}&sort=${sort ? sort : 'cdt,desc'}`)
    },

    getUsersByType(type) {
      return c.get(`/api/user/byType?type=${type}`)
    },

    save(body) {
      return c.post(`/api/user`, body)
    },

    updatePassword(body) {
      return c.put(`/api/user/password`, body)
    }
  }

  worker = {

    delete(id) {
      return c.delete(`/api/worker/${id}`)
    },

    getById(id) {
      return c.get(`/api/worker/${id}`)
    },

    getWorkersWithColors() {
      return c.get(`/api/worker/colors`)
    },

    list(query, page, size, sort) {
      return c.get(`/api/worker?query=${query}&page=${page ? page : 0}&size=${size ? size : 10}&sort=${sort ? sort : 'cdt,desc'}`)
    },

    listAll() {
      return c.get(`/api/worker/list`)
    },

    patch(id, body) {
      return c.patch(`/api/worker/${id}`, body)
    },

    save(body) {
      return c.post(`/api/worker`, body)
    },

    update(id, body) {
      return c.put(`/api/worker/${id}`, body)
    }
  }

  wsMessage = {

    sendMessage(message) {
      return c.post(`/api/messages/send?message=${message}`)
    }
  }
}

export class P_Api {
  auth = {

    login(body) {
      return pc.post(`/api/public/auth/login`, body)
    }
  }
}
