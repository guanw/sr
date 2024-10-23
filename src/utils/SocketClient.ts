import { io, Socket } from "socket.io-client";
import { ENABLE_MULTI_PLAYER } from "./Knobs";
import { Avatar } from "../entity/Avatar";
import avatarsStateManager from "../states/AvatarsStateManager";
import { Logger } from "./Logger";
import { SetupResponse } from "../ResourceLoader";

// TODO Update our server URL
const SERVER_URL = "http://localhost:3000";

class SocketClient {
  private static instance: SocketClient;
  private socket: Socket | undefined;
  private logger: Logger | undefined;

  private constructor() {
    if (!ENABLE_MULTI_PLAYER) {
      return;
    }
    this.logger = Logger.getInstance();
    this.socket = io(SERVER_URL);

    // Handle connection
    this.socket.on("connect", async () => {
      this.logger!.log("Connected to the server");

      const avatar = await Avatar.genInstance();
      const key = this.getSocketId();
      avatarsStateManager.addCurrentAvatar(key!, avatar);
    });

    // Handle disconnection
    this.socket.on("disconnect", () => {
      this.logger!.log("Disconnected from the server");
    });

    // Handle connection errors
    this.socket.on("connect_error", (error) => {
      this.logger!.log(`Connection error: ${error}`, "error");
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
      this.logger!.log(
        `socket is null and event {${event}} will be dropped`,
        "warn"
      );
      return;
    }
    this.socket?.emit(event, data);
  }
}

async function fetchSetupData() {
  try {
    const response = await fetch(SERVER_URL);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data: SetupResponse = await response.json();

    // TODO Properly log the data received from the server
    console.log("Response from /setup:", data);
    return data;
  } catch (error) {
    // TODO properly log error
    console.error("Error fetching /setup data:", error);
    return null;
  }
}

export { SocketClient, fetchSetupData };
