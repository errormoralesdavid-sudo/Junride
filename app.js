// ==============================================================
// PARTE 1 DE 2: NÚCLEO, SEGURIDAD, AUTENTICACIÓN Y GPS EXACTO
// ==============================================================

// REGISTRO DEL SERVICE WORKER PWA
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('./sw.js').catch((err) => console.log('SW error:', err));
  });
}

// SEGURIDAD: SANITIZACIÓN CONTRA INYECCIÓN DE CÓDIGO (XSS)
function escapeHTML(str) {
  if (str === null || str === undefined) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

function cleanInputText(str, maxLen = 100) {
  if (!str) return '';
  return String(str).replace(/[<>]/g, '').trim().slice(0, maxLen);
}

// CAPTURA DEL EVENTO DE INSTALACIÓN PWA
let deferredInstallPrompt = null;
window.addEventListener('beforeinstallprompt', (e) => {
  e.preventDefault();
  deferredInstallPrompt = e;
  const installBox = document.getElementById('welcome-install-pwa-box');
  if (installBox) installBox.style.display = 'flex';
});

function triggerPwaInstallPrompt() {
  triggerHaptic(40);
  if (deferredInstallPrompt) {
    deferredInstallPrompt.prompt();
    deferredInstallPrompt.userChoice.then((choiceResult) => {
      if (choiceResult.outcome === 'accepted') {
        showNeonToast('success', '¡Gracias por instalar JunRide!');
        const installBox = document.getElementById('welcome-install-pwa-box');
        if (installBox) installBox.style.display = 'none';
      }
      deferredInstallPrompt = null;
    });
  } else {
    showNeonToast('info', 'Toca los 3 puntos de tu navegador y selecciona "Instalar aplicación".');
  }
}

// SISTEMA TOAST NEÓN SEGURO
function showNeonToast(type, message, duration = 3500) {
  const container = document.getElementById('toast-container');
  if (!container) return;

  const toast = document.createElement('div');
  toast.className = `neon-toast ${type === 'error' ? 'toast-error' : type === 'warning' ? 'toast-warning' : ''}`;
  
  const icon = type === 'error' ? '❌' : type === 'warning' ? '⚠️' : '✅';
  toast.innerHTML = `
    <span class="toast-icon">${icon}</span>
    <span class="toast-body">${escapeHTML(message)}</span>
  `;

  container.appendChild(toast);
  setTimeout(() => toast.classList.add('show'), 20);

  setTimeout(() => {
    toast.classList.remove('show');
    setTimeout(() => toast.remove(), 350);
  }, duration);
}

// RESPUESTA HÁPTICA NATIVA
function triggerHaptic(duration = 45) {
  if (navigator.vibrate) {
    try { navigator.vibrate(duration); } catch(e) {}
  }
}

// VISOR DE FOTOS AMPLIADAS (LIGHTBOX NEÓN)
function openImageLightbox(src, title = 'Foto Ampliada') {
  triggerHaptic(30);
  const modal = document.getElementById('modal-image-lightbox');
  const targetImg = document.getElementById('lightbox-target-img');
  const titleEl = document.getElementById('lightbox-image-title');
  if (targetImg && src) targetImg.src = src;
  if (titleEl) titleEl.innerText = cleanInputText(title, 60);
  if (modal) modal.classList.add('active');
}

function closeImageLightbox() {
  const modal = document.getElementById('modal-image-lightbox');
  if (modal) modal.classList.remove('active');
}

function triggerZoomElementImage(elementId, title = 'Foto Ampliada') {
  const el = document.getElementById(elementId);
  if (el && el.src) {
    openImageLightbox(el.src, title);
  }
}

// ==============================================================
// ESCALAS DE NIVELES EXIGENTES (MODELO ECONÓMICO SOSTENIBLE)
// ==============================================================
const JUNRIDE_LEVELS_PASSENGER = [
  { id: 1, name: "Caminante", minTrips: 0, maxTrips: 14, icon: "nivel1.png", desc: "Rango de bienvenida. Acumula 15 tokens por viaje particular completado." },
  { id: 2, name: "Senderista", minTrips: 15, maxTrips: 39, icon: "nivel2.png", desc: "Pasajero frecuente de El Junquito. Desbloquea soporte prioritario en horas pico." },
  { id: 3, name: "Explorador", minTrips: 40, maxTrips: 79, icon: "nivel3.png", desc: "Conocedor experto de la vía. Prioridad de despacho en clima de niebla intensa o lluvia." },
  { id: 4, name: "Escalador", minTrips: 80, maxTrips: 139, icon: "nivel4.png", desc: "Viajero de altura constante. Apartado destacado en traslados de madrugada." },
  { id: 5, name: "Guía", minTrips: 140, maxTrips: 219, icon: "nivel5.png", desc: "Veterano respetado de la montaña. Asignación preferencial con choferes 5 estrellas." },
  { id: 6, name: "Conquistador", minTrips: 220, maxTrips: 99999, icon: "nivel6.png", desc: "Rango supremo JunRide. Insignia dorada en perfil y atención VIP 24/7." }
];

const JUNRIDE_LEVELS_DRIVER = [
  { id: 1, name: "Conductor Iniciado", minTrips: 0, maxTrips: 24, icon: "nivel1.png", desc: "Recibes el 85% neto de cada carrera (15% comisión plataforma). Sin generación de tokens en este nivel." },
  { id: 2, name: "Conductor Activo", minTrips: 25, maxTrips: 69, icon: "nivel2.png", desc: "Preferencia en servicios de retorno y acceso a reservas de madrugada. Sin generación de tokens." },
  { id: 3, name: "Ruta Experto", minTrips: 70, maxTrips: 139, icon: "nivel3.png", desc: "Desbloquea bono de +5 tokens por carrera completada y prioridad en mudanzas." },
  { id: 4, name: "Capitán de Montaña", minTrips: 140, maxTrips: 249, icon: "nivel4.png", desc: "Acumula +10 tokens por carrera y acceso a indumentaria oficial JunRide." },
  { id: 5, name: "Master JunRide", minTrips: 250, maxTrips: 99999, icon: "nivel6.png", desc: "Rango élite: +15 tokens por carrera y prioridad absoluta en toda la Troncal 4." }
];


// ==============================================================
// COORDENADAS REALES CORREGIDAS DE LA CARRETERA EL JUNQUITO
// ==============================================================
const JUNQUITO_ALL_KMS = [
  { km: 0, name: "Km 0 (La Yaguara / Redoma)", lat: 10.4782, lon: -66.9445, alt: 940 },
  { km: 1, name: "Km 1 (Subida Carretera Vieja)", lat: 10.4755, lon: -66.9510, alt: 990 },
  { km: 2, name: "Km 2 (Sector El Samán)", lat: 10.4728, lon: -66.9572, alt: 1040 },
  { km: 3, name: "Km 3 (Sector Los Pinos)", lat: 10.4700, lon: -66.9635, alt: 1100 },
  { km: 4, name: "Km 4 (El Amparo / Mirador)", lat: 10.4675, lon: -66.9698, alt: 1160 },
  { km: 5, name: "Km 5 (Curva Los Caobos)", lat: 10.4655, lon: -66.9758, alt: 1220 },
  { km: 6, name: "Km 6 (Sector La Roca)", lat: 10.4640, lon: -66.9818, alt: 1280 },
  { km: 7, name: "Km 7 (Entrada Carapita Alta)", lat: 10.4632, lon: -66.9875, alt: 1330 },
  { km: 8, name: "Km 8 (El Junquito Bajo)", lat: 10.4628, lon: -66.9930, alt: 1380 },
  { km: 9, name: "Km 9 (Sector El Naranjal)", lat: 10.4625, lon: -66.9985, alt: 1430 },
  { km: 10, name: "Km 10 (Curva El Limón)", lat: 10.4622, lon: -67.0040, alt: 1480 },
  { km: 11, name: "Km 11 (Sector Los Olivos / Urb. El Panorama)", lat: 10.4620, lon: -67.0095, alt: 1530 },
  { km: 12, name: "Km 12 (Panadería La Parada / Luis Hurtado)", lat: 10.4618, lon: -67.0155, alt: 1580 },
  { km: 13, name: "Km 13 (Sector El Café / Ibarra)", lat: 10.4616, lon: -67.0220, alt: 1620 },
  { km: 14, name: "Km 14 (Curva La Cabaña)", lat: 10.4614, lon: -67.0290, alt: 1660 },
  { km: 15, name: "Km 15 (Entrada La Loma)", lat: 10.4612, lon: -67.0365, alt: 1700 },
  { km: 16, name: "Km 16 (Sabana del Blanco / Entrada)", lat: 10.4610, lon: -67.0445, alt: 1740 },
  { km: 17, name: "Km 17 (Sector Araguaney)", lat: 10.4615, lon: -67.0525, alt: 1770 },
  { km: 18, name: "Km 18 (Sector Los Manantiales)", lat: 10.4625, lon: -67.0605, alt: 1800 },
  { km: 19, name: "Km 19 (Zona Turística / El Rey de la Fresa)", lat: 10.4640, lon: -67.0685, alt: 1840 },
  { km: 20, name: "Km 20 (Sector La Colina)", lat: 10.4662, lon: -67.0755, alt: 1870 },
  { km: 21, name: "Km 21 (Entrada Tibroncito)", lat: 10.4682, lon: -67.0815, alt: 1910 },
  { km: 22, name: "Km 22 (Sector Monte Alto)", lat: 10.4700, lon: -67.0865, alt: 1950 },
  { km: 23, name: "Km 23 (Pueblo de El Junquito / Plaza Bolívar)", lat: 10.4705, lon: -67.0835, alt: 1980 },
  { km: 24, name: "Km 24 (Bosque Nublado)", lat: 10.4690, lon: -67.0950, alt: 2010 },
  { km: 25, name: "Km 25 (Sector El Parador)", lat: 10.4660, lon: -67.1050, alt: 2040 },
  { km: 26, name: "Km 26 (Paso de Montaña)", lat: 10.4625, lon: -67.1150, alt: 2070 },
  { km: 27, name: "Km 27 (Curva Los Sauces)", lat: 10.4585, lon: -67.1250, alt: 2100 },
  { km: 28, name: "Km 28 (Vía Colonia Tovar / Petaquire)", lat: 10.4545, lon: -67.1350, alt: 2120 }
];

// FIREBASE CONEXIÓN
const firebaseConfig = {
  apiKey: "AIzaSyAsBnD8C_E_o5oHzmw7bWmKrmW2JAjdcaU",
  authDomain: "geomercado-9d642.firebaseapp.com",
  projectId: "geomercado-9d642",
  storageBucket: "geomercado-9d642.firebasestorage.app",
  messagingSenderId: "521126834575",
  appId: "1:521126834575:web:4c847dec3dd57d9a439bfa"
};

let db = null;
if (typeof firebase !== 'undefined') {
  try {
    if (!firebase.apps.length) {
      firebase.initializeApp(firebaseConfig);
    }
    db = firebase.firestore();
  } catch(e) {
    console.warn("Firebase ya inicializado.", e);
  }
}

// ESTADO GLOBAL DE SESIÓN Y MAPA EXACTO
const STORAGE_KEY_USER = 'jr_user_profile_data_v44';
const COMMISSION_RATE = 0.15; // 15% para JunRide, 85% neto para el Chofer
const DRIVER_NET_SHARE = 0.85;

let currentUserId = localStorage.getItem('jr_session_uid') || null;
let userData = null;
let currentTab = 'inicio';
let selectedOrderCategory = 'Carro';
let currentBcvRate = parseFloat(localStorage.getItem('jr_last_bcv_rate') || '877.90');
let isMountainFog = false;
let isDriverOnline = false;
let driverGeoWatchId = null;
let activeTripId = localStorage.getItem('jr_active_trip_id') || null;
let currentTripData = null;

// Variables de Mapa Exacto y Capas
let orderMapInstance = null;
let orderStreetLayer = null;
let orderSatelliteLayer = null;
let isSatelliteView = false;
let orderRouteLayer = null;
let originMarker = null;
let destMarker = null;
let customOriginCoords = null; // Guarda tu lat/lon GPS milimétrica real
let customOriginLabel = null;  // Guarda el nombre de tu calle/sector exacto
let hasIntermediateStop = false;

// Variables de Puestos (Colectivo / Por Puesto)
let coSharedSeats = 1;
let maxAvailableSeatsInZone = 12;
let driverMaxSeatsSetup = 4;

let calculatedOrderPrice = 2.50;
let offeredOrderPrice = 2.50;
let escrowHeldAmount = 0.00;
let selectedRechargeMethodKey = 'bdv';

let selectedOriginIdx = 11; // Km 11 referencia inicial
let selectedDestIdx = 0;
let selectedStopIdx = 12;
let currentKmPickerTarget = 'origin';

let activeRealDriversMarkers = {};

let mediaRecorder = null;
let audioChunks = [];
let isRecordingAudio = false;
let isChatModalOpen = false;
let authCurrentMode = 'register';

let currentRatingStars = 5;
let backgroundChatUnsubscribe = null;
let lastReviewedTripId = null;

// ==============================================================
// NAVEGACIÓN DINÁMICA ENTRE PESTAÑAS Y CONTROL DE ROLES
// ==============================================================
function renderDynamicBottomNav() {
  const navContainer = document.getElementById('dynamic-bottom-nav');
  if (!navContainer || !userData) return;
  const isDriver = (userData.role === 'driver');

  if (isDriver) {
    navContainer.innerHTML = `
      <button class="nav-item-btn ${currentTab === 'driver-panel' ? 'active' : ''}" onclick="switchTab('driver-panel')">
        <div class="nav-active-pill"></div>
        <svg viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 14h-2v-2h2v2zm0-4h-2V7h2v5z"/></svg>
        <small>Tablero</small>
      </button>
      <button class="nav-item-btn ${currentTab === 'driver-ganancias' ? 'active' : ''}" onclick="switchTab('driver-ganancias')">
        <div class="nav-active-pill"></div>
        <svg viewBox="0 0 24 24"><path d="M16 6l2.29 2.29-4.88 4.88-4-4L2 16.59 3.41 18l6-6 4 4 6.3-6.29L22 12V6z"/></svg>
        <small>Ganancias</small>
      </button>
      <button class="nav-item-btn ${currentTab === 'driver-mensajes' ? 'active' : ''}" onclick="switchTab('driver-mensajes')">
        <div class="nav-active-pill"></div>
        <div class="nav-unread-dot" id="nav-unread-badge-driver"></div>
        <svg viewBox="0 0 24 24"><path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm0 14H6l-2 2V4h16v12z"/></svg>
        <small>Mensajes</small>
      </button>
      <button class="nav-item-btn ${currentTab === 'perfil' ? 'active' : ''}" onclick="switchTab('perfil')">
        <div class="nav-active-pill"></div>
        <svg viewBox="0 0 24 24"><path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/></svg>
        <small>Perfil</small>
      </button>
    `;
  } else {
    navContainer.innerHTML = `
      <button class="nav-item-btn ${currentTab === 'inicio' ? 'active' : ''}" onclick="switchTab('inicio')">
        <div class="nav-active-pill"></div>
        <svg viewBox="0 0 24 24"><path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z"/></svg>
        <small>Inicio</small>
      </button>
      <button class="nav-item-btn ${currentTab === 'recargas' ? 'active' : ''}" onclick="switchTab('recargas')">
        <div class="nav-active-pill"></div>
        <svg viewBox="0 0 24 24"><path d="M21 18v1c0 1.1-.9 2-2 2H5c-1.11 0-2-.9-2-2V5c0-1.1.89-2 2-2h14c1.1 0 2 .9 2 2v1h-9c-1.11 0-2 .9-2 2v8c0 1.1.89 2 2 2h9zm-9-2h10V8H12v8zm4-2.5c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5z"/></svg>
        <small>Pagos</small>
      </button>
      <button class="nav-item-btn ${currentTab === 'historial' ? 'active' : ''}" onclick="switchTab('historial')">
        <div class="nav-active-pill"></div>
        <svg viewBox="0 0 24 24"><path d="M13 3c-4.97 0-9 4.03-9 9H1l3.89 3.89.07.14L9 12H6c0-3.87 3.13-7 7-7s7 3.13 7 7-3.13 7-7 7c-1.93 0-3.68-.79-4.94-2.06l-1.42 1.42C8.27 19.99 10.51 21 13 21c4.97 0 9-4.03 9-9s-4.03-9-9-9zm-1 5v5l4.28 2.54.72-1.21-3.5-2.08V8H12z"/></svg>
        <small>Viajes</small>
      </button>
      <button class="nav-item-btn ${currentTab === 'perfil' ? 'active' : ''}" onclick="switchTab('perfil')">
        <div class="nav-active-pill"></div>
        <svg viewBox="0 0 24 24"><path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/></svg>
        <small>Perfil</small>
      </button>
    `;
  }
}

function switchTab(tabName) {
  triggerHaptic(25);
  currentTab = tabName;
  document.querySelectorAll('.tab-content').forEach(el => el.style.display = 'none');
  const targetTab = document.getElementById(`tab-${tabName}`);
  if (targetTab) targetTab.style.display = 'block';

  if (tabName === 'driver-mensajes') {
    const dot = document.getElementById('nav-unread-badge-driver');
    if (dot) dot.style.display = 'none';
  }

  if (tabName === 'historial') {
    fetchUserTripHistory();
  }

  if (tabName === 'driver-ganancias') {
    fetchDriverTripHistory();
  }

  renderDynamicBottomNav();
  window.scrollTo(0, 0);
}

function handleDriverCtaClick() {
  triggerHaptic(40);
  if (!userData) return;

  const hasVehicle = userData.vehiclePlate && userData.vehiclePlate !== 'S/P' && userData.vehicleModel && userData.vehicleModel !== 'S/M';
  
  if (!hasVehicle) {
    showNeonToast('info', 'Antes de empezar como conductor, configura los datos de tu vehículo.');
    openDriverVehicleEditModal();
  } else {
    switchDriverMode();
  }
}

function switchDriverMode() {
  triggerHaptic();
  if (!userData) return;
  userData.role = 'driver';
  localStorage.setItem(STORAGE_KEY_USER, JSON.stringify(userData));
  if (db && currentUserId) {
    db.collection('users').doc(currentUserId).update({ role: 'driver' }).catch(() => {});
  }
  updateUIProfile();
  renderDynamicBottomNav();
  switchTab('driver-panel');
  speakDriverAlert("Modo chofer activado");
}

function switchPassengerMode() {
  triggerHaptic();
  if (!userData) return;
  userData.role = 'passenger';
  localStorage.setItem(STORAGE_KEY_USER, JSON.stringify(userData));
  if (db && currentUserId) {
    db.collection('users').doc(currentUserId).update({ role: 'passenger' }).catch(() => {});
  }
  updateUIProfile();
  renderDynamicBottomNav();
  switchTab('inicio');
  speakDriverAlert("Modo pasajero activado");
}

function handleHeaderHomeClick() {
  triggerHaptic();
  if (userData && userData.role === 'driver') switchTab('driver-panel');
  else switchTab('inicio');
}

// ==============================================================
// CONFIGURACIÓN DE UNIDAD Y CONTROL DE PUESTOS DEL CHOFER
// ==============================================================
function openDriverVehicleEditModal() {
  triggerHaptic(30);
  const modal = document.getElementById('modal-driver-vehicle-setup');
  if (userData) {
    document.getElementById('driver-veh-model-input').value = userData.vehicleModel !== 'S/M' ? (userData.vehicleModel || '') : '';
    document.getElementById('driver-veh-plate-input').value = userData.vehiclePlate !== 'S/P' ? (userData.vehiclePlate || '') : '';
    const vType = userData.vehicleType || 'Moto';
    document.getElementById('driver-veh-setup-val').value = vType;
    
    driverMaxSeatsSetup = parseInt(userData.maxSeats || 4) || 4;
    const maxSeatsEl = document.getElementById('driver-max-seats-val');
    if (maxSeatsEl) maxSeatsEl.innerText = driverMaxSeatsSetup;

    const seatsSetupBox = document.getElementById('driver-seats-setup-box');
    if (seatsSetupBox) seatsSetupBox.style.display = (vType === 'Colectivo') ? 'block' : 'none';

    document.querySelectorAll('#driver-veh-setup-chips .touch-chip').forEach(c => {
      c.classList.toggle('active', c.innerText.includes(vType === 'Colectivo' ? 'Por Puesto' : vType));
    });
    const preview = document.getElementById('setup-veh-photo-preview');
    if (preview && userData.vehiclePhoto) {
      preview.src = userData.vehiclePhoto;
    }
  }
  if (modal) modal.classList.add('active');
}

function closeDriverVehicleModal() {
  const modal = document.getElementById('modal-driver-vehicle-setup');
  if (modal) modal.classList.remove('active');
}

function selectSetupVehicleType(type, elem) {
  triggerHaptic(20);
  document.querySelectorAll('#driver-veh-setup-chips .touch-chip').forEach(c => c.classList.remove('active'));
  elem.classList.add('active');
  document.getElementById('driver-veh-setup-val').value = type;

  const seatsSetupBox = document.getElementById('driver-seats-setup-box');
  if (seatsSetupBox) {
    seatsSetupBox.style.display = (type === 'Colectivo') ? 'block' : 'none';
  }
}

function adjustDriverMaxSeats(delta) {
  triggerHaptic(20);
  driverMaxSeatsSetup = Math.max(2, Math.min(24, driverMaxSeatsSetup + delta));
  const el = document.getElementById('driver-max-seats-val');
  if (el) el.innerText = driverMaxSeatsSetup;
}

function updateDriverAvailableSeats(delta) {
  triggerHaptic(25);
  if (!userData) return;
  const maxS = parseInt(userData.maxSeats || 4) || 4;
  const currentAvail = parseInt(userData.availableSeats !== undefined ? userData.availableSeats : maxS);
  const nextAvail = Math.max(0, Math.min(maxS, currentAvail + delta));

  userData.availableSeats = nextAvail;
  localStorage.setItem(STORAGE_KEY_USER, JSON.stringify(userData));

  const disp = document.getElementById('driver-live-avail-seats-val');
  if (disp) disp.innerText = `${nextAvail} / ${maxS} Libres`;

  if (db && currentUserId) {
    db.collection('users').doc(currentUserId).update({ availableSeats: nextAvail }).catch(() => {});
    if (isDriverOnline) {
      db.collection('drivers_online').doc(currentUserId).set({
        availableSeats: nextAvail,
        maxSeats: maxS
      }, { merge: true }).catch(() => {});
    }
  }
}

function triggerVehiclePhotoUpload() {
  triggerHaptic(30);
  const input = document.getElementById('driver-veh-photo-input');
  if (input) input.click();
}

function handleVehiclePhotoSelected(event) {
  const file = event.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = function(e) {
    const img = new Image();
    img.onload = function() {
      const canvas = document.createElement('canvas');
      const maxDim = 400;
      let width = img.width;
      let height = img.height;

      if (width > height) {
        if (width > maxDim) { height *= maxDim / width; width = maxDim; }
      } else {
        if (height > maxDim) { width *= maxDim / height; height = maxDim; }
      }

      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(img, 0, 0, width, height);

      const compressedDataUrl = canvas.toDataURL('image/jpeg', 0.80);

      const preview = document.getElementById('setup-veh-photo-preview');
      if (preview) preview.src = compressedDataUrl;

      const profileVehImg = document.getElementById('profile-driver-veh-img');
      if (profileVehImg) profileVehImg.src = compressedDataUrl;

      if (userData) {
        userData.vehiclePhoto = compressedDataUrl;
        localStorage.setItem(STORAGE_KEY_USER, JSON.stringify(userData));
        if (currentUserId && db) {
          db.collection('users').doc(currentUserId).update({ vehiclePhoto: compressedDataUrl }).catch(() => {});
        }
      }
      showNeonToast('success', '📸 Foto del vehículo actualizada.');
    };
    img.src = e.target.result;
  };
  reader.readAsDataURL(file);
}

function finishDriverRegistration() {
  triggerHaptic(50);
  const vehType = cleanInputText(document.getElementById('driver-veh-setup-val').value, 20);
  const vehModel = cleanInputText(document.getElementById('driver-veh-model-input').value, 50) || 'Vehículo de Montaña';
  const vehPlate = cleanInputText(document.getElementById('driver-veh-plate-input').value, 12).toUpperCase() || 'S/P';
  const vehPhoto = document.getElementById('setup-veh-photo-preview').src;

  const isFirstRegistration = !userData.isRegistered;
  const maxSeats = (vehType === 'Colectivo') ? driverMaxSeatsSetup : (vehType === 'Carro' ? 4 : 1);

  userData.role = 'driver';
  userData.isRegistered = true;
  userData.vehicleType = vehType;
  userData.vehicleModel = vehModel;
  userData.vehiclePlate = vehPlate;
  userData.vehiclePhoto = vehPhoto;
  userData.maxSeats = maxSeats;
  userData.availableSeats = maxSeats;

  localStorage.setItem(STORAGE_KEY_USER, JSON.stringify(userData));
  if (db && currentUserId) {
    db.collection('users').doc(currentUserId).set({
      role: 'driver',
      isRegistered: true,
      vehicleType: vehType,
      vehicleModel: vehModel,
      vehiclePlate: vehPlate,
      vehiclePhoto: vehPhoto,
      maxSeats: maxSeats,
      availableSeats: maxSeats
    }, { merge: true }).catch(() => {});
  }

  closeDriverVehicleModal();
  launchMainApplication(isFirstRegistration);
  switchTab('driver-panel');
  showNeonToast('success', `🚗 Unidad guardada (${maxSeats} puestos).`);
}

// ==============================================================
// INICIALIZACIÓN PROTEGIDA (GATEKEEPER)
// ==============================================================
document.addEventListener('DOMContentLoaded', () => {
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const schedDateInput = document.getElementById('schedule-date-input');
  if (schedDateInput) schedDateInput.value = tomorrow.toISOString().split('T')[0];

  fetchBCVRate();
  renderRechargeDetails('bdv');

  const avatarInput = document.getElementById('profile-avatar-input');
  if (avatarInput) avatarInput.addEventListener('change', handleAvatarFileSelected);

  const vehPhotoInput = document.getElementById('driver-veh-photo-input');
  if (vehPhotoInput) vehPhotoInput.addEventListener('change', handleVehiclePhotoSelected);

  checkSessionAndAuth();
});

function checkSessionAndAuth() {
  const welcomeScreen = document.getElementById('screen-welcome');
  const roleSelectScreen = document.getElementById('screen-role-select');
  const mainApp = document.getElementById('app-main-interface');
  
  const saved = localStorage.getItem(STORAGE_KEY_USER) || localStorage.getItem('jr_user_profile_data_v43') || localStorage.getItem('jr_user_profile_data_v41');

  if (saved && currentUserId) {
    try {
      const parsed = JSON.parse(saved);
      if (parsed && parsed.isRegistered && parsed.phone && parsed.email) {
        userData = parsed;
        
        if (welcomeScreen) welcomeScreen.style.display = 'none';
        if (roleSelectScreen) roleSelectScreen.style.display = 'none';
        if (mainApp) mainApp.style.setProperty('display', 'block', 'important');

        currentTab = (userData.role === 'driver') ? 'driver-panel' : 'inicio';
        renderDynamicBottomNav();

        document.querySelectorAll('.tab-content').forEach(el => el.style.display = 'none');
        const activeTabEl = document.getElementById(`tab-${currentTab}`);
        if (activeTabEl) activeTabEl.style.display = 'block';

        updateUIProfile();
        requestStartupGpsLocation();
        listenRoadAlertsRealtime();
        listenTripsRealtime();
        listenScheduledTripsRealtime();
        syncUserWithFirestore();
        return;
      }
    } catch(e) {
      console.warn("Error al restaurar sesión:", e);
    }
  }

  userData = null;
  currentUserId = null;
  localStorage.removeItem(STORAGE_KEY_USER);
  localStorage.removeItem('jr_session_uid');

  if (mainApp) mainApp.style.setProperty('display', 'none', 'important');
  if (roleSelectScreen) roleSelectScreen.style.display = 'none';
  if (welcomeScreen) welcomeScreen.style.display = 'flex';
}

function syncUserWithFirestore() {
  if (!db || !currentUserId) return;
  db.collection('users').doc(currentUserId).get().then(doc => {
    if (doc.exists) {
      const remote = doc.data();
      userData = {
        ...userData,
        ...remote,
        kmBalance: parseFloat(remote.kmBalance !== undefined ? remote.kmBalance : 1.00) || 0,
        driverEarnings: parseFloat(remote.driverEarnings !== undefined ? remote.driverEarnings : 0.00) || 0,
        verifiedDriver: (remote.verifiedDriver === true)
      };
      localStorage.setItem(STORAGE_KEY_USER, JSON.stringify(userData));
      updateUIProfile();
    }
  }).catch(() => {});
}

// ==============================================================
// MODAL DE ACCESO Y ENTRADA ESTRICTA
// ==============================================================
function openAuthModal(mode = 'register') {
  triggerHaptic(30);
  authCurrentMode = mode;
  const modal = document.getElementById('modal-auth-form');
  const title = document.getElementById('auth-modal-title');
  const desc = document.getElementById('auth-modal-desc');
  const extraFields = document.getElementById('auth-register-extra-fields');
  const submitBtn = document.getElementById('auth-submit-btn');

  document.getElementById('auth-input-phone').value = '';
  document.getElementById('auth-input-email').value = '';
  document.getElementById('auth-input-name').value = '';
  document.getElementById('auth-input-lastname').value = '';

  if (mode === 'register') {
    title.innerText = 'Crear Cuenta JunRide';
    desc.innerText = 'Completa tus datos para crear tu usuario. Se validará que teléfono y correo sean únicos.';
    extraFields.style.display = 'block';
    submitBtn.innerText = 'Continuar a Selección de Rol';
  } else {
    title.innerText = 'Ya tengo una cuenta';
    desc.innerText = 'Por seguridad, ingresa el teléfono móvil Y correo electrónico registrados para entrar.';
    extraFields.style.display = 'none';
    submitBtn.innerText = 'Verificar y Entrar';
  }

  modal.classList.add('active');
}

function closeAuthModal() {
  document.getElementById('modal-auth-form').classList.remove('active');
}

async function handleAuthSubmit(e) {
  e.preventDefault();
  triggerHaptic(50);

  const phone = cleanInputText(document.getElementById('auth-input-phone').value, 18);
  const email = cleanInputText(document.getElementById('auth-input-email').value, 80).toLowerCase();
  const submitBtn = document.getElementById('auth-submit-btn');

  if (!phone || !email) {
    showNeonToast('error', 'Debes ingresar tanto el teléfono como el correo electrónico.');
    return;
  }

  submitBtn.disabled = true;
  submitBtn.innerText = 'Verificando con el servidor...';

  if (authCurrentMode === 'register') {
    const name = cleanInputText(document.getElementById('auth-input-name').value, 40);
    const lastname = cleanInputText(document.getElementById('auth-input-lastname').value, 40);

    if (!name) {
      showNeonToast('error', 'Por favor ingresa tu nombre.');
      submitBtn.disabled = false;
      submitBtn.innerText = 'Continuar a Selección de Rol';
      return;
    }

    if (db) {
      try {
        const phoneCheck = await db.collection('users').where('phone', '==', phone).get();
        if (!phoneCheck.empty) {
          showNeonToast('error', 'Este teléfono ya tiene una cuenta. Inicia sesión en "Ya tengo una cuenta".');
          submitBtn.disabled = false;
          submitBtn.innerText = 'Continuar a Selección de Rol';
          return;
        }

        const emailCheck = await db.collection('users').where('email', '==', email).get();
        if (!emailCheck.empty) {
          showNeonToast('error', 'Este correo electrónico ya está registrado.');
          submitBtn.disabled = false;
          submitBtn.innerText = 'Continuar a Selección de Rol';
          return;
        }
      } catch (err) {
        console.warn("Fallo de consulta Firestore:", err);
      }
    }

    const cleanName = name.replace(/[^a-zA-Z]/g, '').toUpperCase().slice(0, 6) || 'JUNRIDE';
    const randomSuffix = Math.floor(100 + Math.random() * 900);
    const userReferralCode = `${cleanName}${randomSuffix}`;

    currentUserId = 'user_' + Math.random().toString(36).substr(2, 9);
    localStorage.setItem('jr_session_uid', currentUserId);

    userData = {
      id: currentUserId,
      name: name,
      lastname: lastname,
      phone: phone,
      email: email,
      referralCode: userReferralCode,
      role: 'passenger',
      isRegistered: false,
      verifiedDriver: false,
      kmBalance: 1.00,
      
      passengerTrips: 0,
      passengerTokens: 50, // Bono inicial moderado
      passengerRating: 5.00,
      passengerRatingCount: 1,

      driverEarnings: 0.00,
      driverTrips: 0,
      driverTokens: 0, // Choferes inician con 0 tokens
      driverRating: 5.00,
      driverRatingCount: 1,
      avatar: 'logo.png',
      vehiclePhoto: 'carro.png',
      vehicleType: 'Moto',
      vehicleModel: 'S/M',
      vehiclePlate: 'S/P',
      maxSeats: 4,
      availableSeats: 4,
      batterySaver: false,
      createdAt: new Date().toISOString(),
      walletLedger: [{ type: 'credit', title: 'Bono Bienvenida JunRide', amount: 1.00, date: 'Hoy' }]
    };

    submitBtn.disabled = false;
    closeAuthModal();

    document.getElementById('screen-welcome').style.display = 'none';
    document.getElementById('screen-role-select').style.display = 'flex';
    return;
  }

  if (authCurrentMode === 'login') {
    if (!db) {
      showNeonToast('error', 'Conectando con la base de datos... Por favor intenta de nuevo.');
      submitBtn.disabled = false;
      submitBtn.innerText = 'Verificar y Entrar';
      return;
    }

    let userDoc = null;
    try {
      const snapshot = await db.collection('users')
        .where('phone', '==', phone)
        .where('email', '==', email)
        .get();

      if (snapshot.empty) {
        showNeonToast('error', 'Credenciales no encontradas. Verifica teléfono y correo o crea una cuenta nueva.');
        submitBtn.disabled = false;
        submitBtn.innerText = 'Verificar y Entrar';
        return;
      }

      snapshot.forEach(doc => {
        userDoc = { ...doc.data(), id: doc.id };
      });
    } catch (err) {
      console.error("Error en consulta de base de datos:", err);
      showNeonToast('error', 'Error al verificar credenciales en la base de datos.');
      submitBtn.disabled = false;
      submitBtn.innerText = 'Verificar y Entrar';
      return;
    }

    currentUserId = userDoc.id;
    localStorage.setItem('jr_session_uid', currentUserId);

    userData = {
      id: currentUserId,
      name: cleanInputText(userDoc.name || 'Usuario', 40),
      lastname: cleanInputText(userDoc.lastname || '', 40),
      phone: userDoc.phone || phone,
      email: userDoc.email || email,
      referralCode: userDoc.referralCode || 'JUNRIDE',
      role: userDoc.role || 'passenger',
      isRegistered: true,
      verifiedDriver: (userDoc.verifiedDriver === true),
      vehicleType: userDoc.vehicleType || 'Moto',
      vehicleModel: cleanInputText(userDoc.vehicleModel || 'S/M', 50),
      vehiclePlate: cleanInputText(userDoc.vehiclePlate || 'S/P', 12),
      vehiclePhoto: userDoc.vehiclePhoto || 'carro.png',
      maxSeats: parseInt(userDoc.maxSeats || 4) || 4,
      availableSeats: parseInt(userDoc.availableSeats !== undefined ? userDoc.availableSeats : (userDoc.maxSeats || 4)),
      kmBalance: parseFloat(userDoc.kmBalance !== undefined ? userDoc.kmBalance : 1.00) || 0.00,
      
      passengerTrips: parseInt(userDoc.passengerTrips || 0) || 0,
      passengerTokens: parseInt(userDoc.passengerTokens !== undefined ? userDoc.passengerTokens : 50) || 0,
      passengerRating: parseFloat(userDoc.passengerRating || 5.00) || 5.00,
      passengerRatingCount: parseInt(userDoc.passengerRatingCount || 1) || 1,

      driverEarnings: parseFloat(userDoc.driverEarnings || 0.00) || 0.00,
      driverTrips: parseInt(userDoc.driverTrips || 0) || 0,
      driverTokens: parseInt(userDoc.driverTokens || 0) || 0,
      driverRating: parseFloat(userDoc.driverRating || 5.00) || 5.00,
      driverRatingCount: parseInt(userDoc.driverRatingCount || 1) || 1,

      avatar: userDoc.avatar: userDoc.avatar || 'logo.png',
      batterySaver: userDoc.batterySaver || false,
      walletLedger: userDoc.walletLedger || [{ type: 'credit', title: 'Cuenta Restaurada', amount: 1.00, date: 'Hoy' }]
    };

    localStorage.setItem(STORAGE_KEY_USER, JSON.stringify(userData));

    submitBtn.disabled = false;
    closeAuthModal();

    launchMainApplication(false);

    if (userData.role === 'driver') {
      switchTab('driver-panel');
    }
  }
}

function chooseAppRole(role) {
  triggerHaptic(40);
  if (!userData) return;
  userData.role = role;

  if (role === 'driver') {
    document.getElementById('screen-role-select').style.display = 'none';
    openDriverVehicleEditModal();
  } else {
    userData.isRegistered = true;
    localStorage.setItem(STORAGE_KEY_USER, JSON.stringify(userData));
    document.getElementById('screen-role-select').style.display = 'none';
    launchMainApplication(true);
  }
}

function launchMainApplication(isNewAccount = false) {
  if (!userData || !userData.isRegistered) return;

  const welcomeScreen = document.getElementById('screen-welcome');
  const roleSelectScreen = document.getElementById('screen-role-select');
  const mainApp = document.getElementById('app-main-interface');

  if (welcomeScreen) welcomeScreen.style.display = 'none';
  if (roleSelectScreen) roleSelectScreen.style.display = 'none';
  if (mainApp) mainApp.style.setProperty('display', 'block', 'important');

  if (isNewAccount && db && currentUserId) {
    db.collection('users').doc(currentUserId).set(userData, { merge: true }).catch(() => {});
  }

  currentTab = (userData.role === 'driver') ? 'driver-panel' : 'inicio';
  renderDynamicBottomNav();

  document.querySelectorAll('.tab-content').forEach(el => el.style.display = 'none');
  const activeTabEl = document.getElementById(`tab-${currentTab}`);
  if (activeTabEl) activeTabEl.style.display = 'block';

  updateUIProfile();
  playChimeSound();
  showNeonToast('success', `¡Bienvenido, ${userData.name}!`);

  requestStartupGpsLocation();
  listenRoadAlertsRealtime();
  listenTripsRealtime();
  listenScheduledTripsRealtime();
  fetchUserTripHistory();
}

// ==============================================================
// GPS SATELITAL PURO Y EXACTO (SIN EL IMÁN FORZADO AL KM 5)
// ==============================================================
function findClosestKmEstimate(lat, lon) {
  let closestKm = JUNQUITO_ALL_KMS[11];
  let minDist = 999999;
  let closestIdx = 11;

  JUNQUITO_ALL_KMS.forEach((pt, idx) => {
    let dLat = (pt.lat - lat) * 111000;
    let dLon = (pt.lon - lon) * 109000;
    let d = Math.hypot(dLat, dLon);
    if (d < minDist) {
      minDist = d;
      closestKm = pt;
      closestIdx = idx;
    }
  });

  // IMPORTANTE: Devuelve tu coordenada EXACTA (lat, lon) sin moverte a la fuerza,
  // y solo usa el índice del Km para calcular el precio aproximado de la ruta.
  return {
    exactCoords: { lat: lat, lon: lon },
    index: closestIdx,
    kmName: closestKm.name,
    alt: closestKm.alt
  };
}

async function resolveExactStreetName(lat, lon) {
  try {
    const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}&zoom=18&addressdetails=1`);
    const data = await res.json();
    if (data && data.address) {
      const road = data.address.road || data.address.pedestrian || data.address.suburb || data.address.neighbourhood || '';
      const area = data.address.suburb || data.address.town || data.address.village || 'El Junquito';
      if (road) return `${road}, ${area}`;
    }
  } catch (e) {}
  return null;
}

function requestStartupGpsLocation() {
  if (!userData) return;
  selectedOriginIdx = 11;
  customOriginCoords = { lat: JUNQUITO_ALL_KMS[11].lat, lon: JUNQUITO_ALL_KMS[11].lon };

  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(async pos => {
      const lat = pos.coords.latitude;
      const lon = pos.coords.longitude;
      const est = findClosestKmEstimate(lat, lon);
      
      customOriginCoords = { lat: lat, lon: lon };
      selectedOriginIdx = est.index;

      const streetName = await resolveExactStreetName(lat, lon);
      const triggerEl = document.getElementById('trigger-origin-name');
      if (triggerEl) {
        triggerEl.innerText = streetName ? `📍 ${streetName} (Ref: Km ${JUNQUITO_ALL_KMS[est.index].km})` : `📍 GPS Exacto (${est.kmName})`;
      }
      customOriginLabel = triggerEl ? triggerEl.innerText : est.kmName;
    }, () => {}, { enableHighAccuracy: true, timeout: 9000, maximumAge: 0 });
  }
}

function useCurrentGpsLocation() {
  triggerHaptic();
  if (!userData) return;
  if (!navigator.geolocation) {
    showNeonToast('error', 'Tu navegador no tiene el GPS activado.');
    return;
  }

  showNeonToast('info', '🛰️ Obteniendo tu punto satelital exacto...');
  navigator.geolocation.getCurrentPosition(async pos => {
    const lat = pos.coords.latitude;
    const lon = pos.coords.longitude;
    const est = findClosestKmEstimate(lat, lon);

    // Guardamos tu coordenada exacta real sin alterarla
    customOriginCoords = { lat: lat, lon: lon };
    selectedOriginIdx = est.index;

    const streetName = await resolveExactStreetName(lat, lon);
    const labelText = streetName
      ? `📍 ${streetName} (Ref: Km ${JUNQUITO_ALL_KMS[est.index].km})`
      : `📍 Coordenada Exacta (${lat.toFixed(5)}, ${lon.toFixed(5)})`;

    customOriginLabel = labelText;
    const triggerEl = document.getElementById('trigger-origin-name');
    if (triggerEl) triggerEl.innerText = labelText;

    if (orderMapInstance) {
      orderMapInstance.setView([lat, lon], 17);
      if (originMarker) originMarker.setLatLng([lat, lon]);
    }

    calculateRouteOrder();
    showNeonToast('success', `✅ Ubicación exacta fijada: ${labelText}`);
  }, () => {
    showNeonToast('warning', 'Activa la ubicación de alta precisión en tu teléfono o toca tu calle exacta en el mapa.');
  }, { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 });
}

function openCurrentOriginInGoogleMaps() {
  triggerHaptic(30);
  const pt = customOriginCoords || JUNQUITO_ALL_KMS[selectedOriginIdx];
  window.open(`https://www.google.com/maps/search/?api=1&query=${pt.lat},${pt.lon}`, '_blank');
}
// ==============================================================
// PARTE 2 DE 2: MAPA SATÉLITE, MADRUGADA, PUESTOS, PAGOS Y VIAJES
// ==============================================================

// ALERTAS VIALES PROTEGIDAS
function listenRoadAlertsRealtime() {
  if (!db || !userData) return;
  db.collection('alertas_viales').orderBy('createdAt', 'desc').limit(1).onSnapshot(snapshot => {
    const banner = document.getElementById('live-alerts-banner');
    if (!snapshot || snapshot.empty) {
      if (banner) banner.style.display = 'none';
      return;
    }
    snapshot.forEach(doc => {
      const alertData = doc.data();
      if (banner) {
        banner.style.display = 'flex';
        document.getElementById('alert-banner-title').innerText = `⚠️ ${cleanInputText(alertData.incident, 50)} (${cleanInputText(alertData.km, 40)})`;
        document.getElementById('alert-banner-desc').innerText = `Reportado por ${cleanInputText(alertData.reportedBy || 'Comunidad JunRide', 40)}`;
        banner.dataset.alertDocId = doc.id;
      }
    });
  }, () => {});
}

function dismissRoadAlertBanner(e) {
  if (e) e.stopPropagation();
  triggerHaptic(20);
  const banner = document.getElementById('live-alerts-banner');
  if (banner) banner.style.display = 'none';
  showNeonToast('info', 'Alerta ocultada en tu pantalla.');
}

async function clearCurrentRoadAlertCommunity() {
  triggerHaptic(50);
  const banner = document.getElementById('live-alerts-banner');
  const alertId = banner ? banner.dataset.alertDocId : null;

  if (db && alertId) {
    await db.collection('alertas_viales').doc(alertId).delete().catch(() => {});
    showNeonToast('success', '✅ Vía marcada como despejada para toda la comunidad.');
    closeReportTrafficModal();
  } else {
    showNeonToast('info', 'No hay alertas activas para despejar en este momento.');
    closeReportTrafficModal();
  }
}

// SELECTOR MODAL DE KILÓMETROS
function openKmPickerModal(target) {
  triggerHaptic(20);
  currentKmPickerTarget = target;
  const modal = document.getElementById('modal-km-picker');
  const title = document.getElementById('km-picker-modal-title');
  const searchBox = document.getElementById('poi-search-box');
  if (searchBox) searchBox.value = '';

  if (target === 'origin') title.innerText = 'Punto de Salida (Kilómetro Referencia)';
  else if (target === 'destination') title.innerText = 'Punto de Llegada (Destino)';
  else if (target === 'schedule_origin') title.innerText = 'Salida de Madrugada';
  else if (target === 'schedule_dest') title.innerText = 'Destino de Madrugada';
  else if (target === 'traffic_km') title.innerText = 'Kilómetro del Incidente';
  else title.innerText = 'Parada Intermedia';

  filterKmPickerList('');
  modal.classList.add('active');
}

function filterKmPickerList(query = '') {
  const container = document.getElementById('km-cards-container');
  if (!container) return;
  container.innerHTML = '';
  const q = query.toLowerCase().trim();

  JUNQUITO_ALL_KMS.forEach((pt, idx) => {
    if (!q || pt.name.toLowerCase().includes(q)) {
      const isSelected = (currentKmPickerTarget === 'origin' && idx === selectedOriginIdx) ||
                         (currentKmPickerTarget === 'destination' && idx === selectedDestIdx) ||
                         (currentKmPickerTarget === 'stop' && idx === selectedStopIdx);

      container.innerHTML += `
        <div class="km-card-item ${isSelected ? 'selected' : ''}" onclick="selectKmItem(${idx})">
          <div>
            <strong>${escapeHTML(pt.name)}</strong>
            <p style="font-size:0.68rem; color:#94a3b8;">Altitud estimada: ${pt.alt} msnm</p>
          </div>
          <span>${isSelected ? 'Seleccionado ✓' : 'Elegir'}</span>
        </div>
      `;
    }
  });
}

function closeKmPickerModal() {
  document.getElementById('modal-km-picker').classList.remove('active');
}

function selectKmItem(idx) {
  triggerHaptic(30);
  if (currentKmPickerTarget === 'origin') {
    selectedOriginIdx = idx;
    customOriginCoords = { lat: JUNQUITO_ALL_KMS[idx].lat, lon: JUNQUITO_ALL_KMS[idx].lon };
    customOriginLabel = JUNQUITO_ALL_KMS[idx].name;
    document.getElementById('trigger-origin-name').innerText = JUNQUITO_ALL_KMS[idx].name;
    if (orderMapInstance) {
      orderMapInstance.setView([customOriginCoords.lat, customOriginCoords.lon], 16);
      if (originMarker) originMarker.setLatLng([customOriginCoords.lat, customOriginCoords.lon]);
    }
    calculateRouteOrder();
  } else if (currentKmPickerTarget === 'destination') {
    selectedDestIdx = idx;
    document.getElementById('trigger-destination-name').innerText = JUNQUITO_ALL_KMS[idx].name;
    calculateRouteOrder();
  } else if (currentKmPickerTarget === 'stop') {
    selectedStopIdx = idx;
    document.getElementById('trigger-stop-name').innerText = `Parada: ${JUNQUITO_ALL_KMS[idx].name}`;
    calculateRouteOrder();
  } else if (currentKmPickerTarget === 'schedule_origin') {
    document.getElementById('trigger-sched-origin-name').innerText = JUNQUITO_ALL_KMS[idx].name;
  } else if (currentKmPickerTarget === 'schedule_dest') {
    document.getElementById('trigger-sched-dest-name').innerText = JUNQUITO_ALL_KMS[idx].name;
  } else if (currentKmPickerTarget === 'traffic_km') {
    document.getElementById('trigger-traffic-km-name').innerText = JUNQUITO_ALL_KMS[idx].name;
  }

  closeKmPickerModal();
}

function selectIncidentType(type, elem) {
  triggerHaptic(20);
  document.querySelectorAll('#incident-type-chips .touch-chip').forEach(c => c.classList.remove('active'));
  elem.classList.add('active');
  document.getElementById('incident-type-val').value = type;
}

function selectSchedHour(hour, elem) {
  triggerHaptic(20);
  document.querySelectorAll('#sched-hour-chips .touch-chip').forEach(c => c.classList.remove('active'));
  elem.classList.add('active');
  document.getElementById('schedule-hour-val').value = hour;
}

function selectSchedService(srv, elem) {
  triggerHaptic(20);
  document.querySelectorAll('#sched-service-chips .touch-chip').forEach(c => c.classList.remove('active'));
  elem.classList.add('active');
  document.getElementById('schedule-service-val').value = srv;
}

function selectOrderPaymentMode(modeValue, elem) {
  triggerHaptic(25);
  document.querySelectorAll('#order-pay-mode-cards .pay-mode-option-card').forEach(c => c.classList.remove('active'));
  if (elem) elem.classList.add('active');
  const hiddenInput = document.getElementById('order-pay-mode');
  if (hiddenInput) hiddenInput.value = modeValue;
}

function triggerPanicSOS() {
  triggerHaptic(200);
  const lat = customOriginCoords ? customOriginCoords.lat : JUNQUITO_ALL_KMS[selectedOriginIdx].lat;
  const lon = customOriginCoords ? customOriginCoords.lon : JUNQUITO_ALL_KMS[selectedOriginIdx].lon;
  const userName = userData ? userData.name : 'Usuario';
  const msg = encodeURIComponent(`🚨 ALERTA SOS JUNRIDE: Necesito asistencia inmediata en El Junquito.\nUbicación satelital exacta: https://maps.google.com/?q=${lat},${lon}\nUsuario: ${userName}`);
  window.location.href = `https://wa.me/584123167126?text=${msg}`;
}

function shareLiveTripStatus() {
  triggerHaptic(40);
  const orig = customOriginLabel || JUNQUITO_ALL_KMS[selectedOriginIdx].name;
  const dest = JUNQUITO_ALL_KMS[selectedDestIdx].name;
  const msg = encodeURIComponent(`🚗 Voy en camino en JunRide desde ${orig} hacia ${dest}. Conductor: ${currentTripData ? (currentTripData.driverName || 'Asignado') : 'Asignado'}. Seguimiento con PIN de seguridad satelital activado 🏔️`);
  window.location.href = `https://wa.me/?text=${msg}`;
}

function redeemTokensForWallet() {
  triggerHaptic();
  if (!userData) return;
  const isDriver = (userData.role === 'driver');
  const tokens = isDriver ? (userData.driverTokens || 0) : (userData.passengerTokens || 0);

  if (tokens < 1000) {
    showNeonToast('warning', `Tienes ${tokens} tokens. Necesitas reunir 1,000 tokens para canjear $1.00 USD.`);
    return;
  }
  const dollarsToAdd = Math.floor(tokens / 1000);
  const tokensUsed = dollarsToAdd * 1000;

  if (isDriver) {
    userData.driverTokens -= tokensUsed;
    userData.driverEarnings = Number(((userData.driverEarnings || 0) + dollarsToAdd).toFixed(2));
    showNeonToast('success', `🎉 ¡Tokens canjeados por +$${dollarsToAdd}.00 USD acreditados a tus ganancias netas!`);
  } else {
    userData.passengerTokens -= tokensUsed;
    userData.kmBalance = Number(((userData.kmBalance || 0) + dollarsToAdd).toFixed(2));
    showNeonToast('success', `🎉 ¡Canje exitoso! Se acreditaron +$${dollarsToAdd}.00 USD a tu Cartera Digital.`);
  }

  logWalletMovement('credit', `Canje de ${tokensUsed} Tokens (${isDriver ? 'Chofer' : 'Pasajero'})`, dollarsToAdd);

  if (db && currentUserId) {
    db.collection('users').doc(currentUserId).update({
      passengerTokens: userData.passengerTokens || 0,
      driverTokens: userData.driverTokens || 0,
      kmBalance: userData.kmBalance,
      driverEarnings: userData.driverEarnings || 0,
      walletLedger: userData.walletLedger
    }).catch(() => {});
  }

  updateUIProfile();
}

function shareReferralCode() {
  triggerHaptic();
  const code = (userData && userData.referralCode) ? userData.referralCode : 'JUNRIDE';
  const text = encodeURIComponent(`¡Descarga JunRide en El Junquito! Usa mi código ${code} para pedir traslados exactos desde tu puerta 🏔️🚕`);
  window.location.href = `https://wa.me/?text=${text}`;
}

function toggleBatterySaverMode() {
  triggerHaptic();
  if (!userData) return;
  userData.batterySaver = !userData.batterySaver;
  localStorage.setItem(STORAGE_KEY_USER, JSON.stringify(userData));
  applyBatterySaverUI();
  showNeonToast('info', `Modo Batería Baja: ${userData.batterySaver ? 'Activado' : 'Desactivado'}`);
}

function applyBatterySaverUI() {
  if (userData && userData.batterySaver) {
    document.body.classList.add('battery-saver');
    const tag = document.getElementById('battery-mode-tag');
    if (tag) tag.innerText = 'Activo';
  } else {
    document.body.classList.remove('battery-saver');
    const tag = document.getElementById('battery-mode-tag');
    if (tag) tag.innerText = 'Normal';
  }
}

function copyFullBankDataForApp() {
  triggerHaptic(50);
  playChimeSound();
  const txt = `Banco: 0102 Banco de Venezuela\nTeléfono: 04123167126\nCédula: 30629336`;

  const tempTextArea = document.createElement('textarea');
  tempTextArea.value = txt;
  document.body.appendChild(tempTextArea);
  tempTextArea.select();
  try {
    document.execCommand('copy');
    const btn = document.getElementById('btn-copy-full-bank');
    if (btn) {
      btn.innerText = '¡Copiado! ✓';
      btn.classList.add('copied');
      setTimeout(() => {
        btn.innerText = '📋 Copiar Todo para Banco';
        btn.classList.remove('copied');
      }, 2500);
    }
    showNeonToast('success', '📋 Datos copiados al portapapeles.');
  } catch(e) {
    showNeonToast('error', 'Error al copiar datos.');
  }
  document.body.removeChild(tempTextArea);
}

function calculateCashChange(billAmount) {
  triggerHaptic();
  const fare = offeredOrderPrice;
  const changeUsd = (billAmount - fare);
  const resultEl = document.getElementById('cash-change-result');
  if (changeUsd < 0) {
    if (resultEl) resultEl.innerText = `El billete de $${billAmount} no cubre la tarifa de $${fare.toFixed(2)}.`;
    return;
  }
  const changeVes = (changeUsd * currentBcvRate).toFixed(2);
  if (resultEl) resultEl.innerText = `Tu cambio: $${changeUsd.toFixed(2)} USD (aprox. Bs. ${changeVes})`;
}

// ==============================================================
// SISTEMA DE CALIFICACIÓN Y RESEÑAS
// ==============================================================
function setTripRating(stars) {
  triggerHaptic(25);
  currentRatingStars = Math.max(1, Math.min(5, parseInt(stars) || 5));
  const starEls = document.querySelectorAll('#receipt-stars-box .star-item');
  starEls.forEach((el, idx) => {
    if (idx < currentRatingStars) el.classList.add('active');
    else el.classList.remove('active');
  });

  const lbl = document.getElementById('receipt-stars-label');
  const textMap = {
    1: '1 Estrella (Deficiente)',
    2: '2 Estrellas (Regular)',
    3: '3 Estrellas (Bueno)',
    4: '4 Estrellas (Muy Bueno)',
    5: '5 Estrellas (Excelente)'
  };
  if (lbl) lbl.innerText = textMap[currentRatingStars] || `${currentRatingStars} Estrellas`;
}

function selectTagBadge(badgeElem, text) {
  triggerHaptic(20);
  badgeElem.classList.toggle('active');
  const commentArea = document.getElementById('receipt-public-comment');
  if (commentArea && badgeElem.classList.contains('active')) {
    const currentVal = commentArea.value.trim();
    commentArea.value = currentVal ? `${currentVal}. ${text}` : text;
  }
}

function openReceiptModal(tripData = null) {
  triggerHaptic();
  const trip = tripData || currentTripData;
  if (!trip) return;

  lastReviewedTripId = trip.id || activeTripId;

  document.getElementById('rec-service-name').innerText = trip.service || selectedOrderCategory;
  document.getElementById('rec-driver-name').innerText = trip.driverName || 'Conductor Asignado';
  document.getElementById('rec-driver-veh').innerText = trip.driverVehicle || 'Vehículo Registrado';
  document.getElementById('rec-route-text').innerText = `${trip.pickup || JUNQUITO_ALL_KMS[selectedOriginIdx].name} ➔ ${trip.dropoff || JUNQUITO_ALL_KMS[selectedDestIdx].name}`;
  
  const fare = parseFloat(trip.price || offeredOrderPrice) || 0;
  document.getElementById('rec-amount-text').innerText = `$${fare.toFixed(2)} USD`;
  document.getElementById('rec-amount-ves').innerText = `(Bs. ${(fare * currentBcvRate).toFixed(2)})`;
  document.getElementById('rec-date-text').innerText = new Date().toLocaleString();

  setTripRating(5);
  const commentArea = document.getElementById('receipt-public-comment');
  if (commentArea) commentArea.value = '';

  document.getElementById('modal-trip-receipt').classList.add('active');
}

function closeReceiptModal() { 
  document.getElementById('modal-trip-receipt').classList.remove('active'); 
}

async function submitTripRatingAndReview() {
  triggerHaptic(60);
  const rawComment = document.getElementById('receipt-public-comment').value;
  const safeComment = cleanInputText(rawComment, 200);
  const tripId = lastReviewedTripId || activeTripId;

  if (db && tripId) {
    try {
      await db.collection('trips').doc(tripId).update({
        clientRating: currentRatingStars,
        clientComment: safeComment || 'Sin comentarios adicionales.',
        ratedAt: new Date().toISOString()
      });

      if (currentTripData && currentTripData.driverId) {
        const driverRef = db.collection('users').doc(currentTripData.driverId);
        const driverDoc = await driverRef.get();
        if (driverDoc.exists) {
          const dData = driverDoc.data();
          const prevCount = parseInt(dData.driverRatingCount || 1) || 1;
          const prevRating = parseFloat(dData.driverRating || 5.0) || 5.0;
          const newCount = prevCount + 1;
          const newRating = Number(((prevRating * prevCount + currentRatingStars) / newCount).toFixed(2));

          await driverRef.update({
            driverRating: newRating,
            driverRatingCount: newCount
          });
        }
      }
    } catch(err) {
      console.warn("Error al guardar reseña en Firestore:", err);
    }
  }

  showNeonToast('success', '⭐ ¡Gracias por calificar a tu conductor!');
  closeReceiptModal();
  fetchUserTripHistory();
}

function shareReceiptWhatsApp() {
  const trip = currentTripData;
  const fare = parseFloat(trip ? trip.price : offeredOrderPrice) || 0;
  const driver = trip ? trip.driverName : 'Conductor Asignado';
  const route = trip ? `${trip.pickup} a ${trip.dropoff}` : `${JUNQUITO_ALL_KMS[selectedOriginIdx].name} a ${JUNQUITO_ALL_KMS[selectedDestIdx].name}`;

  const msg = encodeURIComponent(`🧾 Recibo Oficial JunRide:\n🚗 Conductor: ${driver}\n💵 Tarifa: $${fare.toFixed(2)} USD (Bs. ${(fare * currentBcvRate).toFixed(2)})\n🛣️ Ruta: ${route}\n⭐ Calificación: ${currentRatingStars} Estrellas\nEstado: Viaje Completado con Seguridad Satelital 🏔️`);
  window.location.href = `https://wa.me/?text=${msg}`;
}

// ==============================================================
// HISTORIAL DE VIAJES DEL PASAJERO Y DEL CHOFER (85% NETO)
// ==============================================================
async function fetchUserTripHistory() {
  const container = document.getElementById('history-cards-container');
  const loading = document.getElementById('history-loading-msg');
  const empty = document.getElementById('history-empty-msg');
  if (!container) return;

  if (loading) loading.style.display = 'block';
  if (empty) empty.style.display = 'none';
  container.innerHTML = '';

  if (!db || !currentUserId || !userData) {
    if (loading) loading.style.display = 'none';
    if (empty) empty.style.display = 'block';
    return;
  }

  try {
    const snapshot = await db.collection('trips')
      .where('clientId', '==', currentUserId)
      .where('status', '==', 'Completado')
      .get();

    if (loading) loading.style.display = 'none';

    if (snapshot.empty) {
      if (empty) empty.style.display = 'block';
      return;
    }

    const trips = [];
    snapshot.forEach(doc => {
      trips.push({ id: doc.id, ...doc.data() });
    });

    trips.sort((a, b) => new Date(b.completedAt || b.createdAt || 0) - new Date(a.completedAt || a.createdAt || 0));

    const driverIds = [...new Set(trips.map(t => t.driverId).filter(Boolean))];
    const driverAvatarsMap = {};

    await Promise.all(driverIds.map(async (dId) => {
      try {
        const uDoc = await db.collection('users').doc(dId).get();
        if (uDoc.exists && uDoc.data().avatar) {
          driverAvatarsMap[dId] = uDoc.data().avatar;
        }
      } catch(e) {}
    }));

    trips.forEach(t => {
      const ratingNum = Math.max(1, Math.min(5, parseInt(t.clientRating || 5)));
      const stars = '★'.repeat(ratingNum) + '☆'.repeat(5 - ratingNum);
      const commentHtml = t.clientComment ? `<div class="history-comment-box">"${escapeHTML(t.clientComment)}"</div>` : '';
      const safeDriverName = escapeHTML(t.driverName || 'Conductor');
      const liveDriverAvatar = driverAvatarsMap[t.driverId] || t.driverAvatar || 'https://files.catbox.moe/oh53r9.png';
      const fareUsd = (parseFloat(t.price || 0) || 0).toFixed(2);
      const fareBs = (fareUsd * currentBcvRate).toFixed(2);
      const dateStr = t.completedAt || t.createdAt ? (new Date(t.completedAt || t.createdAt).toLocaleDateString() + ' ' + new Date(t.completedAt || t.createdAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})) : 'Reciente';

      const card = document.createElement('div');
      card.className = 'history-trip-card';
      card.innerHTML = `
        <div class="history-card-header">
          <div class="history-driver-info-wrap">
            <img src="${escapeHTML(liveDriverAvatar)}" class="history-driver-avatar-thumb" alt="${safeDriverName}" title="Toca para ampliar foto">
            <div>
              <span class="badge-tag-neon">${escapeHTML(t.service || 'Carrera')}</span>
              <strong style="margin-left:4px; font-size:0.85rem; color:#fff;">Chofer: ${safeDriverName}</strong>
            </div>
          </div>
          <span class="history-fare-badge">$${fareUsd} USD</span>
        </div>

        <div class="history-route-row">
          <span>📍 ${escapeHTML(t.pickup)}</span>
          <span style="color:var(--primary);">➔</span>
          <span>🏁 ${escapeHTML(t.dropoff)}</span>
        </div>

        <div class="history-meta-row">
          <span>📅 ${escapeHTML(dateStr)} (Bs. ${fareBs})</span>
          <span class="history-rating-stars">${stars}</span>
        </div>

        ${commentHtml}
      `;

      const imgThumb = card.querySelector('.history-driver-avatar-thumb');
      if (imgThumb) {
        imgThumb.addEventListener('click', () => openImageLightbox(liveDriverAvatar, `Chofer: ${t.driverName || 'Conductor'}`));
      }
      container.appendChild(card);
    });

  } catch(err) {
    console.warn("Error al cargar historial del pasajero:", err);
    if (loading) loading.style.display = 'none';
    if (empty) empty.style.display = 'block';
  }
}

