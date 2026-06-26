# 🌍 GeoScope

GeoScope is a modern, high-fidelity web application built to explore the world. It provides users with an interactive, immersive, and data-rich experience to discover countries, states, and cities globally. Featuring a 3D interactive globe, advanced search capabilities, and seamless Wikipedia and Weather integrations, GeoScope is your ultimate digital atlas.

## ✨ Features

- **Interactive 3D Globe:** Explore the planet dynamically using an interactive globe built with `react-globe.gl` and custom POI landmark labels.
- **Global Explorer & Search:** Instantly search for any country using fuzzy search capabilities powered by `Fuse.js`. Filter by region, sort by population, name, or area.
- **Deep Hierarchical Navigation:** Dive deep from global views down to individual countries, states/provinces, and specific cities.
- **Rich Data Integration:**
  - **REST Countries API:** Comprehensive metrics like population, area, currencies, languages, and borders.
  - **Wikipedia API:** Dynamic injection of history, background, famous places, and a rich media gallery (images and videos) for almost any region.
  - **Weather API:** Real-time animated weather conditions for locations.
- **Premium UI/UX:**
  - Designed using **Mantine UI v9** with custom **Glassmorphism** aesthetic panels (`.premium-glass-card`).
  - Fluid route transitions and micro-animations using **Framer Motion**.
  - **High-Fidelity Skeleton Loaders:** Custom, layout-matching loading skeletons that eliminate layout shifts during data fetching.
- **State Management & Caching:** Robust local state handled by **Zustand** and hyper-efficient data fetching, caching, and background synchronization via **TanStack React Query v5**.

## 🛠️ Tech Stack

- **Frontend Framework:** [React 19](https://react.dev/) + [Vite 8](https://vitejs.dev/)
- **UI Library:** [Mantine v9](https://mantine.dev/)
- **State Management:** [Zustand](https://zustand-demo.pmnd.rs/)
- **Data Fetching & Caching:** [TanStack Query v5](https://tanstack.com/query/latest)
- **Animations:** [Framer Motion](https://www.framer.com/motion/)
- **3D Rendering:** [react-globe.gl](https://github.com/vasturiano/react-globe.gl)
- **Icons:** [Tabler Icons React](https://tabler-icons.io/)
- **Search:** [Fuse.js](https://fusejs.io/)

## 🚀 Getting Started

### Prerequisites

Make sure you have Node.js installed (v18+ recommended).

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/your-username/GeoScope.git
   ```
2. Navigate into the project directory:
   ```bash
   cd GeoScope
   ```
3. Install dependencies:
   ```bash
   npm install
   ```
4. Start the development server:
   ```bash
   npm run dev
   ```
5. Open your browser and visit `http://localhost:5173`.

## 📁 Project Structure

```text
src/
├── components/       # Reusable UI components (HeroGlobe, BentoGrid, Skeletons, etc.)
├── hooks/            # Custom React hooks (useCountries, useCountUp, etc.)
├── pages/            # Route components (HomePage, CountryDetailsPage, StatePage, CityPage)
├── services/         # API integration layers (REST Countries, Wikipedia APIs)
├── store/            # Zustand global state (useUIStore)
├── themes/           # Custom Mantine theme overrides and global styles
├── utils/            # Helper functions (Universal Search, Fuse.js config)
└── App.jsx           # Main application router and shell
```

## 🎨 Design Philosophy

GeoScope focuses on a "Wow" factor upon first load. The visual identity avoids flat, basic designs and instead heavily utilizes sleek dark modes, vibrant tailored colors, dynamic layout grids, and pixel-perfect skeleton screens that mirror the final loaded UI perfectly. 

## 📝 License

This project is licensed under the MIT License.
