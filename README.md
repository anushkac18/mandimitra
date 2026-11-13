# Mandimitra 2.0

A fresh, role-based mandi booking and consignment operations starter project. The project contains a mobile-first farmer experience and separate Gate, Weighbridge and Admin workspaces.

## Stack
- Frontend: React 18 + Vite + Lucide icons
- Backend: Node.js + Express
- Database: SQLite via better-sqlite3
- Authentication: signed JWT sessions + bcrypt password hashes
- QR: server-generated QR token, rendered in the farmer portal

## Requirements
- Node.js 20 or newer
- npm

## Run locally
From the project root:

```bash
npm install
npm run install:all
```

Copy `server/.env.example` to `server/.env` and change `JWT_SECRET` for any non-demo use.

Start both services:

```bash
npm run dev
```

Open http://localhost:5173. The API runs at http://localhost:4000.

## Demo accounts
| Role | Phone | Password |
|---|---|---|
| Farmer | 9999990004 | Farmer@123 |
| Gate Staff | 9999990002 | Gate@123 |
| Weighbridge Staff | 9999990003 | Scale@123 |
| Admin / Manager | 9999990001 | Admin@123 |

The SQLite database is created automatically at `server/mandimitra.sqlite` and seeded with demo users and five days of slots for Gurugram, Faridabad and Sonipat.

## Included workflows
- Farmer: guided crop / variety / quantity / vehicle / harvest / mandi / slot booking, permanent consignment ID and QR token, My Tokens.
- Gate: verify QR token or consignment ID, prevent duplicate check-in, mark booking as arrived.
- Weighbridge: weigh arrived loads, validate gross/tare/net, prevent duplicate weighments, mark booking weighed.
- Admin: live summary, bookings, slot vehicle/tonnage capacity controls, staff list, audit trail.

## Important implementation notes
This is a runnable MVP foundation, not a production-certified mandi deployment. The QR check-in screen accepts a scanner keyboard-wedge or manually pasted token; camera scanning and direct scale-device integration require device-specific browser permissions / gateway integration. The demo farmer login represents a seeded account; OTP/SMS, production farmer onboarding, walk-in approval workflow, cancellation/rescheduling, manager-authorized weight corrections, exports, and full staff provisioning are extension modules. Do not expose demo credentials in production. Configure HTTPS, a strong JWT secret, backups, rate limits, real SMS/OTP and operational policies before deployment.

## Capacity rules
Slot booking reserves one vehicle and estimated tonnage. A slot cannot be booked after either configured limit is reached. Admin cannot reduce capacity below already-reserved capacity. Actual net weight is stored separately after weighment.