async function fetchDriverTripHistory() {
  const container = document.getElementById('driver-completed-rides-list');
  if (!container) return;

  if (!db || !currentUserId || !userData) {
    container.innerHTML = '<p style="font-size:0.78rem; color:var(--text-muted);">Aún no has completado carreras en este turno.</p>';
    return;
  }

  container.innerHTML = '<p style="font-size:0.78rem; color:var(--text-muted); text-align:center;">Consultando tus carreras completadas...</p>';

  try {
    const snapshot = await db.collection('trips')
      .where('driverId', '==', currentUserId)
      .where('status', '==', 'Completado')
      .get();

    if (snapshot.empty) {
      container.innerHTML = '<p style="font-size:0.78rem; color:var(--text-muted);">Aún no has completado carreras en este turno.</p>';
      return;
    }

    const trips = [];
    snapshot.forEach(doc => {
      trips.push({ id: doc.id, ...doc.data() });
    });

    trips.sort((a, b) => new Date(b.completedAt || b.createdAt || 0) - new Date(a.completedAt || a.createdAt || 0));

    const clientIds = [...new Set(trips.map(t => t.clientId).filter(Boolean))];
    const clientAvatarsMap = {};

    await Promise.all(clientIds.map(async (cId) => {
      try {
        const uDoc = await db.collection('users').doc(cId).get();
        if (uDoc.exists && uDoc.data().avatar) {
          clientAvatarsMap[cId] = uDoc.data().avatar;
        }
      } catch(e) {}
    }));

    container.innerHTML = '';
    trips.forEach(t => {
      const fareTotal = parseFloat(t.price || 0) || 0;
      const netUsd = (fareTotal * DRIVER_NET_SHARE).toFixed(2); // 85% Neto (15% comisión JunRide)
      const netBs = (netUsd * currentBcvRate).toFixed(2);
      const ratingNum = Math.max(1, Math.min(5, parseInt(t.clientRating || 5)));
      const stars = '★'.repeat(ratingNum) + '☆'.repeat(5 - ratingNum);
      const commentHtml = t.clientComment ? `<div class="history-comment-box">"${escapeHTML(t.clientComment)}"</div>` : '';
      
      const liveAvatar = clientAvatarsMap[t.clientId] || t.clientAvatar || 'https://files.catbox.moe/oh53r9.png';
      const safeClientName = escapeHTML(t.clientName || 'Pasajero');
      const dateStr = t.completedAt || t.createdAt ? (new Date(t.completedAt || t.createdAt).toLocaleDateString() + ' ' + new Date(t.completedAt || t.createdAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})) : 'Reciente';

      const card = document.createElement('div');
      card.className = 'driver-history-card';
      card.style.marginBottom = '8px';
      card.innerHTML = `
        <div class="history-card-header">
          <div style="display:flex; align-items:center; gap:8px;">
            <img src="${escapeHTML(liveAvatar)}" class="history-driver-avatar-thumb" alt="${safeClientName}" title="Toca para ampliar foto">
            <div>
              <span class="badge-tag-neon">${escapeHTML(t.service || 'Viaje')}</span>
              <strong style="margin-left:4px; font-size:0.85rem; color:#fff;">👤 ${safeClientName}</strong>
            </div>
          </div>
          <strong style="color:var(--primary); font-size:0.95rem;">+$${netUsd} USD</strong>
        </div>

        <div class="history-route-row" style="margin:4px 0;">
          <span style="font-size:0.78rem;">📍 ${escapeHTML(t.pickup)} ➔ 🏁 ${escapeHTML(t.dropoff)}</span>
        </div>

        <div class="history-meta-row">
          <span>📅 ${escapeHTML(dateStr)} (Bs. ${netBs})</span>
          <span class="history-rating-stars">${stars}</span>
        </div>

        ${commentHtml}
      `;

      const imgThumb = card.querySelector('.history-driver-avatar-thumb');
      if (imgThumb) {
        imgThumb.addEventListener('click', () => openImageLightbox(liveAvatar, `Pasajero: ${t.clientName || 'Cliente'}`));
      }
      container.appendChild(card);
    });

  } catch(err) {
    console.warn("Error al cargar historial de chofer:", err);
    container.innerHTML = '<p style="font-size:0.78rem; color:var(--text-muted);">No se pudieron cargar las carreras en este momento.</p>';
  }
}

