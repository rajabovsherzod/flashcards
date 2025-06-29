import { User, UserStatus } from "@generated/prisma";

export class UserDto {
  id: string;
  fullName: string;
  email: string;
  status: UserStatus;
  createdAt: Date;
  updatedAt: Date;

  constructor(user: User) {
    this.id = user.id;
    this.fullName = user.fullName;
    this.email = user.email;
    this.status = user.status;
    this.createdAt = user.createdAt;
    this.updatedAt = user.updatedAt;
  }
}
