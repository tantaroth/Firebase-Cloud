import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';
import { Observable } from 'rxjs';

export interface Trigger {
  uuid: string;
  service: string;
  task: string;
  params: any;
  output?: any;
}

@Injectable({
  providedIn: 'root'
})
export class TriggerService {
  private triggersCollection: AngularFirestoreCollection<Trigger>;
  triggers: Observable<Trigger[]>;

  constructor(private afs: AngularFirestore) {
    this.triggersCollection = afs.collection<Trigger>('triggers');
  }

  add(trigger: Trigger) {
    return this.triggersCollection.doc(trigger.uuid).set(trigger);
  }
}
