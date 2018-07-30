import * as Training from './training.actions';
import { Injectable } from '@angular/core';
import { AngularFirestore } from 'angularfire2/firestore';
// import { Subject } from 'rxjs/Subject';
import { Subscription } from 'rxjs';

import { Exercise } from './exercise.model';
import { UIService } from '../shared/ui.service';
import { map, take } from 'rxjs/operators';
import * as UI from '../shared/ui.actions';
// import * as fromRoot from '../app.reducer';
import * as fromTraining from './training.reducer';
import { Store } from '@ngrx/store';

@Injectable()
export class TrainingService {
  // exerciseChanged = new Subject<Exercise>();
  // exercisesChanged = new Subject<Exercise[]>();
  // finishedExercisesChanged = new Subject<Exercise[]>();
  // private availableExercises: Exercise[] = [];
  // private runningExercise: Exercise;
  private fbSubs: Subscription[] = [];

  constructor(private db: AngularFirestore, 
    private uiService: UIService,
    private store: Store<fromTraining.State>
    // private store: Store<fromRoot.State>
  ) {}

  fetchAvailableExercises() {
    // this.uiService.loadingStateChanged.next(true);
    this.store.dispatch(new UI.StartLoading());
    this.fbSubs.push(this.db
      .collection('availableExercises')
      .snapshotChanges()
      .pipe(map(docArray => {
        // throw(new Error());
        return docArray.map(doc => {
          // return {
          //   id: doc.payload.doc.id,
          //   name: doc.payload.doc.data().name,
          //   duration: doc.payload.doc.data().duration,
          //   calories: doc.payload.doc.data().calories
          // };
          return {
            id: doc.payload.doc.id,
            ...doc.payload.doc.data()
          };
        });
      }))
      .subscribe((exercises: Exercise[]) => {
        // this.uiService.loadingStateChanged.next(false);
        this.store.dispatch(new UI.StopLoading());
        // this.availableExercises = exercises;
        // this.exercisesChanged.next([...this.availableExercises]);
        this.store.dispatch(new Training.SetAvailableTrainings(exercises));

      }, error => {
        // this.uiService.loadingStateChanged.next(false);
        this.store.dispatch(new UI.StopLoading());
        this.uiService.showSnackbar('Fetching Exercises failed, please try again later', null, 3000);
        // this.exercisesChanged.next(null);
      }));
  }

  startExercise(selectedId: string) {
    // this.db.doc('availableExercises/' + selectedId).update({lastSelected: new Date()});
    // this.runningExercise = this.availableExercises.find(
    //   ex => ex.id === selectedId
    // );
    // this.exerciseChanged.next({ ...this.runningExercise });
    this.store.dispatch(new Training.StartTraining(selectedId));
  }

  completeExercise() {
    // ...this.runningExercise,
    this.store.select(fromTraining.getActiveTraining).pipe(take(1))
    .subscribe(
      ex => {
        this.addDataToDatabase({
          ...ex,
          date: new Date(),
          state: 'completed'
        });
        // this.runningExercise = null;
        // this.exerciseChanged.next(null);
        this.store.dispatch(new Training.StopTraining());
      }
    )   
  }

  cancelExercise(progress: number) {
    // duration: this.runningExercise.duration * (progress / 100),
    // ...this.runningExercise,
    this.store.select(fromTraining.getActiveTraining).pipe(take(1))
    .subscribe(
      ex => {
        this.addDataToDatabase({
          ...ex,
          duration: ex.duration * (progress / 100),
          calories: ex.calories * (progress / 100),
          date: new Date(),
          state: 'cancelled'
        });
        // this.runningExercise = null;
        // this.exerciseChanged.next(null);
        this.store.dispatch(new Training.StopTraining());
      }
    )
    
    
  }

  // getRunningExercise() {
  //   return { ...this.runningExercise };
  // }

  fetchCompletedOrCancelledExercises() {
    this.fbSubs.push(this.db
      .collection('finishedExercises')
      .valueChanges()
      .subscribe((exercises: Exercise[]) => {
        // this.finishedExercisesChanged.next(exercises);
        this.store.dispatch(new Training.SetFinishedTrainings(exercises));
      }));
  }

  cancelSubscriptions() {
    this.fbSubs.forEach(sub => sub.unsubscribe());
  }

  private addDataToDatabase(exercise: Exercise) {
    this.db.collection('finishedExercises').add(exercise);
  }

}
