import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { DomSanitizer } from '@angular/platform-browser';
import { Network } from '@ionic-native/network';

@Component({
  selector: 'page-theory',
  templateUrl: 'theory.html',
})
export class TheoryPage {
  theory: any;
  videoSrc = null;
  hasInternetConnectivity = navigator.onLine;

  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    private sanitizer: DomSanitizer,
    private network: Network) {

    this.theory = navParams.get('theory');
    this.watchInternetConnectivity();
    this.setVideoUrl();
  }

  private watchInternetConnectivity() {
    this.network.onDisconnect().subscribe(() => {
      this.hasInternetConnectivity = false;
    });
    this.network.onConnect().subscribe(() => {
      this.hasInternetConnectivity = true;

    });
  }

  private setVideoUrl() {
    if (this.theory.acf.youtube_video_id) {
      const url = 'https://www.youtube.com/embed/' + this.theory.acf.youtube_video_id;
      this.videoSrc = this.sanitizer.bypassSecurityTrustResourceUrl(url);
    }
  }
}
