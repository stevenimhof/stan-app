import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import 'rxjs/add/operator/map';
import { Config } from '../../app/app.config';


@Injectable()
export class ExerciseProvider {

  constructor(public http: HttpClient, private config: Config) {
  }

  transformCategories(data) {
    let result = [];
    data.forEach(function(el) {
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

  getCategories() {
    return  this.http.get(this.config.wordpressApiUrl + '/wp/v2/exercise_category')
      .map(result => {
        return this.transformCategories(result);
      });
  }

  getExercises() {
    return this.http.get(this.config.wordpressApiUrl + '/wp/v2/exercise' )
      .map(result => {
        return result;
      })
  }


}
