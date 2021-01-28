import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';
import * as mapboxgl from 'mapbox-gl';

interface MarcadorColor {
  color: string;
  marker?: mapboxgl.Marker;
  centro?: [number, number];
}

@Component({
  selector: 'app-marcadores',
  templateUrl: './marcadores.component.html',
  styles: [
    `
      .mapa-container {
        height: 100%;
        width: 100%;
      }

      .list-group {
        position: fixed;
        right: 20px;
        top: 20px;
        z-index: 99;
      }

      li {
        cursor: pointer;
      }
    `,
  ],
})
export class MarcadoresComponent implements AfterViewInit {
  // El símbolo "!" le dice a TypeScript que confíe en nosotros
  // que haremos las validaciones respectivas.
  @ViewChild('mapa') divMapa!: ElementRef;
  mapa!: mapboxgl.Map;
  zoomLevel: number = 15;
  center: [number, number] = [-0.7484136607062297, 38.25670354590649];

  // Arreglo de marcadores
  marcadores: MarcadorColor[] = [];

  constructor() {}

  ngAfterViewInit(): void {
    this.mapa = new mapboxgl.Map({
      container: this.divMapa.nativeElement,
      style: 'mapbox://styles/mapbox/streets-v11',
      center: this.center,
      zoom: this.zoomLevel,
    });

    this.leerLocalStorage();

    // const markerHtml: HTMLElement = document.createElement('div');
    // markerHtml.innerHTML = 'Hola Mundo';

    // new mapboxgl.Marker(
    // //   {
    // //   element: markerHtml
    // // }
    // )
    //   .setLngLat(this.center)
    //   .addTo(this.mapa);
  }

  agregarMarcador(): void {
    const color = '#xxxxxx'.replace(/x/g, (y) =>
      ((Math.random() * 16) | 0).toString(16)
    );

    const nuevoMarcador = new mapboxgl.Marker({
      draggable: true,
      color,
    })
      .setLngLat(this.center)
      .addTo(this.mapa);

    this.marcadores.push({ color, marker: nuevoMarcador });

    this.guardarMarcadoresLocalStorage();

    nuevoMarcador.on('dragend', () => {
      this.guardarMarcadoresLocalStorage();
    });
  }

  irMarcador(marker: mapboxgl.Marker): void {
    this.mapa.flyTo({
      center: marker.getLngLat(),
    });
  }

  guardarMarcadoresLocalStorage() {
    const lngLatArr: MarcadorColor[] = [];

    this.marcadores.forEach((m) => {
      const color = m.color;
      // Ponemos el símbolo ! porque aunque en la Interfaz está
      // declarado como opcional, en este punto sabemos que siempre
      // existirá la propiedad marker
      const { lng, lat } = m.marker!.getLngLat();
      lngLatArr.push({
        color,
        centro: [lng, lat],
      });
    });

    localStorage.setItem('marcadores', JSON.stringify(lngLatArr));
  }

  leerLocalStorage(): void {
    if (!localStorage.getItem('marcadores')) {
      return;
    }
    // Notar la presencia del ! que le indica que existe siempre
    const lngLatArr: MarcadorColor[] = JSON.parse(
      localStorage.getItem('marcadores')!
    );

    lngLatArr.forEach((m) => {
      const newMarker = new mapboxgl.Marker({
        color: m.color,
        draggable: true,
      })
        .setLngLat(m.centro!)
        .addTo(this.mapa);
      this.marcadores.push({ color: m.color, marker: newMarker });

      newMarker.on('dragend', () => {
        this.guardarMarcadoresLocalStorage();
      });
    });
  }

  borrarMarcador(i: number) {
    // Borramos del mapa
    this.marcadores[i].marker?.remove();
    // Borramos de la lista
    this.marcadores.splice(i, 1);
    // Borramos/actualizamos el localStorage
    this.guardarMarcadoresLocalStorage();
  }
}
