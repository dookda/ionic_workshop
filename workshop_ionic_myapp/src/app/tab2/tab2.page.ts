import { Component } from '@angular/core';
import { DataService } from '../data.service';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss']
})
export class Tab2Page {

  public data: any;

  constructor(
    public dataService: DataService,
    public navCtrl: NavController
  ) {
  }

  ionViewDidEnter() {
    this.getData()
  }

  getData() {
    this.dataService.getData().then((res: any) => {
      this.data = res.features;
    })
  }

  gotoDetail(id: any) {
    console.log(id)
    this.navCtrl.navigateForward('/detail/' + id)
  }

}
