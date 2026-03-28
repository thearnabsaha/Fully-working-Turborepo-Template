import { WebSocketServer } from "ws";

const PORT = Number(process.env.WS_PORT) || 4002;

const wss = new WebSocketServer({ port: PORT });

wss.on("connection", (socket) => {
  console.log("Client connected");

  socket.send("Connected to WebSocket server");

  socket.on("message", (message) => {
    socket.send(message.toString());
  });

  socket.on("error", (error) => {
    console.error("WebSocket error:", error);
  });

  socket.on("close", () => {
    console.log("Client disconnected");
  });
});

console.log(`WebSocket server is running on ws://localhost:${PORT}`);
