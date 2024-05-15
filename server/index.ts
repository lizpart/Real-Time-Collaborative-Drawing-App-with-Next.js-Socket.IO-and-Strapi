import express, { Request, Response } from 'express';
import http from 'http';
import multer from 'multer';
import fs from 'fs';

const app = express();
const server = http.createServer(app);
const io = require('socket.io')(server, {
  cors: {
    origin: '*',
  },
});

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'upload/');
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname);
  },
});
const upload = multer({ storage: storage });

let canvasImageData: { id: string; data: Buffer } | null = null; // Initialize as null

io.on('connection', (socket: any) => {
  socket.on('client-ready', () => {
    socket.broadcast.emit('get-canvas-state');
  });

  socket.on('canvas-state', (state: any) => {
    console.log('received canvas state');
    socket.broadcast.emit('canvas-state-from-server', state);
  });

  socket.on('draw-line', ({ prevPoint, currentPoint, color }: any) => {
    socket.broadcast.emit('draw-line', { prevPoint, currentPoint, color });
  });

  socket.on('clear', () => io.emit('clear'));
});

app.post('/upload', upload.single('file'), (req: Request, res: Response) => {
  if (!req.file) {
    return res.status(400).send('No file uploaded.');
  }

  const filePath = req.file.path;
  const imageId = req.file.filename;

  const fileData = fs.readFileSync(filePath);
  canvasImageData = { id: imageId, data: fileData };

  res.status(200).json({ id: imageId });
});

server.listen(3001, () => {
  console.log('✔️ Server listening on port 3001');
});
