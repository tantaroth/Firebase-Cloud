import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AngularFireStorage } from '@angular/fire/storage';
import { Observable } from 'rxjs';

import { TriggerService } from './trigger.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  private storageRef;
  dataForm: FormGroup;
  submitted = false;
  triggers: Observable<any[]>;

  constructor(private formBuilder: FormBuilder, private _trigger: TriggerService, private storage: AngularFireStorage) {
    this.storageRef = storage.ref('upload');
  }

  ngOnInit() {
    this.dataForm = this.formBuilder.group({
      title: [''],
      photo: ['', Validators.required]
    });

    this.triggers = this._trigger.list();
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

    const value = this.dataForm.value;
    const uuid = new Date().getTime() + '-' + Math.floor(Math.random() * 1000000000);

    // stop here if form is invalid
    if (this.dataForm.invalid) {
      return;
    }

    console.log(value.photo);
    this.storageRef.child(uuid + '/' + value.photo.name).put(value.photo).then(
      data => {
        this._trigger
          .add({
            uuid: uuid,
            service: 'file',
            task: 'upload',
            params: {
              title: value.title,
              photo: data.metadata.fullPath
            }
          })
          .then(() => {
            this.submitted = false;
          })
          .catch((err) => {
            console.error(err);
            this.submitted = false;
          });
      }
    );
  }
}
