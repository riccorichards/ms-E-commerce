export interface SessionType {
  delivery: string;
  userAgent: string;
}

export interface SessionDocsType extends SessionType {
  id: number;
}

export interface LoginStyle {
  email: string;
  password: string;
}
