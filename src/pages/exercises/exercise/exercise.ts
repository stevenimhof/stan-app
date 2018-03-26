import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { DomSanitizer } from '@angular/platform-browser';
import { Network } from '@ionic-native/network';

@Component({
  selector: 'page-exercise',
  templateUrl: 'exercise.html',
})
export class ExercisePage {
  exercise: any;
  videoSrc = null;
  hasInternetConnectivity = navigator.onLine;

  constructor(
  	public navCtrl: NavController,
    public navParams: NavParams,
    private sanitizer: DomSanitizer,
    private network: Network) {
    this.exercise = navParams.get('exercise');

    this.watchInternetConnectivity();
    this.setVideoUrl();
  }

  watchInternetConnectivity() {
    this.network.onDisconnect().subscribe(() => {
      this.hasInternetConnectivity = false;
    });
    this.network.onConnect().subscribe(() => {
      this.hasInternetConnectivity = true;

    });
  }

  setVideoUrl() {
    if (this.exercise.acf.video_url) {
      const url = this.exercise.acf.video_url;
      this.videoSrc = this.sanitizer.bypassSecurityTrustResourceUrl(url);
    }
  }

}
