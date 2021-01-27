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
      z-index: 999
    }
    `
  ]
})
export class ZoomRangeComponent implements AfterViewInit {

  // El símbolo "!" le dice a TypeScript que confíe en nosotros
  // que haremos las validaciones respectivas.
  @ViewChild('mapa') divMapa!: ElementRef;

  // El símbolo "!" le dice a TypeScript que confíe en nosotros
  // que haremos las validaciones respectivas.
  mapa!: mapboxgl.Map;

  constructor() { }

  ngAfterViewInit(): void {

    this.mapa = new mapboxgl.Map({
      container: this.divMapa.nativeElement,
      style: 'mapbox://styles/mapbox/streets-v11',
      center: [ -0.7484136607062297, 38.25670354590649 ],
      zoom: 17
    });
  }

  zoomIn() {
    this.mapa.zoomIn();
  }

  zoomOut() {
    this.mapa.zoomOut();
  }

}
