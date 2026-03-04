export enum UserRole {
  USER = 'USER',
  APPROVER = 'APPROVER',
  ADMIN = 'ADMIN',
  DEV = 'DEV',
}

export interface UserSummary {
  id: number;
  name: string;
  email: string;
  role: UserRole;
}

export interface AppUser extends UserSummary {
  createdAt: string;
}

export interface UpdateUserRoleRequest {
  role: UserRole.USER | UserRole.APPROVER | UserRole.ADMIN;
}
