# Health-Link QR System

A modern, full-stack healthcare platform for managing patient profiles, medical records, and doctor-patient interactions using QR codes. Built with React, TypeScript, Vite, Tailwind CSS, and a modular component architecture.

## Features

- **Patient & Doctor Dashboards:** Role-based dashboards with unique privileges and modern UI.
- **QR Code Integration:** Each patient has a unique QR code linking to their profile and latest medical reports.
- **Medical File Upload:** Patients can upload medical documents; doctors can view and add reports/suggestions.
- **Report Attribution:** All reports display the uploading doctor's name or indicate if uploaded by the patient.
- **QR Scan Summary:** Doctors can scan a patient’s QR code to instantly view a summary of the latest report.
- **Authentication & Authorization:** Secure login, registration, and role-based access control.
- **Autosave & Persistence:** All user and report data is autosaved in localStorage for demo/testing.
- **Modern UI/UX:** Responsive, interactive, and visually appealing design using Tailwind CSS and shadcn/ui components.

## Tech Stack

- **Frontend:** React, TypeScript, Vite
- **UI:** Tailwind CSS, shadcn/ui
- **State & Routing:** React Context, React Router
- **QR Code:** qrcode.react (or similar)
- **Persistence:** localStorage (for demo; swap for real backend in production)

## Getting Started

1. **Clone the repository:**
   ```sh
   git clone <your-repo-url>
   cd Health-Link-QR-System
   ```
2. **Install dependencies:**
   ```sh
   npm install
   ```
3. **Start the development server:**
   ```sh
   npm run dev
   ```
4. **Open the app:**
   - Visit the local URL shown in your terminal (e.g., http://localhost:5173)

## Project Structure

- `src/components/` — Reusable UI and feature components (auth, dashboard, layout, utils, ui)
- `src/pages/` — Route-level components (Dashboard, PatientProfile, QRScanResult, etc.)
- `src/services/` — API and data logic (localStorage for demo)
- `src/data/` — Initial/mock data
- `src/utils/` — Utility functions (token generation, QR, PDF, etc.)
- `public/` — Static assets

## Demo Users

- **Doctor:**
  - Username: `dr.smith` (or register a new doctor)
  - Password: `yourpassword`
- **Patient:**
  - Username: auto-generated Patient ID (or register a new patient)
  - Password: `yourpassword`

## Customization & Production
- For production, connect to a real backend and secure file storage.
- Replace localStorage with API calls.
- Add advanced features (AI summaries, notifications, etc.) as needed.

## License

MIT License. See [LICENSE](LICENSE) for details.

---

*Built with ❤️ by the Health-Link QR System team.*
