import { Component } from '@angular/core';
import { NavController, NavParams, Events } from 'ionic-angular';
import { WpPageProvider } from '../../providers/wp-page/wp-page';

@Component({
  selector: 'page-info',
  templateUrl: 'info.html',
})
export class InfoPage {
  mainContent = null;

  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    private events: Events,
    private wpPageProvider: WpPageProvider) {
      this.listenForPagesDidLoad();
      this.mainContent = this.wpPageProvider.getInfoPage();
  }

  private listenForPagesDidLoad() {
    this.events.subscribe('wpPages:loaded', () => {
      this.unlistenForPagesDidLoad();
      this.mainContent = this.wpPageProvider.getInfoPage();
    });
  }

  private unlistenForPagesDidLoad() {
    this.events.unsubscribe('wpPages:loaded', null);
  }

}
