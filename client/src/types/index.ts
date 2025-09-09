export type UserType = {
  _id: string;
  role: string;
  email?: string;
  name?: string;
  companyId: string;
};

export interface JwtPayload {
  exp: number;
  iat?: number;
  id?: string;
  role?: string;
}
