import io from 'socket.io-client';
import { ChatBackendScoketUrl } from '../config';

let socket;

const connectWebSocket = (onConnect, onResponse, onError, onQueuedNumber) => {
  socket = io(ChatBackendScoketUrl, {
    path: '/socket.io/',
    forceNew: true,
    reconnectionAttempts: 3,
    timeout: 2000,
  });

  socket.on('connect', () => {
    onConnect(socket.id);

    socket.on('response', onResponse);
    socket.on('error', onError);
    socket.on('responseQueuedNumber', onQueuedNumber);
  });

  socket.on('disconnect', () => {
    console.log('Disconnected', socket.id);
  });
};

const disconnectWebSocket = () => {
  if (socket) {
    socket.disconnect();
  }
};

const emitPrompt = (prompt, model) => {
  if (socket) {
    socket.emit('prompt', { prompt, model });
  }
};

export { connectWebSocket, disconnectWebSocket, emitPrompt };