// ==============================================================
// DOBLE VERIFICACIÓN UNIFICADA Y BLINDADA (BDV, ZINLI, BINANCE)
// ==============================================================
function parseAmountToNumber(val) {
  if (typeof val === 'number') return val;
  if (!val) return 0;
  const cleanStr = val.toString().trim().replace(/\s/g, '');
  if (cleanStr.includes(',') && cleanStr.includes('.')) {
    return parseFloat(cleanStr.replace(/\./g, '').replace(',', '.')) || 0;
  }
  return parseFloat(cleanStr.replace(',', '.')) || 0;
}

async function verifyPaymentReference(e) {
  e.preventDefault();
  triggerHaptic(50);
  if (!userData || !currentUserId) return;

  const refInput = document.getElementById('pay-ref-input');
  const amountInput = document.getElementById('pay-amount-input');
  const submitBtn = document.getElementById('btn-submit-recharge');

  const ref = cleanInputText(refInput.value, 25);
  const inputAmountNum = parseAmountToNumber(amountInput.value);

  if (!ref || inputAmountNum <= 0 || inputAmountNum > 500000) {
    showNeonToast('error', 'Por favor ingresa una referencia válida y el monto exacto.');
    return;
  }

  if (!db) {
    showNeonToast('error', 'Error al conectar con la base de datos de pagos.');
    return;
  }

  const collectionMap = {
    'bdv': { col: 'verificacion_pagos', label: 'Pago Móvil BDV', isBs: true },
    'zinli': { col: 'verificacion_pagos_zinli', label: 'Zinli', isBs: false },
    'binance': { col: 'verificacion_pagos_binance', label: 'Binance Pay', isBs: false }
  };

  const targetConfig = collectionMap[selectedRechargeMethodKey];
  if (!targetConfig) return;

  submitBtn.disabled = true;
  submitBtn.innerText = 'Verificando con el servidor...';

  try {
    const snap = await db.collection(targetConfig.col)
      .where('referencia_6digitos', '==', ref)
      .get();

    if (snap.empty) {
      showNeonToast('error', `❌ Pago de ${targetConfig.label} no encontrado. Verifica la referencia o espera unos minutos.`);
      return;
    }

    let paymentDoc = null;
    snap.forEach(doc => {
      paymentDoc = { ...doc.data(), docId: doc.id };
    });

    if (paymentDoc.canjeado_en_junride === true || paymentDoc.canjeado_en_junride === 'true') {
      showNeonToast('error', `⚠️ Esta referencia de ${targetConfig.label} ya fue acreditada anteriormente.`);
      return;
    }

    const dbAmountNum = parseAmountToNumber(paymentDoc.monto);
    const diff = Math.abs(dbAmountNum - inputAmountNum);

    if (diff > 0.05) {
      const currencySymbol = targetConfig.isBs ? 'Bs.' : 'USD';
      showNeonToast('error', `❌ El monto ingresado (${inputAmountNum.toFixed(2)} ${currencySymbol}) no coincide con el registro verificado.`);
      return;
    }

    const creditedUsd = targetConfig.isBs
      ? Number((dbAmountNum / currentBcvRate).toFixed(2))
      : Number(dbAmountNum.toFixed(2));

    await db.collection(targetConfig.col).doc(paymentDoc.docId).update({
      canjeado_en_junride: true,
      usuario_id: currentUserId,
      fecha_acreditado_junride: new Date().toISOString()
    });

    userData.kmBalance = Number(((parseFloat(userData.kmBalance) || 0) + creditedUsd).toFixed(2));
    logWalletMovement('credit', `${targetConfig.label} (#${ref})`, creditedUsd);

    await db.collection('users').doc(currentUserId).update({
      kmBalance: userData.kmBalance,
      walletLedger: userData.walletLedger
    });

    updateUIProfile();
    playChimeSound();
    showNeonToast('success', `🎉 ¡Pago ${targetConfig.label} verificado! Se acreditaron +$${creditedUsd.toFixed(2)} USD.`);
    e.target.reset();

  } catch (err) {
    console.error("Error en verificación de pago:", err);
    showNeonToast('error', 'Error al procesar la verificación con la base de datos.');
  } finally {
    submitBtn.disabled = false;
    submitBtn.innerText = 'Verificar y Acreditar Saldo';
  }
}

