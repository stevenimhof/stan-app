import {Component} from '@angular/core';

import {HomePage} from '../home/home';
import {ExercisesPage} from "../exercises/exercises/exercises";
import {TheoriesPage} from "../theories/theories";
import {InfoPage} from "../info/info";

@Component({
  templateUrl: 'tabs.html'
})
export class TabsPage {

  tab1Root = HomePage;
  tab2Root = ExercisesPage;
  tab3Root = TheoriesPage;
  tab4Root = InfoPage;

  constructor() {

  }
}
