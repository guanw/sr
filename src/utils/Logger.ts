export class Logger {
  private static instance: Logger;

  private constructor() {}

  // Singleton instance method
  public static getInstance(): Logger {
    if (!Logger.instance) {
      Logger.instance = new Logger();
    }
    return Logger.instance;
  }

  // Method to log messages
  public log(message: string, level: "info" | "warn" | "error" = "info"): void {
    const timestamp = new Date().toISOString();
    switch (level) {
      case "info":
        console.log(`[INFO] [${timestamp}]: ${message}`);
        break;
      case "warn":
        console.warn(`[WARN] [${timestamp}]: ${message}`);
        break;
      case "error":
        console.error(`[ERROR] [${timestamp}]: ${message}`);
        break;
    }
  }
}
