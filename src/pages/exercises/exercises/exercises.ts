import { Component } from '@angular/core';
import { NavController, Events, LoadingController } from 'ionic-angular';

import { ExercisePage } from '../exercise/exercise';
import { ExerciseProvider } from '../../../providers/exercise/exercise';

@Component({
  selector: 'page-exercises',
  templateUrl: 'exercises.html',
})
export class ExercisesPage {
  shownCategory = null;
  categories = [];
  exercises = [];
  notifications = [];
  spinner = null;

  constructor(
    private navCtrl: NavController,
    private exerciseProvider: ExerciseProvider,
    private loadingCtrl: LoadingController,
    private events: Events) {
    this.init();
  }

  public init() {
    if (this.exerciseProvider.canDisplaySpinner) {
      this.spinner = this.loadingCtrl.create({
        content: 'Bitte warten...',
      });
      this.listenForSpinnerDismissEvent();
    }
    this.listenForExercisesDidChange();

    this.notifications = this.exerciseProvider.getSettings();
    // was the data already received by the time we initialize this class?
    // if not we need to wait for the event
    // this.notifications = this.exerciseProvider.getSettings();
    if (!this.exerciseProvider.receivedDataFromRest) {
      this.listenForNotificationSettingsDidLoad();
    }
    this.setData();
  }

  public isCategoryVisible(category) {
    // if we don't have any notification settings we want to show all by default
    if (!this.notifications.length) return true;

    const result = this.notifications.find(item => item.id === category.id);
    return result !== undefined ? result.isActive : false;
  }

  public isAtLeastOneCategoryVisible() {
    if (!this.notifications.length) return false;

    const result = this.notifications.find(item => item.isActive === true);
    return result !== undefined ? true : false;
  }

  public toggleCategory(category) {
    if (this.isCategoryShown(category)) {
      this.shownCategory = null;
    } else {
      this.shownCategory = category;
    }
  }

  public isCategoryShown(category) {
    return this.shownCategory === category;
  }

  public loadExercise(exercise) {
    this.navCtrl.push(ExercisePage, {
      exercise: exercise
    });
  }

  private listenForExercisesDidChange() {
    this.events.subscribe('exercises:change', () => {
      this.unlistenForExercisesDidChange();
      this.setData();
    });
  }

  private unlistenForExercisesDidChange() {
    this.events.unsubscribe('exercises:change', null);
  }

  private listenForNotificationSettingsDidLoad() {
    if (this.spinner) this.spinner.present();
    this.events.subscribe('notificationSettings:load', () => {
      this.notifications = this.exerciseProvider.getSettings();
      this.dismissSpinner();
      this.unlistenForNotificationSettingsDidLoad();
    });
  }

  private unlistenForNotificationSettingsDidLoad() {
    this.events.unsubscribe('notificationSettings:load', null);
  }

  private listenForSpinnerDismissEvent() {
    this.events.subscribe('exercises:spinner-dismiss', () => {
      this.dismissSpinner();
    });
  }

  private dismissSpinner() {
    if (this.spinner) this.spinner.dismiss();
  }


  private setData() {
    this.categories = this.exerciseProvider.getCategories();
    this.exercises = this.exerciseProvider.getExercises();
    this.prepareData();
  }

  private prepareData() {
    this.categories.forEach(cat => {
      this.exercises.forEach(exercise => {
        if (cat.id == exercise.exercise_category[0]) {
          cat.exercises.push(exercise);
        }
      });
      cat.exercises = cat.exercises.sort(this.compareExercisesByTitel);
    });
  }

  private compareExercisesByTitel(a, b) {
    if (a.title.rendered < b.title.rendered) return -1;
    if (a.title.rendered > b.title.rendered) return 1;
    return 0;
  }
}
