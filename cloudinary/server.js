const http = require('http');

const hostname = '<172.25.4.218>';
const port = 8000;

const server = http.createServer((req, res) => {
        res.statusCode = 200
        res.setHeader('Content-Type', 'text/plain')
        res.end('Hello world')
});

server.listen(port, hostname, () => {
        console.log(`Server running at http://${hostname}:${port}`)
});