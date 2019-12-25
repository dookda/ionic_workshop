import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DataService } from '../data.service';

@Component({
  selector: 'app-detail',
  templateUrl: './detail.page.html',
  styleUrls: ['./detail.page.scss'],
})
export class DetailPage implements OnInit {

  public id: any;
  public data: any;

  public placename: any;
  public placedesc: any;
  public lat: any;
  public lng: any;
  public img: any;

  public photo = false;

  constructor(
    public route: ActivatedRoute,
    public dataService: DataService
  ) {
  }

  ngOnInit() {


  }

  ionViewDidEnter() {
    this.id = this.route.snapshot.paramMap.get('id');

    this.dataService.getOne(this.id).then((res: any) => {
      this.data = res.features[0].properties;
      this.placename = this.data.placename;
      this.placedesc = this.data.placedesc;

      console.log(this.img)

      if (this.img === 'undefined') {
        this.photo = false;
      } else {
        this.photo = true;
        let base64Image = 'data:image/jpeg;base64,' + this.data.img;
        this.img = base64Image;
      }
      //console.log(this.img)
    })
  }



}
