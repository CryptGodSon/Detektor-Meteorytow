/* =====================================================================
   i18n.js — dwujęzyczność PL / EN dla Detektora Meteorytów
   ---------------------------------------------------------------------
   - Treść statyczna: elementy z atrybutem data-i18n (innerHTML)
     oraz data-i18n-content (atrybut content, np. meta description).
   - Treść dynamiczna (tabela / modal / statusy w app.js): funkcja
     window.i18n.t('klucz'). Po zmianie języka emitowane jest zdarzenie
     'i18n:changed', na które app.js przerenderowuje dane.
   - Wybór języka zapisywany w localStorage ('monte_lang').
   ===================================================================== */
(function () {
    'use strict';

    const DICT = {
        pl: {
            /* --- Nawigacja --- */
            nav_glob: 'GLOB',
            nav_telemetry: 'TELEMETRIA',
            nav_meteors: 'METEORYTY',

            /* --- Tytuły / meta (index) --- */
            title_index: 'Detektor Meteorytów NA ŻYWO – Gdzie w powłokę uderzył meteor? [RADAR OSTRZEGAWCZY]',
            desc_index: 'Szokujące dane CNEOS online! Prawdziwy satelitarny radar 100 ostatnich potężnych uderzeń meteorów o niesamowitej energii w Ziemię. Zobacz ostrzeżenia NASA na własne oczy i włącz darmowy lokalizator live!',

            /* --- Hero --- */
            hero_title: 'DETEKTOR METEORYTÓW',
            hero_desc: 'MONITOROWANIE ZAGROŻEŃ KOSMICZNYCH (NEO) | TELEMETRIA NA ŻYWO Z SIECI SATELITARNEJ NASA.',
            scroll_down: 'TELEMETRIA PONIŻEJ',

            /* --- Sekcja mapy --- */
            tracker_heading: 'GLOBALNE ŚLEDZENIE ZAGROŻEŃ',
            infotip_body: '<strong>JAK DZIAŁA SYSTEM?</strong><br><br>' +
                'Aplikacja działa całkowicie samoistnie, uaktualniając najczęstsze raporty prosto z CNEOS (NASA). Czas pokazywany to Twój lokalny czas, więc nie musisz przeliczać stref z USA!<br><br>' +
                '• <strong>Kropki na mapie:</strong> Każda z nich to prawdziwy ślad meteoroidu.<br>' +
                '• <strong>Czerwony kolor:</strong> Odznacza absolutnie najświeższe uderzenie wyłapane przez nasłuch.<br>' +
                '• <strong>Szczegóły:</strong> Kliknij kropkę (zawsze wcelujesz) lub wiersz w tabeli, by poznać koordynaty, prędkość i udar w Kilotonach.<br>' +
                '• System sam się aktualizuje, ale jak poczujesz potrzebę, narzuć to ręcznie przyciskiem skanowania w celu sprawdzenia!',
            scan_btn_full: 'SKANUJ ORBITĘ / ODŚWIEŻ',

            /* --- Sekcja tabeli --- */
            feed_heading: 'STRUMIEŃ DANYCH',
            th_time: '[CZAS_ORBITALNY]',
            th_coords: '[WSPÓŁRZĘDNE]',
            th_mass: '[MASA_I_ROZMIAR]',
            th_velocity: '[PRĘDKOŚĆ]',
            th_impact: '[SIŁA_UDERZENIA]',
            th_status: '[STATUS]',

            /* --- Zgoda cookie --- */
            consent_title: 'KOMUNIKAT SYSTEMOWY',
            consent_body: 'Wymagana autoryzacja sprzętowych plików Cookie w celu zestawienia strumienia telemetrii na Twojej maszynie (Local Storage).',
            consent_btn: 'ZEZWÓL NA TRANSFER',

            /* --- Stopka --- */
            footer_scanner: 'Skaner',
            footer_glob: 'Glob',
            footer_glob_earth: 'Glob Ziemi',
            footer_monte: 'GŁÓWNY PROGRAM KOLONIZACJI MONTE',
            footer_copyright_index: '&copy; 2026 MONTE. Czyniąc ludzkość gatunkiem wieloplanetarnym. Zasilane CNEOS.',
            footer_copyright_meteor: '&copy; 2026 Detektor Meteorytów. Zasilane strumieniami Danych CNEOS/NASA JPL.',

            /* --- Dynamika (app.js) --- */
            scanning: 'ANALIZOWANIE TELEMETRII ORBITALNEJ...',
            scan_btn: 'SKANUJ ORBITĘ',
            scanning_btn: 'SKANOWANIE...',
            status_active: 'AKTYWNE ŁĄCZE SATELITARNE',
            status_fetching: 'NAWIĄZYWANIE ŁĄCZA...',
            status_error: 'BŁĄD NASŁUCHU CNEOS',
            error_main: 'BŁĄD POŁĄCZENIA - SERWERY NASA/PROXY NIEDOSTĘPNE',
            error_sub: 'Spróbuj odświeżyć za chwilę.',
            epic_time: 'CZAS EPIC.',
            badge_latest: 'OSTATNIE UDERZENIE',
            badge_detected: 'WYKRYTO',
            none: 'BRAK',
            unknown: 'NIEZNANA',
            unit_thousand_tons: 'tyś. TON',
            unit_tons: 'TON',
            unit_cm: 'CM',
            unit_meters: 'METRÓW',
            modal_db: 'BAZA_DANYCH',
            modal_coords: 'KOORDYNATY',
            modal_epic: 'CZAS LOK. W EPICENTRUM',
            modal_impact: 'SIŁA UDERZENIA',
            modal_velocity: 'PRĘDKOŚĆ WEJŚCIA',
            modal_mass: 'SZACU. MASA SZCZĄTKÓW',
            modal_diameter: 'SZACU. ŚREDNICA BOLIDU',
            modal_nodata: 'BRAK DANYCH',
            modal_footer: 'ZAPYTANIE_CNEOS // POZIOM_OBRONY_ZIEMI_01',

            /* --- Strona meteoryty.html (encyklopedia) --- */
            title_meteor: 'METEORYTY – DETEKTOR | MONTE',
            desc_meteor: 'Klasyfikacja Obiektów Bliskich Ziemi, analiza ryzyka i kolonizacja Marsa przed potencjalną anomalią balistyczną rodem z NASA.',
            art_h1: 'Fizyka, Astrofizyka a Zagrożenie Z Kosmosu',
            art_subtitle: 'RAPORT ANALITYCZNY // KLASYFIKACJA OBIEKTÓW BLISKICH ZIEMI (NEO)',
            art_h2_1: 'NATURA BOLIDÓW I ZJAWISK ATMOSFERYCZNYCH',
            art_p1: 'Meteoryty, uderzające w naszą planetę, to najczęściej pofragmentowane kawałki asteroid lub rzadziej wędrowne komety, które szczęśliwym trafem przetrwały drastyczne przejście przez gęste warstwy ziemskiej atmosfery. Zdecydowana większość badanych obiektów zagrażających naszej infrastrukturze stanowi fundamentalny gruz skalny – bezcenną, surową pozostałość po gwałtownym procesie formowania się Układu Słonecznego blisko <strong>4,5 miliarda lat temu</strong>.',
            art_p2: 'Dla ziemskiego układu, prawdziwa "magia" balistyczna rozpoczyna się przy granicy Karmana. Kiedy fragment skały o masie ułamka tony (lub masie odpowiadającej nierzadko blokom mieszkalnym) wbija się w ziemską warstwę gazową, następuje to przy ekstremalnych – z ludzkiego punktu widzenia niewyobrażalnych – prędkościach granicznych. Oscylują one w przedziale <strong>11 do 72 km/s</strong>, czyli od 40 tysięcy aż do gigantycznych 260 tysięcy kilometrów na godzinę!',
            art_p3: 'Zamiast klasycznego pożaru, podyktowanego spalaniem tlenowym, dochodzi tu do czystej inżynierii materiałowej: niewyobrażalnie krótki czas wejścia powoduje, że gazy przed obiektem ulegają gigantycznej kompresji. Powstaje fala uderzeniowa taranująca cząstki powietrza. Zmiażdżone powietrze ogrzewa się do temperatur rzędu tysięcy stopni, a samo zjawisko niszczenia nazywamy z fizycznego punktu widzenia <em>ablacją</em>. Na optycznych detektorach i stacjach wczesnego ostrzegania NASA (takich jak CNEOS) wykrywane jest to natychmiast jako potężny rozbłysk promieniowania cieplnego – nazywany anglosaskim terminem <strong>Fireball</strong> (bolid).',
            art_h2_2: 'WIDMO ZAGŁADY: CZY WKRÓTCE ZNIKNIEMY JAK DINOZAURY?',
            art_p4: 'Pomimo powszechnie królujących, ponurych obaw napędzanych wizją reżyserską rodem z Hollywood, czysta i chłodna statystyka układów stochastycznych dynamiki orbitalnej przynosi ulgę. Ziemi absolutnie nie zagraża natychmiastowe globalne wymarcie flory i fauny z miesiąca na miesiąc. Asteroida kalibru rzędu 10-15 kilometrów średnicy – gabaryty przypisywane słynnemu impaktorowi z krateru <strong>Chicxulub</strong>, który przed milionami lat zabił całą gałąź nieptasich dinozaurów – trafia w Ziemię skrajnie i niewyobrażalnie wręcz rzadko. Znakomita większość orbit monstrualnych obiektów Układu Słonecznego została skrupulatnie zweryfikowana przez agencje i przebywa dziś bezpiecznie, mocno ustabilizowana przez dominujące wpływy grawitacyjne w Pasie Głównym Jowisza.',
            art_p5: 'Nie oznacza to jednak jakiejś uniwersalnej gwarancji absolutnego bezpieczeństwa Ziemi i jej mieszkańców.',
            art_p6: 'W XXI wieku największym, najbardziej realnym, <strong>nagłym i punktowym</strong> zagrożeniem dla cywilizacji ludzkiej są obiekty, z którymi mierzy się właśnie Twój Detektor na stronie głównej – te o średnicy od 50 do około 140 metrów. Ciała te są z reguły ciemne, małe (dla teleskopów z Ziemi) a ich wejście gmatwa się w blasku słonecznym, przez co o zbliżającej się skałach dowiadujemy się nierzadko w dniu uderzenia.',
            art_p7: 'Dokładnie taki "niewielki", 50-metrowy bolid zniszczył olbrzymie połacie lasu poruszając się nad Syberią w 1908 roku podczas słynnej katastrofy Tunguskiej. Mieliśmy z nim do czynienia także zupełnie niedawno nad rosyjskim miastem Czelabińsk, kiedy potężna fala uderzeniowa pozbawiła na moment całe miasto barier w postaci okien i raniła około półtora tysiąca osób. Energia wyzwolona z bezpośredniego wlecenia niewielkiego, chociażby tylko stumetrowego obiektu centralnie w nowojorską czy rzymską aglomerację dorównywać będzie podwielokrotności najsilniejszej bomby wodorowej w arsenale mocarstw jądrowych. Ciśnienie z tak kolosalnego wydarzenia dosłownie zdmuchnie metropolię. Ryzyko zagłady całego lądu nie wystąpi, lecz regionalna rzeź wywołana kosmicznym cudem – już tak.',
            promo_h3: 'GWARANCJA PRZETRWANIA GATUNKU',
            promo_p1: 'Najtwardsze analizy z rdzeni geologicznych naszej planety krzyczą głośno i wyraźnie o jednej regule. Orbita okołosłoneczna Ziemi to nie oaza. Ziemia potrafi resetować życie za sprawą wahań osi, drastycznych erupcji szczelinowych i – ostatecznie – rykoszetów ciał niebieskich uwolnionych np. z otchłani mroźnego Pasa Kuipera. Przez setki wieków nasz dom radził sobie z niszczycielskimi żywiołami.',
            promo_p2: 'Trzymanie całej spuścizny cywilizacyjnej, infrastruktury węglowej, dorobku miliardów umysłów oraz bibliotek ludzkości wyłącznie i tylko pod cienkim kloszem jednej, bezbronnej atmosfery to skrajny, taktyczny masochizm. Czysta dyrektywa genetyczna wskazuje, że ochrona puli DNA polega na brutalnej dywersyfikacji. <strong>Kolonizacja nie jest ucieczką hollywoodzkich marzycieli – to ostateczna, naukowa polisa emerytalna dla naszego gatunku.</strong> Rozrzucenie świadomości na zewnętrzne przyczółki ubezpiecza całą historię ludzkich osiągnięć przed destrukcją w punkcie zero.',
            promo_btn: 'SPRAWDŹ GŁÓWNY PROGRAM KOLONIZACYJNY MARSA – MONTE'
        },

        en: {
            /* --- Navigation --- */
            nav_glob: 'GLOBE',
            nav_telemetry: 'TELEMETRY',
            nav_meteors: 'METEORS',

            /* --- Titles / meta (index) --- */
            title_index: 'Meteor Detector LIVE – Where did a meteor hit Earth? [WARNING RADAR]',
            desc_index: 'Shocking CNEOS data online! A real satellite radar of the 100 latest powerful, high-energy meteor impacts on Earth. See NASA warnings with your own eyes and switch on the free live locator!',

            /* --- Hero --- */
            hero_title: 'METEOR DETECTOR',
            hero_desc: 'MONITORING COSMIC THREATS (NEO) | LIVE TELEMETRY FROM THE NASA SATELLITE NETWORK.',
            scroll_down: 'TELEMETRY BELOW',

            /* --- Map section --- */
            tracker_heading: 'GLOBAL THREAT TRACKING',
            infotip_body: '<strong>HOW DOES THE SYSTEM WORK?</strong><br><br>' +
                'The app runs completely on its own, updating the latest reports straight from CNEOS (NASA). The time shown is your local time, so you don\'t have to convert US time zones!<br><br>' +
                '• <strong>Dots on the map:</strong> Each one is a real meteoroid trace.<br>' +
                '• <strong>Red color:</strong> Marks the absolute freshest impact caught by the listening system.<br>' +
                '• <strong>Details:</strong> Click a dot (you\'ll always hit it) or a table row to see coordinates, velocity and impact energy in Kilotons.<br>' +
                '• The system updates itself, but if you feel the need, force it manually with the scan button to check!',
            scan_btn_full: 'SCAN ORBIT / REFRESH',

            /* --- Table section --- */
            feed_heading: 'DATA STREAM',
            th_time: '[ORBITAL_TIME]',
            th_coords: '[COORDINATES]',
            th_mass: '[MASS_AND_SIZE]',
            th_velocity: '[VELOCITY]',
            th_impact: '[IMPACT_FORCE]',
            th_status: '[STATUS]',

            /* --- Cookie consent --- */
            consent_title: 'SYSTEM MESSAGE',
            consent_body: 'Hardware Cookie authorization is required to establish the telemetry stream on your machine (Local Storage).',
            consent_btn: 'ALLOW TRANSFER',

            /* --- Footer --- */
            footer_scanner: 'Scanner',
            footer_glob: 'Globe',
            footer_glob_earth: 'Earth Globe',
            footer_monte: 'MAIN MONTE COLONIZATION PROGRAM',
            footer_copyright_index: '&copy; 2026 MONTE. Making humanity a multiplanetary species. Powered by CNEOS.',
            footer_copyright_meteor: '&copy; 2026 Meteor Detector. Powered by CNEOS/NASA JPL data streams.',

            /* --- Dynamic (app.js) --- */
            scanning: 'ANALYZING ORBITAL TELEMETRY...',
            scan_btn: 'SCAN ORBIT',
            scanning_btn: 'SCANNING...',
            status_active: 'ACTIVE SATELLITE LINK',
            status_fetching: 'ESTABLISHING LINK...',
            status_error: 'CNEOS LISTENING ERROR',
            error_main: 'CONNECTION ERROR - NASA SERVERS/PROXY UNAVAILABLE',
            error_sub: 'Try refreshing in a moment.',
            epic_time: 'EPIC. TIME',
            badge_latest: 'LATEST IMPACT',
            badge_detected: 'DETECTED',
            none: 'NONE',
            unknown: 'UNKNOWN',
            unit_thousand_tons: 'k TONS',
            unit_tons: 'TONS',
            unit_cm: 'CM',
            unit_meters: 'METERS',
            modal_db: 'DATABASE',
            modal_coords: 'COORDINATES',
            modal_epic: 'LOCAL TIME AT EPICENTER',
            modal_impact: 'IMPACT FORCE',
            modal_velocity: 'ENTRY VELOCITY',
            modal_mass: 'EST. DEBRIS MASS',
            modal_diameter: 'EST. BOLIDE DIAMETER',
            modal_nodata: 'NO DATA',
            modal_footer: 'CNEOS_QUERY // EARTH_DEFENSE_LEVEL_01',

            /* --- meteoryty.html page (encyclopedia) --- */
            title_meteor: 'METEORS – DETECTOR | MONTE',
            desc_meteor: 'Classification of Near-Earth Objects, risk analysis and the colonization of Mars ahead of a potential ballistic anomaly straight out of NASA.',
            art_h1: 'Physics, Astrophysics and the Threat From Space',
            art_subtitle: 'ANALYTICAL REPORT // CLASSIFICATION OF NEAR-EARTH OBJECTS (NEO)',
            art_h2_1: 'THE NATURE OF BOLIDES AND ATMOSPHERIC PHENOMENA',
            art_p1: 'Meteorites striking our planet are most often fragmented pieces of asteroids, or more rarely wandering comets, that by sheer luck survived the brutal passage through the dense layers of Earth\'s atmosphere. The vast majority of studied objects threatening our infrastructure are fundamental rocky debris – a priceless, raw remnant of the violent formation of the Solar System nearly <strong>4.5 billion years ago</strong>.',
            art_p2: 'For our planet, the real ballistic "magic" begins at the Kármán line. When a rock fragment weighing a fraction of a tonne (or sometimes as much as an apartment block) slams into Earth\'s gaseous layer, it does so at extreme – from a human standpoint unimaginable – entry velocities. They range from <strong>11 to 72 km/s</strong>, that is from 40 thousand up to a gigantic 260 thousand kilometers per hour!',
            art_p3: 'Instead of a classic fire driven by oxygen combustion, what happens here is pure materials engineering: the unimaginably short entry time causes the gases in front of the object to undergo gigantic compression. A shock wave forms, ramming the air particles. The crushed air heats up to temperatures of thousands of degrees, and the destruction phenomenon itself is, from a physical standpoint, called <em>ablation</em>. On NASA\'s optical detectors and early-warning stations (such as CNEOS) it is detected instantly as a powerful flash of thermal radiation – known by the term <strong>Fireball</strong> (bolide).',
            art_h2_2: 'THE SPECTER OF DOOM: WILL WE SOON VANISH LIKE THE DINOSAURS?',
            art_p4: 'Despite the gloomy fears that commonly prevail, fueled by Hollywood-style directorial visions, the cold, clean statistics of the stochastic systems of orbital dynamics bring relief. Earth is absolutely not threatened by an immediate global extinction of flora and fauna from one month to the next. An asteroid on the order of 10-15 kilometers in diameter – the dimensions attributed to the famous impactor from the <strong>Chicxulub</strong> crater, which millions of years ago killed off the entire branch of non-avian dinosaurs – strikes Earth extremely and almost unimaginably rarely. The vast majority of the orbits of the Solar System\'s monstrous objects have been meticulously verified by agencies and today reside safely, firmly stabilized by the dominant gravitational influences of Jupiter and the Main Belt.',
            art_p5: 'This does not, however, mean any universal guarantee of the absolute safety of Earth and its inhabitants.',
            art_p6: 'In the 21st century, the greatest, most realistic, <strong>sudden and pinpoint</strong> threat to human civilization comes from the objects that your Detector on the home page is dealing with – those between 50 and about 140 meters in diameter. These bodies are usually dark, small (for Earth-based telescopes), and their approach is obscured in the Sun\'s glare, so we often learn about an incoming rock only on the day of impact.',
            art_p7: 'Exactly such a "small", 50-meter bolide destroyed vast swaths of forest as it passed over Siberia in 1908 during the famous Tunguska event. We also encountered one quite recently over the Russian city of Chelyabinsk, when a powerful shock wave momentarily stripped the entire city of its windows and injured around fifteen hundred people. The energy released by a small object – even just a hundred meters across – flying directly into a metropolis like New York or Rome would equal a multiple of the most powerful hydrogen bomb in the arsenal of nuclear powers. The pressure from such a colossal event would literally blow the metropolis away. The risk of annihilating an entire continent would not arise, but a regional massacre triggered by a cosmic fluke – that, yes.',
            promo_h3: 'GUARANTEE OF THE SPECIES\' SURVIVAL',
            promo_p1: 'The hardest analyses from our planet\'s geological cores cry out loud and clear about one rule. Earth\'s solar orbit is no oasis. Earth is capable of resetting life through axial wobbles, drastic fissure eruptions and – ultimately – ricochets of celestial bodies released, for example, from the abyss of the frigid Kuiper Belt. For hundreds of ages our home has coped with destructive forces.',
            promo_p2: 'Keeping the entire civilizational heritage, the carbon-based infrastructure, the achievements of billions of minds and the libraries of humanity solely and only under the thin bell jar of a single, defenseless atmosphere is extreme, tactical masochism. A pure genetic directive indicates that protecting the DNA pool relies on brutal diversification. <strong>Colonization is not an escape for Hollywood dreamers – it is the ultimate, scientific retirement policy for our species.</strong> Scattering consciousness across outer footholds insures the entire history of human achievement against destruction at ground zero.',
            promo_btn: 'EXPLORE THE MAIN MARS COLONIZATION PROGRAM – MONTE'
        }
    };

    const STORAGE_KEY = 'monte_lang';
    let currentLang = localStorage.getItem(STORAGE_KEY) || 'pl';
    if (!DICT[currentLang]) currentLang = 'pl';

    // Zwraca tłumaczenie dla klucza; fallback: PL, a w ostateczności sam klucz.
    function t(key) {
        const pack = DICT[currentLang] || DICT.pl;
        if (pack[key] != null) return pack[key];
        if (DICT.pl[key] != null) return DICT.pl[key];
        return key;
    }

    function applyTranslations() {
        document.documentElement.lang = currentLang;

        document.querySelectorAll('[data-i18n]').forEach(el => {
            const val = t(el.getAttribute('data-i18n'));
            if (val != null) el.innerHTML = val;
        });

        // Tłumaczenie atrybutu content (np. <meta name="description">)
        document.querySelectorAll('[data-i18n-content]').forEach(el => {
            el.setAttribute('content', t(el.getAttribute('data-i18n-content')));
        });

        // Etykieta przełącznika pokazuje język, NA KTÓRY się przełączy
        const toggle = document.getElementById('lang-toggle');
        if (toggle) {
            toggle.textContent = currentLang === 'pl' ? 'EN' : 'PL';
            toggle.setAttribute('aria-label', currentLang === 'pl' ? 'Switch to English' : 'Przełącz na polski');
        }

        // Sygnał dla app.js, by przerenderował treść dynamiczną (tabela/modal/statusy)
        document.dispatchEvent(new CustomEvent('i18n:changed', { detail: { lang: currentLang } }));
    }

    function setLang(lang) {
        if (!DICT[lang] || lang === currentLang) return;
        currentLang = lang;
        localStorage.setItem(STORAGE_KEY, lang);
        applyTranslations();
    }

    function init() {
        const toggle = document.getElementById('lang-toggle');
        if (toggle) {
            toggle.addEventListener('click', () => setLang(currentLang === 'pl' ? 'en' : 'pl'));
        }
        applyTranslations();
    }

    // Udostępnienie API dla app.js
    window.i18n = { t: t, setLang: setLang, getLang: () => currentLang };

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
