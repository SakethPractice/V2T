import player from "./player";
import { SpeechSequence } from "../../types/speech";

type Synthesizer = (
  text: string,
  language: string,
  signal: AbortSignal
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
      // Filter out empty items beforehand to make prefetching predictable
      const validItems = sequence.items.filter(item => item.text?.trim());
      
      let nextBlobPromise: Promise<Blob> | null = null;
      let lastPlayEndTime = 0;

      for (let i = 0; i < validItems.length; i++) {
        if (signal.aborted) return;

        const item = validItems[i];

        // 1. Resolve current audio (from background prefetch or fresh fetch)
        let blob: Blob;
        if (nextBlobPromise) {
          blob = await nextBlobPromise;
          nextBlobPromise = null;
        } else {
          blob = await synthesizer(item.text, item.language, signal);
        }

        if (signal.aborted) return;

        // 2. Start prefetching the NEXT item immediately in the background
        if (i + 1 < validItems.length) {
          const nextItem = validItems[i + 1];
          nextBlobPromise = synthesizer(nextItem.text, nextItem.language, signal).catch(err => {
            // Silently ignore aborts, but throw real errors for debugging
            if (err instanceof DOMException && err.name === "AbortError") throw err;
            console.error("Prefetch error:", err);
            throw err;
          });
        }

        // 3. Handle the dynamic 1-second gap
        const now = Date.now();
        if (i > 0 && lastPlayEndTime > 0) {
          const timeSinceLastPlay = now - lastPlayEndTime;
          
          if (timeSinceLastPlay < 1000) {
            await new Promise(resolve => setTimeout(resolve, 1000 - timeSinceLastPlay));
          }
        }

        if (signal.aborted) return;

        // 4. Play the audio and record the exact finish time
        await player.play(blob, signal);
        lastPlayEndTime = Date.now();
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
}

export default new SpeechQueue();