export interface RegisterResponse {
    code: number;
    message: string;
    data?: {
      id: number;
      username: string;
      email: string;
    };
  }