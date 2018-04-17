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

    this.listenForTheoriessDidLoad();
    this.getTheories();
  }

  public loadTheory(theory) {
    this.navCtrl.push(TheoryPage, {
      theory: theory
    });
  }

  private getTheories() {
    this.theories = this.theoryProvider.getTheories();
  }

  private listenForTheoriessDidLoad() {
    this.events.subscribe('theories:loaded', () => {
      this.getTheories();
      this.unlistenForTheoriessDidLoad();
    });
  }

  private unlistenForTheoriessDidLoad() {
    this.events.unsubscribe('theories:loaded', null);
  }

}
