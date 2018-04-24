import { Component } from '@angular/core';
import { Events } from 'ionic-angular';
import { WpPageProvider } from '../../providers/wp-page/wp-page';

@Component({
  selector: 'page-info',
  templateUrl: 'info.html',
})
export class InfoPage {
  mainContent;

  constructor(private events: Events,
    private wpPageProvider: WpPageProvider) {
      this.listenForPagesDidChange();
      this.mainContent = this.wpPageProvider.getInfoPage();
  }

  private listenForPagesDidChange() {
    this.events.subscribe('wpPages:change', () => {
      this.unlistenForPagesDidChange();
      this.mainContent = this.wpPageProvider.getInfoPage();
    });
  }

  private unlistenForPagesDidChange() {
    this.events.unsubscribe('wpPages:change', null);
  }

}
