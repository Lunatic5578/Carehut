// Debug flag - set to false for production
const DEBUG_MODE = true;

// Initialize the map
async function initMap() {
  logDebug("initMap() started");

  try {
    verifyGeolocationSupport();

    const { latitude: lat, longitude: lng } = await getUserLocation();
    logDebug(`User location: ${lat}, ${lng}`);

    const map = createMap(lat, lng);
    const { Place, AdvancedMarkerElement } = await loadGoogleLibraries();

    const places = await fetchAdoptionCenters(Place, lat, lng);

    renderResults(places, map, AdvancedMarkerElement);
    placeUserMarker(map, lat, lng, AdvancedMarkerElement);

  } catch (error) {
    handleMapError(error);
  }
}

/* ------------------------------
   Helper Functions
------------------------------ */

function logDebug(message) {
  if (DEBUG_MODE) console.log(`[DEBUG] ${message}`);
}

function verifyGeolocationSupport() {
  if (!navigator.geolocation) {
    throw new Error("Geolocation not supported by your browser");
  }
  logDebug("Geolocation supported");
}

async function getUserLocation(timeout = 10000) {
  return new Promise((resolve, reject) => {
    const timer = setTimeout(() => reject(new Error("Geolocation request timed out")), timeout);

    navigator.geolocation.getCurrentPosition(
      (position) => {
        clearTimeout(timer);
        resolve(position.coords);
      },
      (error) => {
        clearTimeout(timer);
        reject(error);
      },
      { enableHighAccuracy: true }
    );
  });
}

function createMap(lat, lng) {
  const mapElement = document.getElementById("map");
  if (!mapElement) throw new Error("Map container not found");

  return new google.maps.Map(mapElement, {
    center: { lat, lng },
    zoom: 13,
    mapId: "PET_ADOPTION_MAP",
    streetViewControl: false,
    fullscreenControl: false
    // Removed styles to avoid conflict with mapId
  });
}

async function loadGoogleLibraries() {
  try {
    const [placesLib, markerLib] = await Promise.all([
      google.maps.importLibrary("places"),
      google.maps.importLibrary("marker")
    ]);
    return {
      Place: placesLib.Place,
      AdvancedMarkerElement: markerLib.AdvancedMarkerElement
    };
  } catch (error) {
    throw new Error("Failed to load required Google Maps libraries");
  }
}

async function fetchAdoptionCenters(Place, lat, lng) {
  const request = {
    textQuery: "animal support center",
    locationBias: { center: { lat, lng }, radius: 5000 },
    fields: [
      "displayName",
      "formattedAddress",
      "location",
      "rating",
      "internationalPhoneNumber"
    ],
    maxResultCount: 10
  };

  const { places } = await Place.searchByText(request);

  if (!places || places.length === 0) {
    throw new Error("No pet support centers found in your area. Try expanding your search.");
  }

  return places;
}

function renderResults(places, map, AdvancedMarkerElement) {
  const infoWindow = new google.maps.InfoWindow();
  const tableBody = document.querySelector("#table_body");
  tableBody.innerHTML = "";

  places.forEach(place => {
    if (place.location) {
      const marker = new AdvancedMarkerElement({
        map,
        position: place.location,
        title: place.displayName
      });

      marker.addListener("click", () => {
        infoWindow.setContent(buildInfoWindowContent(place));
        infoWindow.open(map, marker);
      });
    }
    tableBody.appendChild(createTableRow(place));
  });
}

function buildInfoWindowContent(place) {
  const mapLink = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(place.displayName + ' ' + place.formattedAddress)}`;
  return `
    <div class="map-info-window">
      <h3>${place.displayName}</h3>
      <p>${place.formattedAddress}</p>
      ${place.rating ? `<p><i class="fas fa-star"></i> ${place.rating}/5</p>` : ""}
      ${place.internationalPhoneNumber ? `<p><i class="fas fa-phone"></i> ${place.internationalPhoneNumber}</p>` : ""}
      <div class="links">
        <a href="${mapLink}" target="_blank">
          <i class="fas fa-map-marker-alt"></i> View on Map
        </a>
      </div>
    </div>
  `;
}

function createTableRow(place) {
  const mapLink = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(place.displayName + ' ' + place.formattedAddress)}`;
  const row = document.createElement("tr");
  row.innerHTML = `
    <td>${place.displayName}</td>
    <td>${place.formattedAddress}</td>
    <td>${place.rating ? `${place.rating}/5` : "Unrated"}</td>
    <td class="links">
      <a href="${mapLink}" target="_blank">
        <i class="fas fa-map-marked-alt"></i> Map
      </a>
    </td>
  `;
  return row;
}

function placeUserMarker(map, lat, lng, AdvancedMarkerElement) {
  const userPin = document.createElement("div");
  userPin.className = "user-location-pin";
  userPin.innerHTML = `<div class="pin-circle"></div><div class="pin-pulse"></div>`;

  new AdvancedMarkerElement({
    position: { lat, lng },
    map,
    title: "Your Location",
    content: userPin
  });
}

function handleMapError(error) {
  console.error("Map Error:", error);

  document.querySelector("#table_body").innerHTML = `
    <tr>
      <td colspan="4" class="error-message">
        <i class="fas fa-exclamation-triangle"></i> ${error.message}
      </td>
    </tr>
  `;

  const mapElement = document.getElementById("map");
  if (mapElement) {
    mapElement.style.display = "none";
  }
}

/* ------------------------------
   Init Trigger
------------------------------ */
window.initMap = initMap;
logDebug("support.js loaded");