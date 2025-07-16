"use client";

import { useEffect, useState } from "react";

export default function Home() {
  const [note, setNote] = useState("");
  const [notes, setNotes] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/notes")
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) setNotes(data);
        setLoading(false);
      });
  }, []);

  const addNote = async () => {
    if (note.trim() === "") return;
    const newNote = note.trim();

    await fetch("/api/notes", {
      method: "POST",
      body: JSON.stringify(newNote),
      headers: { "Content-Type": "application/json" },
    });

    setNotes([newNote, ...notes]);
    setNote("");
  };

  const deleteNote = async (noteToDelete: string) => {
    await fetch("/api/notes", {
      method: "DELETE",
      body: JSON.stringify({ noteToDelete }),
      headers: { "Content-Type": "application/json" },
    });

    setNotes(notes.filter((n) => n !== noteToDelete));
  };

  return (
    <main style={{ maxWidth: "600px", margin: "2rem auto", color: "#fefefe" }}>
      <h1 style={{ fontSize: "2rem", marginBottom: "1rem" }}>QuickNotes</h1>

      <div style={{ display: "flex", gap: "0.5rem", marginBottom: "1rem" }}>
        <input
          type="text"
          value={note}
          onChange={(e) => setNote(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              addNote();
            }
          }}
          placeholder="Type a note..."
          style={{
            flex: 1,
            padding: "0.75rem",
            backgroundColor: "#1a1a1a",
            color: "#fff",
            border: "1px solid #444",
            borderRadius: "4px",
          }}
        />
        <button
          onClick={addNote}
          style={{
            backgroundColor: "#3b82f6",
            color: "white",
            border: "none",
            padding: "0.75rem 1rem",
            borderRadius: "4px",
            cursor: "pointer",
          }}
        >
          Save
        </button>
      </div>

      {loading ? (
        <p>Loading...</p>
      ) : (
        <ul style={{ listStyle: "none", padding: 0 }}>
          {notes.map((n, i) => (
            <li
              key={i}
              style={{
                backgroundColor: "#1e1e1e",
                padding: "0.75rem 1rem",
                marginBottom: "0.75rem",
                borderRadius: "6px",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <span>{n}</span>
              <button
                onClick={() => deleteNote(n)}
                style={{
                  background: "transparent",
                  border: "none",
                  color: "#ff6b6b",
                  fontSize: "1.25rem",
                  cursor: "pointer",
                }}
                aria-label={`Delete note: ${n}`}
              >
                ✕
              </button>
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}
