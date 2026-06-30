import { initializeInterview } from "../question-engine/engine/interviewEngine";
import { useInterviewStore } from "../state/interviewStore";
import { DEFAULT_LANGUAGE, LanguageCode, SUPPORTED_LANGUAGES } from "../types/language";
import {
  InterviewResponses,
  createEmptyInterviewResponses,
} from "../types/response";
import { Question } from "../types/questions";

export interface RestorableInterviewSession {
  sessionId: string;
  phone?: string;
  language?: string;
  currentQuestionId?: string;
  responses?: InterviewResponses;
}

function normalizeLanguage(language?: string): LanguageCode {
  if (language && SUPPORTED_LANGUAGES.includes(language as LanguageCode)) {
    return language as LanguageCode;
  }

  return DEFAULT_LANGUAGE;
}

function normalizeResponses(
  responses?: InterviewResponses
): InterviewResponses {
  const empty = createEmptyInterviewResponses();

  return {
    farmer: {
      ...empty.farmer,
      ...responses?.farmer,
    },
    farm: {
      ...empty.farm,
      ...responses?.farm,
      type: responses?.farm?.type ?? "",
    },
    blocks: (responses?.blocks ?? []).map((block) => ({
      ...block,
      name: block?.name ?? "",
      farmingType: block?.farmingType ?? "",
      watersrc: block?.watersrc ?? "",
      soil: block?.soil ?? "",
    })),
  };
}

export function hydrateInterviewSession(
  session: RestorableInterviewSession
): {
  questions: Question[];
  resumeQuestionId: string;
} {
  const store = useInterviewStore.getState();

  try {
    store.resetInterview();
    store.setSessionId(session.sessionId);
    store.setPhone(session.phone ?? "");
    store.setResponses(
      normalizeResponses(session.responses)
    );
    store.setLanguage(
      normalizeLanguage(session.language)
    );

    const resumeQuestionId = session.currentQuestionId ?? "";
    store.setResumeQuestionId(resumeQuestionId);

    const questions = initializeInterview();

    return {
      questions,
      resumeQuestionId,
    };
  } catch (error) {
    console.error("Failed to hydrate interview session", error);

    store.resetInterview();
    store.setSessionId(session.sessionId ?? "");
    store.setPhone(session.phone ?? "");
    store.setResponses(createEmptyInterviewResponses());
    store.setLanguage(
      normalizeLanguage(session.language)
    );

    return {
      questions: initializeInterview(),
      resumeQuestionId: "",
    };
  }
}