function logWalletMovement(type, title, amount) {
  if (!userData) return;
  if (!userData.walletLedger) userData.walletLedger = [];
  userData.walletLedger.unshift({
    type: type,
    title: cleanInputText(title, 60),
    amount: parseFloat(amount) || 0,
    date: new Date().toLocaleTimeString()
  });
  localStorage.setItem(STORAGE_KEY_USER, JSON.stringify(userData));
  renderWalletLedger();
}

function renderWalletLedger() {
  const container = document.getElementById('wallet-ledger-list');
  if (!container) return;
  const ledger = userData ? (userData.walletLedger || []) : [];
  container.innerHTML = '';
  ledger.slice(0, 5).forEach(item => {
    let sign = item.type === 'debit' ? '-' : '+';
    let color = item.type === 'debit' ? '#ef4444' : '#00ff87';
    const numAmt = parseFloat(item.amount) || 0;
    container.innerHTML += `
      <div style="display:flex; justify-content:space-between; align-items:center; padding:8px 12px; background:rgba(255,255,255,0.03); border-radius:12px; margin-bottom:6px; font-size:0.78rem;">
        <div><strong>${escapeHTML(item.title)}</strong><p style="font-size:0.68rem; color:#94a3b8;">${escapeHTML(item.date)}</p></div>
        <strong style="color:${color};">${sign}$${numAmt.toFixed(2)}</strong>
      </div>`;
  });
}

// ==============================================================
// MAPA EXACTO CON VISTA SATELITAL Y CONTROL DE PUESTOS EN VIVO
// ==============================================================
function toggleStopInput() {
  triggerHaptic();
  hasIntermediateStop = !hasIntermediateStop;
  const stopBox = document.getElementById('stop-row-box');
  if (stopBox) stopBox.style.display = hasIntermediateStop ? 'block' : 'none';
  calculateRouteOrder();
}

function adjustSeats(delta) {
  triggerHaptic();
  const limitSeats = Math.max(1, maxAvailableSeatsInZone || 12);
  coSharedSeats = Math.max(1, Math.min(limitSeats, coSharedSeats + delta));
  const seatsVal = document.getElementById('seats-count-val');
  if (seatsVal) seatsVal.innerText = coSharedSeats;
  calculateRouteOrder();
}

function openRideOrderScreen(category = 'Carro') {
  triggerHaptic();
  if (!userData) {
    openAuthModal('register');
    return;
  }
  selectedOrderCategory = category;
  document.getElementById('screen-ride-order').classList.add('active');
  selectOrderVehicle(category);
  setTimeout(() => {
    initOrderMap();
    calculateRouteOrder();
  }, 150);
}

function closeRideOrderScreen() {
  triggerHaptic();
  document.getElementById('screen-ride-order').classList.remove('active');
}
function selectOrderVehicle(cat) {
  triggerHaptic(20);
  selectedOrderCategory = cat;
  document.querySelectorAll('.order-veh-chip').forEach(el => el.classList.remove('selected'));
  if (cat === 'Carro') document.getElementById('chip-carro').classList.add('selected');
  else if (cat === 'Moto') document.getElementById('chip-moto').classList.add('selected');
  else if (cat === 'Colectivo') document.getElementById('chip-puesto').classList.add('selected');
  else if (cat === 'Carga') document.getElementById('chip-carga').classList.add('selected');
  
  const seatsBox = document.getElementById('seats-selector-box');
  if (seatsBox) seatsBox.style.display = (cat === 'Colectivo') ? 'flex' : 'none';

  const radarIcon = document.getElementById('radar-vehicle-icon');
  if (radarIcon) {
    if (cat === 'Carro') radarIcon.src = 'carro.png';
    else if (cat === 'Moto') radarIcon.src = 'moto.png';
    else if (cat === 'Colectivo') radarIcon.src = 'puesto.png';
    else if (cat === 'Carga') radarIcon.src = 'carga.png';
  }

  listenRealDriversInZone();
  calculateRouteOrder();
}


