import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { Config, IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';
import { MyApp } from './app.component';
import { StorageProvider } from "../providers/storage/storage";
import { IonicStorageModule } from "@ionic/storage";
import { WidgetProvider } from '../providers/widget/widget';
import { EmployeerProvider } from '../providers/employeer/employeer';
import { CandidateProvider } from '../providers/candidate/candidate';
import { OrganizationProvider } from '../providers/organization/organization';
import { CityProvider } from '../providers/city/city';
import { SelectSearchableModule } from "ionic-select-searchable";
import { CallNumber } from "@ionic-native/call-number";
import { JobProvider } from '../providers/job/job';
import { ServiceProvider } from '../providers/service/service';
import { PlanPrizeProvider } from '../providers/plan-prize/plan-prize';
import { Camera } from "@ionic-native/camera";
import { Transfer } from "@ionic-native/transfer";
import { DatePipe } from "@angular/common";
import { File } from "@ionic-native/file";
import { FilePath } from "@ionic-native/file-path";
import { SocialSharing } from "@ionic-native/social-sharing";
import { InAppBrowser } from "@ionic-native/in-app-browser";
import { AppUpdate } from "@ionic-native/app-update";
import { MomentModule } from "angular2-moment";
import { FCM } from "@ionic-native/fcm";
import { CheckupdateProvider } from '../providers/checkupdate/checkupdate';
import { HttpClientModule } from "@angular/common/http";
import { FileTransfer } from "@ionic-native/file-transfer";
import { Network } from '@ionic-native/network';
import { NetworkProvider } from '../providers/network/network';
import { enterModalAnimation } from "./animation/entermodal";
import { leaveModalAnimation } from "./animation/leavemodal";
import { NativeAudio } from "@ionic-native/native-audio";
import { SoundProvider } from '../providers/sound/sound';
import { BroadcastProvider } from '../providers/broadcast/broadcast';

@NgModule({
  declarations: [
    MyApp
  ],
  imports: [
    BrowserModule,
    MomentModule,
    HttpClientModule,
    IonicModule.forRoot(MyApp,  { tabsHideOnSubPages: true }),
    IonicStorageModule.forRoot(),
    SelectSearchableModule
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp
  ],
  providers: [
    StatusBar,
    FCM,
    SplashScreen,
    CallNumber,DatePipe,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    StorageProvider,
    WidgetProvider,
    EmployeerProvider,
    CandidateProvider,
    OrganizationProvider,
    CityProvider,
    JobProvider,
    ServiceProvider,
    PlanPrizeProvider,
    Camera,
    Transfer,
    File,
    FilePath,
    FileTransfer,
    SocialSharing,
    InAppBrowser,
    AppUpdate,
    CheckupdateProvider,
    CandidateProvider,
    CityProvider,
    Network,
    NetworkProvider,
    SoundProvider,
    NativeAudio,
    BroadcastProvider
  ]
})
export class AppModule {
  constructor(public config: Config) {
    this.setCustomTransitions();
  }

  private setCustomTransitions(): void  {
    this.config.setTransition('modal-translate-up-enter', enterModalAnimation);
    this.config.setTransition('modal-translate-up-leave', leaveModalAnimation);
  }
}
