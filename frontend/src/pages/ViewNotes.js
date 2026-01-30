import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

function ViewNotes() {
  const [notes, setNotes] = useState([]);

  const fetchNotes = () => {
    fetch("http://localhost:5000/notes")
      .then(res => res.json())
      .then(data => setNotes(data));
  };

  useEffect(() => {
    fetchNotes();
  }, []);

  const deleteNote = (id) => {
    fetch("http://localhost:5000/notes/" + id, {
      method: "DELETE"
    }).then(() => fetchNotes());
  };

  return (
    <div>
      <h2>Notes List</h2>

      <Link to="/add">
        <button>Add Note</button>
      </Link>

      {notes.map(note => (
        <div key={note.id}>
          <h3>{note.title}</h3>
          <p>{note.content}</p>
          <p><b>Module:</b> {note.module}</p>

          <Link to={"/edit/" + note.id}>
            <button>Edit</button>
          </Link>

          <button onClick={() => deleteNote(note.id)}>
            Delete
          </button>

          <hr />
        </div>
      ))}
    </div>
  );
}

export default ViewNotes;
