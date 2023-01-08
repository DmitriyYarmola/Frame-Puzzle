import "./index.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { MainPage, PuzzleScramblePage } from "../pages";

export function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route index path="/" element={<MainPage />} />
        <Route path="puzzle/:id" element={<PuzzleScramblePage />} />
      </Routes>
    </BrowserRouter>
  );
}
