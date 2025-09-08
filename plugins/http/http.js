import axios from 'axios';
import eventsStore from "~/plugins/store/events";

const JWT_NAME = 'token'
const BASE_URL = (import.meta.env?.NUXT_PUBLIC_API_BASE) || (process.env.NODE_ENV === 'production' ? '/' : 'http://localhost:8081/')

function create(http) {
  const h = {
    Accept: 'application/json',
    'Content-Type': 'application/json;utf-8',
  }

  let token = localStorage.getItem(JWT_NAME);

  // if (token !== null) {
  //   console.log(token)
  //   token = JSON.parse(token).value
  // }

  const jwt = token;

  if (jwt) {
    h.Authorization = `Bearer ${jwt}`
  }

  if (http.interceptorId > -1) {
    http.ax.interceptors.response.eject(http.interceptorId)
  }

  http.ax = axios.create({
    baseURL: BASE_URL,
    headers: h,
    timeout: 180000000000000
  })

  if (http.interceptor) {
    const interceptor = http.interceptor
    http.interceptorId = http.ax.interceptors.response
        .use(
            r => r,
            (error) => {
              if (error.response?.status === 401) {
                http.logout()
                interceptor(error)
              }
              return Promise.reject(error)
            })
  }
}

function errHandler(http, err, overrideGlobalHandler) {
  return e => {
    const er = {
      cannotConnect: e.code === 'ERR_NETWORK' || e.code === 'ETIMEDOUT' || undefined,
      status: e.response?.status,
      d: e.response?.data || undefined,
      e,
    }

    if (http.globalErrorHandler && (!overrideGlobalHandler || !overrideGlobalHandler(er))) {
      http.globalErrorHandler(er)
    }

    if (er.status === 400) {
      eventsStore.dispatch('addErrorMessage', { status: er.status, message: er.d.message });
    }


    err(er)
  }
}

class RequestMethods {
  get cli() {
    return null
  }

  get(url, overrideGlobalErrorHandler = undefined) {
    return new Promise((res, err) => this.cli.get(url)
        .then(
            r => res(r.data),
            errHandler(this, err, overrideGlobalErrorHandler)
        )
    )
  }

  getBin(url, overrideGlobalErrorHandler) {
    return new Promise((res, err) => {
      this.cli.get(url, {responseType: 'arraybuffer'})
          .then(
              r => res(new Blob([r.data], {type: r.headers['content-type']})),
              errHandler(this, err, overrideGlobalErrorHandler)
          )
    })
  }

  post(url, body = undefined, overrideGlobalErrorHandler = undefined) {
    return new Promise((res, err) => this.cli.post(url, body)
        .then(
            r => res(r.data),
            errHandler(this, err, overrideGlobalErrorHandler)
        )
    )
  }

  put(url, body = undefined, overrideGlobalErrorHandler = undefined) {
    return new Promise((res, err) => this.cli.put(url, body)
        .then(
            r => res(r.data),
            errHandler(this, err, overrideGlobalErrorHandler)
        )
    )
  }

  delete(url, body = undefined, overrideGlobalErrorHandler = undefined) {
    return new Promise((res, err) => this.cli.delete(url, body)
        .then(
            r => {
              eventsStore.dispatch('addErrorMessage', { status: 210, message: "Запись удалена"});
              res(r.data)
            },
            errHandler(this, err, overrideGlobalErrorHandler)
        )
    )
  }
}

export class Http extends RequestMethods {

  constructor() {
    super();

    this.interceptorId = -1
    this.interceptor = null
    this.globalErrorHandler = null
    this.loginHandler = null
    this.logoutHandler = null
    this.ax = null

    create(this)
  }

  get cli() {
    return this.ax
  }

  setLoginHandler(handler) {
    this.loginHandler = handler
    if (handler && this.loggedIn) {
      handler()
    }
  }

  setLogoutHandler(handler) {
    this.logoutHandler = handler
  }

  setGlobalErrorHandler(handler) {
    this.globalErrorHandler = handler
  }

  set403Interceptor(interceptor) {
    this.interceptor = interceptor
    create(this)
  }

  get loggedIn() {
    return !!localStorage.getItem(JWT_NAME)?.length
  }

  login(jwt) {
    localStorage.setItem(JWT_NAME, jwt)
    create(this)
    if (this.loginHandler) this.loginHandler()
  }

  logout() {
    localStorage.removeItem(JWT_NAME)
    create(this)
    if (this.logoutHandler) this.logoutHandler()
  }
}

export class PublicHttp extends RequestMethods {

  constructor() {
    super();

    this.ax = axios.create({
      baseURL: BASE_URL,
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json;utf-8',
      },
      timeout: 180000000000000
    })
  }

  get cli() {
    return this.ax
  }
}
