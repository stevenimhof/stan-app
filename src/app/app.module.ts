import {NgModule, ErrorHandler} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {IonicApp, IonicModule, IonicErrorHandler} from 'ionic-angular';
import {MyApp} from './app.component';

import {HomePage} from '../pages/home/home';
import {ExcercisesPage} from "../pages/excercises/excercises";
import {TheoriesPage} from "../pages/theories/theories";
import {SettingsPage} from "../pages/settings/settings";
import {AboutPage} from '../pages/about/about';
import {TabsPage} from '../pages/tabs/tabs';

import {StatusBar} from '@ionic-native/status-bar';
import {SplashScreen} from '@ionic-native/splash-screen';
import {ExcercisePage} from "../pages/excercise/excercise";
import {TheoryPage} from "../pages/theory/theory";

@NgModule({
  declarations: [
    MyApp,
    HomePage,
    ExcercisesPage,
    ExcercisePage,
    TheoriesPage,
    TheoryPage,
    SettingsPage,
    AboutPage,
    TabsPage
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp)
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage,
    ExcercisesPage,
    ExcercisePage,
    TheoriesPage,
    TheoryPage,
    SettingsPage,
    AboutPage,
    TabsPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    {provide: ErrorHandler, useClass: IonicErrorHandler}
  ]
})
export class AppModule {
}
