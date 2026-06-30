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
  for (const item of sequence.items) {
    if (signal.aborted) return;

    if (!item.text?.trim()) {
    continue;
    }

    if (signal.aborted) return;

    const blob = await synthesizer(
  item.text,
  item.language,
  signal
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
}


export default new SpeechQueue();
