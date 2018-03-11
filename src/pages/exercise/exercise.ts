import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

@IonicPage()
@Component({
  selector: 'page-exercise',
  templateUrl: 'exercise.html',
})
export class ExercisePage {
	exercise: any;

  constructor(
  	public navCtrl: NavController,
  	public navParams: NavParams) {
  	this.exercise = navParams.get('exercise');
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ExcercisePage');
  }

}
