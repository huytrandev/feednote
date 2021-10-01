import { FilterDto } from '.';

export interface AdvancedFilter extends FilterDto {
  filter?: Object;
  from?: string;
  to?: string;
}
