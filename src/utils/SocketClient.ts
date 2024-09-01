import { io, Socket } from "socket.io-client";
import { ENABLE_MULTI_PLAYER } from "./Knobs";

class SocketClient {
  private static instance: SocketClient;
  private socket: Socket | undefined;

  private constructor() {
    if (!ENABLE_MULTI_PLAYER) {
      return;
    }
    const SERVER_URL = "http://localhost:3000"; // Update with your server URL
    this.socket = io(SERVER_URL);

    // Handle connection
    this.socket.on("connect", () => {
      console.log("Connected to the server");
    });

    // Handle disconnection
    this.socket.on("disconnect", () => {
      console.log("Disconnected from the server");
    });

    // Handle connection errors
    this.socket.on("connect_error", (error) => {
      console.error("Connection error:", error);
    });
  }

  // Method to get the singleton instance
  public static getInstance(): SocketClient {
    if (!SocketClient.instance) {
      SocketClient.instance = new SocketClient();
    }
    return SocketClient.instance;
  }

  // Method to listen to a specific event
  public on(event: string, callback: (data: unknown) => void): void {
    this.socket?.on(event, callback);
  }

  // Method to emit a message to the server
  public emit(event: string, data: unknown): void {
    this.socket?.emit(event, data);
  }
}

export default SocketClient;
