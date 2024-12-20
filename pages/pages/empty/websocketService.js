import { w3cwebsocket as W3CWebSocket } from "websocket";

const WS_URL = "ws://localhost:8080/api/v1/chat/receive"; // URL WebSocket Anda

let websocket = null;

const connect = () => {
  websocket = new W3CWebSocket(WS_URL);

  websocket.onopen = () => {
    console.log("WebSocket Client Connected");
  };

  websocket.onmessage = (message) => {
    const dataFromServer = JSON.parse(message.data);
    // Handle data received from the server here
    console.log('Received data:', dataFromServer);
  };

  websocket.onclose = () => {
    console.log("WebSocket Client Disconnected");
    setTimeout(connect, 5000); // Reconnect after 5 seconds
  };
};

connect();

export const sendWebSocketMessage = (message) => {
  if (websocket && websocket.readyState === websocket.OPEN) {
    websocket.send(JSON.stringify(message));
  }
};