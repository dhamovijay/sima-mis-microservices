import { Component, AfterViewInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import * as L from 'leaflet';
import { HttpClient } from '@angular/common/http';

interface VesselInfo {
  mmsi: number;
  name: string;
  lat: number;
  lng: number;
  sog: number;
  cog: number;
  heading: number;
  status: number;
  lastUpdate: string;
  marker?: L.Marker;
  trail: L.LatLng[];
  trailLine?: L.Polyline;
}

const NAV_STATUS: Record<number, string> = {
  0: 'Under way using engine',
  1: 'At anchor',
  2: 'Not under command',
  3: 'Restricted manoeuvrability',
  4: 'Constrained by draught',
  5: 'Moored',
  6: 'Aground',
  7: 'Engaged in fishing',
  8: 'Under way sailing',
  14: 'AIS-SART',
  15: 'Not defined',
};

const STATUS_COLOR: Record<number, string> = {
  0: '#22c55e', // underway - green
  1: '#f59e0b', // anchor - orange
  5: '#3b82f6', // moored - blue
};

function getStatusColor(status: number): string {
  return STATUS_COLOR[status] || '#22c55e';
}

function createShipIcon(heading: number, status: number): L.DivIcon {
  const color = getStatusColor(status);
  const rotation = heading === 511 ? 0 : heading;
  return L.divIcon({
    className: 'ship-icon-wrapper',
    html: `<div class="ship-icon" style="transform: rotate(${rotation}deg);">
      <svg width="24" height="24" viewBox="0 0 24 24" fill="${color}" xmlns="http://www.w3.org/2000/svg">
        <path d="M12 2 L8 10 L4 22 L12 18 L20 22 L16 10 Z" stroke="#fff" stroke-width="1" fill="${color}"/>
      </svg>
    </div>`,
    iconSize: [24, 24],
    iconAnchor: [12, 12],
    popupAnchor: [0, -14],
  });
}

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css',
})
export class Dashboard implements AfterViewInit, OnDestroy {
  private map!: L.Map;
  private ws: WebSocket | null = null;
  private ro: ResizeObserver | null = null;
  vessels: Map<number, VesselInfo> = new Map();
  isConnected = false;
  isPaused = false;
  vesselCount = 0;
  messageCount = 0;

  // Bounding box: Middle East / Indian Ocean / SE Asia shipping lanes
  private boundingBoxes: number[][][] = [
    [[-5, 30], [35, 130]], // Arabian Sea, Indian Ocean, SE Asia
  ];

  private readonly API_KEY = 'c2a6f3e80fb1d7548e01b4895a2ae8d3acc046f7';
  private readonly MAX_TRAIL = 20;

  constructor(private http: HttpClient) {}

  ngAfterViewInit(): void {
    this.initMap();
    this.loadGeoJson();
    this.connectAIS();

    // Resize map when container resizes (zoom in/out, sidebar toggle)
    const mapEl = document.getElementById('map');
    if (mapEl) {
      this.ro = new ResizeObserver(() => {
        requestAnimationFrame(() => this.map?.invalidateSize());
      });
      this.ro.observe(mapEl);
    }
  }

  ngOnDestroy(): void {
    this.disconnectAIS();
    this.ro?.disconnect();
  }

