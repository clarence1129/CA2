import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import ViewNotes from "./pages/ViewNotes";
import AddNote from "./pages/AddNote";
import EditNote from "./pages/EditNote";
import Login from "./pages/Login";
import Register from "./pages/Register";

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        {/* HOME */}
        <Route path="/" element={<ViewNotes />} />

        {/* AUTH */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* NOTES (NO ROUTE GUARDS) */}
        <Route path="/add" element={<AddNote />} />
        <Route path="/edit/:id" element={<EditNote />} />

        {/* FALLBACK */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
