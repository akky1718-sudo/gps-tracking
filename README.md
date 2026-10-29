# ExactPin 📍

> **Pin your place. Make every delivery easier.**  
> An open-access, precision exact-location sharing tool designed to solve the last 50-meter delivery problem in narrow streets, apartment complexes, hostels, and missing house numbers across India and worldwide.

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)
[![Build Status](https://img.shields.io/badge/Build-Passing-brightgreen.svg)]()
[![Tests](https://img.shields.io/badge/Tests-18%20Passed-success.svg)]()
[![TypeScript](https://img.shields.io/badge/TypeScript-5.7-blue.svg)]()
[![Tailwind CSS](https://img.shields.io/badge/TailwindCSS-v4-38bdf8.svg)]()

---

## 🚀 The Problem

In India and densely populated regions, food and e-commerce delivery riders (Swiggy, Zomato, Amazon, Flipkart, Blinkit, Zepto, Porter) frequently call customers multiple times for directions. 

Standard GPS coordinates saved in apps typically point to the center of a road or the wrong side of a compound wall. House numbers may be absent, alleys are narrow, and maps navigate vehicles to dead ends.

## 💡 The Solution: ExactPin

**ExactPin** is a public, zero-install web utility where users can:
1. Detect their current GPS coordinates via their browser.
2. Drag a high-precision blue pin directly onto their **exact gate entrance, building lobby, or front door**.
3. Instantly generate a synchronized, 6-decimal precision Google Maps navigation link (`https://www.google.com/maps/search/?api=1&query=LAT,LNG`).
4. Add an optional entrance landmark note (e.g. *"Blue gate opposite house 24, next to the neem tree"*).
5. Copy a ready-to-paste delivery block or share it via WhatsApp or delivery app instructions with one tap.

---

## 🌟 Key Features

- **🎯 Draggable Entrance Marker with Instant Sync:** Canonical reactive state updates coordinates, Google Maps URLs, and copy actions synchronously on marker drag or map tap without page refreshes.
- **📡 Real Browser GPS Geolocation:** Acquires one-time satellite coordinates using `navigator.geolocation` with high accuracy and reports satellite accuracy in metres (e.g., `±8m`).
- **🛡️ 100% Client-Side Privacy:** Zero server tracking, zero location history, zero database persistence. Coordinates exist only within the user's active browser session.
- **🗺️ Interactive OpenStreetMap Tiles:** Smooth zooming and panning powered by Leaflet and OpenStreetMap contributors.
- **📍 Smart Reverse Geocoding:** Automatically looks up nearby street and neighbourhood names using Nominatim with debounced requests (500ms), request cancellation to avoid stale overwrites, and in-memory caching.
- **📋 One-Tap Delivery Block Copy:** Generates formatted multi-line instructions containing the Google Maps link, coordinates, gate landmark, and area details.
- **📱 Mobile-First Responsive Design:** Clean deep-navy and blue aesthetic, optimized for Android smartphones, narrow viewports, tablets, and desktop workstations.
- **♿ Accessible UI:** High contrast, ARIA labels, keyboard navigability, and clear toast feedback for all actions.

---

## 🛠️ Technology Stack

| Layer | Technology |
|---|---|
| **Framework** | [React 19](https://react.dev/) + [Vite 6](https://vitejs.dev/) |
| **Language** | [TypeScript 5.7](https://www.typescriptlang.org/) (Strict Mode) |
| **Styling** | [Tailwind CSS v4](https://tailwindcss.com/) |
| **Maps** | [Leaflet 1.9](https://leafletjs.com/) + [React Leaflet 5](https://react-leaflet.js.org/) |
| **Map Tiles** | [OpenStreetMap](https://www.openstreetmap.org/) |
| **Reverse Geocoding** | [OSM Nominatim API](https://nominatim.org/) (Compliant client-side usage) |
| **Icons** | [Lucide React](https://lucide.dev/) |
| **Testing** | [Vitest](https://vitest.dev/) + [React Testing Library](https://testing-library.com/) + [JSDOM](https://github.com/jsdom/jsdom) |
| **Hosting** | [Vercel](https://vercel.com/) / [Netlify](https://www.netlify.com/) |

---

## 📦 Prerequisites

- **Node.js**: `v20.x` or higher (tested on `v24.11.1`)
- **npm**: `v10.x` or higher (tested on `v11.12.1`)
- **Git**

---

## ⚡ Quick Start & Setup

### 1. Clone the repository
```bash
git clone https://github.com/<your-username>/exactpin.git
cd exactpin
```

### 2. Install dependencies
```bash
npm install
```

### 3. Configure environment variables (Optional)
Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```
Available variables:
- `VITE_NOMINATIM_EMAIL`: Custom contact email included in Nominatim reverse geocode queries for policy compliance.
- `VITE_NOMINATIM_APP_NAME`: Identification name (default: `ExactPin`).

### 4. Start local development server
```bash
npm run dev
```
Open `http://localhost:5173` in your browser.

---

## 🧪 Testing

ExactPin features a comprehensive test suite covering all synchronization, GPS mocking, permission errors, and coordinate calculations.

```bash
# Run unit and integration tests once
npm test

# Run tests in watch mode
npm run test:watch
```

### Verified Test Cases:
1. ✅ App loads successfully with title, tagline, and call to action.
2. ✅ Location permission requested only after explicit user initiation.
3. ✅ Successful GPS detection populates coordinates and accuracy badge.
4. ✅ Geolocation errors (denied, unavailable, timeout) show actionable recovery tips and retry button.
5. ✅ Dragging the marker updates latitude and longitude to 6 decimal places immediately.
6. ✅ Tapping the map repositions the pin and resets GPS accuracy badge to "Manually Positioned Pin".
7. ✅ Moving the pin automatically updates the Google Maps link in real-time without stale data.
8. ✅ Copy coordinates action uses the latest canonical location.
9. ✅ Copy Google Maps link uses the latest canonical location.
10. ✅ Reverse geocoding debounces requests and never allows older responses to overwrite newer user selections.
11. ✅ No fabricated coordinates are ever shown prior to user interaction.

---

## 🏗️ Production Build

To create an optimized production bundle:

```bash
npm run build
```

The output will be created in the `dist/` directory, ready for immediate static hosting.

To preview the production build locally:
```bash
npm run preview
```

---

## 🌐 Public Deployment

ExactPin is a 100% static client-side single-page application and can be deployed with one click to Vercel or Netlify.

### Deploying to Vercel
1. Install the Vercel CLI (or connect your GitHub repository in the [Vercel Dashboard](https://vercel.com/)):
   ```bash
   npx vercel
   ```
2. Build Settings:
   - **Framework Preset**: Vite
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
   - **Install Command**: `npm install`
3. SPA routing is already preconfigured via [`vercel.json`](./vercel.json).

### Deploying to Netlify
1. Connect repository in [Netlify Dashboard](https://app.netlify.com/):
   - **Build Command**: `npm run build`
   - **Publish Directory**: `dist`
2. Redirect rules are preconfigured via [`public/_redirects`](./public/_redirects).

---

## 🔒 Privacy & Security

ExactPin is built with a strict **Privacy-First architecture**:
- **Zero Database / Zero Logins**: No sign-up, email, phone number, or credentials required.
- **Client-Side Only Processing**: GPS coordinates are read strictly in the client browser memory. ExactPin has no backend server storing or logging user locations.
- **No Background Tracking**: GPS is sampled once on click; no continuous tracking or location tracing.
- **Explicit User Action**: Coordinates and navigation links are shared only when the user explicitly clicks a "Copy" or "Share" button.
- **No API Secrets in Source**: No proprietary map keys or confidential tokens are bundled in the repository.

---

## ⚖️ Map & Geocoding Attributions & Policy Compliance

- **Map Tiles**: Leaflet map tiles are provided by [OpenStreetMap](https://www.openstreetmap.org/) under the Open Database License (ODbL). Map tiles display compliant attribution: `© OpenStreetMap contributors`.
- **Reverse Geocoding**: Address name lookups utilize the OpenStreetMap Nominatim service. To adhere to Nominatim usage policies:
  - Queries are debounced to 500ms during pin movement.
  - Intermediate dragging events do not trigger network calls.
  - Requests are cached in memory (LRU).
  - Reverse geocoding is non-blocking: failure or rate limiting never disables coordinate generation or Google Maps links.
  - For high-volume production deployments (>1 req/sec), configure an enterprise geocoding provider (e.g. Geocodio, Mapbox, or self-hosted Nominatim).

---

## 📄 License

This project is licensed under the [MIT License](./LICENSE).
