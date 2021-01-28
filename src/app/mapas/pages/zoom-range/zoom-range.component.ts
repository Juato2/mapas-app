import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';
import * as mapboxgl from 'mapbox-gl';

@Component({
  selector: 'app-zoom-range',
  templateUrl: './zoom-range.component.html',
  styles: [
    `
    .mapa-container {
      height: 100%;
      width: 100%;
    }

    .row {
      background-color: white;
      border-radius: 5px;
      bottom: 50px;
      left: 50px;
      padding: 10px;
      position: fixed;
      width: 400px;
      z-index: 999
    }
    `
  ]
})
export class ZoomRangeComponent implements AfterViewInit {

  // El símbolo "!" le dice a TypeScript que confíe en nosotros
  // que haremos las validaciones respectivas.
  @ViewChild('mapa') divMapa!: ElementRef;
  mapa!: mapboxgl.Map;
  zoomLevel: number = 10;

  constructor() { }

  ngAfterViewInit(): void {

    this.mapa = new mapboxgl.Map({
      container: this.divMapa.nativeElement,
      style: 'mapbox://styles/mapbox/streets-v11',
      center: [ -0.7484136607062297, 38.25670354590649 ],
      zoom: this.zoomLevel
    });

    this.mapa.on('zoom', () => this.zoomLevel = this.mapa.getZoom())
    this.mapa.on('zoomend', () =>
      {
        if(this.mapa.getZoom() > 18) {
          // this.mapa.setZoom(18);
          this.mapa.zoomTo(18);
        }
      }
    )
  }

  zoomOut() {
    this.mapa.zoomOut();
  }

  zoomIn() {
    this.mapa.zoomIn();
  }

  zoomCambio(valor: string):void {
    this.mapa.zoomTo(Number(valor));
  }

}
