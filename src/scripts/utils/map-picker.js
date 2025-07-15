import L from 'leaflet';
import CONFIG from './config';

class MapPicker {
  static init(mapId, onLocationSelect) {
    if (!document.getElementById(mapId)) return;
    const map = L.map(mapId).setView([-2.5489, 118.0149], 5);
    let marker;

    const streetLayer = L.tileLayer(`https://api.maptiler.com/maps/streets-v2/{z}/{x}/{y}.png?key=${CONFIG.MAP_API_KEY}`, {
      attribution: '<a href="https://www.maptiler.com/copyright/" target="_blank">&copy; MapTiler</a>',
    });
    const satelliteLayer = L.tileLayer(`https://api.maptiler.com/maps/satellite/{z}/{x}/{y}.jpg?key=${CONFIG.MAP_API_KEY}`, {
      attribution: '<a href="https://www.maptiler.com/copyright/" target="_blank">&copy; MapTiler</a>',
    });

    streetLayer.addTo(map);

    const baseMaps = { "Street": streetLayer, "Satellite": satelliteLayer };
    L.control.layers(baseMaps).addTo(map);

    map.on('click', (e) => {
      const { lat, lng } = e.latlng;
      if (marker) {
        marker.setLatLng(e.latlng);
      } else {
        marker = L.marker(e.latlng).addTo(map);
      }
      onLocationSelect(lat, lng);
    });
  }
}

export default MapPicker;