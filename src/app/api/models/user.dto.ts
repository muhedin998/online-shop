export interface UserDto {
  id: number;
  username: string;
  email: string;
  firstName?: string;
  lastName?: string;
}

export interface UserRolesDto {
  username: string;
  roles: string[];
}

