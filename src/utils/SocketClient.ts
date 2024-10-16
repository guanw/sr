import { io, Socket } from "socket.io-client";
import { ENABLE_MULTI_PLAYER } from "./Knobs";
import { Avatar } from "../entity/Avatar";
import avatarsStateManager from "../states/AvatarsStateManager";

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
    this.socket.on("connect", async () => {
      console.log("Connected to the server");
      const avatar = await Avatar.genInstance();
      const key = this.getSocketId();
      avatarsStateManager.addCurrentAvatar(key!, avatar);
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

  public getSocketId(): string | undefined {
    return this.socket?.id;
  }

  // Method to listen to a specific event
  public on(event: string, callback: (data: unknown) => void): void {
    this.socket?.on(event, callback);
  }

  // Method to emit a message to the server
  public emit(event: string, data: unknown): void {
    const socket = this.getSocketId();
    if (socket == null || socket == undefined) {
      console.log(`socket is null and event {${event}} will be dropped`);
      return;
    }
    this.socket?.emit(event, data);
  }
}

export default SocketClient;
