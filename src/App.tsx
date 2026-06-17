import { BrowserRouter, Routes, Route } from "react-router-dom";

import LanguageSelection from "../pages/languageSelection";
import Instructions from "../pages/instructions";
import InterviewPage from "../pages/interviewPage";
import ReviewPage from "../pages/reviewPage";
import JsonPreview from "../pages/jsonPreview";
import Success from "../pages/success";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LanguageSelection />} />
        <Route path="/instructions" element={<Instructions />} />
        <Route path="/interview" element={<InterviewPage />} />
        <Route path="/review" element={<ReviewPage />} />
        <Route path="/preview" element={<JsonPreview />} />
        <Route path="/success" element={<Success />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;