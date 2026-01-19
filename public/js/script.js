//=============permission==========
const enableNotificationsBtn = document.getElementById("enableNotifications");
if (enableNotificationsBtn) {
  enableNotificationsBtn.addEventListener("click", () => {
    if ("Notification" in window && Notification.permission === "default") {
      Notification.requestPermission().then(permission => {
        console.log("Notification permission:", permission);
      });
    }
  });
}
if ("Notification" in window && Notification.permission === "default") {
  Notification.requestPermission().then(permission => {
    console.log("Notification permission:", permission);
  });
}

// Only auto-run geolocation if not explicitly skipped (e.g., on visitor page)
if (!window.skipAutoLocation) {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(showMap, handleError, { enableHighAccuracy: true, timeout: 30000, maximumAge: 0 });
  } else {
    // alert("Cannot get location, not supported.");
    console.warn("Geolocation not supported or skipped.");
  }
}


let weatherMap = null;

function showMap(position) {
  const lat = position.coords.latitude;
  const lon = position.coords.longitude;

  const mapContainer = document.getElementById("weather-map");
  if (!mapContainer) return;

  // Clear existing map if it exists to make this function idempotent
  if (weatherMap) {
    weatherMap.off();
    weatherMap.remove();
    weatherMap = null;
  }

  weatherMap = L.map("weather-map").setView([lat, lon], 6);

  //==============openweather data======
  //==============openweather data======
  function fetchCurrentWeather(lat, lon) {
    const cacheKey = `weather_${lat.toFixed(2)}_${lon.toFixed(2)}`;
    const cacheTime = 10 * 60 * 1000; // 10 minutes

    // 1. Try Cache First
    const cached = localStorage.getItem(cacheKey);
    if (cached) {
      try {
        const { timestamp, data } = JSON.parse(cached);
        if (Date.now() - timestamp < cacheTime) {
          console.log("Using cached weather data");
          interpretWeather(data);
          return; // Skip fetch if cache is valid
        }
      } catch (e) { console.error("Cache parse error", e); }
    }

    // 2. Fetch Fresh if no cache
    const weatherInfo = document.getElementById("weather-info");
    if (weatherInfo && !cached) weatherInfo.innerHTML = "Loading weather data..."; // Only show loading if no cache

    fetch(`/api/weather?lat=${lat}&lon=${lon}`)
      .then(res => res.json())
      .then(data => {
        // Save to Cache
        localStorage.setItem(cacheKey, JSON.stringify({ timestamp: Date.now(), data: data }));
        interpretWeather(data);
      })
      .catch(err => {
        console.error("Weather API error:", err);
        // [OPTIMIZATION] Mobile Resilience: Don't wipe existing content if fetch fails!
        if (weatherInfo && !weatherInfo.innerHTML.includes("Temp:")) {
          weatherInfo.innerHTML = `<span style="color:red">Unable to load new data. (Offline?)</span>`;
        } else {
          // Toast/Silent fail if we already have data
          console.warn("Update failed, keeping cached data.");
        }
      });
  }

  fetchCurrentWeather(lat, lon);

  //===========refreshh
  setInterval(() => fetchCurrentWeather(lat, lon), 1800000); // 30 mins


  //=============map only==
  L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
    attribution: '&copy; OpenStreetMap contributors &copy; CARTO',
    subdomains: 'abcd',
    maxZoom: 20
  }).addTo(weatherMap);

  //===================map green==
  fetch('https://raw.githubusercontent.com/datasets/geo-countries/master/data/countries.geojson')
    .then(res => res.json())
    .then(data => {
      L.geoJSON(data, { style: { color: '#00FF00', weight: 1, fillOpacity: 0 } }).addTo(weatherMap);
    });

  //====================rainviewer cloud only====
  let cloudLayer;
  let cloudFrames = [];
  let cloudIndex = 0;

  if (typeof apiKey !== 'undefined') {
    L.tileLayer(`https://tile.openweathermap.org/map/clouds_new/{z}/{x}/{y}.png?appid=${apiKey}`, {
      attribution: "© OpenWeatherMap",
      opacity: 0.5
    }).addTo(weatherMap);
  } else {
    console.warn("API Key missing for cloud layer.");
  }


  //========================rainviewer layer
  fetch("https://api.rainviewer.com/public/weather-maps.json")
    .then(res => res.json())
    .then(data => {
      cloudFrames = data.radar.past.concat(data.radar.nowcast);
      playClouds();
    });

  function changeCloudFrame(i) {
    if (cloudLayer) weatherMap.removeLayer(cloudLayer);
    cloudLayer = L.tileLayer(
      `https://tilecache.rainviewer.com/v2/radar/${cloudFrames[i].path}/256/{z}/{x}/{y}/2/1_1.png`,
      { opacity: 0.6, attribution: "Clouds © RainViewer" }
    ).addTo(weatherMap);
  }

  function playClouds() {
    setInterval(() => {
      changeCloudFrame(cloudIndex);
      cloudIndex = (cloudIndex + 1) % cloudFrames.length;
    }, 500);
  }

  //=====================================================
  if (typeof apiKey !== 'undefined') {
    const precipitation = L.tileLayer(
      `https://tile.openweathermap.org/map/precipitation_new/{z}/{x}/{y}.png?appid=${apiKey}`,
      { opacity: 0.9 }
    ).addTo(weatherMap);

    const wind = L.tileLayer(
      `https://tile.openweathermap.org/map/wind_new/{z}/{x}/{y}.png?appid=${apiKey}`,
      { opacity: 0.6 }
    ).addTo(weatherMap);
  }

  //===============from rainviewer data===
  let radarLayer;
  let frameIndex = 0;
  let frames = [];

  fetch("https://api.rainviewer.com/public/weather-maps.json")
    .then(res => res.json())
    .then(data => {
      frames = data.radar.past.concat(data.radar.nowcast);
      playRadar();
    });

  function changeRadarFrame(i) {
    if (radarLayer) weatherMap.removeLayer(radarLayer);
    radarLayer = L.tileLayer(
      `https://tilecache.rainviewer.com/v2/radar/${frames[i].path}/256/{z}/{x}/{y}/2/1_1.png`,
      { opacity: 0.9, attribution: "Weather data © RainViewer" }
    ).addTo(weatherMap);
  }

  function playRadar() {
    setInterval(() => {
      changeRadarFrame(frameIndex);
      frameIndex = (frameIndex + 1) % frames.length;
    }, 500);
  }


  L.marker([lat, lon]).addTo(weatherMap).bindPopup("You are here").openPopup();
}


