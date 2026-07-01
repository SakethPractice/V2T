import player from "./player";
import queue from "./queue";
import { synthesizeSpeech } from "./api";

import {
  SpeechSequence,
  SpeechPriority,
} from "../../types/speech";

class VoiceEngine {
  private currentSequence: SpeechSequence | null = null;

  private currentPriority = SpeechPriority.BACKGROUND;

  private abortController: AbortController | null = null;

  /**
   * Speak a single piece of text.
   */
  async speak(
    text: string,
    language: string,
    priority: SpeechPriority = SpeechPriority.USER_ACTION
  ) {
    return this.playSequence({
      priority,
      items: [
        {
          text,
          language,
        },
      ],
    });
  }

  /**
   * Play an entire speech sequence.
   */
  async playSequence(sequence: SpeechSequence): Promise<void> {
    if (!sequence.items.length) {
    return;
    }

    const priority =
      sequence.priority ?? SpeechPriority.BACKGROUND;

    // Ignore if current speech has higher priority
    if (!this.shouldInterrupt(priority)) {
      return;
    }

    // Stop current sequence
    this.cancel();

    this.abortController = new AbortController();

    this.currentPriority = priority;
    this.currentSequence = sequence;

    try {
      await queue.run(
        sequence,
        this.synthesize.bind(this),
        this.abortController.signal
      );
    } catch (error) {
      if (
        error instanceof DOMException ||
        (error instanceof Error &&
          error.name === "AbortError")
      ) {
        return;
      }
      throw error;
    } finally {
      this.abortController = null;
      this.currentSequence = null;
      this.currentPriority = SpeechPriority.BACKGROUND;
    }
  }

  /**
   * Stop all speech immediately.
   */
  stop() {
    this.cancel();
  }

  /**
   * Pause current playback.
   */
  pause() {
    player.pause();
  }

  /**
   * Resume paused playback.
   */
  resume() {
    player.resume();
  }

  /**
   * Is any speech currently active?
   */
  isSpeaking(): boolean {
  return this.currentSequence !== null;
  }

  /**
   * Current speech sequence.
   */
  getCurrentSequence() {
    return this.currentSequence;
  }

  /**
   * Current priority.
   */
  getCurrentPriority() {
    return this.currentPriority;
  }

  /**
   * Decide whether a new sequence should interrupt.
   */
  private shouldInterrupt(priority: SpeechPriority): boolean {
  // Nothing is currently speaking
    if (!this.currentSequence) {
      return true;
    }

    // Smaller number = higher priority
    return priority <= this.currentPriority;
  }

  /**
   * Cancel current speech.
   */
  private cancel() {
    this.abortController?.abort();
    this.abortController = null;

    player.stop();
  }

  /**
   * Generate speech from backend.
   */
private async synthesize(
  text: string,
  language: string,
  signal: AbortSignal
): Promise<Blob> {
  return synthesizeSpeech({
    text,
    language,
    signal,
  });
}
}

const voiceEngine = new VoiceEngine();

export default voiceEngine;