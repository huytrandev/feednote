import { Ingredient } from '.';

export interface Food {
  _id: string;
  name: string;
  idArea: string;
  ingredient: Ingredient[];
  unit: string,
  createdAt: number;
  areaName: string;
}