function formatDateTime(date) {
  let hours = date.getHours();
  let minutes = date.getMinutes().toString().padStart(2, "0");
  let ampm = hours >= 12 ? "PM" : "AM";

  hours = hours % 12;
  hours = hours ? hours : 12;

  const months = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  const month = months[date.getMonth()];
  const day = date.getDate();
  const year = date.getFullYear();

  return `${hours}:${minutes} ${ampm} ${month} ${day}, ${year}`;
}



let soundEnabled = false;

document.addEventListener("click", () => {
  //   alert('Weather alerts enabled!');
  soundEnabled = true;
});

function showWeatherNotification(title, body, withSound = false) {
  if ("Notification" in window && Notification.permission === "granted") {
    const options = {
      body: body,
      silent: !withSound
    };
    new Notification(title, options);

    if (withSound && soundEnabled) {
      const audio = new Audio("/sounds/alert-33762.mp3");
      audio.play();
    }
  }
}





//=====================
const updateInterval = 600000;
let lastUpdateTime = null;

function getShortDescription(description) {
  if (description.includes("rain")) return "Possible rain. Take an umbrella with you!";
  if (description.includes("clear")) return "Great day to be outside!";
  if (description.includes("cloud")) return "Cloudy skies, but no worries!";
  if (description.includes("storm")) return "Stay safe indoors!";
  if (description.includes("hot")) return "Don't forget to rehydrate, it's hot!";
  return "Have a nice day!";
}


