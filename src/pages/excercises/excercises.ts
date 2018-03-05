import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

import {ExcercisePage} from "../excercise/excercise";

/**
 * Generated class for the ExcercisesPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-excercises',
  templateUrl: 'excercises.html',
})
export class ExcercisesPage {

  constructor(public navCtrl: NavController, public navParams: NavParams) {
  }

  excercises = [
    ['Übung 1', 'Lorem Ipsum'],
    ['Übung 2', 'Lorem Ipsum'],
    ['Übung 3', 'Lorem Ipsum'],
  ];

  excerciseSelected() {
    this.navCtrl.push(ExcercisePage);
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ExcercisesPage');
  }

}
