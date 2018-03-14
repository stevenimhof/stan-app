import {NgModule, ErrorHandler} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {IonicApp, IonicModule, IonicErrorHandler} from 'ionic-angular';
import {MyApp} from './app.component';
import {Config} from './app.config';

import {HomePage} from '../pages/home/home';
import {ExercisesPage} from "../pages/exercises/exercises";
import {ExercisePage} from "../pages/exercise/exercise";
import {TheoriesPage} from "../pages/theories/theories";
import {TheoryPage} from "../pages/theory/theory";
import {InfoPage} from "../pages/info/info";
import {TabsPage} from '../pages/tabs/tabs';
import {SettingsPage} from "../pages/settings/settings";
import {AboutPage} from '../pages/about/about';

import {StatusBar} from '@ionic-native/status-bar';
import {SplashScreen} from '@ionic-native/splash-screen';

import { HttpClientModule } from '@angular/common/http';
import { IonicStorageModule } from '@ionic/storage';

import { ExerciseProvider } from '../providers/exercise/exercise';
import { KeepHtmlPipe } from '../pipes/keep-html/keep-html';
import { AccordionComponent } from '../components/accordion/accordion';

@NgModule({
  declarations: [
    MyApp,
    HomePage,
    ExercisesPage,
    ExercisePage,
    TheoriesPage,
    TheoryPage,
    InfoPage,
    TabsPage,
    SettingsPage,
    AboutPage,
    KeepHtmlPipe,
    AccordionComponent
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
    InfoPage,
    TabsPage,
    SettingsPage,
    AboutPage
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
