import express from 'express';
import http from 'http';
import httpProxy from 'http-proxy';
import path from 'path';
import { port, apiHost, apiPort } from '../config/env';
const apiUrl = 'http://${apiHost}:${apiPort}';
const app = express();
const server = http.Server(app);
const proxy = httpProxy.createProxyServer({target: apiUrl,ws: true;});
app.use('/', express.static(path.resolve(__dirname, '../public')));
/* for test only since request to API will be done with redux auth's fetch method */
app.use('/api', (req, res) => { proxy.web(req,res,{target: ${apiUrl}/${apiVer}})});
server.on('upgrade', (req, socket, head) => {proxy.ws(req,socket,head);});
