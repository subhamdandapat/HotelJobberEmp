import { Component } from '@angular/core';
import {  IonicPage, NavController, NavParams, ViewController } from 'ionic-angular';

@IonicPage()
@Component({
  selector: 'page-search',
  templateUrl: 'search.html',
})
export class SearchPage {
  posts: any = [];
  list: any;
  items:any = [];
  selectedItem:any;
  constructor(public navCtrl: NavController, public navParams: NavParams, private view: ViewController) {console.log('Search----------<<<>>>>');}

  ionViewWillEnter() {
    console.log("search data log-------------->>>")
    this.list = this.navParams.get('data');
    for (let data1 of this.list) {
      this.posts.push(data1.Name);
      this.items = this.posts;
      this.initializeItems();
    }
  }

  initializeItems() {
    this.items = this.posts;
  }

  getItems(ev: any) {
    // Reset items back to all of the items
    this.initializeItems();
    // set val to the value of the searchbar
    let val = ev.target.value;
    // if the value is an empty string don't filter the items
    if (val && val.trim() != '') {
      this.items = this.items.filter((itemsearch) => {
        return (itemsearch.toLowerCase().indexOf(val.toLowerCase()) > -1);
      })
    }
  }

  search(itemsearch): void {
    this.selectedItem = itemsearch;
    this.view.dismiss(this.selectedItem).then();
  }

  closeModal(): void {
    console.log("close modal---------->")
    this.view.dismiss().then();
  }
}
