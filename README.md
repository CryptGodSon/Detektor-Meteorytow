# 🛰️ Detektor Meteorytów | Earth Orbital Defense

**Interaktywny detektor zagrożeń kosmicznych (NEO) zasilany telemetrią live z serwerów CNEOS/NASA. Śledź uderzenia potężnych bolidów w Ziemską atmosferę w czasie rzeczywistym. Moduł wczesnego ostrzegania powiązany z głównym wieloplanetarnym programem kolonizacji – MonteMARS.**

---

## 📸 Główne Funkcje (System Features)
* **Pobieranie Danych Online:** Odpytywanie przez proxy bezpośrednio amerykańskich baz militarnych [CNEOS NASA](https://cneos.jpl.nasa.gov/).
* **Skanowanie Czasu Rzeczywistego:** Aktywny radar "Ping" sygnałujący wykrycie nowego zagrożenia po odświeżeniu pakietu danych.
* **Analiza Fizyczna Obiektów:** Zaawansowana parametryzacja wstrzykująca dane o wybuchu w Kilotonach i konwertująca je przy użyciu wzorów na szacunkową _Masę_ (T) oraz _Wielkość_ (D) obiektu balistycznego.
* **Mapa Geofizyczna (Glob):** Interaktywna technologia Leaflet operująca koordynatami uderzenia dla w pełni darmowego dostępu (open-source OpenStreetMap z nałożonym filtrem Sci-Fi szumu/dark mode).
* **Konwersja Czasu Słonecznego:** Natychmiastowe tłumaczenie bazowego Czasu Centralnego na Prawdziwy Lokalny Czas Epicentrum, korzystając z surowej długości geograficznej uderzenia.
* **Encyklopedia Bolidów:** Potężny, wielomodułowy zbiór tekstów dydaktycznych o zdarzeniach takich jak Tunguska z bezpośrednim łączem do stacji bazowej **MonteMARS**.

## 🛠️ Architektura
Projekt jest wykonany w technologii Czystego Front-Endu ("Vanilla" JS). 
Brak konieczności instalowania Node.js lub bundlerów – zaprojektowany perfekcyjnie pod natychmiastowe wdrożenie jako projekt statyczny.
* `index.html` - Stacja radarowa z wbudowaną zgodą cookies sprzętowych.
* `meteoryty.html` - Hub informacyjno-edukacyjny.
* `style.css` - W pełni skalowalne (Responsywne dla iOS/Android) arkusze Dark Mode.
* `app.js` - Przeliczniki danych silnika balistycznego oraz pętle cykliczne `fetch()`.

## 🚀 Instalacja & Uruchamianie (Local Live Server)
1. Klonuj repozytorium do siebie na pulpit maszynowy.
2. Pobierz darmowe środowisko [VS Code](https://code.visualstudio.com/).
3. W jego rozszerzeniach włącz `Live Server`.
4. Kliknij Prawym Przyciskiem Myszki na `index.html` -> i odpal `Open with Live Server`.
5. Moduł jest załadowany!

## 🌍 O Projekcie i Licencja
Engineered by **[CryptGodSon](https://github.com/CryptGodSon)**. \
Zasilane infrastrukturą i logiką publiczną NASA JPL. Zaprojektowane również na ramy wdrożeniowe *Github Pages*. \
Pochodna głównego planu ekspansji na: [MonteMARS](https://cryptgodson.github.io/MonteMARS/).
