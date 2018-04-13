import { Component } from '@angular/core';
import { NavController, Events } from 'ionic-angular';
import { SettingsPage } from "../settings/settings";
import { MotivationProvider } from "../../providers/motivation/motivation";
import { StripHtmlPipe } from "../../pipes/strip-html/strip-html";

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  dailyMotivation;

  constructor(public navCtrl: NavController,
    private motivationProvider: MotivationProvider,
    private events: Events) {
    this.listenForMotivationsDidLoad();
  }

  // only for testing purposes
  public changeMotivation() {
    this.motivationProvider.changeMotivation();
  }

  public loadSettings() {
    this.navCtrl.push(SettingsPage);
  }

  private setDailyMotivation() {
    this.motivationProvider.getDailyMotivation().then(motivation => {
      this.dailyMotivation = motivation;
    });
  }

  private listenForMotivationsDidLoad() {
    this.events.subscribe('motivations:loaded', () => {
      this.setDailyMotivation();
    });
  }
}
