import { useCallback, useEffect, useRef, useState } from "react";

import { LanguageCode } from "../types/language";
import { SpeechRecognitionErrorEvent, SpeechRecognitionEvent } from "../types/speechRecognition";

import {
  BrowserSpeechRecognition,
  SPEECH_RECOGNITION_LANGUAGES,
  getSpeechRecognitionConstructor,
} from "../utils/speechRecognition";

import {
  createAudioBlob,
  createMediaRecorder,
  requestMicrophone,
  stopMediaTracks,
} from "../utils/mediaRecorder";


interface TranscriptState {
  final: string;
  interim: string;
}

interface UseAudioRecordingReturn {
  isRecording: boolean;
  transcript: TranscriptState;
  audioBlob: Blob | null;
  error: string | null;
  startRecording: () => Promise<void>;
  stopRecording: () => Promise<Blob | null>;
  clearRecording: () => void;
}

export function useAudioRecording(
  language: LanguageCode
): UseAudioRecordingReturn {
  const [isRecording, setIsRecording] = useState(false);

  const [transcript, setTranscript] = useState<TranscriptState>({
    final: "",
    interim: "",
  });

  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);

  const [error, setError] = useState<string | null>(null);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const mediaStreamRef = useRef<MediaStream | null>(null);
  const speechRecognitionRef = useRef<BrowserSpeechRecognition | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);

  const transcriptRef = useRef<TranscriptState>({
    final: "",
    interim: "",
  });

  const updateTranscript = useCallback((value: TranscriptState) => {
    transcriptRef.current = value;
    setTranscript(value);
  }, []);

  const clearRecording = useCallback(() => {
    setAudioBlob(null);
    setError(null);

    updateTranscript({
      final: "",
      interim: "",
    });

    audioChunksRef.current = [];
  }, [updateTranscript]);

  const startRecording = useCallback(async () => {
    if (
        isRecording ||
        mediaRecorderRef.current ||
        speechRecognitionRef.current
        ) {
        return;
        }

    clearRecording();

    try {
      const stream = await requestMicrophone();

      mediaStreamRef.current = stream;

      const recorder = createMediaRecorder(stream);

      mediaRecorderRef.current = recorder;

      audioChunksRef.current = [];

      recorder.ondataavailable = (event: BlobEvent) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      const SpeechRecognitionConstructor = getSpeechRecognitionConstructor();

      if (!SpeechRecognitionConstructor) {
        throw new Error(
          "Speech Recognition is not supported in this browser."
        );
      }

      const recognition = new SpeechRecognitionConstructor();

      recognition.lang = SPEECH_RECOGNITION_LANGUAGES[language];
      recognition.continuous = true;
      recognition.interimResults = true;

      recognition.onresult = (event: SpeechRecognitionEvent) => {
        let finalText = transcriptRef.current.final;
        let interimText = "";

        for (let i = event.resultIndex; i < event.results.length; i++) {
          const text = event.results[i][0].transcript;

          if (event.results[i].isFinal) {
            finalText += text + " ";
          } else {
            interimText += text;
          }
        }

        updateTranscript({
          final: finalText,
          interim: interimText,
        });
      };

      recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
        console.error("Speech Recognition Error:", event.error);
        setError(event.error);
      };

      recognition.onend = () => {
        speechRecognitionRef.current = null;
        };

      speechRecognitionRef.current = recognition;

      recorder.start();
      recognition.start();

      setIsRecording(true);
    } catch (err) {
      console.error(err);
      stopMediaTracks(mediaStreamRef.current);

        mediaRecorderRef.current = null;
        mediaStreamRef.current = null;
        speechRecognitionRef.current = null;
        audioChunksRef.current = [];

        setIsRecording(false);

      setError(
        err instanceof Error ? err.message : "Failed to start recording."
      );
    }
  }, [clearRecording, isRecording, language, updateTranscript]);

  const stopRecording = useCallback((): Promise<Blob | null> => {
    return new Promise((resolve) => {
      if (!mediaRecorderRef.current) {
        resolve(null);
        return;
      }

      const recorder = mediaRecorderRef.current;

      speechRecognitionRef.current?.stop();

      recorder.onstop = () => {
        const blob = createAudioBlob(
        audioChunksRef.current,
        recorder.mimeType
        );

        setAudioBlob(blob);

        stopMediaTracks(mediaStreamRef.current);

        mediaRecorderRef.current = null;
        mediaStreamRef.current = null;
        speechRecognitionRef.current = null;
        audioChunksRef.current = [];

        setIsRecording(false);

        resolve(blob);
      };

      recorder.stop();
    });
  }, []);

  useEffect(() => {
    return () => {
      speechRecognitionRef.current?.stop();

      if (
        mediaRecorderRef.current &&
        mediaRecorderRef.current.state !== "inactive"
      ) {
        mediaRecorderRef.current.stop();
      }

      stopMediaTracks(mediaStreamRef.current);
    };
  }, []);

  return {
    isRecording,
    transcript,
    audioBlob,
    error,
    startRecording,
    stopRecording,
    clearRecording,
  };
}