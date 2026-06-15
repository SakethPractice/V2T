import { BrowserRouter, Routes, Route } from "react-router-dom";

import InterviewPage from "../pages/Interview/interviewPage";
import ReviewPage from "../pages/Review/reviewPage";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<InterviewPage />} />
        <Route path="/review" element={<ReviewPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;