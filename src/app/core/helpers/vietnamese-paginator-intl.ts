import { MatPaginatorIntl } from '@angular/material/paginator';

const vietnameseRangeLabel = (page: number, pageSize: number, length: number) => {
  if (length == 0 || pageSize == 0) { return `0 trên ${length}`; }
  
  length = Math.max(length, 0);

  const startIndex = page * pageSize;

  // If the start index exceeds the list length, do not try and fix the end index to the end.
  const endIndex = startIndex < length ?
      Math.min(startIndex + pageSize, length) :
      startIndex + pageSize;

  return `${startIndex + 1} - ${endIndex} trên ${length}`;
}


export function getVietnamesePaginatorIntl() {
  const paginatorIntl = new MatPaginatorIntl();
  
  paginatorIntl.itemsPerPageLabel = 'Số bản ghi:';
  paginatorIntl.nextPageLabel = 'Trang kế';
  paginatorIntl.previousPageLabel = 'Trang trước';
  paginatorIntl.getRangeLabel = vietnameseRangeLabel;
  
  return paginatorIntl;
}