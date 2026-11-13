import Database from 'better-sqlite3';
import bcrypt from 'bcryptjs';
import { randomUUID } from 'node:crypto';

export const db = new Database('mandimitra.sqlite');
db.pragma('journal_mode = WAL');
db.pragma('foreign_keys = ON');
db.exec(`
CREATE TABLE IF NOT EXISTS users(id TEXT PRIMARY KEY, name TEXT NOT NULL, phone TEXT UNIQUE NOT NULL, password_hash TEXT NOT NULL, role TEXT NOT NULL CHECK(role IN ('farmer','gate','weighbridge','admin')), active INTEGER DEFAULT 1, created_at TEXT DEFAULT CURRENT_TIMESTAMP);
CREATE TABLE IF NOT EXISTS consignments(id TEXT PRIMARY KEY, farmer_id TEXT NOT NULL REFERENCES users(id), farmer_name TEXT NOT NULL, phone TEXT NOT NULL, crop TEXT NOT NULL, variety TEXT, quantity REAL NOT NULL, unit TEXT NOT NULL DEFAULT 'quintal', vehicle TEXT NOT NULL, harvest_at TEXT, qr_token TEXT UNIQUE NOT NULL, created_at TEXT DEFAULT CURRENT_TIMESTAMP);
CREATE TABLE IF NOT EXISTS slots(id INTEGER PRIMARY KEY AUTOINCREMENT, mandi TEXT NOT NULL, slot_date TEXT NOT NULL, slot_time TEXT NOT NULL, max_vehicles INTEGER NOT NULL DEFAULT 30, max_tonnes REAL NOT NULL DEFAULT 100, reserved_vehicles INTEGER NOT NULL DEFAULT 0, reserved_tonnes REAL NOT NULL DEFAULT 0, active INTEGER DEFAULT 1, UNIQUE(mandi,slot_date,slot_time));
CREATE TABLE IF NOT EXISTS bookings(id TEXT PRIMARY KEY, consignment_id TEXT NOT NULL REFERENCES consignments(id), slot_id INTEGER NOT NULL REFERENCES slots(id), status TEXT NOT NULL DEFAULT 'booked', created_at TEXT DEFAULT CURRENT_TIMESTAMP, UNIQUE(consignment_id));
CREATE TABLE IF NOT EXISTS weighments(id TEXT PRIMARY KEY, consignment_id TEXT NOT NULL UNIQUE REFERENCES consignments(id), gross REAL NOT NULL, tare REAL NOT NULL, net REAL NOT NULL, unit TEXT NOT NULL DEFAULT 'kg', staff_id TEXT NOT NULL REFERENCES users(id), created_at TEXT DEFAULT CURRENT_TIMESTAMP);
CREATE TABLE IF NOT EXISTS audit_logs(id TEXT PRIMARY KEY, actor_id TEXT, action TEXT NOT NULL, entity_type TEXT NOT NULL, entity_id TEXT, details TEXT, created_at TEXT DEFAULT CURRENT_TIMESTAMP);
`);
const users = [
 ['admin-001','Mandi Manager','9999990001','admin','Admin@123'],
 ['gate-001','Gate Operator','9999990002','gate','Gate@123'],
 ['scale-001','Weighbridge Operator','9999990003','weighbridge','Scale@123'],
 ['farmer-001','Ramesh Kumar','9999990004','farmer','Farmer@123']
];
const insertUser = db.prepare('INSERT OR IGNORE INTO users(id,name,phone,password_hash,role) VALUES(?,?,?,?,?)');
for (const [id,name,phone,role,password] of users) insertUser.run(id,name,phone,bcrypt.hashSync(password,10),role);
const today = new Date();
const date = (offset) => { const d = new Date(today); d.setDate(d.getDate()+offset); return d.toISOString().slice(0,10); };
const insertSlot = db.prepare('INSERT OR IGNORE INTO slots(mandi,slot_date,slot_time,max_vehicles,max_tonnes) VALUES(?,?,?,?,?)');
for (const mandi of ['Gurugram Mandi','Faridabad Mandi','Sonipat Mandi']) for (let day=0;day<5;day++) for (const time of ['06:00 AM - 08:00 AM','08:00 AM - 10:00 AM','10:00 AM - 12:00 PM']) insertSlot.run(mandi,date(day),time,30,100);
export const id = () => randomUUID();
