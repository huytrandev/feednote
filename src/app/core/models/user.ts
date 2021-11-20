export interface User {
  _id: string;
  name: string;
  idArea: string;
  idManager?: string;
  username: string;
  role: string;
  roleName?: string;
  email?: string;
  phone?: string;
  createdAt: number;
  joinedDate?: string;
  areaName: string;
}
