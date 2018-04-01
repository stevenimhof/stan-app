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
  constructor(public http: HttpClient,
    private config: Config,
    private storage: Storage,
    private events: Events) {
  }

  public getCategoriesFromWordpress() {
    return this.http.get(this.config.wordpressApiUrl + '/wp/v2/exercise_category')
      .map(result => {
        return this.transformCategories(result);
      })
      .catch(error => Observable.throw("Error while trying to get data from server"));
  }

  public getExercisesFromWordpress() {
    return this.http.get(this.config.wordpressApiUrl + '/wp/v2/exercise')
      .map(result => {
        return result;
      })
      .catch(error => Observable.throw("Error while trying to get data from server"));
  }

  public deleteExercises() {
    this.storage.remove('exercises');
  }

  /**
   * Checks for updates by comparing data from server and from local storage
   * If there is a new version on the server, it will be saved in the local storage.
   * In addition, it emits an event that the data is now available via the storage.
   */
  public checkForUpdates() {
    this.getExercisesStorage().then(localExercises => {
      this.getCategoriesFromWordpress().subscribe(categories => {
        this.getExercisesFromWordpress().subscribe(exercises => {
          if (!this.compareExercises(localExercises, exercises, categories)) {
            this.storage.set('exercises', {
              "exercises": exercises,
              "categories": categories,
              "evaluations": []
            }).then(() => {
              this.emitExercisesDidLoad();
            });
          } else {
            this.emitExercisesDidLoad();
          }
        });
      });
    });
  }

  public getCategories() {
    return this.getExercisesStorage().then(localExercises => {
      const result = (localExercises && localExercises['categories']) ? localExercises['categories'] : [];
      return result.sort(this.compareCategoriesByOrder);
    });
  }

  public getExercises() {
    return this.getExercisesStorage().then((localExercises) => {
      return (localExercises && localExercises['exercises']) ? localExercises['exercises'] : [];
    });
  }

  private compareCategoriesByOrder(a,b) {
    if (parseInt(a.order) < parseInt(b.order))
      return -1;
    if (parseInt(a.order) > parseInt(b.order))
      return 1;
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
        isVisible: true,
        exercises: [] // to connect the exercises to the categories
      }
      result.push(obj);
    });
    return result;
  }

  private compareExercises(localExercises, exercisesFromRest, categoriesFromRest) {
    return localExercises
      && JSON.stringify(localExercises['exercises']) == JSON.stringify(exercisesFromRest)
      && JSON.stringify(localExercises['categories']) == JSON.stringify(categoriesFromRest);
  }

  private getExercisesStorage() {
    return this.storage.ready().then(() => {
      return this.storage.get('exercises')
    });
  }

  private emitExercisesDidLoad() {
    this.events.publish('exercises:loaded', null, null);
  }

}
