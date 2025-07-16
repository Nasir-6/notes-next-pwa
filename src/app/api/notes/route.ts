import { NextRequest, NextResponse } from "next/server";
import fs from "fs/promises";
import path from "path";

const DB_PATH = path.join(process.cwd(), "db.json");

export async function GET() {
  try {
    const data = await fs.readFile(DB_PATH, "utf-8");
    const notes = JSON.parse(data);
    return NextResponse.json(notes);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to read notes" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const newNote = await req.json();
    const data = await fs.readFile(DB_PATH, "utf-8");
    const notes = JSON.parse(data);
    notes.unshift(newNote); // Add to the beginning
    await fs.writeFile(DB_PATH, JSON.stringify(notes, null, 2));
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: "Failed to save note" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { noteToDelete } = await req.json();
    const data = await fs.readFile(DB_PATH, "utf-8");
    let notes = JSON.parse(data);

    notes = notes.filter((n: string) => n !== noteToDelete);
    await fs.writeFile(DB_PATH, JSON.stringify(notes, null, 2));

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to delete note" },
      { status: 500 }
    );
  }
}
