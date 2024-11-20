import { isGamePaused } from "../states/events";
import { Logger } from "../utils/Logger";

const audioContext: AudioContext = new window.AudioContext();
const soundBuffers: { [key: string]: AudioBuffer } = {};

export async function loadSound(url: string, key: string) {
  const response = await fetch(url);
  const arrayBuffer = await response.arrayBuffer();
  const soundBuffer = await audioContext.decodeAudioData(arrayBuffer);
  soundBuffers[key] = soundBuffer;
}

export function playSound(key: string) {
  if (isGamePaused()) {
    return;
  }
  const soundBuffer = soundBuffers[key];
  if (soundBuffer === undefined) {
    const logger = Logger.getInstance();
    logger.log(`Sound not found for ${key}`, "error");
    return;
  }
  const source = audioContext.createBufferSource();
  source.buffer = soundBuffer;
  source.connect(audioContext.destination);
  source.start(0);
}
