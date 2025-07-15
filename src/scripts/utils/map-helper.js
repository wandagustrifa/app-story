import L from 'leaflet';
import CONFIG from './config';

class MapHelper {
  static init(mapId, markersData = []) {
    if (!document.getElementById(mapId)) return;
    const map = L.map(mapId).setView([-2.5489, 118.0149], 5);

    const streetLayer = L.tileLayer(`https://api.maptiler.com/maps/streets-v2/{z}/{x}/{y}.png?key=${CONFIG.MAP_API_KEY}`, { attribution: '<a href="https://www.maptiler.com/copyright/" target="_blank">&copy; MapTiler</a>' });
    const satelliteLayer = L.tileLayer(`https://api.maptiler.com/maps/satellite/{z}/{x}/{y}.jpg?key=${CONFIG.MAP_API_KEY}`, { attribution: '<a href="https://www.maptiler.com/copyright/" target="_blank">&copy; MapTiler</a>' });
    
    streetLayer.addTo(map);

    const baseMaps = { "Street": streetLayer, "Satellite": satelliteLayer };
    L.control.layers(baseMaps).addTo(map);

    markersData.forEach(data => {
      if (data.lat && data.lon) {
        L.marker([data.lat, data.lon]).addTo(map).bindPopup(`<b>${data.name}</b><br>${data.description.substring(0, 30)}...`);
      }
    });
  }
}
export default MapHelper;