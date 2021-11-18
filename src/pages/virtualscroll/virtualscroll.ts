import { Component } from '@angular/core';
import { IonicPage, ModalController, NavController, NavParams, ViewController } from 'ionic-angular';

/**
 * Generated class for the VirtualscrollPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-virtualscroll',
  templateUrl: 'virtualscroll.html',
})
export class VirtualscrollPage {
sublists:any =[];
  constructor(public navCtrl: NavController, public navParams: NavParams,public modalCtrl: ModalController,public viewCtrl: ViewController) {
    this.sublists =navParams.get('info').sub_cat;
    console.log(this.sublists)

  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad VirtualscrollPage');
  }
selected(id){
  this.viewCtrl.dismiss(id)
}
}
