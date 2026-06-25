import { useInterviewStore } from "../state/interviewStore";

export const useLanguage = () => {
  const language = useInterviewStore(
    (state) => state.selectedLanguage
  );

  const setLanguage = useInterviewStore(
    (state) => state.setLanguage
  );

  return {
    language: language || "en",
    setLanguage,
  };
};