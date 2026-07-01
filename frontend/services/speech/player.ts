import {
  SpeechEvent,
  SpeechEventMap,
  SpeechEventCallback,
} from "../../types/speech";

class AudioPlayer {
  private audio: HTMLAudioElement | null = null;
  private objectUrl: string | null = null;
  private playing = false;

  private listeners: {
    [K in SpeechEvent]: Set<SpeechEventCallback<SpeechEventMap[K]>>;
    } = {
    start: new Set(),
    end: new Set(),
    cancel: new Set(),
    error: new Set(),
    };

  on<K extends SpeechEvent>(
    event: K,
    callback: SpeechEventCallback<SpeechEventMap[K]>
    ) {
    this.listeners[event].add(callback);
    }

    off<K extends SpeechEvent>(
    event: K,
    callback: SpeechEventCallback<SpeechEventMap[K]>
    ) {
    this.listeners[event].delete(callback);
    }

    private emit<K extends SpeechEvent>(
    event: K,
    payload: SpeechEventMap[K]
    ) {
    this.listeners[event].forEach((callback) => callback(payload));
    }
    
  isPlaying() {
    return this.playing;
  }

  async play(
  blob: Blob,
  signal?: AbortSignal
): Promise<void> {
  this.stop();

  this.audio = new Audio();

  this.objectUrl = URL.createObjectURL(blob);

  this.audio.src = this.objectUrl;

  this.playing = true;

  this.emit("start", undefined);

  return new Promise((resolve, reject) => {
    if (!this.audio) {
      const error = new Error("Audio player not initialized");

      this.emit("error", error);

      reject(error);

      return;
    }

    const cleanup = () => {
      signal?.removeEventListener("abort", onAbort);
    };

    const onAbort = () => {
      cleanup();

      this.stop();

      reject(new DOMException("Aborted", "AbortError"));
    };

    signal?.addEventListener("abort", onAbort);

    this.audio.onended = () => {
      cleanup();

      this.cleanup();

      this.emit("end", undefined);

      resolve();
    };

    this.audio.onerror = () => {
      cleanup();

      const error = new Error("Audio playback failed");

      this.cleanup();

      this.emit("error", error);

      reject(error);
    };

    this.audio.play().catch((error) => {
      cleanup();

      this.cleanup();

      this.emit("error", error);

      reject(error);
    });
  });
}

  pause() {
    this.audio?.pause();
  }

  resume() {
    if (this.audio) {
      this.audio.play().catch((error) => {
        this.emit("error", error);
      });
    }
  }

  stop() {
    if (!this.audio) return;

    this.audio.pause();
    this.audio.currentTime = 0;

    this.cleanup();

    this.emit("cancel", undefined);
  }

  private cleanup() {
    this.playing = false;

    if (this.audio) {
      this.audio.src = "";
      this.audio = null;
    }

    if (this.objectUrl) {
      URL.revokeObjectURL(this.objectUrl);
      this.objectUrl = null;
    }
  }
}

const player = new AudioPlayer();

export default player;