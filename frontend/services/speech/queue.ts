import player from "./player";
import { SpeechSequence } from "../../types/speech";

type Synthesizer = (
  text: string,
  language: string
) => Promise<Blob>;

class SpeechQueue {
  private running = false;

  async run(
    sequence: SpeechSequence,
    synthesizer: Synthesizer,
    signal: AbortSignal
  ) {
    this.running = true;

    try {
  for (const item of sequence.items) {
    if (signal.aborted) return;

    if (!item.text.trim()) {
    continue;
    }

    if (item.delay && item.delay > 0) {
      await this.sleep(item.delay, signal);
    }

    if (signal.aborted) return;

    const blob = await synthesizer(
      item.text,
      item.language
    );

    if (signal.aborted) return;

    await player.play(blob,signal);
  }
} catch (error) {
  if (
    error instanceof DOMException &&
    error.name === "AbortError"
  ) {
    return;
  }

  throw error;
} finally {
  this.running = false;
}
  }

  isRunning(): boolean {
  return this.running;
  }


  private sleep(
    ms: number,
    signal: AbortSignal
  ): Promise<void> {
    return new Promise((resolve, reject) => {
      if (signal.aborted) {
        reject(new DOMException("Aborted", "AbortError"));
        return;
      }

      const timeout = window.setTimeout(() => {
        cleanup();
        resolve();
      }, ms);

      const onAbort = () => {
        clearTimeout(timeout);
        cleanup();
        reject(new DOMException("Aborted", "AbortError"));
      };

      const cleanup = () => {
        signal.removeEventListener("abort", onAbort);
      };

      signal.addEventListener("abort", onAbort);
    });
  }
}


export default new SpeechQueue();