import cors from "cors";
import express from "express";
import { Server, Socket } from "socket.io";
import { createServer } from "http";

import { generateUniqueName } from "./utils";
import { IOEvents } from "./types";

const PORT = process.env.PORT || 8080;

const app = express();
app.use(cors());
app.use((req, res) => {
  res.writeHead(200);
  res.end("hello HTTPS world\n");
});

const server = createServer(app);

const io = new Server(server, {
  cors: { origin: "*" },
});

io.on(IOEvents.CONNECTION, (socket: Socket) => {
  console.log("IOEvents.CONNECTION socketId: " + socket.id);
  // socket.on("message", async (data) => {
  //   console.log("message " + data);
  //   socket.broadcast.to(data.id).emit("message", data.message);
  // });

  socket.on(IOEvents.CREATE_ROOM, async (message) => {
    const newID = generateUniqueName().toLowerCase();
    console.log("IOEvents.CREATE_ROOM newId: " + newID);

    socket.join(newID);

    socket.emit(IOEvents.CREATE_ROOM, { id: newID });
  });

  socket.on(IOEvents.JOIN_ROOM, async (message) => {
    console.log("IOEvents.JOIN_ROOM room Id: " + message.id);
    socket.join(message.id);

    socket.emit(IOEvents.JOIN_ROOM, true);
  });

  socket.on(IOEvents.GROUPS_GET, async (message) => {
    console.log("IOEvents.GROUPS_GET ");
    const room = [...socket.rooms][1];

    const host = [...(await io.in(room).allSockets())][0];
    socket.broadcast.to(host).emit(IOEvents.GROUPS_GET, {});
  });

  socket.on(IOEvents.GROUPS_GET_RESPONSE, (data) => {
    console.log("IOEvents.GROUPS_GET_RESPONSE ");
    const room = [...socket.rooms][1];
    socket.broadcast.to(room).emit(IOEvents.GROUPS_GET_RESPONSE, data);
  });

  socket.on(IOEvents.GROUPS_POST, (message) => {});

  socket.on(IOEvents.BUTTON_PRESS, async (message) => {
    const room = [...socket.rooms][1];
    const host = [...(await io.in(room).allSockets())][0];

    socket.broadcast.to(host).emit(IOEvents.BUTTON_PRESS, message);
  });

  socket.on(IOEvents.ERROR, (err) => {
    console.log("socket error " + err);
    if (err && err.message === "unauthorized event") {
      socket.disconnect();
    }
  });

  socket.on(IOEvents.HOST_DISCONNECT, async () => {
    console.log("IOEvents.HOST_DISCONNECT ");
    const room = [...socket.rooms][1];

    socket.broadcast.to(room).emit(IOEvents.HOST_DISCONNECT, {});

    io.socketsLeave(room);
    const host = await io.in(room).allSockets();
  });

  socket.on(IOEvents.DISCONNECT, async (data) => {
    console.log(`client: ${socket.id} disconnected`);
  });
});

server.listen(PORT, () => console.log(`Listening on ${PORT}`));
