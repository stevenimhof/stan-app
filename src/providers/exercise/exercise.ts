import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/throw';
import { Config } from '../../app/app.config';
import { Storage } from '@ionic/storage';
import { Events } from 'ionic-angular';

@Injectable()
export class ExerciseProvider {
  categories = [];
  exercises = [];
  notifications = [];
  receivedDataFromRest = false;
  canDisplaySpinner = true;

  constructor(public http: HttpClient,
    private config: Config,
    private storage: Storage,
    private events: Events) { }

  public saveExerciseData() {
    return this.getExerciseStorage().then(() => {
      return this.storage.set('exercises', {
        "exercises": this.exercises,
        "categories": this.categories,
        "notificationSettings": this.notifications
      });
    });
  }

  /**
   * Checks for updates by comparing data from server and from local storage
   * If there is a new version on the server, it will be saved in the local storage.
   * In addition, it emits an event that the data is now available via the storage.
   */
  public checkForUpdates() {
    this.getExerciseStorage().then(localData => {
      this.categories = localData ? localData['categories'] : [];
      this.exercises = localData ? localData['exercises'] : [];
      this.notifications = localData ? localData['notificationSettings'] : [];

      this.getCategoriesFromWordpress()
        .timeout(this.config.REST_TIMEOUT_DURATION)
        .subscribe(unsortedCategories => {

          const categories = unsortedCategories.sort(this.compareCategoriesByOrder);
          this.getExercisesFromWordpress()
            .timeout(this.config.REST_TIMEOUT_DURATION)
            .subscribe(exercises => {

              this.receivedDataFromRest = true;
              this.handleComparisionOfData(localData, exercises, categories);
            },
              err => { this.handleRequestError(); }
          );
        },
          err => { this.handleRequestError(); }
      );
    });
  }

  public getCategories() {
    return this.categories;
  }

  public getExercises() {
    return this.exercises;
  }

  public getSettings() {
    return this.notifications;
  }

  public emitExercisesDidChange() {
    this.events.publish('exercises:change', null, null);
  }

  public emitSettingsDidLoad() {
    this.events.publish('notificationSettings:load', null, null);
  }

  /**
   * Prepare the notification list based on the data from the exercise categories
   */
  public prepareNotifications() {
    if (!this.categories.length) return;
    // do we have any notifications? if that's not the case we need to
    // create a list from the exercise categories
    if (this.notifications === undefined || !this.notifications.length) {
      this.copyAllNotificationsFromCategories();
      this.saveExerciseData();
    } else {
      // compare exercise categories and items in notification settings
      // if there's a change we need to update our list
      if (JSON.stringify(this.categories) !== JSON.stringify(this.notifications)) {
        this.updateSettings();
        this.saveExerciseData();
      }
    }
  }

  /**
   * Update the list of notification settings
   * 
   * Take the current notification settings and add any new items
   * from the exercise category list. Don't change the 'isActive' property 
   * of the current notification settings
   */
  private updateSettings() {
    const temp: any = this.notifications;
    this.copyAllNotificationsFromCategories();
    this.notifications.forEach(item => {
      const found = temp.find(el => el.id === item.id);
      if (found) {
        item.isActive = found.isActive;
      }
    });
  }

  private handleComparisionOfData(localData, exercises, categories) {
    if (!this.compareExerciseData(localData, exercises, categories)) {
      this.categories = categories;
      this.exercises = exercises;

      this.emitExercisesDidChange();
      this.saveExerciseData();
      this.prepareNotifications();
    }
    this.emitSettingsDidLoad();
  }

  public emitSpinnerDismissEvent() {
    this.events.publish('exercises:spinner-dismiss', null, null);
  }

  private handleRequestError() {
    this.setDisplaySpinnerStatus(false);
    this.emitSpinnerDismissEvent();
  }

  private setDisplaySpinnerStatus(flag) {
    this.canDisplaySpinner = flag;
  }

  private getCategoriesFromWordpress() {
    return this.http.get(this.config.WP_API_URL + '/wp/v2/exercise_category?' + this.config.WP_MAX_POSTS)
      .map(result => {
        return this.transformCategories(result);
      })
      .catch(error => Observable.throw("Error while trying to get data from server"));
  }

  private getExercisesFromWordpress() {
    return this.http.get(this.config.WP_API_URL + '/wp/v2/exercise?' + this.config.WP_MAX_POSTS)
      .map(result => {
        return result;
      })
      .catch(error => Observable.throw("Error while trying to get data from server"));
  }

  private copyAllNotificationsFromCategories() {
    this.notifications = [];
    this.categories.forEach(cat => {
      this.notifications.push({ id: cat.id, name: cat.name, isActive: true });
    });
  }

  private compareCategoriesByOrder(a, b) {
    if (parseInt(a.order) < parseInt(b.order)) return -1;
    if (parseInt(a.order) > parseInt(b.order)) return 1;
    return 0;
  }

  /**
   * Transform categories from server into a more flattener structure for better handling
   * 
   * @param data category object from server
   */
  private transformCategories(data) {
    let result = [];
    data.forEach(function (el) {
      let obj = {
        id: el.id,
        order: el.acf.order,
        color: el.acf.color,
        name: el.name,
        parent: el.parent,
        slug: el.slug,
        exercises: [] // to connect the exercises to the categories
      }
      result.push(obj);
    });
    return result;
  }

  private compareExerciseData(localData, exercisesFromRest, categoriesFromRest) {
    return localData
      && JSON.stringify(localData['exercises']) == JSON.stringify(exercisesFromRest)
      && JSON.stringify(localData['categories']) == JSON.stringify(categoriesFromRest);
  }

  private getExerciseStorage() {
    return this.storage.ready().then(() => {
      return this.storage.get('exercises')
    });
  }

}
