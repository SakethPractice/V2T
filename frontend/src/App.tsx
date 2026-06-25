import { BrowserRouter, Routes, Route } from "react-router-dom";

import StartPage from "../pages/startPage";
import LanguageSelection from "../pages/languageSelection";
import Instructions from "../pages/instructions";
import InterviewPage from "../pages/interviewPage";
import ReviewPage from "../pages/reviewPage";
import Success from "../pages/success";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<StartPage />} />
        <Route path="/language" element={<LanguageSelection />} />
        <Route path="/instructions" element={<Instructions />} />
        <Route path="/interview" element={<InterviewPage />} />
        <Route path="/review" element={<ReviewPage />} />
        <Route path="/success" element={<Success />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;