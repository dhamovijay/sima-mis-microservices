import { Component, AfterViewInit } from '@angular/core';
import * as L from 'leaflet';
import { HttpClient } from '@angular/common/http';
import { HttpClientModule } from '@angular/common/http';



@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [HttpClientModule],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css'
})
export class Dashboard implements AfterViewInit {
  private map: any;
  
  constructor(private http: HttpClient) { }

 private initMap(): void {
    this.map = L.map('map', {
      center: [20, 0], // centered on world
      zoom: 3
    });

    const tiles = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 18,
      minZoom: 3,
      attribution: '© OpenStreetMap contributors'
    });

    tiles.addTo(this.map);
  }


  private loadGeoJson(): void {
  const url = 'assets/attributed_ports.geojson';

  this.http.get(url, { responseType: 'json' }).subscribe({
    next: (geojsonData: any) => {
      try {
        const geoJsonLayer = L.geoJSON(geojsonData, {
          pointToLayer: (feature, latlng) => L.circleMarker(latlng, { radius: 4 }),
          onEachFeature: (feature, layer) => {
            const name = feature.properties?.Name || feature.properties?.name || 'Unknown';
            const code = feature.properties?.LOCODE || feature.properties?.LOCODE || 'Unknown';
            layer.bindPopup(`<b>${name +" - " + code }</b>`);
          }
        });
        geoJsonLayer.addTo(this.map);
        console.log('GeoJSON loaded, features:', (geojsonData.features || []).length);
      } catch (err) {
        console.error('Invalid GeoJSON structure:', err);
      }
    },
    error: (err) => {
      console.error('Failed loading GeoJSON from', url, err);
      // helpful message
      if (err.status === 404) {
        console.error('404 — file not found. Verify src/assets/attributed_ports.geojson exists and angular.json includes assets folder.');
      } else {
        console.error('HTTP error', err);
      }
    }
  });
}


   ngAfterViewInit(): void {
    this.initMap();
    this.loadGeoJson();
  }
}
