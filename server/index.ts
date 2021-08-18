import path from 'path';
import fs from 'fs';
import express from 'express';
import React from 'react'
import ReactDOMServer from 'react-dom/server'
import App from '../client/App';

const HOST_URL = process.env.HOST_URL || 'http://localhost';
const PORT = process.env.PORT || 3000;

const server = express();
server.set('view engine', 'ejs')
server.set('views', path.join(__dirname, 'views'));

server.use('/', express.static(path.join(__dirname, 'static')))

const manifest = fs.readFileSync(
  path.join(__dirname, 'static/manifest.json'),
  'utf-8'
)
const assets = JSON.parse(manifest)

server.get('/', (req: express.Request, res: express.Response) => {
  const component = ReactDOMServer.renderToString(React.createElement(App))
  res.render('index', { assets, component });
});

server.listen(3000, () => {
  console.log(`Server running on ${HOST_URL}:${PORT}`);
});
