import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {Observable} from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/throw';
import {Config} from '../../app/app.config';
import {Storage} from '@ionic/storage';


@Injectable()
export class ExerciseProvider {
  localExercisesPromise;

  constructor(public http: HttpClient,
              private config: Config,
              private storage: Storage) {
  }

  transformCategories(data) {
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

  setLocalExercisesPromis() {
    if (!this.localExercisesPromise) {
      this.localExercisesPromise = this.storage.get('exercises');
    }
  }

  getCategories() {
    this.setLocalExercisesPromis();
    return this.localExercisesPromise.then((localExercises) => {
      return (localExercises && localExercises['categories']) ? localExercises['categories'] : [];
    });
  }

  getExercises() {
    this.setLocalExercisesPromis();
    return this.localExercisesPromise.then((localExercises) => {
      //console.log("get exercises from localStorage");
      return (localExercises && localExercises['exercises']) ? localExercises['exercises'] : [];
    });
  }

  getCategoriesFromWordpress() {
    return this.http.get(this.config.wordpressApiUrl + '/wp/v2/exercise_category')
      .map(result => {
        return this.transformCategories(result);
      })
      .catch(error => Observable.throw("Error while trying to get data from server"));
  }

  getExercisesFromWordpress() {
    return this.http.get(this.config.wordpressApiUrl + '/wp/v2/exercise')
      .map(result => {
        return result;
      })
      .catch(error => Observable.throw("Error while trying to get data from server"));
  }

  deleteExercises() {
    this.storage.remove('exercises');
  }
}
