import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import ViewNotes from "./pages/ViewNotes";
import AddNote from "./pages/AddNote";
import EditNote from "./pages/EditNote";
import Login from "./pages/Login";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Home */}
        <Route path="/" element={<ViewNotes />} />

        {/* Login */}
        <Route path="/login" element={<Login />} />

        {/* Add Note (protected on page level) */}
        <Route path="/add" element={<AddNote />} />

        {/* Edit Note (protected on page level) */}
        <Route path="/edit/:id" element={<EditNote />} />

        {/* Catch-all */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
