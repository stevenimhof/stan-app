import { Component } from '@angular/core';
import { Events } from 'ionic-angular';
import { WpPageProvider } from '../../providers/wp-page/wp-page';

@Component({
  selector: 'page-about',
  templateUrl: 'about.html'
})
export class AboutPage {
  mainContent;

  constructor(private events: Events,
    private wpPageProvider: WpPageProvider) {
      this.listenForPagesDidChange();
      this.mainContent = this.wpPageProvider.getAboutPage();
  }

  private listenForPagesDidChange() {
    this.events.subscribe('wpPages:change', () => {
      this.unlistenForPagesDidChange();
      this.mainContent = this.wpPageProvider.getAboutPage();
    });
  }

  private unlistenForPagesDidChange() {
    this.events.unsubscribe('wpPages:change', null);
  }

}
