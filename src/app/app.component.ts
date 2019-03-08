import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  dataForm: FormGroup;
  submitted = false;

  constructor(private formBuilder: FormBuilder) {}

  ngOnInit() {
    this.dataForm = this.formBuilder.group({
      title: [''],
      photo: ['', Validators.required]
    });
  }

  // convenience getter for easy access to form fields
  get f() {
    return this.dataForm.controls;
  }

  onFileSelect(event) {
    if (event.target.files.length > 0) {
      const file = event.target.files[0];
      this.dataForm.get('photo').setValue(file);
    }
  }

  onSubmit() {
    this.submitted = true;

    const formData = new FormData();
    const value = this.dataForm.value;

    formData.append('title', value.title);
    formData.append('photo', value.photo);

    // stop here if form is invalid
    if (this.dataForm.invalid) {
      return;
    }

    console.log('SUCCESS!! :-)\n\n', this.dataForm.value, formData);
    this.submitted = false;
  }
}
