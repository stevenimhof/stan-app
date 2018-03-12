import {NgModule, ErrorHandler} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {IonicApp, IonicModule, IonicErrorHandler} from 'ionic-angular';
import {MyApp} from './app.component';
import {Config} from './app.config';

import {HomePage} from '../pages/home/home';
import {ExercisesPage} from "../pages/exercises/exercises";
import {TheoriesPage} from "../pages/theories/theories";
import {SettingsPage} from "../pages/settings/settings";
import {AboutPage} from '../pages/about/about';
import {TabsPage} from '../pages/tabs/tabs';

import {StatusBar} from '@ionic-native/status-bar';
import {SplashScreen} from '@ionic-native/splash-screen';
import {ExercisePage} from "../pages/exercise/exercise";
import {TheoryPage} from "../pages/theory/theory";

import { HttpClientModule } from '@angular/common/http';
import { IonicStorageModule } from '@ionic/storage';

import { ExerciseProvider } from '../providers/exercise/exercise';

@NgModule({
  declarations: [
    MyApp,
    HomePage,
    ExercisesPage,
    ExercisePage,
    TheoriesPage,
    TheoryPage,
    SettingsPage,
    AboutPage,
    TabsPage
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp),
    HttpClientModule,
    IonicStorageModule.forRoot()
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage,
    ExercisesPage,
    ExercisePage,
    TheoriesPage,
    TheoryPage,
    SettingsPage,
    AboutPage,
    TabsPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    ExerciseProvider,
    Config
  ]
})
export class AppModule {
}
