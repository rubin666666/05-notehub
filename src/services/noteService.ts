import axios, { type AxiosResponse } from 'axios';
import type { Note, NoteTag } from '../types/note';

const BASE_URL = 'https://notehub-public.goit.study/api';
const token = import.meta.env.VITE_NOTEHUB_TOKEN;

if (!token) {
  throw new Error('Missing VITE_NOTEHUB_TOKEN environment variable.');
}

const notehubApi = axios.create({
  baseURL: BASE_URL,
  headers: {
    Authorization: `Bearer ${token}`,
  },
});

export interface FetchNotesParams {
  page: number;
  perPage?: number;
  search?: string;
  tag?: NoteTag;
  sortBy?: 'created' | 'updated';
}

export interface FetchNotesResponse {
  notes: Note[];
  totalPages: number;
}

export interface CreateNoteParams {
  title: string;
  content: string;
  tag: NoteTag;
}

export type CreateNoteResponse = Note;
export type DeleteNoteResponse = Note;

export async function fetchNotes(
  params: FetchNotesParams,
): Promise<FetchNotesResponse> {
  const response: AxiosResponse<FetchNotesResponse> =
    await notehubApi.get<FetchNotesResponse>('/notes', {
      params: {
        page: params.page,
        perPage: params.perPage ?? 12,
        search: params.search || undefined,
        tag: params.tag,
        sortBy: params.sortBy ?? 'created',
      },
    });

  return response.data;
}

export async function createNote(
  note: CreateNoteParams,
): Promise<CreateNoteResponse> {
  const response: AxiosResponse<CreateNoteResponse> =
    await notehubApi.post<CreateNoteResponse>('/notes', note);

  return response.data;
}

export async function deleteNote(id: string): Promise<DeleteNoteResponse> {
  const response: AxiosResponse<DeleteNoteResponse> =
    await notehubApi.delete<DeleteNoteResponse>(`/notes/${id}`);

  return response.data;
}
