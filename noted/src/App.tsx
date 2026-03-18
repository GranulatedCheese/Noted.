import { HashRouter as Router, Routes, Route } from "react-router-dom";
import Landing from "./pages/Landing";
import Backpack from "./pages/Backpack";
import Notebook from "./pages/Notebook";

function App() {
  return (
    <Router>
      {/* basename="/Noted./" */}
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/backpack" element={<Backpack />} />
        <Route path="/notebook/:id" element={<Notebook />} />
      </Routes>
    </Router>
  );
}

export default App;
