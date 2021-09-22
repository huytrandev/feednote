import { AbstractControl, ValidationErrors } from '@angular/forms'

export function UserNameExisted(control: AbstractControl): ValidationErrors | null {
  const value = control.value;
  

  return null;
}