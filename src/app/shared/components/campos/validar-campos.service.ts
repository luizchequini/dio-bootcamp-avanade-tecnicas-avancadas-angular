import { Injectable } from '@angular/core';
import { AbstractControl } from '@angular/forms';

@Injectable({
  providedIn: 'root'
})
export class ValidarCamposService {

  constructor() { }

  hasErrorValidator(control: AbstractControl, errorName: string): boolean{
    if((control.dirty || control.touched) && this.hasError(control, errorName)){
      return true;
    }
    return false;
  }

  hasError(control: AbstractControl, errorName: string): boolean{
    return control.hasError(errorName);
  }

  lengthValidar(control: AbstractControl, errorName: string): number{
    const e = control.errors[errorName];
    return e.requiredLength || e.min || e.max || 0;
  }
}