//=================================================
function interpretWeather(data) {
  const temp = data.main.temp;
  const feelsLike = data.main.feels_like;
  const description = (data.weather?.[0]?.description || "").toLowerCase();
  const humidity = data.main.humidity;
  const windSpeed = data.wind.speed;
  const clouds = data.clouds.all;
  const shortDesc = getShortDescription(description);

  /* Hacker Green Theme */
  const hackerStyle = 'color: #00FF00; font-family: "Roboto", sans-serif; text-shadow: 0 0 5px rgba(0, 255, 0, 0.3);';

  let message = `<div style="${hackerStyle}">`;
  message += `<strong><i class="bi bi-thermometer-half"></i> Temp:</strong> ${temp}°C (Feels like ${feelsLike}°C)<br>`;
  message += `<strong><i class="bi bi-cloud"></i> Weather:</strong> ${description}<br>`;
  message += `<strong><i class="bi bi-droplet"></i> Humidity:</strong> ${humidity}%<br>`;
  message += `<strong><i class="bi bi-cloud-sun"></i> Cloud coverage:</strong> ${clouds}%<br>`;
  message += `<strong><i class="bi bi-wind"></i> Wind:</strong> ${windSpeed} m/s<br>`;
  message += `<em>Temp: ${temp}°C, ${shortDesc}</em><br>`;

  //======================
  if (description.includes("rain") && clouds > 70) {
    message += `<i class="bi bi-umbrella-fill" style="color:#00FF00;"></i> Possible heavy rain!<br>`;
  }
  if (windSpeed > 15) {
    message += `<i class="bi bi-wind" style="color:#00FF00;"></i> Strong winds!<br>`;
  }
  if (temp > 40) {
    message += `<i class="bi bi-thermometer-high" style="color:#00FF00;"></i> Extremely hot!<br>`;
  }
  if (temp < 5) {
    message += `<i class="bi bi-thermometer-low" style="color:#00FF00;"></i> Extremely cold!<br>`;
  }

  const now = new Date();
  const formattedTime = formatDateTime(now);
  message += `<br><strong>Updated:</strong> ${formattedTime}<br>`;
  message += `</div>`;

  document.getElementById("weather-info").innerHTML = message;


  // ===== Notifications =====
  let hazard = false;
  let hazardText = "";

  if (description.includes("rain") && clouds > 70) {
    hazard = true;
    hazardText += "Heavy rain possible. ";
  }
  if (windSpeed > 15) {
    hazard = true;
    hazardText += "Strong winds. ";
  }
  if (temp > 40) {
    hazard = true;
    hazardText += "Extreme heat. ";
  }
  if (temp < 5) {
    hazard = true;
    hazardText += "Extreme cold. ";
  }


  if (hazard) {
    showWeatherNotification("Weather Alert!", hazardText, true);
  } else {
    showWeatherNotification("Current Weather", `Temp: ${temp}°C, ${description}. ${shortDesc}`, false);
  }

}


function handleError(err) {
  console.warn(`ERROR(${err.code}): ${err.message}`);
}

// ==========================================
// SHARED DEPLOYMENT LOGIC (Admin Map & Table)
// ==========================================

let globalDeployMap = null;