function createNeonPinIcon(label) {
  return L.divIcon({
    className: 'custom-neon-pin-wrapper',
    html: `
      <div class="custom-neon-pin">
        <svg viewBox="0 0 24 24" width="34" height="34" fill="#00ff87">
          <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
        </svg>
        <div class="pin-label-popup">${escapeHTML(label)}</div>
      </div>
    `,
    iconSize: [34, 46],
    iconAnchor: [17, 34]
  });
}

function toggleOrderMapLayer() {
  triggerHaptic(30);
  if (!orderMapInstance || !orderStreetLayer || !orderSatelliteLayer) return;
  isSatelliteView = !isSatelliteView;
  const btn = document.getElementById('btn-toggle-map-style');

  if (isSatelliteView) {
    orderMapInstance.removeLayer(orderStreetLayer);
    orderSatelliteLayer.addTo(orderMapInstance);
    if (btn) {
      btn.innerText = '🗺️ Mapa Calles';
      btn.classList.add('active');
    }
    showNeonToast('info', '🛰️ Vista Satélite activada: Toca tu techo o calle exacta.');
  } else {
    orderMapInstance.removeLayer(orderSatelliteLayer);
    orderStreetLayer.addTo(orderMapInstance);
    if (btn) {
      btn.innerText = '🛰️ Vista Satélite';
      btn.classList.remove('active');
    }
    showNeonToast('info', '🗺️ Mapa de Calles nítido activado.');
  }
}

function initOrderMap() {
  const origPt = customOriginCoords || JUNQUITO_ALL_KMS[selectedOriginIdx];
  const destPt = JUNQUITO_ALL_KMS[selectedDestIdx];

  if (orderMapInstance) { orderMapInstance.remove(); orderMapInstance = null; }
  
  orderMapInstance = L.map('order-leaflet-map', { 
    zoomControl: false, 
    attributionControl: false,
    minZoom: 11,
    maxZoom: 19
  }).setView([origPt.lat, origPt.lon], 16);
  
  // Capa 1: Calles nítidas (sin filtro negro que ocultaba calles)
  orderStreetLayer = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19
  });

  // Capa 2: Satélite de alta resolución (Esri World Imagery)
  orderSatelliteLayer = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
    maxZoom: 19
  });

  if (isSatelliteView) {
    orderSatelliteLayer.addTo(orderMapInstance);
  } else {
    orderStreetLayer.addTo(orderMapInstance);
  }

  // AL TOCAR EL MAPA: Clava el pin en el punto EXACTO donde el usuario tocó (sin imán al Km 5)
  orderMapInstance.on('click', async function(e) {
    triggerHaptic(20);
    const exactLat = e.latlng.lat;
    const exactLon = e.latlng.lng;
    const est = findClosestKmEstimate(exactLat, exactLon);

    customOriginCoords = { lat: exactLat, lon: exactLon };
    selectedOriginIdx = est.index;

    if (originMarker) originMarker.setLatLng([exactLat, exactLon]);

    const street = await resolveExactStreetName(exactLat, exactLon);
    const labelText = street
      ? `📍 ${street} (Ref: Km ${JUNQUITO_ALL_KMS[est.index].km})`
      : `📍 Punto Exacto (${est.kmName})`;

    customOriginLabel = labelText;
    const triggerEl = document.getElementById('trigger-origin-name');
    if (triggerEl) triggerEl.innerText = labelText;

    calculateRouteOrder();
  });

  originMarker = L.marker([origPt.lat, origPt.lon], {
    icon: createNeonPinIcon('Tu Ubicación'),
    draggable: true
  }).addTo(orderMapInstance);

  originMarker.on('dragend', async function(e) {
    const pos = e.target.getLatLng();
    const est = findClosestKmEstimate(pos.lat, pos.lng);
    customOriginCoords = { lat: pos.lat, lon: pos.lng };
    selectedOriginIdx = est.index;
    const street = await resolveExactStreetName(pos.lat, pos.lng);
    const labelText = street ? `📍 ${street} (Ref: Km ${JUNQUITO_ALL_KMS[est.index].km})` : `📍 Punto Exacto (${est.kmName})`;
    customOriginLabel = labelText;
    const triggerEl = document.getElementById('trigger-origin-name');
    if (triggerEl) triggerEl.innerText = labelText;
    calculateRouteOrder();
  });

  destMarker = L.marker([destPt.lat, destPt.lon], { icon: createNeonPinIcon('Destino') }).addTo(orderMapInstance);

  listenRealDriversInZone();
  drawRouteOnMap(origPt, destPt);
}

// ESCUCHA CHOFERES EN EL MAPA Y MUESTRA CUÁNTOS PUESTOS LIBRES LES QUEDAN
function listenRealDriversInZone() {
  if (!db || !orderMapInstance || !userData) return;

  db.collection('drivers_online').onSnapshot(snapshot => {
    if (!orderMapInstance) return;

    const currentActiveIds = {};
    let totalColectivoSeatsFound = 0;
    let colectivosCount = 0;

    snapshot.forEach(doc => {
      const driver = doc.data();
      const driverId = doc.id;

      if (currentUserId && driverId === currentUserId) return;

      const matchesCategory = (driver.vehicleType || 'Carro') === selectedOrderCategory;
      if (!matchesCategory) return;

      currentActiveIds[driverId] = true;

      const maxS = parseInt(driver.maxSeats || 4) || 4;
      const availS = parseInt(driver.availableSeats !== undefined ? driver.availableSeats : maxS);

      if (selectedOrderCategory === 'Colectivo' && availS > 0) {
        colectivosCount++;
        if (availS > totalColectivoSeatsFound) totalColectivoSeatsFound = availS;
      }

            const iconImg = selectedOrderCategory === 'Moto' ? 'moto.png'
        : selectedOrderCategory === 'Colectivo' ? 'puesto.png'
        : selectedOrderCategory === 'Carga' ? 'carga.png'
        : 'carro.png';

      const safeFirstName = escapeHTML(driver.name ? driver.name.split(' ')[0] : 'Chofer');
      const seatsBadgeHtml = (selectedOrderCategory === 'Colectivo')
        ? `<span class="driver-seats-pill-tag">${availS}/${maxS} Libres</span>`
        : '';

      const customDriverIcon = L.divIcon({
        className: 'driver-real-icon-wrap',
        html: `
          <div class="driver-real-marker-box">
            <img src="${iconImg}" alt="Chofer Real">
            <span class="driver-marker-name-tag">${safeFirstName}</span>
            ${seatsBadgeHtml}
          </div>
        `,
        iconSize: [46, 56],
        iconAnchor: [23, 28]
      });

      if (activeRealDriversMarkers[driverId]) {
        activeRealDriversMarkers[driverId].setLatLng([driver.lat, driver.lon]);
        activeRealDriversMarkers[driverId].setIcon(customDriverIcon);
      } else {
        const m = L.marker([driver.lat, driver.lon], { icon: customDriverIcon }).addTo(orderMapInstance);
        m.on('click', () => {
          if (selectedOrderCategory === 'Colectivo') {
            maxAvailableSeatsInZone = Math.max(1, availS);
            if (coSharedSeats > maxAvailableSeatsInZone) {
              coSharedSeats = maxAvailableSeatsInZone;
              document.getElementById('seats-count-val').innerText = coSharedSeats;
              calculateRouteOrder();
            }
            showNeonToast('info', `🚐 Unidad de ${driver.name || 'Chofer'}: le quedan ${availS} de ${maxS} puestos libres.`);
          }
        });
        activeRealDriversMarkers[driverId] = m;
      }
    });

    const statusSeatsEl = document.getElementById('live-colectivos-seats-status');
    if (statusSeatsEl && selectedOrderCategory === 'Colectivo') {
      if (colectivosCount > 0) {
        maxAvailableSeatsInZone = totalColectivoSeatsFound;
        statusSeatsEl.innerText = `🟢 ${colectivosCount} unidad(es) en línea • Hasta ${totalColectivoSeatsFound} puestos libres ahora`;
      } else {
        maxAvailableSeatsInZone = 12;
        statusSeatsEl.innerText = `🚐 Pide tus puestos (Unidades de 4, 6, 8 o 12 asientos recibirán tu alerta)`;
      }
    }

    Object.keys(activeRealDriversMarkers).forEach(id => {
      if (!currentActiveIds[id]) {
        orderMapInstance.removeLayer(activeRealDriversMarkers[id]);
        delete activeRealDriversMarkers[id];
      }
    });

  }, () => {});
}

async function drawRouteOnMap(startCoords, endCoords) {
  if (orderRouteLayer && orderMapInstance) {
    orderMapInstance.removeLayer(orderRouteLayer);
    orderRouteLayer = null;
  }

  if (originMarker) originMarker.setLatLng([startCoords.lat, startCoords.lon]);
  if (destMarker) destMarker.setLatLng([endCoords.lat, endCoords.lon]);

  const url = `https://router.project-osrm.org/route/v1/driving/${startCoords.lon},${startCoords.lat};${endCoords.lon},${endCoords.lat}?overview=full&geometries=geojson`;
  
  try {
    const res = await fetch(url);
    const data = await res.json();
    if (data.routes && data.routes.length > 0) {
      const coords = data.routes[0].geometry.coordinates.map(c => [c[1], c[0]]);
      orderRouteLayer = L.polyline(coords, { color: '#00ff87', weight: 4.5 }).addTo(orderMapInstance);
      return;
    }
  } catch(e) {}

  orderRouteLayer = L.polyline([[startCoords.lat, startCoords.lon], [endCoords.lat, endCoords.lon]], {
    color: '#00ff87',
    weight: 4,
    dashArray: '6, 6'
  }).addTo(orderMapInstance);
}

function calculateRouteOrder() {
  const origPt = customOriginCoords || JUNQUITO_ALL_KMS[selectedOriginIdx];
  const destPt = JUNQUITO_ALL_KMS[selectedDestIdx];

  // Distancia real combinada con diferencia de kilómetros
  const dLatKm = (origPt.lat - destPt.lat) * 111.0;
  const dLonKm = (origPt.lon - destPt.lon) * 109.0;
  const straightDistKm = Math.hypot(dLatKm, dLonKm) * 1.35;
  const tableDistKm = Math.abs(JUNQUITO_ALL_KMS[selectedOriginIdx].km - JUNQUITO_ALL_KMS[selectedDestIdx].km);
  let distKm = Math.max(tableDistKm, straightDistKm);

  if (hasIntermediateStop) {
    distKm += Math.abs(JUNQUITO_ALL_KMS[selectedOriginIdx].km - JUNQUITO_ALL_KMS[selectedStopIdx].km) * 0.4;
  }

  let pMoto = Math.round((Math.max(1.5, 1.5 + (distKm * 0.20))) * 10) / 10;
  let pCarro = Math.round((Math.max(2.5, 2.5 + (distKm * 0.35))) * 10) / 10;
  let pPuesto = (1.00 * coSharedSeats);
  let pCarga = Math.round((Math.max(4.0, 4.0 + (distKm * 0.50))) * 10) / 10;

  if (isMountainFog) {
    pMoto = Math.round((pMoto * 1.15) * 10) / 10;
    pCarro = Math.round((pCarro * 1.15) * 10) / 10;
    pCarga = Math.round((pCarga * 1.15) * 10) / 10;
  }

  const pMotoEl = document.getElementById('price-moto');
  if (pMotoEl) pMotoEl.innerText = `$${pMoto.toFixed(2)}`;

  const pCarroEl = document.getElementById('price-carro');
  if (pCarroEl) pCarroEl.innerText = `$${pCarro.toFixed(2)}`;

  const pPuestoEl = document.getElementById('price-puesto');
  if (pPuestoEl) pPuestoEl.innerText = `$${pPuesto.toFixed(2)}`;

  const pCargaEl = document.getElementById('price-carga');
  if (pCargaEl) pCargaEl.innerText = `$${pCarga.toFixed(2)}`;

  if (selectedOrderCategory === 'Moto') calculatedOrderPrice = pMoto;
  else if (selectedOrderCategory === 'Colectivo') calculatedOrderPrice = pPuesto;
  else if (selectedOrderCategory === 'Carga') calculatedOrderPrice = pCarga;
  else calculatedOrderPrice = pCarro;

  offeredOrderPrice = calculatedOrderPrice;
  const fareDisp = document.getElementById('order-fare-display');
  if (fareDisp) fareDisp.innerText = `$${offeredOrderPrice.toFixed(2)}`;

  const fareVes = document.getElementById('order-fare-ves');
  if (fareVes) fareVes.innerText = (offeredOrderPrice * currentBcvRate).toFixed(2);

  if (orderMapInstance) {
    drawRouteOnMap(origPt, destPt);
  }
}

function adjustOrderPrice(delta) {
  triggerHaptic(20);
  offeredOrderPrice = Math.min(150.0, Math.max(1.0, Math.round((offeredOrderPrice + delta) * 10) / 10));
  document.getElementById('order-fare-display').innerText = `$${offeredOrderPrice.toFixed(2)}`;
  document.getElementById('order-fare-ves').innerText = (offeredOrderPrice * currentBcvRate).toFixed(2);
}

// ==============================================================
// SOLICITUD DE CARRERA EN VIVO (GUARDA COORDENADA EXACTA Y ASIENTOS)
// ==============================================================
async function confirmOrderTrip() {
  triggerHaptic(80);
  if (!userData || !db) {
    showNeonToast('error', 'Error de conexión con el servidor.');
    return;
  }

  offeredOrderPrice = Math.min(150.0, Math.max(1.0, parseFloat(offeredOrderPrice) || 2.50));

  const payMode = document.getElementById('order-pay-mode').value;
  const currentBalance = parseFloat(userData.kmBalance) || 0;

  if (payMode === 'cartera' && currentBalance < offeredOrderPrice) {
    showNeonToast('error', 'Saldo insuficiente en tu cartera digital. Recarga saldo o selecciona pagar en efectivo.');
    return;
  }

  const origPt = customOriginCoords || JUNQUITO_ALL_KMS[selectedOriginIdx];
  const destPt = JUNQUITO_ALL_KMS[selectedDestIdx];
  const exactRefText = cleanInputText(document.getElementById('origin-exact-reference-input') ? document.getElementById('origin-exact-reference-input').value : '', 90);
  const baseOriginName = customOriginLabel || JUNQUITO_ALL_KMS[selectedOriginIdx].name;
  const fullPickupText = exactRefText ? `${baseOriginName} (${exactRefText})` : baseOriginName;

  const otpCode = Math.floor(1000 + Math.random() * 9000).toString();

  const tripPayload = {
    clientId: currentUserId,
    clientName: cleanInputText(`${userData.name || 'Usuario'} ${userData.lastname || ''}`, 60),
    clientPhone: cleanInputText(userData.phone, 18),
    clientAvatar: userData.avatar || 'https://files.catbox.moe/oh53r9.png',
    service: selectedOrderCategory === 'Colectivo' ? `Por Puesto (${coSharedSeats} asiento${coSharedSeats > 1 ? 's' : ''})` : selectedOrderCategory,
    seatsRequested: selectedOrderCategory === 'Colectivo' ? coSharedSeats : 1,
    pickup: fullPickupText,
    pickupCoords: { lat: origPt.lat, lon: origPt.lon },
    dropoff: destPt.name,
    dropoffCoords: { lat: destPt.lat, lon: destPt.lon },
    paymentMode: payMode,
    price: offeredOrderPrice.toFixed(2),
    otp: otpCode,
    status: 'Buscando conductor',
    createdAt: new Date().toISOString()
  };

  try {
    const docRef = await db.collection('trips').add(tripPayload);
    activeTripId = docRef.id;
    localStorage.setItem('jr_active_trip_id', activeTripId);

    if (payMode === 'cartera') {
      escrowHeldAmount = offeredOrderPrice;
      userData.kmBalance = Number((currentBalance - offeredOrderPrice).toFixed(2));
      logWalletMovement('debit', `Retención Carrera (${JUNQUITO_ALL_KMS[selectedOriginIdx].name})`, offeredOrderPrice);
      
      await db.collection('users').doc(currentUserId).update({
        kmBalance: userData.kmBalance,
        walletLedger: userData.walletLedger
      });
      updateUIProfile();
    } else {
      escrowHeldAmount = 0.00;
    }

    showNeonToast('success', '📡 Ubicación exacta enviada a los choferes.');
    startBackgroundChatListener(activeTripId);

    document.getElementById('passenger-otp-val').innerText = otpCode;
    document.getElementById('order-form-controls').style.display = 'none';
    document.getElementById('search-radar-box').style.display = 'flex';
  } catch(err) {
    console.error("Error al crear viaje:", err);
    showNeonToast('error', 'No se pudo enviar la solicitud. Verifica tu conexión a internet.');
  }
}

async function cancelTrip(isManual = false) {
  triggerHaptic(50);
  if (activeTripId) {
    if (escrowHeldAmount > 0 && userData) {
      userData.kmBalance = Number(((parseFloat(userData.kmBalance) || 0) + escrowHeldAmount).toFixed(2));
      logWalletMovement('refund', 'Reembolso por Cancelación', escrowHeldAmount);
      escrowHeldAmount = 0.00;
      
      if (db && currentUserId) {
        db.collection('users').doc(currentUserId).update({
          kmBalance: userData.kmBalance,
          walletLedger: userData.walletLedger
        }).catch(() => {});
      }
      updateUIProfile();
    }

    if (db) {
      await db.collection('trips').doc(activeTripId).delete().catch(() => {});
    }
    localStorage.removeItem('jr_active_trip_id');
    localStorage.removeItem('jr_driver_active_trip_cache');
    activeTripId = null;
    currentTripData = null;

    if (backgroundChatUnsubscribe) {
      backgroundChatUnsubscribe();
      backgroundChatUnsubscribe = null;
    }

    document.getElementById('search-radar-box').style.display = 'none';
    document.getElementById('order-form-controls').style.display = 'block';
    document.getElementById('live-tracking-box').style.display = 'none';

    if (isManual) showNeonToast('info', '✅ Solicitud cancelada. Tus fondos están de vuelta en tu cartera.');
  }
}

