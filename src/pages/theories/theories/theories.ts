import { Component } from '@angular/core';
import { NavController, NavParams, Events } from 'ionic-angular';

import { TheoryPage } from "../theory/theory";
import { TheoryProvider } from '../../../providers/theory/theory';

@Component({
  selector: 'page-theories',
  templateUrl: 'theories.html',
})
export class TheoriesPage {
  theories;

  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    private events: Events,
    private theoryProvider: TheoryProvider) {

    this.listenForTheoriesDidChange();
    this.setTheories();
  }

  public loadTheory(theory) {
    this.navCtrl.push(TheoryPage, {
      theory: theory
    });
  }

  private setTheories() {
    this.theories = this.theoryProvider.getTheories();
  }

  private listenForTheoriesDidChange() {
    this.events.subscribe('theories:change', () => {
      this.setTheories();
      this.unlistenForTheoriesDidChange();
    });
  }

  private unlistenForTheoriesDidChange() {
    this.events.unsubscribe('theories:change', null);
  }

}