// Helper: Haversine Distance
function calculateDistanceShared(lat1, lon1, lat2, lon2) {
  if (!lat1 || !lon1 || !lat2 || !lon2) return 99999;
  const R = 6371;
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLon = (lon2 - lon1) * (Math.PI / 180);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

window.openSharedDeployModal = async function ({ reportId, lat, lng, type, dateStr, locationStr }) {
  // Ensure lat/lng are floats
  const incLat = parseFloat(lat);
  const incLon = parseFloat(lng);

  // Fallback location string
  if (!locationStr) locationStr = `Lat: ${incLat.toFixed(5)}, Lon: ${incLon.toFixed(5)}`;

  Swal.fire({
    title: 'Scanning Area...',
    text: 'Searching for stations within 4km...',
    allowOutsideClick: false,
    didOpen: () => { Swal.showLoading() }
  });

  try {
    // Parallel Fetch
    const [respRes, stnRes] = await Promise.all([
      fetch('/api/responders'),
      fetch('/api/stations')
    ]);

    if (!respRes.ok || !stnRes.ok) throw new Error('Failed to fetch data');

    const responders = await respRes.json();
    const stations = await stnRes.json();

    // Process Stations
    const processedStations = stations.map(s => {
      let sLat = parseFloat(s.latitude);
      let sLng = parseFloat(s.longitude);
      let dist = 99999;
      if (!isNaN(sLat) && !isNaN(sLng)) {
        dist = calculateDistanceShared(sLat, sLng, incLat, incLon);
      }
      return { ...s, lat: sLat, lng: sLng, dist, responders: [] };
    }).sort((a, b) => a.dist - b.dist);

    // Map Responders
    responders.forEach(r => {
      const stn = processedStations.find(s => s.id === r.station_id);
      if (stn) {
        stn.responders.push(r);
      }
    });

    // Build Flat List
    let deployableResponders = [];
    processedStations.forEach(stn => {
      stn.responders.forEach(r => {
        r.distStation = stn.dist;
        r.station_name = stn.name;
        r.station_lat = stn.lat;
        r.station_lng = stn.lng;

        const currentLoad = stn.responders.filter(rx => rx.status === 'deployed').length;
        r.currentLoad = currentLoad;
        r.isStationFull = currentLoad >= 3;
        deployableResponders.push(r);
      });
    });

    // Safety Check 4km
    if (processedStations.length === 0 || processedStations[0].dist > 4.0) {
      Swal.fire({
        icon: 'warning',
        title: 'No Nearby Stations',
        html: `
                    <div class="text-center">
                        <p class="mb-2" style="font-size: 1.1rem; color: #fff;">No registered stations or responders found in your area.</p>
                        <p class="text-muted small mb-4">Nearest station is <strong>${processedStations.length > 0 ? processedStations[0].dist.toFixed(1) + 'km' : 'N/A'}</strong> away.</p>
                        <div style="border-top: 1px solid rgba(255, 170, 0, 0.3); margin: 20px 0;"></div>
                        <p class="mb-3 text-uppercase" style="letter-spacing: 1px; font-size: 0.9rem; color: #aaa;">Emergency Hotlines</p>
                        <div class="row g-3">
                            <div class="col-6"><div class="p-3" style="background: rgba(255, 255, 255, 0.05); border: 1px solid #ffaa00; border-radius: 8px;"><div class="mb-1 text-uppercase" style="font-weight: 600; font-size: 0.9rem;">PNP / Police</div><div style="font-size: 3.5rem; font-weight: 900; line-height: 1; color: #ffaa00;">117</div></div></div>
                            <div class="col-6"><div class="p-3" style="background: rgba(255, 255, 255, 0.05); border: 1px solid #ffaa00; border-radius: 8px;"><div class="mb-1 text-uppercase" style="font-weight: 600; font-size: 0.9rem;">BFP / Fire</div><div style="font-size: 3.5rem; font-weight: 900; line-height: 1; color: #ffaa00;">911</div></div></div>
                        </div>
                    </div>
                `,
        confirmButtonText: 'OK'
      });
      return;
    }

    // Build HTML
    const html = `
            <div id="globalDeployMap" style="height: 300px; width: 100%; margin-bottom: 15px; border-radius: 5px;"></div>
            <div class="d-flex justify-content-between mb-2">
                <small class="text-muted">Showing All Stations</small>
                <small class="text-muted">Sort: Nearest Station</small>
            </div>
            <div class="list-group text-start" style="max-height: 250px; overflow-y: auto;">
                ${deployableResponders.length > 0 ? deployableResponders.map(r => {
      const isDeployed = r.status === 'deployed';
      const isResponding = r.action === 'responding'; // New Check
      const isFull = r.isStationFull;
      const isLocKnown = (r.station_lat != null);

      let isDisabled = isDeployed || isResponding || isFull || !isLocKnown;
      let btnClass = isDisabled ? 'list-group-item-secondary' : 'list-group-item-action';
      let disabledAttr = isDisabled ? 'disabled style="opacity: 0.7; cursor: not-allowed;"' : "";
      let clickHandler = isDisabled ? "" : 'onclick="confirmDeployShared(' + r.id + ', ' + incLat + ', ' + incLon + ', \'' + reportId + '\', \'' + type + '\')"';

      let statusText = r.status.toUpperCase();
      let statusClass = isDeployed ? 'bg-secondary' : 'bg-success';

      if (isResponding) {
        statusText = 'RESPONDING';
        statusClass = 'bg-warning text-dark';
      }

      let statusBadge = `<span class="badge ${statusClass}">${statusText}</span>`;

      let note = '';
      const loadColor = r.currentLoad >= 3 ? 'text-danger' : 'text-success';
      note += `<br><small class="${loadColor}">Station Deploys Today: <strong>${r.currentLoad}/3</strong></small>`;

      if (isDeployed) note += '<br><small class="text-muted">Already Deployed</small>';
      else if (isResponding) note += '<br><small class="text-warning">Currently Responding</small>';
      else if (isFull) note += `<br><small class="text-danger"><i class="fa fa-ban"></i> Max Capacity Reached</small>`;

      // Calculate Live Distance
      let liveDist = 99999;
      if (r.latitude && r.longitude) {
        liveDist = calculateDistanceShared(parseFloat(r.latitude), parseFloat(r.longitude), incLat, incLon);
      }
      let liveDistStr = (liveDist < 9000) ? ` • Live: <strong>${liveDist.toFixed(2)} km</strong>` : '';

      return `
                            <button type="button" class="list-group-item ${btnClass}" ${disabledAttr} ${clickHandler}>
                                <div class="d-flex justify-content-between align-items-center">
                                    <div>
                                        <strong>${r.firstname} ${r.lastname}</strong>
                                        <br>
                                        <small class="text-muted">Station: ${r.station_name} • Base: ${r.distStation.toFixed(2)} km${liveDistStr}</small>
                                        ${note}
                                    </div>
                                    ${statusBadge}
                                </div>
                            </button>
                      `;
    }).join('') : '<div class="list-group-item">No active responders found.</div>'}
            </div>
        `;

    Swal.fire({
      title: 'Deploy Responder',
      html: html,
      width: '800px',
      showConfirmButton: false,
      showCloseButton: true,
      didOpen: () => {
        if (globalDeployMap) { globalDeployMap.off(); globalDeployMap.remove(); globalDeployMap = null; }

        globalDeployMap = L.map('globalDeployMap').setView([incLat, incLon], 13);
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(globalDeployMap);

        // Incident Marker
        let markerColor = '#dc3545';
        let iconClass = 'fa-exclamation-triangle';
        const typeLower = (type || 'General').toLowerCase();
        if (typeLower.includes('flood')) { markerColor = '#0dcaf0'; iconClass = 'fa-water'; }
        else if (typeLower.includes('earthquake')) { markerColor = '#fd7e14'; iconClass = 'fa-globe-americas'; }
        else if (typeLower.includes('landslide')) { markerColor = '#795548'; iconClass = 'fa-mountain'; }
        else if (typeLower.includes('fire')) { markerColor = '#dc3545'; iconClass = 'fa-fire'; }
        else if (typeLower.includes('accident')) { markerColor = '#6f42c1'; iconClass = 'fa-car-crash'; }

        const incidentIcon = L.divIcon({
          className: 'custom-div-icon',
          html: `<div style="background-color:${markerColor}; width: 32px; height: 32px; border-radius: 50%; border: 3px solid white; box-shadow: 0 2px 5px rgba(0,0,0,0.5); display: flex; align-items: center; justify-content: center; color: white; font-size: 14px;"><i class="fa ${iconClass}"></i></div>`,
          iconSize: [32, 32],
          iconAnchor: [16, 16],
          popupAnchor: [0, -20]
        });

        L.marker([incLat, incLon], { icon: incidentIcon }).addTo(globalDeployMap)
          .bindPopup(`<b>${type}</b><br>Time: ${dateStr}`).openPopup();

        // Stations
        processedStations.forEach(s => {
          if (!s.lat || !s.lng) return;
          const deployedCount = s.responders.filter(rx => rx.status === 'deployed').length;
          let color = deployedCount >= 3 ? 'red' : 'green';
          const icon = L.divIcon({
            className: 'custom-div-icon',
            html: `<div style="background-color:${color}; width: 12px; height: 12px; border-radius: 50%; border: 2px solid white; box-shadow: 0 0 4px black;"></div>`,
            iconSize: [12, 12]
          });
          L.marker([s.lat, s.lng], { icon: icon }).addTo(globalDeployMap);
        });

        // Smart Route (OSRM)
        if (processedStations.length > 0) {
          const candidates = processedStations.slice(0, 3).filter(s => s.lat && s.lng);
          const group = new L.featureGroup([L.marker([incLat, incLon])]);
          const fallbackStation = candidates[0];
          const fallbackLine = L.polyline([[fallbackStation.lat, fallbackStation.lng], [incLat, incLon]], { color: 'grey', weight: 2, dashArray: '5, 10' }).addTo(globalDeployMap);
          group.addLayer(L.marker([fallbackStation.lat, fallbackStation.lng]));
          globalDeployMap.fitBounds(group.getBounds(), { padding: [50, 50] });

          const routeRequests = candidates.map(s => {
            const url = `https://router.project-osrm.org/route/v1/driving/${s.lng},${s.lat};${incLon},${incLat}?overview=full&geometries=geojson`;
            return fetch(url).then(res => res.json()).then(data => (data.routes && data.routes.length > 0 ? { station: s, route: data.routes[0] } : null)).catch(e => null);
          });

          Promise.all(routeRequests).then(results => {
            const validRoutes = results.filter(r => r !== null);
            if (validRoutes.length > 0) {
              validRoutes.sort((a, b) => a.route.distance - b.route.distance);
              const best = validRoutes[0];
              globalDeployMap.removeLayer(fallbackLine);
              const routeLayer = L.geoJSON(best.route.geometry, { style: { color: 'blue', weight: 5, opacity: 0.8 } }).addTo(globalDeployMap);
              globalDeployMap.fitBounds(routeLayer.getBounds(), { padding: [50, 50] });
            }
          });
        }
      }
    });

  } catch (err) {
    console.error(err);
    Swal.fire('Error', 'Failed to load deployment data.', 'error');
  }
};

window.confirmDeployShared = function (responderId, lat, lng, incidentId, type) {
  fetch('/api/deploy', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ responderId, lat, lng, incidentId, type })
  })
    .then(res => res.json())
    .then(data => {
      if (data.success) {
        Swal.fire('Deployed!', 'Responder has been notified.', 'success')
          .then(() => location.reload());
      } else {
        Swal.fire('Error', data.message || 'Failed to deploy.', 'error');
      }
    })
    .catch(err => Swal.fire('Error', 'Network error deploying responder.', 'error'));
};