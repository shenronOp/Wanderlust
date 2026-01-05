const [lng, lat] = listing.geometry.coordinates;
const map = L.map("map").setView([lat, lng], 13);

const isRetina = L.Browser.retina;
const baseUrl = "https://maps.geoapify.com/v1/tile/osm-bright/{z}/{x}/{y}.png?apiKey={apiKey}";
const retinaUrl = "https://maps.geoapify.com/v1/tile/osm-bright/{z}/{x}/{y}@2x.png?apiKey={apiKey}";

L.tileLayer(isRetina ? retinaUrl : baseUrl, {
  attribution: 'Powered by <a href="https://www.geoapify.com/" target="_blank">Geoapify</a> | © OpenStreetMap contributors',
  apiKey: myAPIKey,
  maxZoom: 20,
}).addTo(map);

const customIcon = L.divIcon({
  className: "custom-marker",
  html: '<div class="marker-pin"></div>',
  iconSize: [30, 30],
  iconAnchor: [15, 30],
});

L.marker([lat, lng], { icon: customIcon })
  .addTo(map)
  .bindTooltip(`
    <div class="map-tooltip">
      <div class="tooltip-title">${listing.title}</div>
      <div class="tooltip-location">
        <i class="fa-solid fa-location-dot"></i> ${listing.location}, ${listing.country}
      </div>
    </div>
  `, {
    direction: "top",
    offset: [0, -20],
    opacity: 1
  });
