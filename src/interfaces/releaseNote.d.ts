export interface IReleaseNoteAuthor {
  login: string;
  avatar_url: string;
  html_url: string;
}
export interface IReleaseNote {
  id: number;
  tag_name: string;
  name: string;
  body: string;
  html_url: string;
  published_at: string;
  author: IReleaseNoteAuthor;
  type?: "FE" | "BE";
}
export interface IReleaseNoteListResponse {
  rows: IReleaseNote[];
  total: number;
}
