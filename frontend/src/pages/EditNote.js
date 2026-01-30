import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

function EditNote() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [module, setModule] = useState("");

  useEffect(() => {
    fetch("http://localhost:5000/notes")
      .then(res => res.json())
      .then(data => {
        const note = data.find(n => n.id === parseInt(id));
        if (note) {
          setTitle(note.title);
          setContent(note.content);
          setModule(note.module);
        }
      });
  }, [id]);

  const updateNote = () => {
    fetch("http://localhost:5000/notes/" + id, {
      method: "PUT",
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
      <h2>Edit Note</h2>

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

      <button onClick={updateNote}>Update Note</button>
    </div>
  );
}

export default EditNote;
