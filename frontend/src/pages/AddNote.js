import { useState } from "react";
import { useNavigate } from "react-router-dom";

function AddNote() {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [module, setModule] = useState("");

  const navigate = useNavigate();

  const addNote = () => {
    fetch("http://localhost:5000/notes", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ title, content, module })
    }).then(() => {
      navigate("/");
    });
  };

  return (
    <div>
      <h2>Add Note</h2>

      <input
        placeholder="Title"
        value={title}
        onChange={e => setTitle(e.target.value)}
      />
      <br />

      <input
        placeholder="Content"
        value={content}
        onChange={e => setContent(e.target.value)}
      />
      <br />

      <input
        placeholder="Module"
        value={module}
        onChange={e => setModule(e.target.value)}
      />
      <br />

      <button onClick={addNote}>Save Note</button>
    </div>
  );
}

export default AddNote;
