export interface SessionType {
  delivery: number;
  isValid: boolean;
  userAgent: string;
}

export interface SessionDocsType extends SessionType {
  id: number;
}

export interface LoginStyle {
  email: string;
  password: string;
}
