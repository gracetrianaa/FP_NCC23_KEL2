const express = require("express");
const { chats } = require("./data/data");
const connectDB = require("./config/db");
const userRoutes = require("./routes/userRoutes");
const chatRoutes = require("./routes/chatRoutes");
const messageRoutes = require("./routes/messageRoutes");
const dotenv = require("dotenv");
const helmet = require("helmet");
const { notFound, errorHandler } = require("./middleware/errorMiddleware");


dotenv.config();
const app = express();
const PORT = 3005;
connectDB();

app.use(express.json());
app.use(helmet());

app.use('/user', userRoutes);
app.use('/chats', chatRoutes);
app.use('/message', messageRoutes);

app.use(notFound);
app.use(errorHandler);

const server = app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}.`);
});

const io = require('socket.io')(server, {
    pingTimeout: 60000,
    cors: {
        origin: "http://localhost:3000",
    },
});

io.on("connection", (socket) => {
    console.log("Connected to Socket.io");

    socket.on('setup', (userData) => {
        socket.join(userData._id);
        // console.log(userData._id);
        socket.emit("connected");
    });

    socket.on('join chat', (room) => {
        socket.join(room);
        console.log("User join Room: " + room)
    });

    socket.on("typing", (room) => socket.in(room).emit("typing"));

    socket.on("stop typing", (room) => socket.in(room).emit("stop typing"));

    socket.on("new message", (newMessageReceived) => {
        var chat = newMessageReceived.chat;

        if(!chat.users) return console.log("chat.users not defined");

        // if user send message, the message should send to other member except the sender
        chat.users.forEach((user) => {
            if(user._id === newMessageReceived.sender._id) return;

            socket.in(chat._id).emit("message recieved", newMessageReceived);
        });
    })
});