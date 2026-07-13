import { useState, useCallback, useEffect, useRef } from 'react';
import { useAudioRecording } from './useAudioRecording';
import { LanguageCode } from '../types/language';
import { uploadAudioForExtraction } from "../services/speech/sttApi";

export type VoiceJobStatus =
  | "idle"
  | "recording"
  | "processing"
  | "completed"
  | "failed";

export interface VoiceJobState {
  jobId: string | null;
  questionId: string;
  status: VoiceJobStatus;
  browserTranscript: string;
  aiTranscript: string;
  extractedValue: string;
  error: string | null;
}

interface UseVoiceJobOptions {
  questionId: string;
  language: LanguageCode;
  targetField: string;
}

export const useVoiceJob = ({ questionId, language, targetField }: UseVoiceJobOptions) => {
  const [state, setState] = useState<VoiceJobState>({
    jobId: null,
    questionId,
    status: "idle",
    browserTranscript: "",
    aiTranscript: "",
    extractedValue: "",
    error: null,
  });

  const { 
    isRecording, 
    startRecording: startAudioRecording, 
    stopRecording: stopAudioRecording, 
    transcript 
  } = useAudioRecording(language);

  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const AUTO_STOP_TIMEOUT = 20_000; // 20 seconds

  useEffect(() => {
    setState((prev) => {
      if (prev.questionId === questionId) return prev;
      return { ...prev, questionId };
    });
  }, [questionId]);

  useEffect(() => {
    if (transcript) {
      const combinedTranscript = `${transcript.final} ${transcript.interim}`.trim();
      setState((prev) => ({ ...prev, browserTranscript: combinedTranscript }));
    }
  }, [transcript]);

  const startRecording = useCallback(async () => {
    setState((prev) => ({
      ...prev,
      jobId: crypto.randomUUID(),
      status: "recording",
      error: null,
      browserTranscript: "",
      aiTranscript: "",
      extractedValue: "",
    }));
    
    await startAudioRecording();
  }, [startAudioRecording]);

  // 2. Implement processRecording(blob) with try/catch and stale checks
  const processRecording = useCallback(async (
    blob: Blob,
    browserTranscript: string,
    currentJobId: string | null
  ) => {
    try {
      let response;

      try {
        response = await uploadAudioForExtraction({
          audioBlob: blob,
          browserTranscript,
          language,
          targetField,
        });
      } catch (error) {
        if (
          error instanceof Error &&
          error.message === "STT request timed out" &&
          browserTranscript
        ) {
          response = await uploadAudioForExtraction({
            browserTranscript,
            language,
            targetField,
          });
        } else {
          throw error;
        }
      }

      setState((prev) => {
        if (prev.jobId !== currentJobId) return prev;

        return {
          ...prev,
          status: "completed",
          aiTranscript: response.transcript,
          extractedValue: response.value,
        };
      });
    } catch (error) {
      setState((prev) => {
        if (prev.jobId !== currentJobId) return prev;

        return {
          ...prev,
          status: "failed",
          error:
            error instanceof Error
              ? error.message
              : "An unknown processing error occurred",
        };
      });
    }
  }, [language, targetField]);

  const stopRecording = useCallback(async () => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }

    const blob = await stopAudioRecording();

    if (!blob) {
      setState((prev) => ({
        ...prev,
        status: "failed",
        error: "Failed to capture audio",
      }));
      return;
    }

    setState((prev) => ({ ...prev, status: "processing" }));

    void processRecording(blob, state.browserTranscript, state.jobId);
  }, [stopAudioRecording, processRecording, state.browserTranscript, state.jobId]);

  useEffect(() => {
  if (!isRecording) {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
    return;
  }

  timerRef.current = setTimeout(() => {
    void stopRecording();
  }, AUTO_STOP_TIMEOUT);

  return () => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  };
}, [isRecording, stopRecording]);

  const clearRecording = useCallback(() => {
  if (timerRef.current) {
    clearTimeout(timerRef.current);
    timerRef.current = null;
  }

  void stopAudioRecording().catch(() => {});

  setState({
    jobId: null,
    questionId,
    status: "idle",
    browserTranscript: "",
    aiTranscript: "",
    extractedValue: "",
    error: null,
  });
}, [questionId, stopAudioRecording]);

  return {
    state,
    isRecording,
    startRecording,
    stopRecording,
    clearRecording,
  };
};