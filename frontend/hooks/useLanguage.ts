import { useInterviewStore }
  from "../state/interviewStore"

export const useLanguage = () => {
  return useInterviewStore(
    state => state.selectedLanguage
  );
};