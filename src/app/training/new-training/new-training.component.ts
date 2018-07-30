import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Observable} from 'rxjs';
import { map } from 'rxjs/operators';

import { TrainingService } from '../training.service';
import { Exercise } from '../exercise.model';
import { UIService } from '../../shared/ui.service';
import * as fromRoot from '../../app.reducer';
import * as fromTraining from '../training.reducer';
import { Store } from '@ngrx/store';


@Component({
  selector: 'app-new-training',
  templateUrl: './new-training.component.html',
  styleUrls: ['./new-training.component.css']
})
export class NewTrainingComponent implements OnInit {
  // exercises: Exercise[];
  exercises$: Observable<Exercise[]>;
  // isLoading = true;
  isLoading$: Observable<boolean>;
  // private exerciseSubscription: Subscription;
  // private loadingSubscription: Subscription;

  constructor(private trainingService: TrainingService, 
    private uiService: UIService,
    private store: Store<fromTraining.State>
    // private store: Store<fromRoot.State>
  ) {}

  ngOnInit() {
    this.isLoading$ = this.store.select(fromRoot.getIsLoading);
    this.exercises$ = this.store.select(fromTraining.getAvailableExercises);
    // this.loadingSubscription = this.uiService.loadingStateChanged.subscribe(
    //   isLoading => {
    //     this.isLoading = isLoading;
    //   }
    // );
    // this.exerciseSubscription = this.trainingService.exercisesChanged.subscribe(
    //   exercises => {
    //     this.exercises = exercises;
    //   }
    // );
    this.fetchExercises();
  }

  fetchExercises() {
    this.trainingService.fetchAvailableExercises();
  }

  onStartTraining(form: NgForm) {
    this.trainingService.startExercise(form.value.exercise);
  }

 // ngOnDestroy() {
    // if (this.exerciseSubscription) {
    //   this.exerciseSubscription.unsubscribe();
    // }
    // if (this.loadingSubscription) {
    //   this.loadingSubscription.unsubscribe();
    // }
 // }
}
