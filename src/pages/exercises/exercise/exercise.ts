import { Component } from '@angular/core';
import { NavParams } from 'ionic-angular';

@Component({
  selector: 'page-exercise',
  templateUrl: 'exercise.html',
})
export class ExercisePage {
  exercise: any;
  videoId;

  constructor(
    private navParams: NavParams) {
    this.exercise = this.navParams.get('exercise');
    this.setVideoId();
  }

  private setVideoId() {
    this.videoId = this.exercise.acf.youtube_video_id;
  }

}
