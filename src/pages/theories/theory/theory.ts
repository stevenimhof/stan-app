import { Component, NgZone } from '@angular/core';
import { NavParams, Events } from 'ionic-angular';
import { DomSanitizer } from '@angular/platform-browser';
import { NetworkProvider } from '../../../providers/network/network';

@Component({
  selector: 'page-theory',
  templateUrl: 'theory.html',
})
export class TheoryPage {
  theory: any;
  videoSrc = null;
  isOnline;

  constructor(private navParams: NavParams,
    private sanitizer: DomSanitizer,
    private networkProvider: NetworkProvider,
    private _zone: NgZone,
    private events: Events) {

    this.theory = this.navParams.get('theory');
    this.setVideoUrl();
  }

  ionViewDidLoad() {
    this.setOnlineStatus(this.networkProvider.isOnline());
    this.onNetworkChange();
  }

  private setVideoUrl() {
    if (this.theory.acf.youtube_video_id) {
      const url = 'https://www.youtube.com/embed/' + this.theory.acf.youtube_video_id;
      this.videoSrc = this.sanitizer.bypassSecurityTrustResourceUrl(url);
    }
  }

  private onNetworkChange() {
    this.events.subscribe('network:offline', () => {
      this.setOnlineStatus(false);
    });

    this.events.subscribe('network:online', () => {
      this.setOnlineStatus(true);
    });
  }

  private setOnlineStatus(flag) {
    this._zone.run(() => {
      this.isOnline = flag;
    });
  }

  ngOnDestroy() {
    this.events.unsubscribe('network:offline');
    this.events.unsubscribe('network:online');
  }
}
