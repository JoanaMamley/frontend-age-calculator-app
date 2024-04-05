import { Component, OnInit } from '@angular/core';
import { Age } from './app.model';
import { FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit{
  age: Age | undefined;
  ageForm: FormGroup = new FormGroup({});
  isFormInvalidOrUnfilled: boolean = true;

  ngOnInit(): void {
    const currentYear = new Date().getFullYear();

    this.ageForm = new FormGroup({
      'day': new FormControl(null, [Validators.required, Validators.min(1), Validators.max(31)]),
      'month': new FormControl(null, [Validators.required, Validators.min(1), Validators.max(12)]),
      'year': new FormControl(null, [Validators.required, Validators.max(currentYear)])
    })

    this.ageForm.setValidators(this.dateValidator());

    this.ageForm.valueChanges.subscribe(value => {
      if (this.ageForm.errors) {
        console.log(this.ageForm.errors['dateError'])
      }
      this.isFormInvalidOrUnfilled = this.isFormInvalidOrEmpty();

      if (!this.isFormInvalidOrUnfilled) {
        const day = parseInt(this.ageForm.get('day')?.value);
        const month = parseInt(this.ageForm.get('month')?.value);
        const year = parseInt(this.ageForm.get('year')?.value);
        this.age = this.calculateAge(new Date(year, month - 1, day))
      }
    });
  }

  dateValidator() {
    return (formGroup: FormGroup) => {
      const day = parseInt(formGroup.get('day').value);
      const month = parseInt(formGroup.get('month').value);
      const year = parseInt(formGroup.get('year').value);

      if (month === 2) {
      if (this.isLeapYear(year) && day > 29)  return { 'dateError': true }
        if (!this.isLeapYear(year) && day > 28) return { 'dateError': true }
      }
  
      if ((month === 9 || month === 4 || month === 6 || month === 11) && day > 30) return { 'dateError': true }
  
      if (day > 31) return { 'dateError': true }

      return null;
    };
  }

  private isLeapYear(year: number): boolean {
    return (year % 4 === 0 && year % 100 !== 0) || (year % 400 === 0);
  }

  private calculateAge(birthdate: Date): Age {
    const today: Date = new Date();
    let years: number = today.getFullYear() - birthdate.getFullYear();
    let months: number = today.getMonth() - birthdate.getMonth();
    let days: number = today.getDate() - birthdate.getDate();

    // If birthdate month is greater than today's month or birthdate day is greater than today's day,
    // then we haven't completed the birthday yet, so we decrement years by 1
    if (months < 0 || (months === 0 && today.getDate() < birthdate.getDate())) {
        years--;
        months += 12; // Add 12 months to the current month to get the remaining months until the next birthday
    }

    // If days are negative, means we've not reached the birthdate yet in this month
    if (days < 0) {
        // Calculate the days remaining until the birthday
        const tempDate = new Date(today.getFullYear(), today.getMonth() - 1, 0); // Get last day of previous month
        days = tempDate.getDate() - birthdate.getDate() + today.getDate();
        months--; // Decrement months by 1
    }

    return { years, months, days };
  }

  isFormInvalidOrEmpty(): boolean {
    return this.ageForm.invalid || this.areControlsEmpty();
  }

  areControlsEmpty(): boolean{
    const controls = this.ageForm.controls;
    for (const controlName in controls) {
      const control = controls[controlName];
      if (control.value === null || control.value === '') {
        return true; 
      }
    }
    return false; 
  }

  get hasDateError(): boolean {
    return this.ageForm.errors && this.ageForm.errors['dateError'];
  }

}
