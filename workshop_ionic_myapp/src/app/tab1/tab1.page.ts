import { Component } from '@angular/core';
import { Map, tileLayer, layerGroup, marker, control, LatLng } from 'leaflet';
import { Geolocation } from '@ionic-native/geolocation/ngx';
import { DataService } from '../data.service';
import { Camera, CameraOptions } from '@ionic-native/camera/ngx';
@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss']
})
export class Tab1Page {

  public map: Map;
  public dat: Data = {};
  public date: String = new Date().toISOString();
  public latlng: LatLng;
  public lyrGroup: any;
  public latlngTxt: string;

  public photo = false;
  public capturedSnapURL: string;
  public img: any;
  public cameraOptions: CameraOptions = {
    quality: 20,
    destinationType: this.camera.DestinationType.DATA_URL,
    encodingType: this.camera.EncodingType.JPEG,
    mediaType: this.camera.MediaType.PICTURE
  }

  constructor(
    private geolocation: Geolocation,
    public dataService: DataService,
    public camera: Camera
  ) {
    this.dat.placedesc = 'agriculture';
  }

  ionViewDidEnter() {
    this.getLocation();

    if (!this.map) {
      this.loadMap();
    }
  }

  loadMap() {
    this.map = new Map("map").setView([15.660878, 101.081535], 5);

    const roads = tileLayer('http://{s}.google.com/vt/lyrs=r&x={x}&y={y}&z={z}', {
      maxZoom: 20,
      subdomains: ['mt0', 'mt1', 'mt2', 'mt3']
    })

    const satellite = tileLayer('http://{s}.google.com/vt/lyrs=s&x={x}&y={y}&z={z}', {
      maxZoom: 20,
      subdomains: ['mt0', 'mt1', 'mt2', 'mt3']
    })

    const hybrid = tileLayer('http://{s}.google.com/vt/lyrs=y&x={x}&y={y}&z={z}', {
      maxZoom: 20,
      subdomains: ['mt0', 'mt1', 'mt2', 'mt3']
    })

    const terrain = tileLayer('http://{s}.google.com/vt/lyrs=t,m&x={x}&y={y}&z={z}', {
      maxZoom: 20,
      subdomains: ['mt0', 'mt1', 'mt2', 'mt3']
    })

    const amp = tileLayer.wms('http://119.59.125.189/mapservice/gis/wms?', {
      layers: 'gis:prov_thailand',
      format: 'image/png',
      transparent: true,
      zIndex: 5,
    });

    this.lyrGroup = layerGroup();

    const baseLayer = {
      'แผนที่ถนน': roads.addTo(this.map),
      'แผนที่ภาพจาดดาวเทียม': satellite,
      'แผนที่ผสม': hybrid,
      'แผนที่ลักษณะภูมิประเทศ': terrain,
    }
    const overlay = {
      'ขอบเขตอำเภอ': amp.addTo(this.map),
      'marker': this.lyrGroup.addTo(this.map)
    }

    control.layers(baseLayer, overlay).addTo(this.map)
  }

  getLocation() {
    this.geolocation.getCurrentPosition().then((res: any) => {
      this.latlng = new LatLng(res.coords.latitude, res.coords.longitude)
      console.log(this.latlng)
      this.latlngTxt = 'ละติจูด: ' + this.latlng.lat + ' ลองจิจูด: ' + this.latlng.lng
      const a = marker(this.latlng).addTo(this.lyrGroup);
    })
  }

  saveData() {
    this.dat.date = this.date;
    this.dat.lat = this.latlng.lat;
    this.dat.lng = this.latlng.lng;
    this.dat.img = this.img;
    console.log(this.dat)
    this.dataService.insertData(this.dat).then((res: any) => {
      console.log('ok');
      this.dat.placename = '';
      this.photo = false;
    })
  }

  getPhoto() {
    this.camera.getPicture(this.cameraOptions).then((imageData) => {
      let base64Image = 'data:image/jpeg;base64,' + imageData;
      this.img = imageData;
      this.capturedSnapURL = base64Image;
      this.photo = true;
    }, (err) => {
      console.log(err);
    });
  }

}

export interface Data {
  placename?: any;
  placedesc?: any;
  date?: any;
  lat?: number;
  lng?: number;
  img?: any;
}