// ==============================================================
// CONEXIÓN DEL CHOFER EN VIVO Y RESTA AUTOMÁTICA DE PUESTOS
// ==============================================================
function toggleDriverStatus() {
  triggerHaptic();
  if (!userData) return;

  const driverRating = parseFloat(userData.driverRating !== undefined ? userData.driverRating : 5.00) || 5.00;
  const ratingCount = parseInt(userData.driverRatingCount || 1) || 1;
  if (driverRating < 3.00 && ratingCount >= 2) {
    showNeonToast('error', 'Tu cuenta está suspendida por tener calificación menor a 3.0 estrellas.');
    return;
  }

  if (userData.verifiedDriver !== true) {
    showNeonToast('warning', 'Tu cuenta debe estar verificada por soporte antes de conectarte.');
    openKycWhatsAppModal();
    return;
  }

  isDriverOnline = !isDriverOnline;
  const statusImg = document.getElementById('img-driver-toggle-state');
  const statusBtn = document.getElementById('btn-driver-status-img');
  const statusText = document.getElementById('driver-status-text');
  const seatsControlBox = document.getElementById('driver-live-seats-control');

  if (isDriverOnline) {
    if (statusImg) statusImg.src = "https://files.catbox.moe/wboolc.png";
    if (statusBtn) statusBtn.classList.add('online');
    if (statusText) {
      statusText.innerText = "🟢 Conectado con Voz (Esperando carreras)";
      statusText.style.color = "#00ff87";
    }
    if (seatsControlBox) {
      seatsControlBox.style.display = (userData.vehicleType === 'Colectivo') ? 'block' : 'none';
      const maxS = parseInt(userData.maxSeats || 4) || 4;
      const availS = parseInt(userData.availableSeats !== undefined ? userData.availableSeats : maxS);
      const disp = document.getElementById('driver-live-avail-seats-val');
      if (disp) disp.innerText = `${availS} / ${maxS} Libres`;
    }

    speakDriverAlert("Modo chofer activado. Transmitiendo ubicación exacta.");
    fetchPendingTripsForDriver();

    if (navigator.geolocation) {
      driverGeoWatchId = navigator.geolocation.watchPosition(pos => {
        if (db && currentUserId) {
          const maxS = parseInt(userData.maxSeats || 4) || 4;
          const availS = parseInt(userData.availableSeats !== undefined ? userData.availableSeats : maxS);
          db.collection('drivers_online').doc(currentUserId).set({
            name: cleanInputText(`${userData.name || 'Chofer'} ${userData.lastname || ''}`, 50),
            lat: pos.coords.latitude,
            lon: pos.coords.longitude,
            heading: pos.coords.heading || 0,
            vehicleType: userData.vehicleType || 'Moto',
            maxSeats: maxS,
            availableSeats: availS,
            updatedAt: new Date()
          }, { merge: true }).catch(() => {});
        }
      }, () => {}, { enableHighAccuracy: true, maximumAge: 3000, timeout: 8000 });
    }

  } else {
    if (statusImg) statusImg.src = "https://files.catbox.moe/qi6nhs.png";
    if (statusBtn) statusBtn.classList.remove('online');
    if (statusText) {
      statusText.innerText = "🔴 Desconectado (Toca el botón para conectarte)";
      statusText.style.color = "#ef4444";
    }
    if (seatsControlBox) seatsControlBox.style.display = 'none';
    speakDriverAlert("Modo chofer desconectado.");

    const driverList = document.getElementById('driver-requests-list');
    if (driverList) driverList.innerHTML = '';

    if (driverGeoWatchId) {
      navigator.geolocation.clearWatch(driverGeoWatchId);
      driverGeoWatchId = null;
    }
    if (db && currentUserId) {
      db.collection('drivers_online').doc(currentUserId).delete().catch(() => {});
    }
  }
}

function fetchPendingTripsForDriver() {
  if (!db || !userData) return;
  db.collection('trips').where('status', '==', 'Buscando conductor').get().then(snapshot => {
    const driverList = document.getElementById('driver-requests-list');
    if (!driverList) return;
    driverList.innerHTML = '';

    if (snapshot.empty && !activeTripId) {
      driverList.innerHTML = '<p style="font-size:0.75rem; color:#94a3b8; text-align:center;">No hay solicitudes activas en este momento.</p>';
      return;
    }

    snapshot.forEach(doc => {
      renderSingleDriverTripCard(doc.id, doc.data());
    });
  }).catch(() => {});
}

function renderSingleDriverTripCard(tripId, trip) {
  const driverList = document.getElementById('driver-requests-list');
  if (!driverList) return;

  const pLat = trip.pickupCoords ? parseFloat(trip.pickupCoords.lat) || 10.4620 : 10.4620;
  const pLon = trip.pickupCoords ? parseFloat(trip.pickupCoords.lon) || -67.0095 : -67.0095;
  const pAvatar = trip.clientAvatar || 'https://files.catbox.moe/oh53r9.png';
  const safeClientName = escapeHTML(trip.clientName || 'Pasajero');
  const netForDriver = ((parseFloat(trip.price || 0) || 0) * DRIVER_NET_SHARE).toFixed(2);

  const li = document.createElement('li');
  li.style.cssText = 'display:flex; flex-direction:column; gap:8px; padding:14px; background:rgba(255,255,255,0.03); border-radius:16px; border:1px solid var(--border-glow); margin-bottom:8px;';
  li.innerHTML = `
    <div style="display:flex; justify-content:space-between; align-items:center;">
      <div>
        <strong style="color:#00ff87; font-size:0.95rem;">${escapeHTML(trip.service)} ($${escapeHTML(trip.price)})</strong>
        <small style="display:block; font-size:0.68rem; color:#38bdf8;">Tu ganancia neta (85%): $${netForDriver} USD</small>
      </div>
      <button class="btn-primary-neon btn-sm btn-accept-trip">Aceptar</button>
    </div>
    <div style="display:flex; align-items:center; gap:8px;">
      <img src="${escapeHTML(pAvatar)}" class="req-passenger-avatar" style="width:34px; height:34px; border-radius:50%; border:1.5px solid var(--primary); object-fit:cover; cursor:pointer;" title="Toca para ampliar foto">
      <p style="font-size:0.78rem; color:#cbd5e1; flex:1;">👤 <strong>${safeClientName}</strong>: ${escapeHTML(trip.pickup)} ➔ ${escapeHTML(trip.dropoff)}</p>
    </div>
    <button class="btn-sm btn-secondary-dim btn-open-map" style="width:100%; font-size:0.72rem;">🗺️ Ver Punto Exacto en Google Maps</button>
  `;

  li.querySelector('.btn-accept-trip').addEventListener('click', () => acceptTrip(tripId, trip.seatsRequested || 1));
  li.querySelector('.req-passenger-avatar').addEventListener('click', () => openImageLightbox(pAvatar, `Pasajero: ${trip.clientName || 'Cliente'}`));
  li.querySelector('.btn-open-map').addEventListener('click', () => openDriverNavExternal(pLat, pLon));

  driverList.appendChild(li);
}

function openDriverNavExternal(lat, lon) {
  triggerHaptic(40);
  const url = `https://www.google.com/maps/dir/?api=1&destination=${lat},${lon}&travelmode=driving`;
  window.open(url, '_blank');
}

function openDriverNavExternalCurrent() {
  triggerHaptic(40);
  if (!currentTripData) return;

  if (currentTripData.status === 'En trayecto' && currentTripData.dropoffCoords) {
    openDriverNavExternal(currentTripData.dropoffCoords.lat, currentTripData.dropoffCoords.lon);
  } else if (currentTripData.pickupCoords) {
    openDriverNavExternal(currentTripData.pickupCoords.lat, currentTripData.pickupCoords.lon);
  } else {
    openDriverNavExternal(10.4620, -67.0095);
  }
}

async function validatePassengerOTP() {
  triggerHaptic(50);
  const enteredOtp = document.getElementById('driver-input-otp').value.trim();
  
  if (!currentTripData) {
    const saved = localStorage.getItem('jr_driver_active_trip_cache');
    if (saved) {
      try { currentTripData = JSON.parse(saved); } catch(e) {}
    }
  }

  if (!activeTripId && currentTripData) {
    activeTripId = currentTripData.id;
  }

  if (!activeTripId || !currentTripData) {
    showNeonToast('error', 'No hay carrera activa seleccionada en este teléfono.');
    return;
  }

  const expectedOtp = (currentTripData.otp || '').toString().trim();

  if (enteredOtp === expectedOtp) {
    playChimeSound();
    speakDriverAlert("PIN correcto. Iniciando viaje hacia el destino.");
    showNeonToast('success', '✅ PIN validado. Viaje iniciado.');

    if (db) {
      await db.collection('trips').doc(activeTripId).update({
        status: 'En trayecto'
      }).catch(() => {});
    }

    document.getElementById('driver-otp-input-area').style.display = 'none';
    document.getElementById('driver-in-route-area').style.display = 'block';
    
    const btnMap = document.getElementById('btn-driver-ext-map');
    if (btnMap) btnMap.innerText = '🗺️ Navegar al Destino';
  } else {
    triggerHaptic(150);
    showNeonToast('error', `❌ PIN incorrecto (${enteredOtp}). Pídele el código al pasajero.`);
  }
}

// ==============================================================
// FINALIZAR VIAJE: COMISIÓN 15% Y CONTROL ESTRICTO DE TOKENS
// ==============================================================
async function completeActiveTripDriver() {
  triggerHaptic(100);
  playChimeSound();

  const fareVal = parseFloat(currentTripData ? currentTripData.price : 2.50) || 2.50;
  // Comisión de JunRide: 15% -> El chofer recibe el 85% neto
  const netEarnings = Number((fareVal * DRIVER_NET_SHARE).toFixed(2));
  const serviceType = currentTripData ? (currentTripData.service || 'Carro') : 'Carro';

  // Tokens más difíciles para el Pasajero (15 por viaje normal, 10 por puesto, 25 por mudanza)
  let passengerTokensAwarded = 15;
  if (serviceType.includes('Puesto') || serviceType === 'Colectivo') passengerTokensAwarded = 10;
  else if (serviceType === 'Carga') passengerTokensAwarded = 25;

  // El Chofer NO gana tokens en los niveles iniciales (solo a partir de 70 carreras completadas)
  let driverTokensAwarded = 0;
  const currentDriverTrips = parseInt(userData ? userData.driverTrips : 0) || 0;
  if (currentDriverTrips >= 250) driverTokensAwarded = 15;
  else if (currentDriverTrips >= 140) driverTokensAwarded = 10;
  else if (currentDriverTrips >= 70) driverTokensAwarded = 5;

  if (userData) {
    userData.driverEarnings = Number(((parseFloat(userData.driverEarnings) || 0) + netEarnings).toFixed(2));
    userData.driverTrips = currentDriverTrips + 1;
    userData.driverTokens = (parseInt(userData.driverTokens) || 0) + driverTokensAwarded;
    localStorage.setItem(STORAGE_KEY_USER, JSON.stringify(userData));
    updateUIProfile();

    if (db && currentUserId) {
      db.collection('users').doc(currentUserId).update({
        driverEarnings: userData.driverEarnings,
        driverTrips: userData.driverTrips,
        driverTokens: userData.driverTokens
      }).catch(() => {});
    }
  }

  if (db && currentTripData && currentTripData.clientId) {
    try {
      const passengerRef = db.collection('users').doc(currentTripData.clientId);
      const passDoc = await passengerRef.get();
      if (passDoc.exists) {
        const pData = passDoc.data();
        const pTrips = (parseInt(pData.passengerTrips || 0) || 0) + 1;
        const pTokens = (parseInt(pData.passengerTokens !== undefined ? pData.passengerTokens : 50) || 0) + passengerTokensAwarded;
        await passengerRef.update({
          passengerTrips: pTrips,
          passengerTokens: pTokens
        });
      }
    } catch(err) {
      console.warn("Fallo al actualizar pasajero en Firestore:", err);
    }
  }

  if (db && activeTripId) {
    await db.collection('trips').doc(activeTripId).update({
      status: 'Completado',
      completedAt: new Date().toISOString(),
      tokensAwarded: passengerTokensAwarded
    }).catch(() => {});
  }

  speakDriverAlert("Viaje completado. Ganancia acreditada.");
  const tokenMsg = driverTokensAwarded > 0 ? ` y +${driverTokensAwarded} Tokens` : '';
  showNeonToast('success', `🏁 ¡Viaje completado! Ganaste +$${netEarnings.toFixed(2)} USD netos (85%)${tokenMsg}.`);

  document.getElementById('driver-active-trip-box').style.display = 'none';
  localStorage.removeItem('jr_active_trip_id');
  localStorage.removeItem('jr_driver_active_trip_cache');
  
  fetchDriverTripHistory();
  activeTripId = null;
  currentTripData = null;
  fetchPendingTripsForDriver();
}

// ==============================================================
// CHAT Y NOTAS DE VOZ EN TIEMPO REAL
// ==============================================================
function openActiveChatModal() {
  triggerHaptic();
  if (!activeTripId) {
    showNeonToast('warning', 'El chat se activa cuando tienes un viaje asignado en curso.');
    return;
  }
  isChatModalOpen = true;
  document.getElementById('modal-active-chat').classList.add('active');
  
  const dotBottom = document.getElementById('nav-unread-badge-driver');
  if (dotBottom) dotBottom.style.display = 'none';
  const dotActiveBtn = document.getElementById('active-trip-unread-dot');
  if (dotActiveBtn) dotActiveBtn.style.display = 'none';
  const dotPassengerLive = document.getElementById('passenger-live-chat-dot');
  if (dotPassengerLive) dotPassengerLive.style.display = 'none';

  listenChatMessagesRealtime();
}

function closeActiveChatModal() {
  isChatModalOpen = false;
  document.getElementById('modal-active-chat').classList.remove('active');
}

function handleChatKeyPress(e) {
  if (e.key === 'Enter') sendChatMessageText();
}

function sendQuickReply(text) {
  document.getElementById('chat-text-input').value = text;
  sendChatMessageText();
}

async function sendChatMessageText() {
  const input = document.getElementById('chat-text-input');
  const text = cleanInputText(input.value, 250);
  if (!text || !activeTripId || !db || !userData) return;

  triggerHaptic(20);
  const senderRole = (userData.role === 'driver') ? 'driver' : 'passenger';
  const senderName = cleanInputText(`${userData.name || 'Usuario'} ${userData.lastname || ''}`, 50);

  await db.collection('trips').doc(activeTripId).collection('messages').add({
    senderId: currentUserId,
    senderRole: senderRole,
    senderName: senderName,
    text: text,
    type: 'text',
    createdAt: new Date().toISOString()
  }).catch(() => {});

  input.value = '';
}

async function toggleAudioRecording() {
  triggerHaptic(50);
  const recordBtn = document.getElementById('btn-record-audio');
  const indicator = document.getElementById('audio-recording-indicator');

  if (!isRecordingAudio) {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorder = new MediaRecorder(stream);
      audioChunks = [];

      mediaRecorder.ondataavailable = e => { if (e.data.size > 0) audioChunks.push(e.data); };

      mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(audioChunks, { type: 'audio/webm' });
        const reader = new FileReader();
        reader.readAsDataURL(audioBlob);
        reader.onloadend = async () => {
          const base64Audio = reader.result;
          if (activeTripId && db && userData) {
            const senderRole = (userData.role === 'driver') ? 'driver' : 'passenger';
            await db.collection('trips').doc(activeTripId).collection('messages').add({
              senderId: currentUserId,
              senderRole: senderRole,
              senderName: cleanInputText(`${userData.name || 'Usuario'} ${userData.lastname || ''}`, 50),
              audioData: base64Audio,
              type: 'audio',
              createdAt: new Date().toISOString()
            }).catch(() => {});
            showNeonToast('success', '🎤 Nota de voz enviada.');
          }
        };
      };

      mediaRecorder.start();
      isRecordingAudio = true;
      recordBtn.classList.add('recording');
      indicator.style.display = 'block';

    } catch(err) {
      showNeonToast('error', 'Permiso de micrófono requerido para enviar notas de voz.');
    }
  } else {
    if (mediaRecorder && mediaRecorder.state !== 'inactive') {
      mediaRecorder.stop();
      mediaRecorder.stream.getTracks().forEach(track => track.stop());
    }
    isRecordingAudio = false;
    recordBtn.classList.remove('recording');
    indicator.style.display = 'none';
  }
}

function listenChatMessagesRealtime() {
  if (!db || !activeTripId) return;
  db.collection('trips').doc(activeTripId).collection('messages').orderBy('createdAt', 'asc').onSnapshot(snapshot => {
    const container = document.getElementById('chat-messages-container');
    if (!container) return;
    container.innerHTML = '';

    snapshot.forEach(doc => {
      const msg = doc.data();
      const isMe = (msg.senderId === currentUserId);
      const bubble = document.createElement('div');
      bubble.className = `chat-msg-bubble ${isMe ? 'sent' : 'received'}`;
      const safeSender = escapeHTML(msg.senderName || 'Usuario');

      if (msg.type === 'audio' && typeof msg.audioData === 'string' && msg.audioData.startsWith('data:audio')) {
        bubble.innerHTML = `
          <strong style="font-size:0.7rem; color:${isMe ? 'var(--primary)' : '#38bdf8'};">${safeSender} (Nota de voz):</strong>
          <div class="chat-audio-player">
            <audio controls src="${msg.audioData}" style="max-width:180px; height:32px;"></audio>
          </div>
        `;
      } else {
        bubble.innerHTML = `
          <strong style="font-size:0.7rem; color:${isMe ? 'var(--primary)' : '#38bdf8'};">${safeSender}:</strong>
          <span>${escapeHTML(msg.text || '')}</span>
        `;
      }
      container.appendChild(bubble);
    });

    container.scrollTop = container.scrollHeight;
  }, () => {});
}

function toggleMountainWeather() {
  triggerHaptic();
  isMountainFog = !isMountainFog;
  const btn = document.getElementById('btn-weather-toggle');
  if (btn) btn.classList.toggle('active', isMountainFog);
  calculateRouteOrder();
  if (isMountainFog) {
    speakDriverAlert("Alerta de niebla activa. Tarifa dinámica ajustada.");
    showNeonToast('warning', 'Alerta de niebla: Recargo dinámico del 15% aplicado a tarifas.');
  } else {
    showNeonToast('info', 'Modo clima normal restablecido.');
  }
}

// ==============================================================
// SISTEMA EN VIVO DE VIAJES DE MADRUGADA (VER, ACEPTAR, COMUNICAR Y ELIMINAR)
// ==============================================================
function openScheduleTripModal() { triggerHaptic(); document.getElementById('modal-schedule-trip').classList.add('active'); }
function closeScheduleTripModal() { document.getElementById('modal-schedule-trip').classList.remove('active'); }

async function confirmScheduleTrip() {
  triggerHaptic();
  if (!userData || !db) return;
  const date = document.getElementById('schedule-date-input').value;
  const hour = cleanInputText(document.getElementById('schedule-hour-val').value, 15);
  const service = cleanInputText(document.getElementById('schedule-service-val').value, 20);
  const pickup = cleanInputText(document.getElementById('trigger-sched-origin-name').innerText, 80);
  const dest = cleanInputText(document.getElementById('trigger-sched-dest-name').innerText, 80);
  const rawFare = parseFloat(document.getElementById('schedule-fare-input').value || 4.0) || 4.0;
  const safeFare = Math.min(150.0, Math.max(1.0, rawFare));

  await db.collection('trips_programados').add({
    clientId: currentUserId,
    clientName: cleanInputText(`${userData.name || 'Usuario'} ${userData.lastname || ''}`, 50),
    clientAvatar: userData.avatar || 'https://files.catbox.moe/oh53r9.png',
    phone: cleanInputText(userData.phone, 18),
    date: date,
    hour: hour,
    service: service,
    pickup: pickup,
    dest: dest,
    fare: safeFare.toFixed(2),
    status: 'Disponible',
    createdAt: new Date().toISOString()
  }).catch(() => {});

  showNeonToast('success', `✅ ¡Solicitud de madrugada montada para el ${date} a las ${hour}!`);
  closeScheduleTripModal();
}

