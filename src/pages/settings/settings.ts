import { Component } from '@angular/core';
import { NavController, NavParams, Events } from 'ionic-angular';
import { ExerciseProvider } from '../../providers/exercise/exercise';

import { AboutPage } from "../about/about";

@Component({
  selector: 'page-settings',
  templateUrl: 'settings.html',
})
export class SettingsPage {

  categories = [];

  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    private exerciseProvider: ExerciseProvider,
    private events: Events) {

      this.listenForExercisesDidLoad();
      if (!this.categories.length) {
        this.getCategories();
      }
  }

  public onChange() {
  }

  private getCategories() {
    this.exerciseProvider.getCategories().then(result => {
      this.categories = result;
    });
  }

  private listenForExercisesDidLoad() {
    this.events.subscribe('exercises:loaded', () => {
      this.getCategories();
      this.unlistenForExercisesDidLoad();
    });
  }

  private unlistenForExercisesDidLoad() {
    this.events.unsubscribe('exercises:loaded', null);
  }

  loadAbout() {
    this.navCtrl.push(AboutPage);
  }

}
