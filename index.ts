import {createServer, IncomingMessage, ServerResponse} from 'http'
import {parse} from 'query-string'
import * as url from 'url'
import * as fs from 'fs'

const hostname = '127.0.0.1'
const port = 5000

const server = createServer((req: IncomingMessage, res: ServerResponse) => {
  const location = url.parse(req.url ? req.url : '', true)
  const params = parse(location.search ? location.search : '')
  const userContent = JSON.stringify(params)
  let fileContent: string | undefined
  const file = `users/${params.id}.txt`

  if (location.pathname == '/create-user') {
    fs.writeFile(file, userContent, (err: NodeJS.ErrnoException | null) => {
      if (err) throw err
      console.log('Usuario criado')
    })
  } else if (location.pathname == '/select-user') {
      if(!fs.existsSync(file)) {
        fileContent = 'Usuario nao encontrado'
        console.log(fileContent) 
      } else {
        const data = fs.readFileSync(file, 'utf-8')
        fileContent = data
        console.log('Usuario selecionado')
      }
  } else if (location.pathname == '/delete-user') {
    fs.unlink(file, (err: NodeJS.ErrnoException | null) => {
      const fileNotFind = err?.code !== 'ENOENT'
      if (fileNotFind) console.log(`${file} Deletado`) 
       else console.log('Arquivo nao encontrado');
    })
  }

  res.statusCode = 200
  res.setHeader('Content-Type', 'application/json')
  res.end(fileContent)
})

server.listen(port, hostname, () => {
  console.log(hostname, port)
})
