// src/types/api/auth/Response.types.ts
export interface AuthLoginUserData {
  id: string;
  name: string;
  role: string;
}

export interface AuthLoginResponse {
  token: string;
  user: AuthLoginUserData;
}
