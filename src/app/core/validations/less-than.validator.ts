import { FormGroup } from '@angular/forms';

export function LessThan(controlName: string, matchingControlName: string) {
  return (formGroup: FormGroup) => {
    const control = formGroup.controls[controlName];
    const matchingControl = formGroup.controls[matchingControlName];
    if (matchingControl.errors && !matchingControl.errors.mustMatch) {
      // return if another validator has already found an error on the matchingControl
      return;
    }

    // set error on matchingControl if validation fails
    if (parseInt(control.value) >= parseInt(matchingControl.value)) {
      matchingControl.setErrors({ lessThan: true });
    } else {
      matchingControl.setErrors(null);
    }
  };
}
