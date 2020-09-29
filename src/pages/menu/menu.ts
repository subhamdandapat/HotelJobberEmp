import {AlertController} from 'ionic-angular';
import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, Nav } from 'ionic-angular';
import { ModalController } from 'ionic-angular';
import { StorageProvider } from "../../providers/storage/storage";
import {WidgetProvider} from "../../providers/widget/widget";
import {SoundProvider} from "../../providers/sound/sound";


export interface PageInterface {
  title: string;
  pageName: string;
  tabComponent?: any;
  index?: number;
  icon: string;
}

@IonicPage()
@Component({
  selector: 'page-menu',
  templateUrl: 'menu.html',
})

export class MenuPage {

  EmpName: any;
  fb_data: any;
  Emp_details: any;
  // Basic root for our content view
  rootPage = 'TabsPage';

  // Reference to the app's root nav
  @ViewChild(Nav) nav: Nav;

  pages: PageInterface[] = [
    { title: 'Profiles', pageName: 'TabsPage', tabComponent: 'Tab1Page', index: 0, icon: 'phonebook' },
    { title: 'My Calls', pageName: 'TabsPage', tabComponent: 'Tab2Page', index: 1, icon: 'call1',},
    { title: 'Post Job', pageName: 'TabsPage', tabComponent: 'OrganizationPage', index: 2, icon: 'job' },
    { title: 'My Jobs', pageName: 'TabsPage', tabComponent: 'OrganizationPage', icon: 'myjob', index: 2 },
    { title: 'Broadcast', pageName: 'TabsPage', tabComponent: 'BroadcastPage', icon: 'property', index: 4 },
    { title: 'Plans & Pricing', pageName: 'PlansPricingPage', icon: 'price' },
    { title: 'Shortlisted Profiles', pageName: 'ShortlistedPage', icon: 'shortlisted' },
    { title: 'Notifications', pageName:'NotificationPage', icon: 'notification'},
    { title: 'Support', pageName: 'HelpPage', icon: 'helps' },
    { title: 'Logout', pageName: 'LoginPage', icon: 'logout' }
  ];

  constructor(public alertCtrl: AlertController, public modalCtrl: ModalController, private localStorage: StorageProvider,
              public navCtrl: NavController, private widget: WidgetProvider, private soundPro: SoundProvider) {}

  ionViewDidLoad(): void {
    this.localStorage.getStorage('employeer_details').then((val: any) => {
      console.log('Details:',JSON.parse(val));
      this.Emp_details = JSON.parse(val);
    });
    this.rootPage = "TabsPage";
  }

  openPage(page: PageInterface, i): void {
      let params = {};
      if (page.pageName == 'LoginPage') {
        this.navCtrl.setRoot('LoginPage').then();
      } else {
        // The index is equal to the order of our tabs inside tabs.ts
        if (page.index) {
          params = { tabIndex: page.index };
        }
        // The active child nav is our Tabs Navigation
        if (this.nav.getActiveChildNav() && page.index != undefined) {
          this.nav.getActiveChildNav().select(page.index);
        } else {
          // Tabs are not active, so reset the root page
          // In this case: moving to or from SpecialPage
          this.nav.push(page.pageName, params).then();
        }
      }
  }

  touchSound(): void {
    this.soundPro.activeTouchSound = !this.soundPro.activeTouchSound;
  }

  showNotification(): void {
    this.widget.openNotification();
  }
}
