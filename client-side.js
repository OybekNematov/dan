const socket = io('http://localhost:3000'); // WebSocket URL

socket.emit('userMessage', { message: 'Salom, Admin!' });

socket.on('adminMessage', (data) => {
  console.log('Admin javobi:', data.message);
});
