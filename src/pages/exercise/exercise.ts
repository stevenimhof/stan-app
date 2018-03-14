import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { DomSanitizer } from '@angular/platform-browser';

@IonicPage()
@Component({
  selector: 'page-exercise',
  templateUrl: 'exercise.html',
})
export class ExercisePage {
  exercise: any;
  videoSrc = null;

  constructor(
  	public navCtrl: NavController,
    public navParams: NavParams,
    private sanitizer: DomSanitizer) {
    this.exercise = navParams.get('exercise');

    if (this.exercise.acf.video_url) {
      const url = this.exercise.acf.video_url;
      this.videoSrc = this.sanitizer.bypassSecurityTrustResourceUrl(url);
    }
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ExcercisePage');
  }

}
