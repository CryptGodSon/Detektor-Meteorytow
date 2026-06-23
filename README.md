# 🛰️ Meteor Detector | Earth Orbital Defense

**An interactive cosmic-threat (NEO) detector powered by live telemetry from CNEOS/NASA servers. Track the impacts of powerful bolides entering Earth's atmosphere in real time. An early-warning module linked to the main multiplanetary colonization program – MonteMARS.**

---

## 📸 System Features
* **Online Data Fetching:** Queries the U.S. [CNEOS NASA](https://cneos.jpl.nasa.gov/) databases directly through a CORS proxy (with automatic fallback across several proxies for resilience).
* **Real-Time Scanning:** An active radar "Ping" signals the detection of a new threat whenever a fresh data packet arrives.
* **Physical Object Analysis:** Advanced parametrization that takes the blast energy in Kilotons and converts it, using physics formulas, into the estimated _Mass_ (T) and _Size_ (D) of the ballistic object.
* **Geophysical Map (Globe):** Interactive Leaflet technology operating on impact coordinates, fully free to use (open-source OpenStreetMap with a Sci-Fi noise / dark-mode filter).
* **Solar Time Conversion:** Instantly translates the base time into the true local time at the epicenter, using the raw longitude of the impact.
* **Bolide Encyclopedia:** A powerful, multi-module collection of educational texts about events such as Tunguska, with a direct link to the **MonteMARS** base station.
* **Bilingual Interface (PL/EN):** A language switch in the navigation bar; the choice is saved in `localStorage` and applied across both pages instantly, without reloading.

## 🛠️ Architecture
The project is built with pure front-end ("Vanilla" JS) technology.
No need to install Node.js or bundlers – designed perfectly for instant deployment as a static project.
* `index.html` - Radar station with a built-in hardware-cookie consent.
* `meteoryty.html` - Information & education hub.
* `style.css` - Fully scalable (responsive for iOS/Android) Dark Mode stylesheets.
* `app.js` - Ballistic-engine data converters and cyclic `fetch()` loops.
* `i18n.js` - PL/EN dictionary and translation engine powering the language switch.

## 🚀 Installation & Running (Local Live Server)
1. Clone the repository to your local machine.
2. Download the free [VS Code](https://code.visualstudio.com/) environment.
3. Enable the `Live Server` extension.
4. Right-click `index.html` -> and run `Open with Live Server`.
5. The module is loaded!

## 🌍 About the Project & License
Engineered by **[CryptGodSon](https://github.com/CryptGodSon)**. \
Powered by NASA JPL's public infrastructure and logic. Also designed for the *GitHub Pages* deployment framework. \
A derivative of the main expansion plan at: [MonteMARS](https://cryptgodson.github.io/MonteMARS/).
