import { Component, Input, NgZone } from '@angular/core';
import { Events } from 'ionic-angular';
import { DomSanitizer } from '@angular/platform-browser';
import { NetworkProvider } from '../../providers/network/network';

@Component({
  selector: 'youtube-video',
  templateUrl: 'youtube-video.html'
})
export class YoutubeVideoComponent {
  @Input() id: any;
  videoId;
  isOnline;

  constructor(private sanitizer: DomSanitizer,
    private networkProvider: NetworkProvider,
    private _zone: NgZone,
    private events: Events
  ) { }

  ngOnInit() {
    this.setVideoId(this.id);
    this.setOnlineStatus(this.networkProvider.isOnline());
    this.onNetworkChange();
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
      console.log('setting status to: '+flag);
      this.isOnline = flag;
    });
  }

  ngOnDestroy() {
    this.events.unsubscribe('network:offline');
    this.events.unsubscribe('network:online');
  }

  private setVideoId(id) {
    if (id) {
      const url = 'https://www.youtube.com/embed/' + id;
      this.videoId = this.sanitizer.bypassSecurityTrustResourceUrl(url);
    }
  }

}
