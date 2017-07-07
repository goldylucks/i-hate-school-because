const http = require('http')

let list = [
  { title: '#1 title from server without decsription' },
  { title: '#2 title from server WITH decsription', description: '#2 description!' },
]

const PORT = process.env.PORT || 8000

const server = http.createServer((req, res) => {

  if (req.url === '/list') {
    if (req.method !== 'GET') {
      res.end('not get')
      return
    }
    // Set CORS headers
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Request-Method', '*');
    res.setHeader('Access-Control-Allow-Methods', 'OPTIONS, GET');
    res.setHeader('Access-Control-Allow-Headers', '*');
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify(list))
    return
  }
  if (req.url === '/new') {
    // Set CORS headers
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Request-Method', '*');
    res.setHeader('Access-Control-Allow-Methods', 'OPTIONS, GET, POST');
    res.setHeader('Access-Control-Allow-Headers', '*, content-type');
    res.setHeader('Content-Type', 'application/json');
    if (req.method === 'POST') {
      let body = '';
      req.on('data', data => {
        body += data
        if (body.length > 1e6) {
          req.connection.destroy()
          return
        }
      });
      req.on('end', () => {
        try {
          list = [JSON.parse(body)].concat(list)
          res.end(JSON.stringify({ message: 'success! :)' }))
        } catch (err) {
          console.error('error adding item', err)
          res.end(JSON.stringify({ message: 'failure :(' }))
        }
      });
      return
    }
    res.end()
  }

  res.end('you hit the main entrance, nothing to see here!')
})

server.listen(PORT, () => {
  console.log(`server listenting on port ${PORT}`)
})