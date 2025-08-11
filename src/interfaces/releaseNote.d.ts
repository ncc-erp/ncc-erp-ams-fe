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
}
export interface IReleaseNoteListResponse {
  data: IReleaseNote[];
  total: number;
}
