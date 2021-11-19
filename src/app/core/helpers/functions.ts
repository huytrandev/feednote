import * as moment from 'moment';

export function formatDate(date: string | number, format?: string): string {
  if (format) {
    return moment(date).format(format);
  } else {
    return moment(date).format('L');
  }
}

export function getRoleName(role: string): string {
  const _role = role.toLowerCase().trim();
  switch (_role) {
    case 'admin':
      return 'Quản trị hệ thống';
    case 'manager':
      return 'Cán bộ thú y';
    case 'breeder':
      return 'Hộ dân';
    default:
      return _role;
  }
}

export function getTypeFoodName(type: string | number): string {
  const _type = Number(type);
  switch (_type) {
    case 0:
      return 'Thức ăn thô';
    case 1:
      return 'Thức ăn tinh';
    default:
      return String(_type);
  }
}
