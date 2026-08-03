import { Client } from "@stomp/stompjs";
import { useEffect } from "react";

interface Props {
  children: React.ReactNode;
}

export const socket = new Client({
  brokerURL: `${import.meta.env.VITE_WS_URL}/ws`,
  // or "ws://localhost:8080/ws"

  reconnectDelay: 5000,

  debug: (message) => {
    console.log(message);
  },

  onConnect: () => {
    console.log("✅ WebSocket Connected");
  },

  onDisconnect: () => {
    console.log("❌ WebSocket Disconnected");
  },

  onStompError: (frame) => {
    console.error("STOMP Error:", frame.headers.message);
  },
});

export default function WebSocketProvider({ children }: Props) {
  useEffect(() => {
    socket.activate();

    return () => {
      socket.deactivate();
    };
  }, []);

  return <>{children}</>;
}
