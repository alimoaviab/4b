# 4Bit Academy — Complete Website + Admin Panel + MongoDB Atlas

Institute of 4B Information Technology (Abdul Hakim, Multan Road, Punjab).

---

## 🚀 How to Run

1. **Install Node.js** (v18 or higher).
2. Install dependencies (if not already installed):
   ```bash
   npm install
   ```
3. Start the server:
   ```bash
   npm run dev
   # OR
   node server.js
   ```
4. Open in your browser:
   - 🌐 **Public Website**: [http://localhost:3000](http://localhost:3000)
   - 🔐 **Admin Dashboard**: [http://localhost:3000/admin.html](http://localhost:3000/admin.html)
   - 🩺 **Health & DB Status**: [http://localhost:3000/api/health](http://localhost:3000/api/health)

---

## 🔑 Admin Login Credentials

- **Username**: `admin`
- **Password**: `admin`
*(Direct password login — Email OTP is completely disabled as requested).*

---

## 🍃 MongoDB Atlas Database Structure (`db.js`)

Database name: `4bitacademy`

1. **`applications`**
   - Stores all online admission submissions.
   - Fields: `applicationNo` (e.g. `4B-2026-0001`), `studentName`, `fatherName`, `phone`, `cnic`, `course`, `dob`, `address`, `education`, `status` (`Pending`, `Accepted`, `Rejected`), `rollNo`, `registrationNo`, `marks`, `totalMarks`, `grade`, `remarks`, `submittedAt`.
2. **`courses`**
   - 11 Career-focused courses with modules, advantages, images, and descriptions.
   - Fully editable and deletable from the Admin Panel.
3. **`posts`**
   - Academy news and announcements displayed dynamically on the homepage.
4. **`admin`**
   - Admin credentials hashed securely with `scrypt` and unique salt.
5. **`sessions`**
   - Active user login sessions with MongoDB native TTL expiration (30-minute idle sliding timeout).

---

## ⚙️ Environment Variables (`.env`)

```env
MONGODB_URI=mongodb+srv://4dadmin:4badmin@cluster0.rzbr0ll.mongodb.net/
MONGODB_DB=4bitacademy
ADMIN_USER=admin
ADMIN_PASSWORD=Admin@1234Local!
ADMIN_EMAIL=4bitacademy151@gmail.com
SESSION_SECRET=4bitacademy-secure-session-secret-key-2026-production
PORT=3000
```
