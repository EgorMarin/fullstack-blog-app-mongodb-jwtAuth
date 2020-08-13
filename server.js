const express = require('express')
const app = express()
const userRoutes = require('./routes/user.router')
const postRoutes = require('./routes/post.router')
const mongoose = require('mongoose')
const dotenv = require('dotenv')
const cors = require('cors')

//socket.io
// const server = require('http').Server(app);
// const io = require('socket.io')(server)

const PORT = 4000
dotenv.config()

const corsOptions = {
  exposedHeaders: 'authtoken',
}

app.use(cors(corsOptions))
app.use(express.json())

app.use('/api/user', userRoutes)
app.use('/api/posts', postRoutes)


////////////////  Socket.io ////////////////////////////
// const room = {
//   users: [],
//   messages: []
// }

// io.on('connection', socket => {
//   socket.on('ROOM:JOIN', (userName) => {
//     socket.join(room)
//     room.users = [...room.users, {socketId: socket.id, userName}]
//     // io.in для всех включая отправителя
//     // socket.to для всех кроме отправителя
//     io.in(room).emit('ROOM:SET_USERS', room.users)
//     io.in(room).emit('ROOM:SET_MESSAGES', room.messages)
//   })

//   socket.on('ROOM:NEW_MESSAGE', ({text, userName}) => {
//     room.messages = [...room.messages, {text, userName}]
//     io.in(room).emit('ROOM:SET_MESSAGES', room.messages)
//     console.log(room);
//   })

//   socket.on('disconnect', () => {
//     const deleted = room.users.filter(user => user.socketId !== socket.id)
//     if (deleted) socket.to(room).emit('ROOM:SET_USERS', deleted)
//   })
//   console.log('user is connected', socket.id);
// })
//////////////////////////////////////


mongoose.connect(process.env.DB_CONNECT, {useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true })

app.listen(PORT, () => {
  console.log(`Server was started on port:${PORT}`);
})