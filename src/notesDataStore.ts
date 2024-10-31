import { atom } from "nanostores";
import type { NoteData } from "./types";

export const $noteData = atom<NoteData>({
  userId: "",
  name: "",
  url: "",
  notes: "",
});
