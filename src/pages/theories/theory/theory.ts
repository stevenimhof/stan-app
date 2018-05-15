import { Component } from '@angular/core';
import { NavParams } from 'ionic-angular';

@Component({
  selector: 'page-theory',
  templateUrl: 'theory.html',
})
export class TheoryPage {
  theory: any;
  videoId;

  constructor(private navParams: NavParams) {
    this.theory = this.navParams.get('theory');
    this.setVideoId();
  }

  private setVideoId() {
    this.videoId = this.theory.acf.youtube_video_id;
  }
}
