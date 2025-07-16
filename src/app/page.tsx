"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

export default function Home() {
  const [note, setNote] = useState("");
  const queryClient = useQueryClient();

  // Fetch notes
  const { data: notes = [], isLoading } = useQuery<string[]>({
    queryKey: ["notes"],
    queryFn: async () => {
      const res = await fetch("/api/notes");
      if (!res.ok) throw new Error("Failed to fetch notes");
      return res.json();
    },
  });

  // Mutation to add note
  const addNoteMutation = useMutation({
    mutationFn: async (newNote: string) => {
      const res = await fetch("/api/notes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newNote),
      });
      if (!res.ok) throw new Error("Failed to add note");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notes"] });
      setNote("");
    },
  });

  // Mutation to delete note
  const deleteNoteMutation = useMutation({
    mutationFn: async (noteToDelete: string) => {
      const res = await fetch("/api/notes", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ noteToDelete }),
      });
      if (!res.ok) throw new Error("Failed to delete note");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notes"] });
    },
  });

  const handleAddNote = () => {
    if (note.trim() === "") return;
    addNoteMutation.mutate(note.trim());
  };

  const handleDeleteNote = (noteToDelete: string) => {
    deleteNoteMutation.mutate(noteToDelete);
  };

  return (
    <main style={{ maxWidth: 600, margin: "2rem auto", color: "#fefefe" }}>
      <h1 style={{ fontSize: "2rem", marginBottom: "1rem" }}>QuickNotes</h1>

      <div style={{ display: "flex", gap: 8, marginBottom: "1rem" }}>
        <input
          type="text"
          value={note}
          onChange={(e) => setNote(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              handleAddNote();
            }
          }}
          placeholder="Type a note..."
          style={{
            flex: 1,
            padding: "0.75rem",
            backgroundColor: "#1a1a1a",
            color: "#fff",
            border: "1px solid #444",
            borderRadius: 4,
          }}
          disabled={addNoteMutation.isPending}
        />
        <button
          onClick={handleAddNote}
          disabled={addNoteMutation.isPending}
          style={{
            backgroundColor: "#3b82f6",
            color: "white",
            border: "none",
            padding: "0.75rem 1rem",
            borderRadius: 4,
            cursor: "pointer",
            opacity: addNoteMutation.isPending ? 0.6 : 1,
          }}
        >
          Save
        </button>
      </div>

      {isLoading ? (
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
                borderRadius: 6,
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <span>{n}</span>
              <button
                onClick={() => handleDeleteNote(n)}
                disabled={deleteNoteMutation.isPending}
                style={{
                  background: "transparent",
                  border: "none",
                  color: "#ff6b6b",
                  fontSize: "1.25rem",
                  cursor: "pointer",
                  opacity: deleteNoteMutation.isPending ? 0.6 : 1,
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
