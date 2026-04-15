# TechStore 🛒 - Modern React E-Commerce SPA

![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![Redux](https://img.shields.io/badge/Redux-593D88?style=for-the-badge&logo=redux&logoColor=white)
![Tailwind](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-B73BFE?style=for-the-badge&logo=vite&logoColor=FFD62E)

## Overview
TechStore is a high-performance, responsive e-commerce web application built to demonstrate modern frontend architecture. Rather than just rendering components, this project focuses heavily on state management, seamless user experience, and graceful error handling. 

This project was built with a holistic product mindset, demonstrating an expansion to not just SDE roles by prioritizing UI/UX feedback loops, strict routing, and edge-case management.

## 🚀 Live Demo
[View the live application here](https://ecommercejay.netlify.app)

## ✨ Key Features
* **Advanced State Management:** Utilizes Redux Toolkit for global cart and product state, featuring cross-slice communication (e.g., auto-clearing the cart upon user logout).
* **State Persistence:** Implements custom Redux store subscriptions to hydrate application state from `localStorage`, ensuring cart data survives page refreshes.
* **Protected Routing:** Employs React Router to strictly guard checkout and cart flows. Unauthenticated users are gracefully intercepted with floating toast notifications instead of silent failures.
* **Performance Optimized:** Strategically utilizes React's `useMemo`, `useCallback`, and `React.memo` to cache expensive cart calculations and prevent unnecessary DOM re-renders.
* **Simulated Network Latency:** Integrates realistic asynchronous loading states (spinners) during checkout and API fetching to provide clear user feedback.
* **Responsive Design:** Fully styled with Tailwind CSS v4, utilizing a mobile-first grid system and a custom-built global dark/light mode context toggle.
* **Graceful Fallbacks:** Features a dedicated 404 Catch-All route to intercept invalid URLs and guide users back to safety.

## 🛠️ Tech Stack
* **Core:** React 18, Vite
* **State Management:** Redux Toolkit, React Context API
* **Routing:** React Router DOM v6
* **Styling:** Tailwind CSS v4
* **HTTP Client:** Axios (fetching from FakeStore API)
* **Notifications:** React Hot Toast

## 🧠 Architectural Decisions
* **Type-Based Folder Structure:** Files are segregated by architectural role (`/components`, `/pages`, `/store`, `/context`) to ensure maintainability as the codebase scales.
* **Axios over Fetch:** Chosen for automatic JSON parsing, streamlined error catching, and future-proofing for JWT interceptors.
* **Tailwind CSS Strategy:** Utilized the v4 `@custom-variant` class strategy for dark mode to allow manual user toggling over strict system-preference overrides.

## 💻 Local Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/Jay-137/ReactJS_Ecommerce.git
   ```

2. Navigate to the directory:
   ```bash
   cd techstore
   ```


3. Install dependencies:
   ```bash
   npm install
   ```


4. Start the development server:
   ```bash
   npm run dev
   ```



## 🔮 Future Scope

* Transitioning the simulated frontend authentication to a full-stack Node.js/Express backend.
* Connecting a MongoDB database for permanent user cart storage.
* Containerizing the application using Docker to streamline deployments and integrate seamlessly into a continuous integration pipeline.