  private initMap(): void {
    this.map = L.map('map', {
      center: [15, 65],
      zoom: 4,
    });

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 18,
      minZoom: 3,
      attribution: '&copy; OpenStreetMap contributors',
    }).addTo(this.map);
  }

  private loadGeoJson(): void {
    this.http.get('assets/attributed_ports.geojson', { responseType: 'json' }).subscribe({
      next: (data: any) => {
        L.geoJSON(data, {
          pointToLayer: (feature, latlng) =>
            L.circleMarker(latlng, {
              radius: 4,
              fillColor: '#00b4db',
              color: '#fff',
              weight: 1,
              fillOpacity: 0.7,
            }),
          onEachFeature: (feature, layer) => {
            const name = feature.properties?.Name || 'Unknown';
            const code = feature.properties?.LOCODE || '';
            layer.bindPopup(`<b>${name} - ${code}</b>`);
          },
        }).addTo(this.map);
      },
    });
  }

  connectAIS(): void {
    if (this.ws) return;

    this.ws = new WebSocket('wss://stream.aisstream.io/v0/stream');

    this.ws.onopen = () => {
      this.isConnected = true;
      const subscription = {
        APIKey: this.API_KEY,
        BoundingBoxes: this.boundingBoxes,
        FilterMessageTypes: ['PositionReport'],
      };
      this.ws!.send(JSON.stringify(subscription));
    };

    this.ws.onmessage = (event) => {
      if (this.isPaused) return;
      try {
        const msg = JSON.parse(event.data);
        if (msg.MessageType === 'PositionReport') {
          this.processPosition(msg);
        }
      } catch (e) {
        // ignore parse errors
      }
    };

    this.ws.onclose = () => {
      this.isConnected = false;
      this.ws = null;
      // Auto-reconnect after 5 seconds
      setTimeout(() => {
        if (!this.ws) this.connectAIS();
      }, 5000);
    };

    this.ws.onerror = () => {
      this.isConnected = false;
    };
  }

  disconnectAIS(): void {
    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }
    this.isConnected = false;
  }

  private processPosition(msg: any): void {
    const meta = msg.Metadata;
    const pos = msg.Message?.PositionReport;
    if (!meta || !pos) return;

    const mmsi = meta.MMSI;
    const lat = pos.Latitude;
    const lng = pos.Longitude;

    if (lat === 0 && lng === 0) return; // invalid position

    this.messageCount++;
    const existing = this.vessels.get(mmsi);

    if (existing) {
      // Update existing vessel
      existing.lat = lat;
      existing.lng = lng;
      existing.sog = pos.Sog || 0;
      existing.cog = pos.Cog || 0;
      existing.heading = pos.TrueHeading || 0;
      existing.status = pos.NavigationalStatus ?? 15;
      existing.name = meta.ShipName?.trim() || existing.name;
      existing.lastUpdate = new Date().toLocaleTimeString();

      // Update marker position and icon
      existing.marker?.setLatLng([lat, lng]);
      existing.marker?.setIcon(createShipIcon(existing.heading, existing.status));

      // Update trail
      existing.trail.push(L.latLng(lat, lng));
      if (existing.trail.length > this.MAX_TRAIL) {
        existing.trail.shift();
      }
      if (existing.trailLine) {
        existing.trailLine.setLatLngs(existing.trail);
      }

      // Update popup content
      existing.marker?.setPopupContent(this.buildPopup(existing));
    } else {
      // New vessel
      const vessel: VesselInfo = {
        mmsi,
        name: meta.ShipName?.trim() || `MMSI: ${mmsi}`,
        lat,
        lng,
        sog: pos.Sog || 0,
        cog: pos.Cog || 0,
        heading: pos.TrueHeading || 0,
        status: pos.NavigationalStatus ?? 15,
        lastUpdate: new Date().toLocaleTimeString(),
        trail: [L.latLng(lat, lng)],
      };

      const marker = L.marker([lat, lng], {
        icon: createShipIcon(vessel.heading, vessel.status),
      }).addTo(this.map);

      marker.bindPopup(this.buildPopup(vessel));
      vessel.marker = marker;

      const trailLine = L.polyline(vessel.trail, {
        color: getStatusColor(vessel.status),
        weight: 2,
        opacity: 0.4,
        dashArray: '4 6',
      }).addTo(this.map);
      vessel.trailLine = trailLine;

      this.vessels.set(mmsi, vessel);
      this.vesselCount = this.vessels.size;
    }
  }

  private buildPopup(v: VesselInfo): string {
    const statusText = NAV_STATUS[v.status] || 'Unknown';
    const color = getStatusColor(v.status);
    return `
      <div class="vessel-popup">
        <div style="font-weight:bold;font-size:14px;margin-bottom:4px;">${v.name}</div>
        <table style="font-size:12px;line-height:1.6;">
          <tr><td style="color:#888;">MMSI</td><td style="padding-left:8px;">${v.mmsi}</td></tr>
          <tr><td style="color:#888;">Status</td><td style="padding-left:8px;"><span style="color:${color};">${statusText}</span></td></tr>
          <tr><td style="color:#888;">Speed</td><td style="padding-left:8px;">${v.sog.toFixed(1)} knots</td></tr>
          <tr><td style="color:#888;">Course</td><td style="padding-left:8px;">${v.cog.toFixed(1)}&deg;</td></tr>
          <tr><td style="color:#888;">Heading</td><td style="padding-left:8px;">${v.heading}&deg;</td></tr>
          <tr><td style="color:#888;">Position</td><td style="padding-left:8px;">${v.lat.toFixed(4)}, ${v.lng.toFixed(4)}</td></tr>
          <tr><td style="color:#888;">Updated</td><td style="padding-left:8px;">${v.lastUpdate}</td></tr>
        </table>
      </div>`;
  }

  togglePause(): void {
    this.isPaused = !this.isPaused;
  }

  focusVessel(mmsi: number): void {
    const v = this.vessels.get(mmsi);
    if (v) {
      this.map.setView([v.lat, v.lng], 8);
      v.marker?.openPopup();
    }
  }

  get vesselList(): VesselInfo[] {
    return Array.from(this.vessels.values())
      .sort((a, b) => a.name.localeCompare(b.name))
      .slice(0, 50);
  }
}
