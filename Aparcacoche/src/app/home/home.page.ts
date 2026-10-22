import { Component, OnInit } from '@angular/core';
import { IonHeader, IonToolbar, IonTitle, IonContent } from '@ionic/angular/standalone';
import * as L from 'leaflet';
import { Geolocation } from '@capacitor/geolocation';


@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  standalone: true,
  styleUrls: ['home.page.scss'],
  imports: [IonHeader, IonToolbar, IonTitle, IonContent]
})
export class HomePage implements OnInit {
  constructor() {}

  private map!: L.Map;

  ngOnInit() {

  }

  initMap(){
    this.map = L.map('map').setView([39.4739, -6.3712], 15);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(this.map);
    setTimeout(() => {
        this.map?.invalidateSize();
      },500);
  }

  ionViewDidEnter() {
    this.initMap(); 
  }

  async aparcaCoche(){
    const position = await Geolocation.getCurrentPosition();
    const {latitude, longitude} = position.coords;

    this.map.setView([latitude, longitude], 15);

    const carIcon = L.divIcon({ html: '🛻', className: 'car-marker' });
    L.marker([latitude, longitude], { icon: carIcon }).addTo(this.map);
  }

  async sitiosMap(){
    const policeIcon = L.divIcon({ html: '🚓', className: 'police-marker' });
    L.marker([39.455812317783256, -6.378289910982168], { icon: policeIcon }).addTo(this.map);
    L.marker([39.47797027838029, -6.352425368765524], { icon: policeIcon }).addTo(this.map);

    const hospitalIcon = L.divIcon({ html: '🏥', className: 'hospital-marker' });
    L.marker([39.46880015428868, -6.36843438614351], { icon: hospitalIcon }).addTo(this.map);
    L.marker([39.47672978817181, -6.329392503379331], { icon: hospitalIcon }).addTo(this.map);
  }
}
