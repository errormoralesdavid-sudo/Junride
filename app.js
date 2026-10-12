// REGISTRO DEL SERVICE WORKER PWA
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('./sw.js').catch((err) => console.log('SW error:', err));
  });
}

// SISTEMA TOAST NEÓN NATIVO
function showNeonToast(type, message, duration = 3200) {
  const container = document.getElementById('toast-container');
  if (!container) return;

  const toast = document.createElement('div');
  toast.className = `neon-toast ${type === 'error' ? 'toast-error' : type === 'warning' ? 'toast-warning' : ''}`;
  
  const icon = type === 'error' ? '❌' : type === 'warning' ? '⚠️' : '✅';
  toast.innerHTML = `
    <span class="toast-icon">${icon}</span>
    <span class="toast-body">${message}</span>
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

const JUNRIDE_LEVELS = [
  { id: 1, name: "Caminante", minTrips: 0, maxTrips: 4, icon: "https://files.catbox.moe/31p0et.png", desc: "Rango de bienvenida. Primeros pasos para nuevos usuarios que inician su recorrido por la carretera de montaña." },
  { id: 2, name: "Senderista", minTrips: 5, maxTrips: 14, icon: "https://files.catbox.moe/hpp6uj.png", desc: "Pasajero frecuente de las curvas de El Junquito. Desbloquea soporte prioritario en horas de tráfico alto y registro ágil." },
  { id: 3, name: "Explorador", minTrips: 15, maxTrips: 29, icon: "https://files.catbox.moe/aezw5k.png", desc: "Conocedor experto de la vía. Prioridad de despacho en clima de niebla intensa o lluvia y doble acumulación de tokens." },
  { id: 4, name: "Escalador", minTrips: 30, maxTrips: 49, icon: "https://files.catbox.moe/jin2u3.png", desc: "Viajero de altura constante. Apartado inmediato de traslados de madrugada y preferencia en asignación de unidades confort." },
  { id: 5, name: "Guía", minTrips: 50, maxTrips: 79, icon: "https://files.catbox.moe/ybh81r.png", desc: "Veterano respetado de la montaña. Máxima prioridad con choferes mejor calificados y tarifa preferencial en mudanzas o carga." },
  { id: 6, name: "Conquistador", minTrips: 80, maxTrips: 9999, icon: "https://files.catbox.moe/htwomx.png", desc: "Rango supremo de honor JunRide. Conquistador de la cima: insignia dorada en perfil, bonificación en tokens y asistencia directa 24/7." }
];

const JUNQUITO_ALL_KMS = [
  { km: 0, name: "Km 0 (La Yaguara / Metro)", lat: 10.4768, lon: -66.9600 },
  { km: 1, name: "Km 1 (Inicio Carretera Vieja)", lat: 10.4735, lon: -66.9680 },
  { km: 2, name: "Km 2 (Sector El Samán)", lat: 10.4705, lon: -66.9750 },
  { km: 3, name: "Km 3 (Sector Los Pinos)", lat: 10.4678, lon: -66.9820 },
  { km: 4, name: "Km 4 (El Amparo / Mirador)", lat: 10.4652, lon: -66.9890 },
  { km: 5, name: "Km 5 (Curva Los Caobos)", lat: 10.4638, lon: -66.9965 },
  { km: 6, name: "Km 6 (Sector La Roca)", lat: 10.4622, lon: -67.0040 },
  { km: 7, name: "Km 7 (Entrada Carapita Alta)", lat: 10.4618, lon: -67.0115 },
  { km: 8, name: "Km 8 (El Junquito Bajo)", lat: 10.4612, lon: -67.0195 },
  { km: 9, name: "Km 9 (Sector El Naranjal)", lat: 10.4608, lon: -67.0270 },
  { km: 10, name: "Km 10 (Curva El Limón)", lat: 10.4610, lon: -67.0345 },
  { km: 11, name: "Km 11 (Sector Los Olivos)", lat: 10.4614, lon: -67.0420 },
  { km: 12, name: "Km 12 (Panadería La Parada)", lat: 10.4618, lon: -67.0495 },
  { km: 13, name: "Km 13 (Sector El Café)", lat: 10.4616, lon: -67.0570 },
  { km: 14, name: "Km 14 (Curva La Cabaña)", lat: 10.4613, lon: -67.0645 },
  { km: 15, name: "Km 15 (Entrada La Loma)", lat: 10.4611, lon: -67.0720 },
  { km: 16, name: "Km 16 (Pueblo / Plaza Bolívar)", lat: 10.4609, lon: -67.0805 },
  { km: 17, name: "Km 17 (Salida del Pueblo)", lat: 10.4614, lon: -67.0880 },
  { km: 18, name: "Km 18 (Sector Los Manantiales)", lat: 10.4623, lon: -67.0955 },
  { km: 19, name: "Km 19 (Zona Turística / Fresas)", lat: 10.4638, lon: -67.1030 },
  { km: 20, name: "Km 20 (Sector La Colina)", lat: 10.4658, lon: -67.1105 },
  { km: 21, name: "Km 21 (Entrada Tibroncito)", lat: 10.4678, lon: -67.1180 },
  { km: 22, name: "Km 22 (Sector Monte Alto)", lat: 10.4702, lon: -67.1255 },
  { km: 23, name: "Km 23 (El Retén / La Niebla)", lat: 10.4732, lon: -67.1330 },
  { km: 24, name: "Km 24 (Bosque Nublado)", lat: 10.4708, lon: -67.1405 },
  { km: 25, name: "Km 25 (Sector El Parador)", lat: 10.4668, lon: -67.1485 },
  { km: 26, name: "Km 26 (Paso de Montaña)", lat: 10.4628, lon: -67.1565 },
  { km: 27, name: "Km 27 (Curva Los Sauces)", lat: 10.4588, lon: -67.1655 },
  { km: 28, name: "Km 28 (Cruce Colonia Tovar)", lat: 10.4548, lon: -67.1745 }
];

const JUNQUITO_BOUNDS = [
  [10.4300, -67.1950],
  [10.4950, -66.9450]
];

// INICIALIZACIÓN DEFENSIVA DE FIREBASE
const firebaseConfig = {
  apiKey: "AIzaSyAsBnD8C_E_o5oHzmw7bWmKrmW2JAjdcaU",
  authDomain: "geomercado-9d642.firebaseapp.com",
  projectId: "geomercado-9d642",
  storageBucket: "geomercado-9d642.firebasestorage.app",
  messagingSenderId: "521126834575",
  appId: "1:521126834575:web:4c847dec3dd57d9a439bfa"
};

let db = null;
let auth = null;
if (typeof firebase !== 'undefined') {
  try {
    if (!firebase.apps.length) {
      firebase.initializeApp(firebaseConfig);
    }
    db = firebase.firestore();
    auth = firebase.auth();
  } catch(e) {
    console.warn("Firebase ya inicializado o fuera de línea.", e);
  }
}

let currentUserId = 'user_' + Math.random().toString(36).substr(2, 9);
let userData = null;
let currentTab = 'inicio';
let selectedOrderCategory = 'Carro';
let currentBcvRate = parseFloat(localStorage.getItem('jr_last_bcv_rate') || '876.80');
let isMountainFog = false;
let isDriverOnline = false;
let driverGeoWatchId = null;
let activeTripId = null;
let currentTripData = null;
let orderMapInstance = null;
let orderRouteLayer = null;
let originMarker = null;
let destMarker = null;
let customOriginCoords = null;
let hasIntermediateStop = false;
let coSharedSeats = 1;
let nearbyVehiclesMarkers = [];
let calculatedOrderPrice = 2.50;
let offeredOrderPrice = 2.50;
let escrowHeldAmount = 0.00;
let selectedRechargeMethodKey = 'bdv';

let selectedOriginIdx = 16;
let selectedDestIdx = 0;
let selectedStopIdx = 12;
let currentKmPickerTarget = 'origin';

document.addEventListener('DOMContentLoaded', () => {
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const schedDateInput = document.getElementById('schedule-date-input');
  if (schedDateInput) schedDateInput.value = tomorrow.toISOString().split('T')[0];

  checkSessionAndAuth();
  fetchBCVRate();
  renderRechargeDetails('bdv');
  renderLevelsBreakdownList();
  requestStartupGpsLocation();
  restoreOfflineTripState();
  listenRoadAlertsRealtime();

  // INICIAR ESCUCHA DE VIAJES DE INMEDIATO
  listenTripsRealtime();

  const avatarInput = document.getElementById('profile-avatar-input');
  if (avatarInput) avatarInput.addEventListener('change', handleAvatarFileSelected);
});

function restoreOfflineTripState() {
  const savedTrip = localStorage.getItem('jr_offline_active_trip');
  if (savedTrip) {
    try {
      const trip = JSON.parse(savedTrip);
      activeTripId = trip.id;
      document.getElementById('live-tracking-box').style.display = 'block';
      document.getElementById('live-driver-name').innerText = trip.driverName || 'Conductor en Camino';
      document.getElementById('trip-fare-val').innerText = trip.price;
      document.getElementById('passenger-otp-val').innerText = trip.otp;
    } catch(e) {}
  }
}

function snapToNearestHighway(lat, lon) {
  let closestKm = JUNQUITO_ALL_KMS[16];
  let minDist = 999999;
  let closestIdx = 16;

  JUNQUITO_ALL_KMS.forEach((pt, idx) => {
    let d = Math.hypot(pt.lat - lat, pt.lon - lon);
    if (d < minDist) {
      minDist = d;
      closestKm = pt;
      closestIdx = idx;
    }
  });

  return { snappedCoords: { lat: closestKm.lat, lon: closestKm.lon }, index: closestIdx, kmName: closestKm.name };
}

function requestStartupGpsLocation() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(pos => {
      const lat = pos.coords.latitude;
      const lon = pos.coords.longitude;
      const accuracy = pos.coords.accuracy;

      if (accuracy > 250) {
        console.warn("Señal GPS difusa por antena.");
        return;
      }

      if (lat >= 10.4300 && lat <= 10.4950 && lon >= -67.1950 && lon <= -66.9450) {
        const snap = snapToNearestHighway(lat, lon);
        customOriginCoords = snap.snappedCoords;
        selectedOriginIdx = snap.index;
        const triggerEl = document.getElementById('trigger-origin-name');
        if (triggerEl) triggerEl.innerText = snap.kmName;
      }
    }, err => {}, { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 });
  }
}

function checkSessionAndAuth() {
  const saved = localStorage.getItem('jr_user_profile_v29');
  if (saved) {
    try {
      userData = JSON.parse(saved);
    } catch(e) {
      setupDefaultUser();
    }
  } else {
    setupDefaultUser();
  }

  if (!userData.role) userData.role = 'passenger';

  updateUIProfile();
  renderDynamicBottomNav();
  initAuth();
}

function setupDefaultUser() {
  userData = {
    name: 'David', lastname: 'Morales', phone: '04123167126', role: 'passenger',
    kmBalance: 5.00, driverEarnings: 0.00, driverTripsCount: 0,
    totalTrips: 11, tokens: 2150, rating: 5.00, avatar: 'https://files.catbox.moe/oh53r9.png',
    batterySaver: false,
    walletLedger: [{ type: 'credit', title: 'Bono Inicial de Cartera', amount: 5.00, date: 'Hoy' }]
  };
  localStorage.setItem('jr_user_profile_v29', JSON.stringify(userData));
}

function initAuth() {
  if (!auth) return;
  auth.signInAnonymously().then(res => {
    currentUserId = res.user.uid;
    if (userData && currentUserId && db) {
      db.collection('users').doc(currentUserId).set(userData, { merge: true }).catch(() => {});
    }
  }).catch(err => {
    console.warn("Auth anónimo omitido, operando en modo directo:", err);
  });
}

function listenRoadAlertsRealtime() {
  if (!db) return;
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
        document.getElementById('alert-banner-title').innerText = `⚠️ ${alertData.incident} (${alertData.km})`;
        document.getElementById('alert-banner-desc').innerText = `Reportado por ${alertData.reportedBy || 'Comunidad JunRide'}`;
      }
    });
  }, () => {});
}

function openKmPickerModal(target) {
  triggerHaptic(20);
  currentKmPickerTarget = target;
  const modal = document.getElementById('modal-km-picker');
  const title = document.getElementById('km-picker-modal-title');
  const container = document.getElementById('km-cards-container');

  if (target === 'origin') title.innerText = 'Punto de Salida (Origen)';
  else if (target === 'destination') title.innerText = 'Punto de Llegada (Destino)';
  else title.innerText = 'Parada Intermedia';

  container.innerHTML = '';
  JUNQUITO_ALL_KMS.forEach((pt, idx) => {
    const isSelected = (target === 'origin' && idx === selectedOriginIdx) ||
                       (target === 'destination' && idx === selectedDestIdx) ||
                       (target === 'stop' && idx === selectedStopIdx);

    container.innerHTML += `
      <div class="km-card-item ${isSelected ? 'selected' : ''}" onclick="selectKmItem(${idx})">
        <strong>${pt.name}</strong>
        <span>${isSelected ? 'Seleccionado ✓' : 'Elegir'}</span>
      </div>
    `;
  });

  modal.classList.add('active');
}

function closeKmPickerModal() {
  document.getElementById('modal-km-picker').classList.remove('active');
}

function selectKmItem(idx) {
  triggerHaptic(30);
  if (currentKmPickerTarget === 'origin') {
    selectedOriginIdx = idx;
    customOriginCoords = { lat: JUNQUITO_ALL_KMS[idx].lat, lon: JUNQUITO_ALL_KMS[idx].lon };
    document.getElementById('trigger-origin-name').innerText = JUNQUITO_ALL_KMS[idx].name;
  } else if (currentKmPickerTarget === 'destination') {
    selectedDestIdx = idx;
    document.getElementById('trigger-destination-name').innerText = JUNQUITO_ALL_KMS[idx].name;
  } else if (currentKmPickerTarget === 'stop') {
    selectedStopIdx = idx;
    document.getElementById('trigger-stop-name').innerText = `Parada: ${JUNQUITO_ALL_KMS[idx].name}`;
  }

  closeKmPickerModal();
  calculateRouteOrder();
}

function triggerPanicSOS() {
  triggerHaptic(200);
  const lat = customOriginCoords ? customOriginCoords.lat : JUNQUITO_ALL_KMS[selectedOriginIdx].lat;
  const lon = customOriginCoords ? customOriginCoords.lon : JUNQUITO_ALL_KMS[selectedOriginIdx].lon;
  const msg = encodeURIComponent(`🚨 ALERTA SOS JUNRIDE: Necesito asistencia inmediata en El Junquito.\nUbicación satelital en vivo: https://maps.google.com/?q=${lat},${lon}\nUsuario: ${userData.name || 'David'}`);
  window.location.href = `https://wa.me/584123167126?text=${msg}`;
}

