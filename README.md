# OpenJob RESTful API V1

RESTful API untuk platform rekrutmen kerja dibangun dengan Node.js, Express, dan PostgreSQL.

## ⭐ Fitur Utama

- **Database Management**:PostgreSQL + `node-pg-migrate`
- **Authentication & Authorization**:JWT (access + refresh token)
- **Data Validation**:Joi schema validation
- **Error Handling**:Custom middleware
- **Search Jobs**:Query param `?title` & `?company-name`
- **Bookmark & Application Tracking**

## 🛠️ Tech Stack

- Node.js v22
- Express.js
- PostgreSQL
- node-pg-migrate
- Joi
- JSON Web Token (JWT)
- bcrypt

## 🚀 Cara Menjalankan

1. **Clone repository**
   ```bash
   git clone https://github.com/revifbrnti/openjob-api.git
   cd openjob-api
   ```
2. **Install dependencies**
   ```bash
   npm install
   ```
3. **Setup database**
   ```bash
   createdb openjob_db
   ```
4. **Copy .env.example ke .env dan isi sesuai konfigurasi kamu**
   
5. **Jalankan migrasi**
   ```bash
   npm run migrate
   ```
5. **Jalankan server**
   ```bash
  npm run start:dev
   ```
5. **Akses **
   ```bash
   (http://localhost:3000)
   ```
## Author
Revi Febrianti
GitHub: revifbrnti 
