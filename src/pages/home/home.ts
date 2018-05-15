import { Component, ViewChild } from '@angular/core';
import { Content } from 'ionic-angular';
import { NavController, Events } from 'ionic-angular';
import { SettingsPage } from "../settings/settings";
import { MotivationProvider } from "../../providers/motivation/motivation";

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  @ViewChild(Content) content: Content
  dailyMotivation;

  constructor(private navCtrl: NavController,
    private motivationProvider: MotivationProvider,
    private events: Events) {
    this.listenForMotivationsDidChange();
  }

  ionViewWillEnter() {
    if (this.dailyMotivation) {
      this.motivationProvider.setDailyMotivation();
      this.getDailyMotivation();
    }
  }

  public loadSettings() {
    this.navCtrl.push(SettingsPage);
  }

  private getDailyMotivation() {
    this.dailyMotivation = this.motivationProvider.getDailyMotivation();
  }

  private listenForMotivationsDidChange() {
    this.events.subscribe('motivations:change', () => {
      this.getDailyMotivation();
      this.content.resize();
    });
  }
}
