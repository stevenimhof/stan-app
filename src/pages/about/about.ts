import { Component } from '@angular/core';
import { NavController, NavParams, Events } from 'ionic-angular';
import { WpPageProvider } from '../../providers/wp-page/wp-page';

@Component({
  selector: 'page-about',
  templateUrl: 'about.html'
})
export class AboutPage {
  mainContent = null;

  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    private events: Events,
    private wpPageProvider: WpPageProvider) {
      this.listenForPagesDidLoad();
      this.mainContent = this.wpPageProvider.getAboutPage();
  }

  private listenForPagesDidLoad() {
    this.events.subscribe('wpPages:loaded', () => {
      this.unlistenForPagesDidLoad();
      this.mainContent = this.wpPageProvider.getAboutPage();
    });
  }

  private unlistenForPagesDidLoad() {
    this.events.unsubscribe('wpPages:loaded', null);
  }

}