function listenScheduledTripsRealtime() {
  if (!db || !currentUserId || !userData) return;

  db.collection('trips_programados').onSnapshot(snapshot => {
    const passengerSection = document.getElementById('my-scheduled-trips-section');
    const passengerList = document.getElementById('my-scheduled-trips-list');
    const driverSchedList = document.getElementById('driver-scheduled-requests-list');

    if (passengerList) passengerList.innerHTML = '';
    if (driverSchedList) driverSchedList.innerHTML = '';

    let myCount = 0;
    let driverAvailableCount = 0;

    snapshot.forEach(doc => {
      const sched = doc.data();
      const schedId = doc.id;

      // Ignore cancelled/deleted reservations
      if (sched.status === 'Cancelado') return;

      // 1. VISTA DEL PASAJERO: Ver sus solicitudes montadas, quién la aceptó, chatear o eliminarla
      if (sched.clientId === currentUserId && passengerList) {
        myCount++;
        const isAccepted = (sched.status === 'Aceptado' && sched.driverName);
        const card = document.createElement('div');
        card.className = `sched-trip-card ${isAccepted ? 'accepted' : ''}`;

        const driverInfoHtml = isAccepted ? `
          <div style="display:flex; align-items:center; justify-content:space-between; background:rgba(0,255,135,0.1); padding:8px 10px; border-radius:12px; margin-top:4px;">
            <div style="display:flex; align-items:center; gap:8px;">
              <img src="${escapeHTML(sched.driverAvatar || 'https://files.catbox.moe/oh53r9.png')}" style="width:32px; height:32px; border-radius:50%; border:1.5px solid var(--primary); object-fit:cover;">
              <div>
                <strong style="font-size:0.78rem; color:#00ff87; display:block;">✅ Aceptado por: ${escapeHTML(sched.driverName)}</strong>
                <small style="font-size:0.68rem; color:#cbd5e1;">${escapeHTML(sched.driverVehicle || 'Unidad Asignada')}</small>
              </div>
            </div>
            <button type="button" class="btn-primary-neon btn-sm btn-wa-driver" style="padding:6px 10px; font-size:0.7rem;">📲 Hablar</button>
          </div>
        ` : `
          <small style="font-size:0.7rem; color:#fbbf24; font-weight:700;">⏳ Esperando que un chofer acepte tu reserva...</small>
        `;

        card.innerHTML = `
          <div style="display:flex; justify-content:space-between; align-items:center;">
            <span class="badge-tag-neon">${escapeHTML(sched.date)} • ${escapeHTML(sched.hour)}</span>
            <div style="display:flex; align-items:center; gap:8px;">
              <strong style="color:var(--primary); font-size:0.9rem;">$${escapeHTML(sched.fare)}</strong>
              <button type="button" class="btn-sm btn-secondary-dim btn-cancel-sched" style="padding:4px 8px; font-size:0.68rem; color:#ef4444; border-color:rgba(239,68,68,0.4);">🗑️ Eliminar</button>
            </div>
          </div>
          <div style="font-size:0.76rem; color:#fff; font-weight:700;">
            ${escapeHTML(sched.service)}: ${escapeHTML(sched.pickup)} ➔ ${escapeHTML(sched.dest)}
          </div>
          ${driverInfoHtml}
        `;

        card.querySelector('.btn-cancel-sched').addEventListener('click', () => cancelScheduledTrip(schedId));
        if (isAccepted) {
          const waBtn = card.querySelector('.btn-wa-driver');
          if (waBtn) {
            waBtn.addEventListener('click', () => contactScheduledPartnerWhatsApp(sched.driverPhone, `Hola ${sched.driverName}, soy ${userData.name}. Te escribo por mi viaje de madrugada apartado en JunRide para el ${sched.date} a las ${sched.hour} (${sched.pickup} a ${sched.dest}).`));
          }
        }
        passengerList.appendChild(card);
      }

      // 2. VISTA DEL CHOFER: Ver reservas disponibles o aceptadas por él
      if (driverSchedList && (sched.status === 'Disponible' || sched.driverId === currentUserId)) {
        driverAvailableCount++;
        const isMine = (sched.driverId === currentUserId);
        const dCard = document.createElement('div');
        dCard.className = `sched-trip-card ${isMine ? 'accepted' : ''}`;
        dCard.innerHTML = `
          <div style="display:flex; justify-content:space-between; align-items:center;">
            <span class="badge-tag-neon">${escapeHTML(sched.date)} • ${escapeHTML(sched.hour)}</span>
            <strong style="color:#00ff87; font-size:0.95rem;">$${escapeHTML(sched.fare)} USD</strong>
          </div>
          <div style="font-size:0.78rem; color:#fff; font-weight:700;">
            👤 ${escapeHTML(sched.clientName || 'Pasajero')} (${escapeHTML(sched.service)})
          </div>
          <div style="font-size:0.74rem; color:#cbd5e1;">
            📍 ${escapeHTML(sched.pickup)} ➔ 🏁 ${escapeHTML(sched.dest)}
          </div>
          <div style="display:flex; gap:8px; margin-top:4px;">
            ${isMine
              ? `<button type="button" class="btn-primary-neon btn-sm btn-wa-client" style="flex:1; font-size:0.74rem;">📲 Hablar con Pasajero</button>`
              : `<button type="button" class="btn-primary-neon btn-sm btn-accept-sched" style="flex:1; font-size:0.74rem;">✅ Aceptar Madrugada</button>`
            }
          </div>
        `;

        if (isMine) {
          dCard.querySelector('.btn-wa-client').addEventListener('click', () => {
            contactScheduledPartnerWhatsApp(sched.phone, `Hola ${sched.clientName}, soy tu chofer ${userData.name} de JunRide 🏔️. Confirmo tu traslado de madrugada para el ${sched.date} a las ${sched.hour}.`);
          });
        } else {
          dCard.querySelector('.btn-accept-sched').addEventListener('click', () => acceptScheduledTrip(schedId));
        }

        driverSchedList.appendChild(dCard);
      }
    });

    if (passengerSection) {
      passengerSection.style.display = myCount > 0 ? 'block' : 'none';
    }
    if (driverSchedList && driverAvailableCount === 0) {
      driverSchedList.innerHTML = '<p style="font-size:0.74rem; color:#94a3b8; text-align:center;">No hay reservas de madrugada pendientes ahora.</p>';
    }
  }, () => {});
}

async function acceptScheduledTrip(schedId) {
  triggerHaptic(70);
  if (!userData || !db) return;
  if (userData.verifiedDriver !== true) {
    showNeonToast('warning', 'Debes estar verificado como chofer para aceptar viajes de madrugada.');
    return;
  }

  await db.collection('trips_programados').doc(schedId).update({
    status: 'Aceptado',
    driverId: currentUserId,
    driverName: cleanInputText(`${userData.name || 'Chofer'} ${userData.lastname || ''}`, 50),
    driverPhone: cleanInputText(userData.phone, 18),
    driverAvatar: userData.avatar || 'https://files.catbox.moe/oh53r9.png',
    driverVehicle: cleanInputText(`${userData.vehicleType || 'Carro'} - ${userData.vehicleModel || ''} (${userData.vehiclePlate || ''})`, 70),
    acceptedAt: new Date().toISOString()
  }).catch(() => {});

  playChimeSound();
  showNeonToast('success', '⏰ ¡Viaje de madrugada aceptado! Ahora puedes comunicarte con el pasajero.');
}

async function cancelScheduledTrip(schedId) {
  triggerHaptic(50);
  if (!db || !schedId) return;
  try {
    // Actualizamos a 'Cancelado' para cumplir con la regla allow delete: if false en Firestore
    await db.collection('trips_programados').doc(schedId).update({
      status: 'Cancelado',
      cancelledAt: new Date().toISOString()
    });
    showNeonToast('info', '🗑️ Tu solicitud de madrugada fue eliminada.');
  } catch (e) {
    showNeonToast('error', 'No se pudo eliminar la solicitud.');
  }
}

function contactScheduledPartnerWhatsApp(phone, messageText) {
  triggerHaptic(40);
  const cleanPhone = String(phone || '').replace(/\D/g, '');
  const formattedPhone = cleanPhone.startsWith('0') ? '58' + cleanPhone.slice(1) : (cleanPhone.startsWith('58') ? cleanPhone : '58' + cleanPhone);
  window.location.href = `https://wa.me/${formattedPhone}?text=${encodeURIComponent(messageText)}`;
}

function openReportTrafficModal() { triggerHaptic(); document.getElementById('modal-traffic-alert').classList.add('active'); }
function closeReportTrafficModal() { document.getElementById('modal-traffic-alert').classList.remove('active'); }

async function publishRoadAlert() {
  triggerHaptic();
  if (!userData) return;
  const incident = cleanInputText(document.getElementById('incident-type-val').value, 50);
  const km = cleanInputText(document.getElementById('trigger-traffic-km-name').innerText, 60);
  if (db) {
    await db.collection('alertas_viales').add({
      incident, km,
      reportedBy: cleanInputText(`${userData.name || 'Usuario'} ${userData.lastname || ''}`, 50),
      createdAt: new Date()
    }).catch(() => {});
  }
  showNeonToast('success', `Alerta vial publicada: "${incident}" en ${km}.`);
  closeReportTrafficModal();
}

function openKycWhatsAppModal() { triggerHaptic(); document.getElementById('modal-kyc-whatsapp').classList.add('active'); }
function closeKycWhatsAppModal() { document.getElementById('modal-kyc-whatsapp').classList.remove('active'); }

function sendKycToWhatsApp() {
  const userName = userData ? `${userData.name} ${userData.lastname || ''}`.trim() : 'Conductor';
  const userPhone = userData ? userData.phone : 'S/T';
  const vehType = userData ? (userData.vehicleType || 'Moto') : 'Vehículo';
  const vehPlate = userData ? (userData.vehiclePlate || 'S/P') : 'S/P';

  const msg = encodeURIComponent(`Hola Soporte JunRide 🏔️. Envío mis recaudos para verificación de Chofer:\n👤 Nombre: ${userName}\n📱 Teléfono: ${userPhone}\n🚗 Unidad: ${vehType} (${vehPlate})\n(Adjunto foto de Licencia y Carnet de Circulación)`);
  window.location.href = `https://wa.me/584123167126?text=${msg}`;
  closeKycWhatsAppModal();
}

function requestWeeklyPayout() {
  triggerHaptic();
  if (!userData) return;
  const payoutVal = parseFloat(userData.driverEarnings) || 0;
  if (payoutVal <= 0) { showNeonToast('warning', 'No tienes ganancias pendientes por liquidar.'); return; }
  const bcvVal = (payoutVal * currentBcvRate).toFixed(2);
  const msg = encodeURIComponent(`Hola Administración JunRide 🏔️.\nSolicito liquidación de mis ganancias netas (85%):\n👤 Chofer: ${userData.name}\n💵 Monto Neto: $${payoutVal.toFixed(2)} USD (Bs. ${bcvVal})`);
  window.location.href = `https://wa.me/584123167126?text=${msg}`;
}

// ==============================================================
// SINCRONIZACIÓN DE VIAJES ACTIVOS EN TIEMPO REAL
// ==============================================================
function listenTripsRealtime() {
  if (!db || !currentUserId || !userData) return;

  db.collection('trips')
    .where('status', 'in', ['Buscando conductor', 'Conductor asignado', 'En trayecto', 'Completado'])
    .onSnapshot(snapshot => {
      const driverList = document.getElementById('driver-requests-list');

      snapshot.forEach(doc => {
        const trip = doc.data();
        const tripId = doc.id;

        if (trip.driverId === currentUserId && (trip.status === 'Conductor asignado' || trip.status === 'En trayecto')) {
          activeTripId = tripId;
          currentTripData = { ...trip, id: tripId };
          localStorage.setItem('jr_active_trip_id', tripId);
          localStorage.setItem('jr_driver_active_trip_cache', JSON.stringify(currentTripData));

          startBackgroundChatListener(tripId);

          const tripBox = document.getElementById('driver-active-trip-box');
          if (tripBox) {
            tripBox.style.display = 'block';
            document.getElementById('driver-trip-fare-badge').innerText = `$${trip.price}`;
            document.getElementById('driver-trip-route-info').innerText = `${trip.pickup} ➔ ${trip.dropoff}`;
            
            const passNameEl = document.getElementById('driver-passenger-name');
            if (passNameEl) passNameEl.innerText = `${trip.clientName || 'Pasajero en espera'}`;

            const passAvatarImg = document.getElementById('driver-passenger-avatar-img');
            if (passAvatarImg) passAvatarImg.src = trip.clientAvatar || 'https://files.catbox.moe/oh53r9.png';

            if (trip.status === 'En trayecto') {
              document.getElementById('driver-otp-input-area').style.display = 'none';
              document.getElementById('driver-in-route-area').style.display = 'block';
              const btnMap = document.getElementById('btn-driver-ext-map');
              if (btnMap) btnMap.innerText = '🗺️ Navegar al Destino';
            }
          }
        }

        if (activeTripId === tripId && userData.role === 'passenger') {
          currentTripData = { ...trip, id: tripId };

          if (trip.status === 'Conductor asignado') {
            closeRideOrderScreen();
            document.getElementById('live-tracking-box').style.display = 'block';
            document.getElementById('passenger-trip-status-title').innerText = '🛰️ Conductor Asignado (En camino)';
            document.getElementById('live-driver-name').innerText = trip.driverName || 'Conductor Asignado';
            document.getElementById('live-driver-vehicle-details').innerText = `${trip.driverVehicle || 'Vehículo Registrado'}`;
            document.getElementById('trip-fare-val').innerText = trip.price;

            const dAvatarImg = document.getElementById('live-driver-avatar-img');
            if (dAvatarImg) dAvatarImg.src = trip.driverAvatar || 'https://files.catbox.moe/oh53r9.png';

            const dVehImg = document.getElementById('live-vehicle-photo-img');
            if (dVehImg) dVehImg.src = trip.driverVehiclePhoto || 'https://files.catbox.moe/lkxyw7.png';

            startBackgroundChatListener(tripId);
          } else if (trip.status === 'En trayecto') {
            document.getElementById('passenger-trip-status-title').innerText = '🟢 En Trayecto hacia el Destino';
            document.getElementById('live-driver-name').innerText = 'Viaje en curso con seguridad satelital';
          } else if (trip.status === 'Completado') {
            document.getElementById('live-tracking-box').style.display = 'none';
            showNeonToast('success', `🏁 ¡Has llegado a tu destino! Ganaste +${trip.tokensAwarded || 15} Tokens.`);
            
            syncUserWithFirestore();
            openReceiptModal(currentTripData);
            fetchUserTripHistory();
            activeTripId = null;
            localStorage.removeItem('jr_active_trip_id');
          }
        }
      });

      if (isDriverOnline && driverList && !activeTripId) {
        driverList.innerHTML = '';
        let pendingCount = 0;

        snapshot.forEach(doc => {
          const trip = doc.data();
          if (trip.status === 'Buscando conductor') {
            pendingCount++;
            renderSingleDriverTripCard(doc.id, trip);
          }
        });

        if (pendingCount === 0) {
          driverList.innerHTML = '<p style="font-size:0.75rem; color:#94a3b8; text-align:center;">Esperando nuevas solicitudes...</p>';
        }
      }
    }, () => {});
}

async function acceptTrip(tripId, seatsTaken = 1) {
  triggerHaptic(100);
  if (!userData) return;
  activeTripId = tripId;
  localStorage.setItem('jr_active_trip_id', tripId);

  // Si es un Colectivo / Por Puesto, descuenta automáticamente los asientos ocupados
  if (userData.vehicleType === 'Colectivo') {
    updateDriverAvailableSeats(-Math.abs(parseInt(seatsTaken) || 1));
  }

  const driverPayload = {
    status: 'Conductor asignado',
    driverId: currentUserId,
    driverName: cleanInputText(`${userData.name || 'Chofer'} ${userData.lastname || ''}`, 50),
    driverPhone: cleanInputText(userData.phone, 18),
    driverAvatar: userData.avatar || 'https://files.catbox.moe/oh53r9.png',
    driverVehicle: cleanInputText(`${userData.vehicleType || 'Moto'} - ${userData.vehicleModel || 'S/M'} (${userData.vehiclePlate || 'S/P'})`, 80),
    driverVehiclePhoto: userData.vehiclePhoto || 'https://files.catbox.moe/lkxyw7.png'
  };

  if (db) {
    await db.collection('trips').doc(tripId).update(driverPayload).catch(() => {});
  }

  speakDriverAlert("Carrera aceptada. Dirígete a recoger al pasajero.");
  showNeonToast('success', '✅ ¡Carrera aceptada! Dirígete al punto exacto.');

  startBackgroundChatListener(tripId);

  const driverList = document.getElementById('driver-requests-list');
  if (driverList) driverList.innerHTML = '';
  document.getElementById('driver-active-trip-box').style.display = 'block';
  document.getElementById('driver-otp-input-area').style.display = 'block';
  document.getElementById('driver-in-route-area').style.display = 'none';
}

