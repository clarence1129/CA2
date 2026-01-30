import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import ViewNotes from "./pages/ViewNotes";
import AddNote from "./pages/AddNote";
import EditNote from "./pages/EditNote";

function App() {
  return (
    <Router>
      <div>
        <h1>Study Notes Manager</h1>

        <Routes>
          <Route path="/" element={<ViewNotes />} />
          <Route path="/add" element={<AddNote />} />
          <Route path="/edit/:id" element={<EditNote />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
