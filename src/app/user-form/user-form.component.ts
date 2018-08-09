import { Component, OnInit } from '@angular/core';
import { AuthService } from "../shared/auth.service";
import { ReactiveFormsModule, FormGroup, FormBuilder, Validators } from "@angular/forms";

@Component({
  selector: 'app-user-form',
  templateUrl: './user-form.component.html',
  styleUrls: ['./user-form.component.css']
})
export class UserFormComponent implements OnInit {

  singInForm: FormGroup;
  logInForm: FormGroup;
  newUser: boolean = true; // to toggle or signup form
  passReset: boolean = false;

  constructor(private fb: FormBuilder, private authService: AuthService) { }

  ngOnInit() {
    this.buildForms();
  }

  toggleForm(): void {
    this.newUser = !this.newUser;
  }

  signup(): void {
    this.authService.emailSignUp(
      this.singInForm.value['email'],
      this.singInForm.value['password'],
      this.singInForm.value['username']
    );
  }

  emailLogin(): void {
    this.authService.emailLogin(
      this.logInForm.value['email'],
      this.logInForm.value['password']
    );
  }

  // resetPassword() {
  //   this.authService.resetPassword(this.userForm.value['email'])
  //     .then(() => this.passReset = true)
  // }

  buildForms(): void {
    this.singInForm = this.fb.group({
      'email': ['', [
        Validators.required,
        Validators.email
      ]],
      'password': ['', [
        Validators.pattern('^(?=.*[0-9])(?=.*[a-zA-Z])([a-zA-Z0-9]+)$'),
        Validators.minLength(6),
        Validators.maxLength(25)
      ]],
      'username': ['', [
        Validators.required,
        Validators.minLength(2),
        Validators.maxLength(25)
      ]],
    });

    this.logInForm = this.fb.group({
      'email': ['', [
        Validators.required,
        Validators.email
      ]],
      'password': ['', [
        Validators.pattern('^(?=.*[0-9])(?=.*[a-zA-Z])([a-zA-Z0-9]+)$'),
        Validators.minLength(6),
        Validators.maxLength(25)
      ]],
    });

    this.singInForm.valueChanges.subscribe(data => this.onValueChanged(data));
    this.logInForm.valueChanges.subscribe(data => this.onValueChanged(data));
    this.onValueChanged(); // reset validation messages
  }

  onValueChanged(data?: any) {
    if (!this.singInForm) {return; }
    const form = this.singInForm;
    for (const field in this.formErrors) {
      // clear previous error message (if any)
      this.formErrors[field] = '';
      const control = form.get(field);
      if (control && control.dirty && !control.valid) {
        const messages = this.validationMessages[field];
        for (const key in control.errors) {
          this.formErrors[field] += messages[key] + ' ';
        }
      }
    }
  }

  formErrors = {
    'email': '',
    'password': ''
  };

  validationMessages = {
    'email': {
      'required': 'Email is required.',
      'email': 'Email must be a valid email'
    },
    'password': {
      'required': 'Password is required.',
      'pattern': 'Password must be include at letter and one number.',
      'minlength': 'Password must be at least 6 characters long.',
      'maxlength': 'Password cannot be more than 25 characters long.'
    }
  };

}
