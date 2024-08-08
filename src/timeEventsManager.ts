type TimedEvent = {
  lastTime: number;
  interval: number;
  callback: () => void;
};

class TimedEventsManager {
  private events: TimedEvent[] = [];

  addEvent(interval: number, callback: () => void) {
    this.events.push({
      lastTime: Date.now(),
      interval,
      callback,
    });
  }

  update() {
    const currentTime = Date.now();
    this.events.forEach((event) => {
      if (currentTime - event.lastTime >= event.interval) {
        event.lastTime = currentTime;
        event.callback();
      }
    });
  }
}

export const timedEventsManager = new TimedEventsManager();