function redeemTokensForWallet() {
  triggerHaptic();
  const tokens = userData.tokens || 0;
  if (tokens < 1000) {
    showNeonToast('warning', 'Necesitas al menos 1,000 tokens para canjear ($1.00 USD). Completa más viajes para ganar.');
    return;
  }
  const dollarsToAdd = Math.floor(tokens / 1000);
  const tokensUsed = dollarsToAdd * 1000;
  userData.tokens -= tokensUsed;
  userData.kmBalance = (userData.kmBalance || 0) + dollarsToAdd;
  logWalletMovement('credit', `Canje de ${tokensUsed} Tokens`, dollarsToAdd);
  updateUIProfile();
  showNeonToast('success', `🎉 ¡Canje exitoso! Se acreditaron +$${dollarsToAdd}.00 USD a tu Cartera Digital.`);
}

function shareReferralCode() {
  triggerHaptic();
  const text = encodeURIComponent(`¡Usa mi código DAVIDJR en JunRide para obtener $1.00 de descuento en tu primer viaje en El Junquito! 🏔️🚕`);
  window.location.href = `https://wa.me/?text=${text}`;
}

function toggleBatterySaverMode() {
  triggerHaptic();
  userData.batterySaver = !userData.batterySaver;
  localStorage.setItem('jr_user_profile_v29', JSON.stringify(userData));
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

function openReceiptModal() {
  triggerHaptic();
  document.getElementById('rec-service-name').innerText = selectedOrderCategory;
  document.getElementById('rec-route-text').innerText = `${JUNQUITO_ALL_KMS[selectedOriginIdx].name} ➔ ${JUNQUITO_ALL_KMS[selectedDestIdx].name}`;
  document.getElementById('rec-amount-text').innerText = `$${offeredOrderPrice.toFixed(2)} USD`;
  document.getElementById('rec-date-text').innerText = new Date().toLocaleDateString();
  document.getElementById('modal-trip-receipt').classList.add('active');
}
function closeReceiptModal() { document.getElementById('modal-trip-receipt').classList.remove('active'); }

function selectTagBadge(badge) {
  triggerHaptic(20);
  badge.style.background = '#00ff87';
  badge.style.color = '#050811';
}

function shareReceiptWhatsApp() {
  const msg = encodeURIComponent(`🧾 Recibo JunRide:\nServicio: ${selectedOrderCategory}\nTarifa: $${offeredOrderPrice.toFixed(2)} USD\nRuta: ${JUNQUITO_ALL_KMS[selectedOriginIdx].name} a ${JUNQUITO_ALL_KMS[selectedDestIdx].name}\nEstado: Pagado y Verificado 🏔️`);
  window.location.href = `https://wa.me/?text=${msg}`;
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

      userData.avatar = compressedDataUrl;
      localStorage.setItem('jr_user_profile_v29', JSON.stringify(userData));
      
      if (currentUserId && db) {
        db.collection('users').doc(currentUserId).update({ avatar: compressedDataUrl }).catch(() => {});
      }

      updateUIProfile();
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

function switchDriverMode() {
  triggerHaptic();
  userData.role = 'driver';
  localStorage.setItem('jr_user_profile_v29', JSON.stringify(userData));
  updateUIProfile();
  renderDynamicBottomNav();
  switchTab('driver-panel');
  speakDriverAlert("Modo chofer activado");
}

function switchPassengerMode() {
  triggerHaptic();
  userData.role = 'passenger';
  localStorage.setItem('jr_user_profile_v29', JSON.stringify(userData));
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

function renderDynamicBottomNav() {
  const navContainer = document.getElementById('dynamic-bottom-nav');
  if (!navContainer) return;
  const isDriver = (userData && userData.role === 'driver');

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
  renderDynamicBottomNav();
  window.scrollTo(0, 0);
}

function getUserCurrentLevel(tripsCount) {
  let current = JUNRIDE_LEVELS[0];
  let next = JUNRIDE_LEVELS[1];
  for (let i = 0; i < JUNRIDE_LEVELS.length; i++) {
    if (tripsCount >= JUNRIDE_LEVELS[i].minTrips) {
      current = JUNRIDE_LEVELS[i];
      next = JUNRIDE_LEVELS[i + 1] || null;
    }
  }
  return { current, next };
}

function updateUIProfile() {
  if (!userData) return;
  try {
    const kmBal = document.getElementById('ui-km-balance');
    if (kmBal) kmBal.innerText = `$${(userData.kmBalance || 0).toFixed(2)}`;
    
    const recBal = document.getElementById('recarga-km-val');
    if (recBal) recBal.innerText = `$${(userData.kmBalance || 0).toFixed(2)}`;

    const profName = document.getElementById('profile-fullname');
    if (profName) profName.innerText = `${userData.name || 'David'} ${userData.lastname || ''}`;

    const tagBal = document.getElementById('profile-wallet-balance-tag');
    if (tagBal) tagBal.innerText = `$${(userData.kmBalance || 0).toFixed(2)}`;

    if (userData.avatar) {
      const avatarImg = document.getElementById('profile-avatar-img');
      if (avatarImg) avatarImg.src = userData.avatar;
    }

    applyBatterySaverUI();

    const totalTrips = userData.totalTrips || 11;
    const { current, next } = getUserCurrentLevel(totalTrips);

    const tierIconRight = document.getElementById('profile-tier-icon-right');
    if (tierIconRight) tierIconRight.src = current.icon;

    const tierName = document.getElementById('profile-tier-name');
    if (tierName) tierName.innerText = `${current.name} (Nivel ${current.id})`;

    const tierExpText = document.getElementById('profile-tier-exp-text');
    const tierBar = document.getElementById('profile-tier-progress-bar');
    if (next) {
      const span = next.minTrips - current.minTrips;
      const currentInTier = totalTrips - current.minTrips;
      const pct = Math.min(100, Math.max(10, Math.round((currentInTier / span) * 100)));
      if (tierExpText) tierExpText.innerText = `${totalTrips} / ${next.minTrips} Viajes para ${next.name}`;
      if (tierBar) tierBar.style.width = `${pct}%`;
    } else {
      if (tierExpText) tierExpText.innerText = `${totalTrips} Viajes (Nivel Máximo)`;
      if (tierBar) tierBar.style.width = `100%`;
    }

    const statTrips = document.getElementById('stats-total-trips');
    if (statTrips) statTrips.innerText = totalTrips;

    const statTokens = document.getElementById('stats-total-tokens');
    if (statTokens) statTokens.innerText = (userData.tokens || (totalTrips * 195)).toLocaleString();

    const headerBadge = document.getElementById('header-driver-badge');
    if (headerBadge) {
      headerBadge.style.display = (userData.role === 'driver') ? 'flex' : 'none';
    }

    const earnVal = document.getElementById('driver-total-earnings-val');
    if (earnVal) earnVal.innerText = `$${(userData.driverEarnings || 0).toFixed(2)}`;

    const dTripsCount = document.getElementById('driver-trips-count-val');
    if (dTripsCount) dTripsCount.innerText = `${userData.driverTripsCount || 0}`;

    const commFee = document.getElementById('driver-commission-fee-val');
    if (commFee) commFee.innerText = `$${((userData.driverEarnings || 0) * 0.10).toFixed(2)}`;

    renderWalletLedger();
  } catch(e) {
    console.error("UI profile update error:", e);
  }
}

function renderLevelsBreakdownList() {
  const container = document.getElementById('levels-list-container');
  if (!container) return;
  container.innerHTML = '';
  const totalTrips = (userData ? userData.totalTrips : 11) || 11;
  const { current } = getUserCurrentLevel(totalTrips);

  JUNRIDE_LEVELS.forEach(lvl => {
    const isCurrent = (current.id === lvl.id);
    container.innerHTML += `
      <div class="level-card-large ${isCurrent ? 'current-unlocked' : ''}">
        <div class="level-trophy-large-wrap">
          <img src="${lvl.icon}" alt="${lvl.name}">
        </div>
        <div class="level-info-body">
          <div class="level-title-row">
            <span class="level-title-text">Nivel ${lvl.id}: ${lvl.name}</span>
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

  if (rateFound && !isNaN(rateFound)) {
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
    if (lblRef) lblRef.innerText = "Referencia / Comprobante de Zinli:";
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
    if (lblRef) lblRef.innerText = "Binance Order ID / Pay ID:";
    if (lblAmount) lblAmount.innerText = "Monto enviado en USDT:";
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

function verifyPaymentReference(e) {
  e.preventDefault();
  triggerHaptic(50);
  const ref = document.getElementById('pay-ref-input').value.trim();
  const amount = parseFloat(document.getElementById('pay-amount-input').value);
  let usdVal = amount;
  if (selectedRechargeMethodKey === 'bdv') usdVal = (amount / currentBcvRate);
  
  userData.kmBalance = (userData.kmBalance || 0) + usdVal;
  logWalletMovement('credit', `Recarga ${selectedRechargeMethodKey.toUpperCase()} (#${ref})`, usdVal);
  updateUIProfile();
  showNeonToast('success', `✅ ¡Recarga acreditada por $${usdVal.toFixed(2)} USD!`);
  e.target.reset();
}

function logWalletMovement(type, title, amount) {
  if (!userData) return;
  if (!userData.walletLedger) userData.walletLedger = [];
  userData.walletLedger.unshift({
    type: type, title: title, amount: parseFloat(amount), date: new Date().toLocaleTimeString()
  });
  localStorage.setItem('jr_user_profile_v29', JSON.stringify(userData));
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
    container.innerHTML += `
      <div style="display:flex; justify-content:space-between; align-items:center; padding:8px 12px; background:rgba(255,255,255,0.03); border-radius:12px; margin-bottom:6px; font-size:0.78rem;">
        <div><strong>${item.title}</strong><p style="font-size:0.68rem; color:#94a3b8;">${item.date}</p></div>
        <strong style="color:${color};">${sign}$${item.amount.toFixed(2)}</strong>
      </div>`;
  });
}

function toggleStopInput() {
  triggerHaptic();
  hasIntermediateStop = !hasIntermediateStop;
  const stopBox = document.getElementById('stop-row-box');
  if (stopBox) stopBox.style.display = hasIntermediateStop ? 'block' : 'none';
  calculateRouteOrder();
}

function adjustSeats(delta) {
  triggerHaptic();
  coSharedSeats = Math.max(1, Math.min(4, coSharedSeats + delta));
  const seatsVal = document.getElementById('seats-count-val');
  if (seatsVal) seatsVal.innerText = coSharedSeats;
  calculateRouteOrder();
}

function useCurrentGpsLocation() {
  triggerHaptic();
  if (navigator.geolocation) {
    showNeonToast('info', 'Calibrando satélites GPS...');
    navigator.geolocation.getCurrentPosition(pos => {
      const lat = pos.coords.latitude;
      const lon = pos.coords.longitude;
      const accuracy = pos.coords.accuracy;

      if (lat < 10.4300 || lat > 10.4950 || lon < -67.1950 || lon > -66.9450) {
        showNeonToast('warning', 'Señal fuera de la montaña. Toca en el mapa para fijar tu punto.');
        return;
      }

      const snap = snapToNearestHighway(lat, lon);
      customOriginCoords = snap.snappedCoords;
      selectedOriginIdx = snap.index;

      const triggerEl = document.getElementById('trigger-origin-name');
      if (triggerEl) triggerEl.innerText = snap.kmName;

      calculateRouteOrder();
      showNeonToast('success', `📍 GPS exacto: ${snap.kmName} (±${Math.round(accuracy)}m)`);
    }, err => {
      showNeonToast('error', 'Por favor concede permiso de ubicación precisa.');
    }, { enableHighAccuracy: true, timeout: 12000, maximumAge: 0 });
  }
}

function openRideOrderScreen(category = 'Carro') {
  triggerHaptic();
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
    if (cat === 'Carro') radarIcon.src = 'https://files.catbox.moe/lkxyw7.png';
    else if (cat === 'Moto') radarIcon.src = 'https://files.catbox.moe/xriwyl.png';
    else if (cat === 'Colectivo') radarIcon.src = 'https://files.catbox.moe/w6c0q9.png';
    else if (cat === 'Carga') radarIcon.src = 'https://files.catbox.moe/bjsczm.png';
  }

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
        <div class="pin-label-popup">${label}</div>
      </div>
    `,
    iconSize: [34, 46],
    iconAnchor: [17, 46]
  });
}

function spawnNearbyVehicles(centerCoords) {
  if (!orderMapInstance) return;
  nearbyVehiclesMarkers.forEach(m => orderMapInstance.removeLayer(m));
  nearbyVehiclesMarkers = [];

  const vehTypes = [
    { img: 'https://files.catbox.moe/xriwyl.png', dLat: 0.0010, dLon: 0.0025 },
    { img: 'https://files.catbox.moe/lkxyw7.png', dLat: -0.0008, dLon: -0.0020 },
    { img: 'https://files.catbox.moe/w6c0q9.png', dLat: 0.0015, dLon: -0.0035 }
  ];

  vehTypes.forEach(v => {
    let vIcon = L.divIcon({
      className: 'nearby-veh-wrapper',
      html: `<div class="nearby-veh-marker"><img src="${v.img}" alt="Vehículo Cercano"></div>`,
      iconSize: [34, 34],
      iconAnchor: [17, 17]
    });
    let marker = L.marker([centerCoords.lat + v.dLat, centerCoords.lon + v.dLon], { icon: vIcon }).addTo(orderMapInstance);
    nearbyVehiclesMarkers.push(marker);
  });
}

function initOrderMap() {
  const origPt = customOriginCoords || JUNQUITO_ALL_KMS[selectedOriginIdx];
  const destPt = JUNQUITO_ALL_KMS[selectedDestIdx];

  if (orderMapInstance) { orderMapInstance.remove(); orderMapInstance = null; }
  
  orderMapInstance = L.map('order-leaflet-map', { 
    zoomControl: false, 
    attributionControl: false,
    maxBounds: JUNQUITO_BOUNDS,
    minZoom: 11,
    maxZoom: 18
  }).setView([origPt.lat, origPt.lon], 13);
  
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    bounds: JUNQUITO_BOUNDS
  }).addTo(orderMapInstance);

  orderMapInstance.on('click', function(e) {
    const snap = snapToNearestHighway(e.latlng.lat, e.latlng.lng);
    customOriginCoords = snap.snappedCoords;
    selectedOriginIdx = snap.index;
    const triggerEl = document.getElementById('trigger-origin-name');
    if (triggerEl) triggerEl.innerText = snap.kmName;
    calculateRouteOrder();
  });

  originMarker = L.marker([origPt.lat, origPt.lon], { icon: createNeonPinIcon('Origen') }).addTo(orderMapInstance);
  destMarker = L.marker([destPt.lat, destPt.lon], { icon: createNeonPinIcon('Destino') }).addTo(orderMapInstance);

  spawnNearbyVehicles(origPt);
  drawRouteOnMap(origPt, destPt);
}

async function drawRouteOnMap(startCoords, endCoords) {
  if (orderRouteLayer && orderMapInstance) orderMapInstance.removeLayer(orderRouteLayer);
  
  const snapStart = snapToNearestHighway(startCoords.lat, startCoords.lon).snappedCoords;
  const snapEnd = snapToNearestHighway(endCoords.lat, endCoords.lon).snappedCoords;

  const url = `https://router.project-osrm.org/route/v1/driving/${snapStart.lon},${snapStart.lat};${snapEnd.lon},${snapEnd.lat}?overview=full&geometries=geojson`;
  
  try {
    const res = await fetch(url);
    const data = await res.json();
    if (data.routes && data.routes.length > 0) {
      const coords = data.routes[0].geometry.coordinates.map(c => [c[1], c[0]]);
      orderRouteLayer = L.polyline(coords, { color: '#00ff87', weight: 4.5 }).addTo(orderMapInstance);
      orderMapInstance.fitBounds(orderRouteLayer.getBounds(), { padding: [35, 35] });

      if (originMarker) originMarker.setLatLng(coords[0]);
      if (destMarker) destMarker.setLatLng(coords[coords.length - 1]);
      return;
    }
  } catch(e) {}

  orderRouteLayer = L.polyline([[snapStart.lat, snapStart.lon], [snapEnd.lat, snapEnd.lon]], { color: '#00ff87', weight: 4, dashArray: '6, 6' }).addTo(orderMapInstance);
  if (originMarker) originMarker.setLatLng([snapStart.lat, snapStart.lon]);
  if (destMarker) destMarker.setLatLng([snapEnd.lat, snapEnd.lon]);
}

function calculateRouteOrder() {
  let distKm = Math.abs(JUNQUITO_ALL_KMS[selectedOriginIdx].km - JUNQUITO_ALL_KMS[selectedDestIdx].km);

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
    const origPt = customOriginCoords || JUNQUITO_ALL_KMS[selectedOriginIdx];
    const destPt = JUNQUITO_ALL_KMS[selectedDestIdx];
    drawRouteOnMap(origPt, destPt);
  }
}

function adjustOrderPrice(delta) {
  triggerHaptic(20);
  offeredOrderPrice = Math.max(1.0, Math.round((offeredOrderPrice + delta) * 10) / 10);
  document.getElementById('order-fare-display').innerText = `$${offeredOrderPrice.toFixed(2)}`;
  document.getElementById('order-fare-ves').innerText = (offeredOrderPrice * currentBcvRate).toFixed(2);
}

// CONFIRMAR PEDIDO Y ENVIAR AL RADAR
async function confirmOrderTrip() {
  triggerHaptic(80);
  const payMode = document.getElementById('order-pay-mode').value;

  if (payMode === 'cartera' && (userData.kmBalance || 0) < offeredOrderPrice) {
    showNeonToast('error', 'Saldo insuficiente en tu cartera digital. Recarga saldo o selecciona pagar en efectivo.');
    return;
  }

  const origPt = customOriginCoords || JUNQUITO_ALL_KMS[selectedOriginIdx];
  const destPt = JUNQUITO_ALL_KMS[selectedDestIdx];
  const otpCode = Math.floor(1000 + Math.random() * 9000).toString();

  if (payMode === 'cartera') {
    escrowHeldAmount = offeredOrderPrice;
    userData.kmBalance -= offeredOrderPrice;
    logWalletMovement('debit', `Retención Carrera (${JUNQUITO_ALL_KMS[selectedOriginIdx].name})`, offeredOrderPrice);
    updateUIProfile();
  } else {
    escrowHeldAmount = 0.00;
  }

  const tripPayload = {
    clientId: currentUserId,
    clientName: userData.name || 'David Pasajero',
    clientPhone: userData.phone || '04123167126',
    service: selectedOrderCategory,
    pickup: JUNQUITO_ALL_KMS[selectedOriginIdx].name,
    pickupCoords: { lat: origPt.lat, lon: origPt.lon },
    dropoff: destPt.name,
    dropoffCoords: { lat: destPt.lat, lon: destPt.lon },
    paymentMode: payMode,
    price: offeredOrderPrice.toFixed(2),
    otp: otpCode,
    status: 'Buscando conductor',
    createdAt: firebase.firestore.FieldValue ? firebase.firestore.FieldValue.serverTimestamp() : new Date()
  };

  if (db) {
    try {
      const docRef = await db.collection('trips').add(tripPayload);
      activeTripId = docRef.id;
      showNeonToast('success', '📡 Solicitud transmitida a todos los choferes.');
    } catch(err) {
      console.error("Error al publicar en Firebase:", err);
      showNeonToast('warning', 'Modo offline: Conecta Firebase para enlazar con choferes.');
      activeTripId = 'offline_' + Date.now();
    }
  } else {
    activeTripId = 'offline_' + Date.now();
  }

  localStorage.setItem('jr_offline_active_trip', JSON.stringify({
    id: activeTripId, price: offeredOrderPrice.toFixed(2), otp: otpCode, status: 'Buscando conductor'
  }));

  document.getElementById('passenger-otp-val').innerText = otpCode;
  document.getElementById('order-form-controls').style.display = 'none';
  document.getElementById('search-radar-box').style.display = 'flex';
}

async function cancelTrip(isManual = false) {
  triggerHaptic(50);
  if (activeTripId) {
    if (escrowHeldAmount > 0) {
      userData.kmBalance += escrowHeldAmount;
      logWalletMovement('refund', 'Reembolso por Cancelación', escrowHeldAmount);
      escrowHeldAmount = 0.00;
      updateUIProfile();
    }

    if (db && !activeTripId.startsWith('offline_')) {
      await db.collection('trips').doc(activeTripId).delete().catch(() => {});
    }
    localStorage.removeItem('jr_offline_active_trip');
    activeTripId = null;
    currentTripData = null;

    document.getElementById('search-radar-box').style.display = 'none';
    document.getElementById('order-form-controls').style.display = 'block';
    document.getElementById('live-tracking-box').style.display = 'none';

    if (isManual) showNeonToast('info', '✅ Solicitud cancelada. Tus fondos están de vuelta en tu cartera.');
  }
}

// TOGGLE CONEXIÓN DEL CHOFER CON REFRESCO INMEDIATO DE VIAJES
function toggleDriverStatus() {
  triggerHaptic();
  isDriverOnline = !isDriverOnline;
  const statusImg = document.getElementById('img-driver-toggle-state');
  const statusBtn = document.getElementById('btn-driver-status-img');
  const statusText = document.getElementById('driver-status-text');

  if (isDriverOnline) {
    if (statusImg) statusImg.src = "https://files.catbox.moe/wboolc.png";
    if (statusBtn) statusBtn.classList.add('online');
    if (statusText) {
      statusText.innerText = "🟢 Conectado con Voz (Esperando carreras)";
      statusText.style.color = "#00ff87";
    }
    speakDriverAlert("Modo chofer activado. Buscando pasajeros.");

    // REFRESCAR INMEDIATAMENTE LA LISTA DE VIAJES ACTIVOS
    fetchPendingTripsForDriver();

    if (navigator.geolocation) {
      driverGeoWatchId = navigator.geolocation.watchPosition(pos => {
        const snap = snapToNearestHighway(pos.coords.latitude, pos.coords.longitude);
        if (db && currentUserId) {
          db.collection('drivers_online').doc(currentUserId).set({
            name: userData.name || 'David Conductor',
            lat: snap.snappedCoords.lat,
            lon: snap.snappedCoords.lon,
            heading: pos.coords.heading || 0,
            updatedAt: new Date()
          }, { merge: true }).catch(() => {});
        }
      }, err => {}, { enableHighAccuracy: true, maximumAge: 3000, timeout: 8000 });
    }

  } else {
    if (statusImg) statusImg.src = "https://files.catbox.moe/qi6nhs.png";
    if (statusBtn) statusBtn.classList.remove('online');
    if (statusText) {
      statusText.innerText = "🔴 Desconectado (Toca el botón para conectarte)";
      statusText.style.color = "#ef4444";
    }
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

// CONSULTA DIRECTA DE VIAJES PENDIENTES
function fetchPendingTripsForDriver() {
  if (!db) return;
  db.collection('trips').where('status', '==', 'Buscando conductor').get().then(snapshot => {
    const driverList = document.getElementById('driver-requests-list');
    if (!driverList) return;
    driverList.innerHTML = '';

    if (snapshot.empty) {
      driverList.innerHTML = '<p style="font-size:0.75rem; color:#94a3b8; text-align:center;">No hay solicitudes activas en este momento.</p>';
      return;
    }

    snapshot.forEach(doc => {
      renderSingleDriverTripCard(doc.id, doc.data());
    });
  }).catch(err => console.error("Error al consultar viajes:", err));
}

function renderSingleDriverTripCard(tripId, trip) {
  const driverList = document.getElementById('driver-requests-list');
  if (!driverList) return;

  const pLat = trip.pickupCoords ? trip.pickupCoords.lat : 10.4614;
  const pLon = trip.pickupCoords ? trip.pickupCoords.lon : -67.0805;

  driverList.innerHTML += `
    <li style="display:flex; flex-direction:column; gap:8px; padding:14px; background:rgba(255,255,255,0.03); border-radius:16px; border:1px solid var(--border-glow); margin-bottom:8px;">
      <div style="display:flex; justify-content:space-between; align-items:center;">
        <strong style="color:#00ff87; font-size:1rem;">${trip.service} ($${trip.price})</strong>
        <button onclick="acceptTrip('${tripId}')" class="btn-primary-neon btn-sm">Aceptar Carrera</button>
      </div>
      <p style="font-size:0.78rem; color:#cbd5e1;">👤 <strong>${trip.clientName || 'Pasajero'}</strong>: ${trip.pickup} ➔ ${trip.dropoff}</p>
      <button class="btn-sm btn-secondary-dim" style="width:100%; font-size:0.72rem;" onclick="openDriverNavExternal(${pLat}, ${pLon})">🗺️ Ver Ubicación en Google Maps</button>
    </li>`;
}

function openDriverNavExternal(lat, lon) {
  triggerHaptic();
  const url = `https://www.google.com/maps/dir/?api=1&destination=${lat},${lon}&travelmode=driving`;
  window.open(url, '_blank');
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

function openScheduleTripModal() { triggerHaptic(); document.getElementById('modal-schedule-trip').classList.add('active'); }
function closeScheduleTripModal() { document.getElementById('modal-schedule-trip').classList.remove('active'); }

async function confirmScheduleTrip() {
  triggerHaptic();
  const date = document.getElementById('schedule-date-input').value;
  const hour = document.getElementById('schedule-hour-select').value;
  const service = document.getElementById('schedule-service-select').value;
  const pickup = document.getElementById('schedule-pickup-input').value;
  const dest = document.getElementById('schedule-dest-input').value;
  const fare = parseFloat(document.getElementById('schedule-fare-input').value || 4.0);

  if (db) {
    await db.collection('trips_programados').add({
      clientName: userData.name || 'David',
      phone: userData.phone || '04123167126',
      date: date, hour: hour, service: service,
      pickup: pickup, dest: dest, fare: fare, status: 'Disponible', createdAt: new Date()
    }).catch(() => {});
  }

  showNeonToast('success', `✅ ¡Viaje de Madrugada apartado para el ${date} a las ${hour}!`);
  closeScheduleTripModal();
}

function openReportTrafficModal() { triggerHaptic(); document.getElementById('modal-traffic-alert').classList.add('active'); }
function closeReportTrafficModal() { document.getElementById('modal-traffic-alert').classList.remove('active'); }

async function publishRoadAlert() {
  triggerHaptic();
  const incident = document.getElementById('traffic-incident-type').value;
  const km = document.getElementById('traffic-incident-km').value;
  if (db) {
    await db.collection('alertas_viales').add({ incident, km, reportedBy: userData ? userData.name : 'Comunidad', createdAt: new Date() }).catch(() => {});
  }
  showNeonToast('success', `Alerta vial publicada: "${incident}" en ${km}.`);
  closeReportTrafficModal();
}

function openKycWhatsAppModal() { triggerHaptic(); document.getElementById('modal-kyc-whatsapp').classList.add('active'); }
function closeKycWhatsAppModal() { document.getElementById('modal-kyc-whatsapp').classList.remove('active'); }

function sendKycToWhatsApp() {
  const msg = encodeURIComponent(`Hola Soporte JunRide 🏔️. Solicito validación para mi cuenta de Conductor.\nNombre: ${userData.name || 'David'}\nTeléfono: ${userData.phone || '04123167126'}`);
  window.location.href = `https://wa.me/584123167126?text=${msg}`;
  closeKycWhatsAppModal();
}

function requestWeeklyPayout() {
  triggerHaptic();
  const payoutVal = (userData.driverEarnings || 0);
  if (payoutVal <= 0) { showNeonToast('warning', 'No tienes ganancias pendientes por liquidar.'); return; }
  const bcvVal = (payoutVal * currentBcvRate).toFixed(2);
  const msg = encodeURIComponent(`Hola Administración JunRide 🏔️.\nSolicito liquidación de mis ganancias:\n👤 Chofer: ${userData.name}\n💵 Monto Neto: $${payoutVal.toFixed(2)} USD (Bs. ${bcvVal})`);
  window.location.href = `https://wa.me/584123167126?text=${msg}`;
}

// SINCRONIZACIÓN CONTINUA EN TIEMPO REAL
function listenTripsRealtime() {
  if (!db) return;
  db.collection('trips').onSnapshot(snapshot => {
    const driverList = document.getElementById('driver-requests-list');
    const historyList = document.getElementById('history-list');

    if (isDriverOnline && driverList) {
      driverList.innerHTML = '';
      let pendingCount = 0;

      snapshot.forEach(doc => {
        const trip = doc.data();
        const tripId = doc.id;

        if (trip.status === 'Buscando conductor') {
          pendingCount++;
          renderSingleDriverTripCard(tripId, trip);
        }
      });

      if (pendingCount > 0) {
        speakDriverAlert("Nueva carrera disponible en la montaña.");
      } else {
        driverList.innerHTML = '<p style="font-size:0.75rem; color:#94a3b8; text-align:center;">Esperando nuevas solicitudes...</p>';
      }
    }

    // SI EL PASAJERO ESTÁ ESPERANDO, VER CUÁNDO ACEPTA EL CHOFER
    snapshot.forEach(doc => {
      const trip = doc.data();
      const tripId = doc.id;

      if (activeTripId === tripId && userData.role === 'passenger') {
        currentTripData = trip;
        if (trip.status === 'Conductor asignado' || trip.status === 'En trayecto') {
          closeRideOrderScreen();
          document.getElementById('live-tracking-box').style.display = 'block';
          document.getElementById('live-driver-name').innerText = trip.driverName || 'Conductor Asignado';
          document.getElementById('trip-fare-val').innerText = trip.price;
          speakDriverAlert("Un conductor ha tomado tu viaje. Va en camino.");
          
          localStorage.setItem('jr_offline_active_trip', JSON.stringify({
            id: tripId, driverName: trip.driverName, price: trip.price, otp: trip.otp
          }));
        }
      }
    });
  }, err => console.error("Error en listener de viajes:", err));
}

async function acceptTrip(tripId) {
  triggerHaptic(100);
  if (db) {
    await db.collection('trips').doc(tripId).update({
      status: 'Conductor asignado',
      driverName: userData.name ? `${userData.name} Conductor` : 'David Conductor',
      driverPhone: userData.phone || '04123167126'
    }).catch(() => {});
  }
  speakDriverAlert("Carrera aceptada. Navegando al punto del pasajero.");
  showNeonToast('success', '✅ ¡Carrera aceptada con éxito!');
}

function logout() { localStorage.removeItem('jr_user_profile_v29'); location.reload(); }
