export interface LoginRequestDto {
  username: string;
  password: string;
  permanent?: boolean;
}

export interface LoginResponseDto {
  token: string;
}

export interface RegisterRequestDto {
  username: string;
  email: string;
  password: string;
  firstName?: string;
  lastName?: string;
}

export interface MessageResponseDto {
  message: string;
}

