const fs = require('fs')

function genClass(className, cVar, extraCode, paths) {
  const classBody = Object.entries(
      paths.flatMap(e => {
        return Object.entries(e.value).map(rt => {
          return {
            path: e.path,
            tag: rt[1].tags[0],
            type: rt[0],
            value: rt[1],
            params: rt[1].parameters?.reduce((a, c) => {
              let cin = a[c.in]

              if (!cin) cin = a[c.in] = []

              cin.push(c)

              return a
            }, {}) || {}
          }
        })
      })
          .reduce((a, c) => {
            let v = a[c.tag]

            if (!v) v = a[c.tag] = []

            v.push(c)

            return a
          }, {})
  )
      .map(en => {

        const group = en[0].split('-')
            .filter(w => !['controller', 'rest'].includes(w))
            .map((w, i) => i === 0 ? w : w.charAt(0).toUpperCase() + w.slice(1))
            .join('')

        const methods = en[1]
            .map(r => {
              r.value.operationId = r.value.operationId.replace(/_\d+$/, '')

              return r
            })
            .sort((a, b) => {
              if (a.value.operationId > b.value.operationId) return 1
              if (a.value.operationId < b.value.operationId) return -1
              return 0
            })
            .map(r => {

              let params = ''
              let query = ''

              if (r.params.path) {
                params += r.params.path.map(p => p.name).join(', ')
              }

              if (r.params.query) {
                params += (params.length ? ', ' : '') +
                    r.params.query
                        .sort((a, b) => {
                          if (a.default && !b.default) return 1
                          if (!a.default && b.default) return -1
                          if (a.name > b.name) return -1
                          if (a.name < b.name) return 1
                          return 0
                        })
                        .map(p => {
                            if (p.name === 'pageable') return  "page, size, sort"
                            else return p.name + (p.default ? ` = ${p.default}` : '')
                        })
                        .join(', ')
                query += '?' + r.params.query
                    .map(p => {
                      const val = p.required || p.default ? p.name : `${p.name} ? ${p.name} : ''`
                        if (p.name === 'pageable') return  "page=${page ? page : 0}&size=${size ? size : 10}&sort=${sort ? sort : 'cdt,desc'}"
                        else return `${p.name}=\${${val}}`
                    })
                    .join('&')
              }


              if (r.value.requestBody) {
                params += (params.length ? ', ' : '') + 'body'
              }

              return '    ' + r.value.operationId + '(' + params + ') {\n' +
                  `      return ${cVar}.` + r.type + '(`' +
                  r.path.replaceAll(/\{/g, '${') +
                  query +
                  '`' +
                  (r.value.requestBody ? ', body' : '') +
                  ')' +
                  '\n    }'
            }).join(',\n\n')

        return {
          group,
          methods
        }
      })
      .sort((a, b) => {
        const ag = a.group.toLowerCase()
        const bg = b.group.toLowerCase()
        if (ag > bg) return 1
        if (ag < bg) return -1
        return 0
      })
      .map(g => {
        return '  ' + g.group + ' = {\n\n' + g.methods + '\n  }'
      })
      .join('\n\n')

  return `class ${className} {\n${extraCode ? '\n' + extraCode + '\n\n' : ''}${classBody}\n\}`
}

fetch('http://localhost:8081/v3/api-docs').then(r => r.json()).then(r => {

  const paths = Object.entries(r.paths).map(e => {
    return {
      path: e[0],
      value: e[1]
    }
  })
      .reduce(
          (a, c) => {
            if (
                [
                  '/api/public',
                  '/api/verify/password',
                  '/api/restore/password'
                ].filter(p => c.path.startsWith(p))
                    .length
            ) {
              a.public.push(c)
            } else {
              a.auth.push(c)
            }
            return a
          },
          {auth: [], public: []}
      )

  let text = 'import {Http, PublicHttp} from "./http";\n\n' +
      'const c = new Http()\n' +
      'const pc = new PublicHttp()\n\n'

  text += 'export ' + genClass(
      'AuthApi',
      'c',
      '  get cli() {\n    return c\n  }',
      paths.auth
  ) + '\n\n'

  text += 'export ' + genClass('P_Api', 'pc', '', paths.public) + '\n'

  return text
})
    .then(t => {
      return new Promise((res, rej) => {
        fs.writeFile('./api.js', t, err => {
          if (err) rej(err)
          else res('DONE!')
        })
      })
    })
    .then(console.log, console.error)