// ==============================================================
// ACTUALIZACIÓN DE PERFIL Y BARRAS DE PROGRESO INDEPENDIENTES
// ==============================================================
function updateUIProfile() {
  if (!userData) {
    const pName = document.getElementById('profile-fullname');
    if (pName) pName.innerText = '---';
    const pTier = document.getElementById('profile-tier-name');
    if (pTier) pTier.innerText = '---';
    return;
  }

  try {
    const isDriver = (userData.role === 'driver');
    const kmBalanceNum = parseFloat(userData.kmBalance) || 0;

    const kmBal = document.getElementById('ui-km-balance');
    if (kmBal) kmBal.innerText = `$${kmBalanceNum.toFixed(2)}`;
    
    const recBal = document.getElementById('recarga-km-val');
    if (recBal) recBal.innerText = `$${kmBalanceNum.toFixed(2)}`;

    const profName = document.getElementById('profile-fullname');
    if (profName) profName.innerText = `${userData.name || ''} ${userData.lastname || ''}`.trim() || 'Usuario';

    const refTag = document.getElementById('profile-referral-tag');
    if (refTag) refTag.innerText = `Código: ${userData.referralCode || '---'}`;

    if (userData.avatar) {
      const avatarImg = document.getElementById('profile-avatar-img');
      if (avatarImg) avatarImg.src = userData.avatar;
    }

    applyBatterySaverUI();

    const driverMaintHud = document.getElementById('driver-maintenance-hud');
    const passengerTierHud = document.getElementById('passenger-tier-hud');
    const driverTierHud = document.getElementById('driver-tier-hud');
    const verifiedBadgeTag = document.getElementById('profile-driver-verified-tag');
    const unverifiedWarn = document.getElementById('driver-unverified-warning');
    const suspendedWarn = document.getElementById('driver-suspended-warning');

    const driverRating = parseFloat(userData.driverRating !== undefined ? userData.driverRating : 5.00) || 5.00;
    const driverRatingCount = parseInt(userData.driverRatingCount || 1) || 1;
    const isSuspended = isDriver && (driverRating < 3.00 && driverRatingCount >= 2);

    if (isDriver) {
      if (driverMaintHud) driverMaintHud.style.display = 'block';
      if (passengerTierHud) passengerTierHud.style.display = 'none';
      if (driverTierHud) driverTierHud.style.display = 'block';

      const vehTypeTag = document.getElementById('profile-driver-veh-type');
      if (vehTypeTag) vehTypeTag.innerText = userData.vehicleType || 'Moto';

      const plateTag = document.getElementById('profile-driver-plate-tag');
      if (plateTag) plateTag.innerText = userData.vehiclePlate || 'S/P';

      const vehModelTag = document.getElementById('profile-driver-veh-model');
      if (vehModelTag) vehModelTag.innerText = `${userData.vehicleModel || 'Modelo no especificado'} (${userData.vehiclePlate || 'S/P'})`;

      const seatsLbl = document.getElementById('profile-driver-seats-label');
      if (seatsLbl) {
        const maxS = parseInt(userData.maxSeats || 4) || 4;
        seatsLbl.innerText = userData.vehicleType === 'Colectivo' ? `Capacidad configurada: ${maxS} puestos` : 'Foto visible para los pasajeros';
      }

      const vehImg = document.getElementById('profile-driver-veh-img');
      if (vehImg) vehImg.src = userData.vehiclePhoto || 'https://files.catbox.moe/lkxyw7.png';

      const isVerified = (userData.verifiedDriver === true);
      if (verifiedBadgeTag) {
        verifiedBadgeTag.innerText = isSuspended ? 'Suspendido' : (isVerified ? 'Verificado ✓' : 'Pendiente');
        verifiedBadgeTag.style.background = isSuspended ? 'rgba(239,68,68,0.2)' : (isVerified ? 'rgba(0,255,135,0.2)' : 'rgba(245,158,11,0.2)');
        verifiedBadgeTag.style.color = isSuspended ? '#ef4444' : (isVerified ? 'var(--primary)' : '#fbbf24');
      }
      
      if (suspendedWarn) suspendedWarn.style.display = isSuspended ? 'block' : 'none';
      if (unverifiedWarn) unverifiedWarn.style.display = (!isVerified && !isSuspended) ? 'block' : 'none';

      const redeemTitle = document.getElementById('profile-redeem-title');
      if (redeemTitle) redeemTitle.innerText = "Canjear Tokens (Desde Rango Experto)";
      const levelsTitle = document.getElementById('profile-levels-title');
      if (levelsTitle) levelsTitle.innerText = "Escala de Choferes JunRide";

      const currentDriverTrips = parseInt(userData.driverTrips) || 0;
      const { current, next } = getUserCurrentLevel(currentDriverTrips, true);

      const tierIconRight = document.getElementById('profile-tier-icon-right');
      if (tierIconRight) tierIconRight.src = current.icon;

      const tierName = document.getElementById('profile-tier-name');
      if (tierName) tierName.innerText = `${current.name} (${userData.vehicleType || 'Moto'})`;

      const driverExpText = document.getElementById('driver-tier-exp-text');
      const driverBar = document.getElementById('driver-tier-progress-bar');
      if (next) {
        const span = next.minTrips - current.minTrips;
        const currentInTier = currentDriverTrips - current.minTrips;
        const pct = Math.min(100, Math.max(8, Math.round((currentInTier / span) * 100)));
        if (driverExpText) driverExpText.innerText = `${currentDriverTrips} / ${next.minTrips} Carreras para ${next.name}`;
        if (driverBar) driverBar.style.width = `${pct}%`;
      } else {
        if (driverExpText) driverExpText.innerText = `${currentDriverTrips} Carreras (Rango Máximo)`;
        if (driverBar) driverBar.style.width = `100%`;
      }

      const statRating = document.getElementById('stats-rating-val');
      if (statRating) statRating.innerText = `⭐ ${driverRating.toFixed(2)}`;

      const statTrips = document.getElementById('stats-total-trips');
      if (statTrips) statTrips.innerText = currentDriverTrips;

      const statTokens = document.getElementById('stats-total-tokens');
      const driverTok = parseInt(userData.driverTokens || 0) || 0;
      if (statTokens) statTokens.innerText = driverTok.toLocaleString();

      const earnVal = document.getElementById('driver-total-earnings-val');
      const driverEarnNum = parseFloat(userData.driverEarnings) || 0;
      if (earnVal) earnVal.innerText = `$${driverEarnNum.toFixed(2)}`;

      const dTripsCount = document.getElementById('driver-trips-count-val');
      if (dTripsCount) dTripsCount.innerText = `${currentDriverTrips}`;

    } else {
      if (driverMaintHud) driverMaintHud.style.display = 'none';
      if (passengerTierHud) passengerTierHud.style.display = 'block';
      if (driverTierHud) driverTierHud.style.display = 'none';
      if (unverifiedWarn) unverifiedWarn.style.display = 'none';
      if (suspendedWarn) suspendedWarn.style.display = 'none';

      const redeemTitle = document.getElementById('profile-redeem-title');
      if (redeemTitle) redeemTitle.innerText = "Canjear Tokens por Saldo";
      const levelsTitle = document.getElementById('profile-levels-title');
      if (levelsTitle) levelsTitle.innerText = "Escala de Niveles JunRide";

      const currentPassengerTrips = parseInt(userData.passengerTrips) || 0;
      const { current, next } = getUserCurrentLevel(currentPassengerTrips, false);

      const tierIconRight = document.getElementById('profile-tier-icon-right');
      if (tierIconRight) tierIconRight.src = current.icon;

      const tierName = document.getElementById('profile-tier-name');
      if (tierName) tierName.innerText = `${current.name} (Nivel ${current.id})`;

      const tierExpText = document.getElementById('profile-tier-exp-text');
      const tierBar = document.getElementById('profile-tier-progress-bar');
      if (next) {
        const span = next.minTrips - current.minTrips;
        const currentInTier = currentPassengerTrips - current.minTrips;
        const pct = Math.min(100, Math.max(8, Math.round((currentInTier / span) * 100)));
        if (tierExpText) tierExpText.innerText = `${currentPassengerTrips} / ${next.minTrips} Viajes para ${next.name}`;
        if (tierBar) tierBar.style.width = `${pct}%`;
      } else {
        if (tierExpText) tierExpText.innerText = `${currentPassengerTrips} Viajes (Nivel Máximo)`;
        if (tierBar) tierBar.style.width = `100%`;
      }

      const passRating = parseFloat(userData.passengerRating !== undefined ? userData.passengerRating : 5.00) || 5.00;
      const statRating = document.getElementById('stats-rating-val');
      if (statRating) statRating.innerText = `⭐ ${passRating.toFixed(2)}`;

      const statTrips = document.getElementById('stats-total-trips');
      if (statTrips) statTrips.innerText = currentPassengerTrips;

      const statTokens = document.getElementById('stats-total-tokens');
      const passTok = parseInt(userData.passengerTokens !== undefined ? userData.passengerTokens : 50) || 0;
      if (statTokens) statTokens.innerText = passTok.toLocaleString();
    }

    const headerBadge = document.getElementById('header-driver-badge');
    if (headerBadge) {
      headerBadge.style.display = isDriver ? 'flex' : 'none';
    }

    renderWalletLedger();
  } catch(e) {
    console.error("Error al actualizar UI del perfil:", e);
  }
}

function getUserCurrentLevel(tripsCount, isDriver = false) {
  const levels = isDriver ? JUNRIDE_LEVELS_DRIVER : JUNRIDE_LEVELS_PASSENGER;
  let current = levels[0];
  let next = levels[1];
  for (let i = 0; i < levels.length; i++) {
    if (tripsCount >= levels[i].minTrips) {
      current = levels[i];
      next = levels[i + 1] || null;
    }
  }
  return { current, next };
}

function renderLevelsBreakdownList() {
  const container = document.getElementById('levels-list-container');
  if (!container) return;
  container.innerHTML = '';
  const isDriver = (userData && userData.role === 'driver');
  const levels = isDriver ? JUNRIDE_LEVELS_DRIVER : JUNRIDE_LEVELS_PASSENGER;
  const tripsCount = isDriver ? (parseInt(userData ? userData.driverTrips : 0) || 0) : (parseInt(userData ? userData.passengerTrips : 0) || 0);
  const { current } = getUserCurrentLevel(tripsCount, isDriver);

  const modalTitle = document.getElementById('levels-modal-main-title');
  const modalDesc = document.getElementById('levels-modal-main-desc');
  if (modalTitle) modalTitle.innerText = isDriver ? "🚗 Escala de Rangos para Conductores" : "🏔️ Escala de Rangos JunRide";
  if (modalDesc) modalDesc.innerText = isDriver ? "Recibe el 85% neto de cada traslado y desbloquea bonos de tokens a partir del rango Ruta Experto." : "Completa carreras en la montaña para subir de rango y reunir tokens canjeables.";

  levels.forEach(lvl => {
    const isCurrent = (current.id === lvl.id);
    container.innerHTML += `
      <div class="level-card-large ${isCurrent ? 'current-unlocked' : ''}">
        <div class="level-trophy-large-wrap">
          <img src="${lvl.icon}" alt="${lvl.name}">
        </div>
        <div class="level-info-body">
          <div class="level-title-row">
            <span class="level-title-text">${lvl.name}</span>
            <span class="level-trips-req">${lvl.minTrips}+ viajes</span>
          </div>
          <p class="level-desc-text">${lvl.desc}</p>
        </div>
      </div>
    `;
  });
}

function openLevelsModal() { 
  triggerHaptic();
  renderLevelsBreakdownList();
  document.getElementById('modal-levels-breakdown').classList.add('active'); 
}
function closeLevelsModal() { document.getElementById('modal-levels-breakdown').classList.remove('active'); }

async function fetchBCVRate(manual = false) {
  if (manual) triggerHaptic();
  const badge = document.getElementById('bcv-rate-val');
  if (manual && badge) badge.innerText = "Cargando...";

  let rateFound = null;
  try {
    const res = await fetch('https://rates.dolarvzla.com/bcv/current.json', { cache: 'no-cache' });
    const data = await res.json();
    if (data && data.current && data.current.usd) rateFound = parseFloat(data.current.usd);
    else if (data && data.price) rateFound = parseFloat(data.price);
  } catch (e) {}

  if (!rateFound) {
    try {
      const res2 = await fetch('https://ve.dolarapi.com/v1/dolares/oficial', { cache: 'no-cache' });
      const data2 = await res2.json();
      if (data2 && data2.promedio) rateFound = parseFloat(data2.promedio);
    } catch (e2) {}
  }

  if (rateFound && !isNaN(rateFound) && rateFound > 1) {
    currentBcvRate = rateFound;
    localStorage.setItem('jr_last_bcv_rate', rateFound.toString());
  }
  if (badge) badge.innerText = `${currentBcvRate.toFixed(2)} Bs.`;
  const ordBcv = document.getElementById('order-bcv-val');
  if (ordBcv) ordBcv.innerText = `${currentBcvRate.toFixed(2)} Bs.`;
  calculateRouteOrder();
}

function renderRechargeDetails(method) {
  const logoEl = document.getElementById('pay-current-logo');
  const titleEl = document.getElementById('pay-method-title');
  const container = document.getElementById('pay-fields-container');
  const lblRef = document.getElementById('lbl-recharge-ref');
  const lblAmount = document.getElementById('lbl-recharge-amount');
  if (!container) return;

  if (method === 'bdv') {
    if (logoEl) logoEl.src = "https://files.catbox.moe/m27j7r.png";
    if (titleEl) titleEl.innerText = "Pago Móvil Banco de Venezuela";
    if (lblRef) lblRef.innerText = "Últimos 6 dígitos de la referencia:";
    if (lblAmount) lblAmount.innerText = "Monto pagado en Bs.:";
    container.innerHTML = `
      <div class="pay-detail-row">
        <div><span style="font-size:0.72rem; color:var(--text-muted);">Banco Destino:</span><div style="font-size:0.85rem; font-weight:700;">Banco de Venezuela (0102)</div></div>
        <button type="button" class="copy-chip-btn" onclick="copyToClipboard('0102', 'Código Banco')">Copiar</button>
      </div>
      <div class="pay-detail-row">
        <div><span style="font-size:0.72rem; color:var(--text-muted);">Teléfono:</span><div style="font-size:0.85rem; font-weight:700;">0412-3167126</div></div>
        <button type="button" class="copy-chip-btn" onclick="copyToClipboard('04123167126', 'Teléfono')">Copiar</button>
      </div>
      <div class="pay-detail-row">
        <div><span style="font-size:0.72rem; color:var(--text-muted);">Cédula de Identidad:</span><div style="font-size:0.85rem; font-weight:700;">30.629.336</div></div>
        <button type="button" class="copy-chip-btn" onclick="copyToClipboard('30629336', 'Cédula')">Copiar</button>
      </div>`;
  } else if (method === 'zinli') {
    if (logoEl) logoEl.src = "https://files.catbox.moe/24w3zq.png";
    if (titleEl) titleEl.innerText = "Transferencia Zinli (Dólares USD)";
    if (lblRef) lblRef.innerText = "Referencia / Comprobante de Zinli (6 dígitos):";
    if (lblAmount) lblAmount.innerText = "Monto enviado en USD ($):";
    container.innerHTML = `
      <div class="pay-detail-row">
        <div><span style="font-size:0.72rem; color:var(--text-muted);">Correo Oficial Zinli:</span><div style="font-size:0.85rem; font-weight:700;">davidjunride@gmail.com</div></div>
        <button type="button" class="copy-chip-btn" onclick="copyToClipboard('davidjunride@gmail.com', 'Correo Zinli')">Copiar</button>
      </div>
      <div class="pay-detail-row"><div><span style="font-size:0.72rem; color:var(--text-muted);">Titular:</span><div style="font-size:0.85rem; font-weight:700;">David Morales</div></div></div>`;
  } else if (method === 'binance') {
    if (logoEl) logoEl.src = "https://files.catbox.moe/0amryl.png";
    if (titleEl) titleEl.innerText = "Binance Pay (USDT)";
    if (lblRef) lblRef.innerText = "Binance Order ID / Pay ID (6 dígitos o ref):";
    if (lblAmount) lblAmount.innerText = "Monto enviado en USDT ($):";
    container.innerHTML = `
      <div class="pay-detail-row">
        <div><span style="font-size:0.72rem; color:var(--text-muted);">Binance Pay ID:</span><div style="font-size:0.85rem; font-weight:700;">521126834</div></div>
        <button type="button" class="copy-chip-btn" onclick="copyToClipboard('521126834', 'Binance Pay ID')">Copiar</button>
      </div>
      <div class="pay-detail-row"><div><span style="font-size:0.72rem; color:var(--text-muted);">Usuario:</span><div style="font-size:0.85rem; font-weight:700;">David M. (JunRide)</div></div></div>`;
  }
}

function selectRechargeMethod(method) {
  triggerHaptic();
  selectedRechargeMethodKey = method;
  document.querySelectorAll('.recharge-brand-card').forEach(c => c.classList.remove('active'));
  const btn = document.getElementById(`btn-pay-${method}`);
  if (btn) btn.classList.add('active');
  renderRechargeDetails(method);
}

function copyToClipboard(txt, label) {
  triggerHaptic();
  const tempTextArea = document.createElement('textarea');
  tempTextArea.value = txt;
  document.body.appendChild(tempTextArea);
  tempTextArea.select();
  try {
    document.execCommand('copy');
    showNeonToast('success', `¡${label} copiado con éxito!`);
  } catch(e) {
    showNeonToast('error', `Error al copiar ${label}.`);
  }
  document.body.removeChild(tempTextArea);
}

function triggerAvatarUpload() {
  triggerHaptic();
  document.getElementById('profile-avatar-input').click();
}

function handleAvatarFileSelected(event) {
  const file = event.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = function(e) {
    const img = new Image();
    img.onload = function() {
      const canvas = document.createElement('canvas');
      const maxDim = 256;
      let width = img.width;
      let height = img.height;

      if (width > height) {
        if (width > maxDim) { height *= maxDim / width; width = maxDim; }
      } else {
        if (height > maxDim) { width *= maxDim / height; height = maxDim; }
      }

      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(img, 0, 0, width, height);

      const compressedDataUrl = canvas.toDataURL('image/jpeg', 0.82);

      if (userData) {
        userData.avatar = compressedDataUrl;
        localStorage.setItem(STORAGE_KEY_USER, JSON.stringify(userData));
        if (currentUserId && db) {
          db.collection('users').doc(currentUserId).update({ avatar: compressedDataUrl }).catch(() => {});
        }
        updateUIProfile();
      }
      showNeonToast('success', 'Foto de perfil actualizada con éxito.');
    };
    img.src = e.target.result;
  };
  reader.readAsDataURL(file);
}

function playChimeSound() {
  try {
    const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(523.25, audioCtx.currentTime);
    osc.frequency.setValueAtTime(659.25, audioCtx.currentTime + 0.15);
    gain.gain.setValueAtTime(0.2, audioCtx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.4);
    osc.connect(gain);
    gain.connect(audioCtx.destination);
    osc.start();
    osc.stop(audioCtx.currentTime + 0.4);
  } catch(e) {}
}

function playMessageNotificationSound() {
  try {
    const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(880, audioCtx.currentTime);
    osc.frequency.setValueAtTime(1174.66, audioCtx.currentTime + 0.08);
    gain.gain.setValueAtTime(0.25, audioCtx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.3);
    osc.connect(gain);
    gain.connect(audioCtx.destination);
    osc.start();
    osc.stop(audioCtx.currentTime + 0.3);
  } catch(e) {}
}

function speakDriverAlert(text) {
  playChimeSound();
  if ('speechSynthesis' in window) {
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'es-ES';
    utterance.rate = 1.0;
    window.speechSynthesis.speak(utterance);
  }
}

function startBackgroundChatListener(tripId) {
  if (!db || !tripId || !userData) return;

  if (backgroundChatUnsubscribe) {
    backgroundChatUnsubscribe();
  }

  backgroundChatUnsubscribe = db.collection('trips').doc(tripId).collection('messages')
    .orderBy('createdAt', 'desc')
    .limit(1)
    .onSnapshot(snapshot => {
      if (snapshot.empty) return;

      snapshot.forEach(doc => {
        const msg = doc.data();
        const isFromOtherPerson = (msg.senderId && msg.senderId !== currentUserId);

        if (isFromOtherPerson && !isChatModalOpen) {
          playMessageNotificationSound();
          showNeonToast('info', `💬 Nuevo mensaje de ${msg.senderName || 'tu chofer/pasajero'}`);

          const dotActiveBtn = document.getElementById('active-trip-unread-dot');
          if (dotActiveBtn) dotActiveBtn.style.display = 'block';

          const dotPassengerLive = document.getElementById('passenger-live-chat-dot');
          if (dotPassengerLive) dotPassengerLive.style.display = 'block';

          const dotBottom = document.getElementById('nav-unread-badge-driver');
          if (dotBottom) dotBottom.style.display = 'block';
        }
      });
    }, () => {});
}

function logout() {
  triggerHaptic(40);
  localStorage.removeItem(STORAGE_KEY_USER);
  localStorage.removeItem('jr_user_profile_data_v43');
  localStorage.removeItem('jr_user_profile_data_v41');
  localStorage.removeItem('jr_session_uid');
  localStorage.removeItem('jr_active_trip_id');
  localStorage.removeItem('jr_driver_active_trip_cache');
  userData = null;
  currentUserId = null;
  location.reload();
}
