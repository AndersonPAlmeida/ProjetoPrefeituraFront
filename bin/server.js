import express from 'express';
import http from 'http';
import path from 'path';
import { port } from '../config/env';
const apiUrl = 'http://${apiHost}:${apiPort}';
const app = express();
const server = http.Server(app);
app.use('/', express.static(path.resolve(__dirname, '../public')));
app.listen(port, 
  (err) => { 
    if(err) { 
      console.error(err); 
    } else { 
      console.info(`Server listening on port ${port}!`);
    }
  }
);
