export interface User {
  _id: string;
  name: string;
  idArea: string;
  idManager?: string;
  username: string;
  role: string;
  email?: string;
  phone?: string;
  createdAt: number;
  areaName: string;
}
