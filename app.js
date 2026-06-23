document.addEventListener('DOMContentLoaded', () => {
    // --- KONFIGURACJA ---
    // NASA JPL API nie wysyła nagłówków CORS, więc żądanie z przeglądarki musi przejść przez proxy.
    const NASA_API = 'https://ssd-api.jpl.nasa.gov/fireball.api?limit=100';
    // Lista proxy CORS z fallbackiem - jeśli pierwsze jest niedostępne, próbujemy kolejne.
    const PROXIES = [
        url => `https://api.allorigins.win/raw?url=${encodeURIComponent(url)}`,
        url => `https://corsproxy.io/?url=${encodeURIComponent(url)}`,
        url => `https://api.codetabs.com/v1/proxy/?quest=${encodeURIComponent(url)}`
    ];

    // Pobiera dane przez kolejne proxy, dopóki któreś nie zwróci poprawnego JSON-a NASA.
    async function fetchViaProxy(targetUrl) {
        let lastError;
        for (const buildUrl of PROXIES) {
            try {
                const response = await fetch(buildUrl(targetUrl));
                if (!response.ok) throw new Error('HTTP ' + response.status);
                const data = await response.json();
                // Walidacja - odrzucamy strony-zaślepki proxy, które nie są danymi NASA.
                if (data && Array.isArray(data.fields) && Array.isArray(data.data)) {
                    return data;
                }
                throw new Error('Niepoprawny format danych z proxy');
            } catch (err) {
                lastError = err;
                console.warn('Proxy nieudane, próbuję następne:', err.message);
            }
        }
        throw lastError || new Error('Wszystkie proxy niedostępne');
    }
    const TILE_URL = 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png';
    const ATTRIBUTION = '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors';

    let lastLatestDate = null; // Przechowuje datę najnowszego uderzenia
    let isInitialLoad = true;
    let audioCtx = null; // Jeden współdzielony kontekst audio (przeglądarki limitują ich liczbę)

    // --- GENERATOR DŹWIĘKU RADAROWEGO ---
    function playRadarBeep() {
        try {
            const AudioCtx = window.AudioContext || window.webkitAudioContext;
            if (!AudioCtx) return;
            if (!audioCtx) audioCtx = new AudioCtx();
            // Po interakcji użytkownika wznawiamy kontekst (polityka autoplay przeglądarek)
            if (audioCtx.state === 'suspended') audioCtx.resume();
            const ctx = audioCtx;
            const osc = ctx.createOscillator();
            const gainNode = ctx.createGain();
            
            osc.type = 'sine';
            osc.frequency.setValueAtTime(1046.50, ctx.currentTime); // C6 wysoki ping
            
            gainNode.gain.setValueAtTime(0.15, ctx.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 1.0);
            
            osc.connect(gainNode);
            gainNode.connect(ctx.destination);
            
            osc.start();
            osc.stop(ctx.currentTime + 1.0);
        } catch(e) {
            console.error('Audio api blocked', e);
        }
    }

    // --- INICJALIZACJA MAPY ---
    const map = L.map('map', {
        center: [20, 0],
        zoom: 2,
        minZoom: 2,
        maxBounds: [[-90, -180], [90, 180]],
        maxBoundsViscosity: 1.0,
        zoomControl: false // Stylistycznie chcemy, by wyglądało to jak ekran radaru
    });

    L.control.zoom({ position: 'bottomright' }).addTo(map);
    L.tileLayer(TILE_URL, { attribution: ATTRIBUTION }).addTo(map);

    const markersGroup = L.featureGroup().addTo(map);
    const tableBody = document.getElementById('telemetry-body');
    const heroContent = document.querySelector('.hero-content'); // nowy selektor dla Hero Content
    const consentModule = document.getElementById('consent-module');
    const confirmBtn = document.getElementById('confirm-link-btn');
    const scanBtn = document.getElementById('scan-btn');

    // --- LOGIKA NAWIGACJI (SCROLL) JAK W MONTE ---
    let lastScrollY = window.scrollY;
    const navbar = document.querySelector('.navbar');

    window.addEventListener('scroll', () => {
        const currentScrollY = window.scrollY;
        
        // Zarzadzanie efektem blur / kolorem tla nav po scrollu
        if (currentScrollY > 50) {
            navbar.classList.add('nav-scrolled');
        } else {
            navbar.classList.remove('nav-scrolled');
        }

        // Ukrywanie paska nawigacji podczas przewijania w dół, pokazywanie w gorę
        if (currentScrollY > lastScrollY && currentScrollY > 100) {
            navbar.classList.add('nav-hidden');
        } else {
            navbar.classList.remove('nav-hidden');
        }
        
        lastScrollY = currentScrollY;
    });

    // --- ZGODA NA PLIKI COOKIE ---
    if (!localStorage.getItem('monte_consent')) {
        consentModule.classList.remove('hidden');
    }

    confirmBtn.addEventListener('click', () => {
        localStorage.setItem('monte_consent', 'true');
        consentModule.classList.add('hidden');
    });

    // --- EFEKT MIKRO GRAWITACJI W HERO ---
    document.addEventListener('mousemove', (e) => {
        const x = (e.clientX / window.innerWidth - 0.5) * 10; 
        const y = (e.clientY / window.innerHeight - 0.5) * -10;
        
        if (heroContent) {
            heroContent.style.transform = `rotateY(${x}deg) rotateX(${y}deg)`;
        }
    });

    // --- POBIERANIE DANYCH Z NASA ---
    async function fetchData() {
        showScanningState(true);
        updateConnectionStatus('fetching');
        try {
            const data = await fetchViaProxy(NASA_API);

            // Logika wykrywania nowego uderzenia
            if (data.data && data.data.length > 0) {
                const latestDate = data.data[0][0]; // Pierwsza kolumna to "date"
                
                // Zatrąb, jeśli jest nowa data, Z WYJĄTKIEM pierwszego ładowania (aby uniknąc błędu braku interakcji użytkownika)
                if (!isInitialLoad && lastLatestDate !== latestDate) {
                    playRadarBeep();
                }
                lastLatestDate = latestDate;
            }

            processData(data);
            updateConnectionStatus('ok');
        } catch (error) {
            console.error('Błąd pobierania:', error);
            tableBody.innerHTML = `<tr><td colspan="6" style="text-align:center; padding:50px; color:#fff; background:#111;">BŁĄD POŁĄCZENIA - SERWERY NASA NASA/PROXY NIEDOSTĘPNE<br><small style="color:#aaa; font-size:0.75rem;">Spróbuj odświeżyć za chwilę.</small></td></tr>`;
            updateConnectionStatus('error');
        } finally {
            showScanningState(false);
        }
    }

    function processData(data) {
        const fields = data.fields;
        const records = data.data;

        markersGroup.clearLayers();
        tableBody.innerHTML = '';

        records.forEach((record, index) => {
            const entry = {};
            fields.forEach((field, i) => entry[field] = record[i]);
            
            // Transformacja czasu z NASA (zawsze UTC) na czas lokalny (Polska strefa czasowa przeglądarki)
            // NASA przysyła yyyy-mm-dd hh:mm:ss więc dodajemy T i Z aby poprawnie zbudować nową datę z UTC
            let localDateStr = entry.date.split(' ')[0];
            let localTimeStr = entry.date.split(' ')[1];
            try {
                const parseableDate = entry.date.replace(' ', 'T') + "Z";
                const dateObj = new Date(parseableDate);
                if (!isNaN(dateObj.getTime())) {
                    localDateStr = dateObj.toLocaleDateString();
                    localTimeStr = dateObj.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit', second:'2-digit'});
                }
            } catch(e) {}
            
            // --- FIZYKA: MASA, ŚREDNICA ORAZ CZAS SŁONECZNY EPICENTRUM ---
            let epicenterTimeStr = 'BRAK';
            let calcMassStr = 'NIEZNANA';
            let calcDiameterStr = 'NIEZNANA';
            
            if (entry.lon && entry['lon-dir']) {
                let lonOffset = Math.round(parseFloat(entry.lon) / 15);
                if (entry['lon-dir'] === 'W') lonOffset *= -1;
                
                try {
                    const utcDate = new Date(entry.date.replace(' ', 'T') + "Z");
                    if (!isNaN(utcDate.getTime())) {
                        utcDate.setHours(utcDate.getHours() + lonOffset);
                        epicenterTimeStr = utcDate.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
                    }
                } catch(e) {}
            }
            
            if (entry['impact-e']) {
                const impactKt = parseFloat(entry['impact-e']);
                const energyJoules = impactKt * 4.184e12; // Przeliczam KT na Dżule
                const velocityKms = entry.vel ? parseFloat(entry.vel) : 17.0; // Standard speed if null
                const velocityMs = velocityKms * 1000;
                
                // M = 2E / v^2 (z E = 1/2 m v^2)
                const massKg = (2 * energyJoules) / (velocityMs * velocityMs);
                const massTonnes = massKg / 1000;
                calcMassStr = massTonnes > 1000 ? (massTonnes/1000).toFixed(2) + ' tyś. TON' : massTonnes.toFixed(2) + ' TON';
                
                // Obliczanie średnicy zakładając gęstość chondrytu zwyczajnego ~3000 kg/m^3
                const volume = massKg / 3000;
                const radius = Math.cbrt(volume / ((4/3) * Math.PI));
                const diameter = radius * 2;
                calcDiameterStr = diameter < 1 ? (diameter*100).toFixed(1) + ' CM' : diameter.toFixed(2) + ' METRÓW';
            }
            
            entry.calcMassInfo = calcMassStr;
            entry.calcDiameterInfo = calcDiameterStr;
            entry.epicenterTimeInfo = epicenterTimeStr;

            const isLatest = index === 0;   // Najnowszy meteor to pierwszy w tabeli
            const activeColor = isLatest ? '#ff3b3b' : '#ffffff';
            const pulseClass = isLatest ? 'pulse-marker-latest' : 'pulse-marker';

            if (entry.lat && entry.lon) {
                const lat = parseFloat(entry.lat) * (entry['lat-dir'] === 'S' ? -1 : 1);
                const lon = parseFloat(entry.lon) * (entry['lon-dir'] === 'W' ? -1 : 1);
                const energy = parseFloat(entry.energy) || 1;
                
                const radius = 3 + Math.log10(energy * 10); // Dynamika kropki bazujaca na energii wpuknięcia

                const marker = L.circleMarker([lat, lon], {
                    radius: radius,
                    color: activeColor,
                    weight: 1,
                    fillColor: activeColor,
                    fillOpacity: 1,
                    className: pulseClass
                });

                marker.on('click', () => showModal(entry));
                marker.addTo(markersGroup);
            }

            const row = document.createElement('tr');
            if(isLatest) row.style.backgroundColor = 'rgba(255, 59, 59, 0.05)';
            
            row.innerHTML = `
                <td><span style="color:${activeColor}">${localDateStr}</span> <br> <small style="color:${isLatest ? '#ff3b3b' : '#555'}">${localTimeStr}</small></td>
                <td style="color:${isLatest ? '#ccc' : '#888'}">${entry.lat}${entry['lat-dir']} / ${entry.lon}${entry['lon-dir']} <br> <small style="color:#555">CZAS EPIC. ${epicenterTimeStr}</small></td>
                <td><span style="color:${activeColor}; font-weight:bold;">${calcMassStr}</span> <br> <small style="color:#666">&Oslash; ${calcDiameterStr}</small></td>
                <td><span style="color:${activeColor}">${entry.vel || '---'} KM/S</span></td>
                <td style="color:${activeColor}; font-weight:700;">${entry['impact-e'] || '---'} KT</td>
                <td><span class="status-badge" style="${isLatest ? 'color:#ff3b3b; border-color:#ff3b3b; box-shadow: 0 0 10px rgba(255,59,59,0.3);' : ''}">${isLatest ? 'OSTATNIE UDERZENIE' : 'WYKRYTO'}</span></td>
            `;
            row.addEventListener('click', () => showModal(entry));
            tableBody.appendChild(row);
        });
    }

    function showScanningState(isScanning) {
        if (isScanning) {
            tableBody.innerHTML = `<tr><td colspan="6" class="scanning" style="text-align:center; padding:50px;">ANALIZOWANIE TELEMETRII ORBITALNEJ...</td></tr>`;
            scanBtn.innerHTML = 'SKANOWANIE...';
            // Wygaszanie klikniecia
            scanBtn.style.pointerEvents = 'none';
        } else {
            scanBtn.innerHTML = 'SKANUJ ORBITĘ &rarr;';
            scanBtn.style.pointerEvents = 'auto';
        }
    }

    function updateConnectionStatus(state) {
        const statusDot = document.getElementById('connection-status-dot');
        const statusText = document.getElementById('connection-status-text');
        
        if (!statusDot || !statusText) return;
        
        statusDot.classList.remove('status-green', 'status-orange', 'status-red');
        
        if (state === 'fetching') {
            statusDot.classList.add('status-orange');
            statusText.innerText = 'NAWIĄZYWANIE ŁĄCZA...';
            statusText.style.color = '#ffa500';
        } else if (state === 'ok') {
            statusDot.classList.add('status-green');
            statusText.innerText = 'AKTYWNE ŁĄCZE SATELITARNE';
            statusText.style.color = '#00ff00';
        } else if (state === 'error') {
            statusDot.classList.add('status-red');
            statusText.innerText = 'BŁĄD NASŁUCHU CNEOS';
            statusText.style.color = '#ff3b3b';
        }
    }

    function showModal(entry) {
        const modalOverlay = document.getElementById('modal-overlay');
        const modalContent = document.getElementById('modal-content');
        
        modalContent.innerHTML = `
            <h2 style="margin-bottom:30px; letter-spacing:4px; font-size:2rem; font-family:'D-DIN', sans-serif;">BAZA_DANYCH: ${entry.date}</h2>
            <div class="modal-grid">
                <div><span style="color:#666;">KOORDYNATY</span><br><br><span style="font-size:1rem;color:#fff">${entry.lat}${entry['lat-dir']} ${entry.lon}${entry['lon-dir']}</span></div>
                <div><span style="color:#666;">CZAS LOK. W EPICENTRUM</span><br><br><span style="font-size:1rem;color:#fff">${entry.epicenterTimeInfo}</span></div>
                <div><span style="color:#666;">SIŁA UDERZENIA</span><br><br><span style="font-size:1rem;color:#fff; font-weight:bold;">${entry['impact-e']} KT</span></div>
                <div><span style="color:#666;">PRĘDKOŚĆ WEJŚCIA</span><br><br><span style="font-size:1rem;color:#fff">${entry.vel || 'BRAK DANYCH'} KM/S</span></div>
                <div><span style="color:#666;">SZACU. MASA SZCZĄTKÓW</span><br><br><span style="font-size:1rem;color:#fff">${entry.calcMassInfo}</span></div>
                <div><span style="color:#666;">SZACU. ŚREDNICA BOLIDU</span><br><br><span style="font-size:1rem;color:#fff">${entry.calcDiameterInfo}</span></div>
            </div>
            <div style="margin-top:40px; border-top:1px solid #222; padding-top:20px; color:#444; font-size:0.6rem; letter-spacing:2px;">
                ZAPYTANIE_CNEOS // POZIOM_OBRONY_ZIEMI_01
            </div>
        `;
        
        modalOverlay.classList.remove('hidden');
    }

    const modalOverlay = document.getElementById('modal-overlay');
    document.getElementById('close-modal').addEventListener('click', () => {
        modalOverlay.classList.add('hidden');
    });
    // Zamknięcie modala kliknięciem w tło...
    modalOverlay.addEventListener('click', (e) => {
        if (e.target === modalOverlay) modalOverlay.classList.add('hidden');
    });
    // ...lub klawiszem Escape
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') modalOverlay.classList.add('hidden');
    });

    scanBtn.addEventListener('click', () => {
        playRadarBeep(); // Ręczny dźwięk na żądanie
        fetchData();
    });
    
    fetchData().then(() => { isInitialLoad = false; }); // Początkowe ładowanie

    // Aplikacja nie wymaga odświeżania od użytkownika - sprawdzamy radary co 2 minuty
    setInterval(fetchData, 120000); 
});
