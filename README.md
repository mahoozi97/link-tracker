# Link Tracker 🔗

Link Tracker is a **URL Shortener and Tracking application** that allows users to create short links redirecting to original URLs while automatically tracking link visits. The application features user authentication, role-based dashboards, full CRUD operations for managing links, and provides analytics including total clicks, daily click records, and daily average clicks for each link.

---

## Live Demo

[Deployed Website](https://link-tracker-rzup.onrender.com)

#### ⚠️ Email Verification (Render Demo)

Email delivery using Nodemailer is disabled on Render due to SMTP restrictions.

👉 Bypass Code: 0000

📌 Note: Full email functionality is active in local development.

---

## 📸 Screenshots

<details>
  <summary>Click to expand gallery</summary>

<h3>Authentication</h3>

  <img src="https://i.imgur.com/AkuRsD0.png">
  <img src="https://i.imgur.com/6bm2Kg5.png">

<h3>User Panel</h3>

  <img src="https://i.imgur.com/0QrEDBJ.png">
  <img src="https://i.imgur.com/un0a4zP.png">
  <img src="https://i.imgur.com/6cZO8S1.png">
  
<h3>Admin Panel</h3>
  <img src="https://i.imgur.com/TrYj1fx.png">
  <img src="https://i.imgur.com/3w6hzkt.png">
  <img src="https://i.imgur.com/S5Jh9gZ.png">
  <img src="https://i.imgur.com/qxD0jgD.png"> 
</details>

---

## 🚀 Key Features

### 🔐 Secure Authentication & Identity Management
* OTP-Verified Onboarding: Multi-step registration flow using Nodemailer
* State Persistence: Managed user sessions and security context via `express-session` .
* Robust Password Recovery: Integrated "Forgot Password" and "Change Email" workflows backed by OTP validation.
* RBAC (Role-Based Access Control): Granular authorization logic separating standard **User** capabilities from **Admin** privileges.

### 📈 Dynamic User Dashboard
* URL Lifecycle Management: Full CRUD operations for generating and managing shortened links.
* Real-time Engagement Tracking: Automatic click-event logging for every shortened URL.
* Advanced Analytics: Interactive metrics displaying total engagement, daily click-through rates (CTR), and performance averages.
* Account Customization: Self-service profile management and credential updates.

### 🛠️ Administrative Control Center (Back-office)
* Centralized Resource Management: Global oversight of all system-wide links with the ability to moderate or remove content.
* User Governance: Comprehensive directory to monitor user activity, delete accounts, or elevate privileges (Toggle User/Admin).
* 30-Day Data Aggregation: High-level analytics summarizing system performance and traffic trends over the last 30 days.

---

## 📊 Entity Relationship Diagram (ERD)

![ERD Diagram](./link-tracker.drawio.svg)

Brief explanation of the main entities and relationships.

---

## 🧱 Tech Stack

### Frontend

![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)
![EJS](https://img.shields.io/badge/EJS-8D6CAB?style=for-the-badge&logo=javascript&logoColor=white)

### Backend

![Node.js](https://img.shields.io/badge/Node%20js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)
![Express.js](https://img.shields.io/badge/Express%20js-000000?style=for-the-badge&logo=express&logoColor=white)

### Database

![MongoDB](https://img.shields.io/badge/MongoDB-4EA94B?style=for-the-badge&logo=mongodb&logoColor=white)
![Mongoose](https://img.shields.io/badge/Mongoose-880000?style=for-the-badge&logo=mongoose&logoColor=white)

### Auth & Utilities

![bcrypt](https://img.shields.io/badge/Bcrypt-eeeeee?style=for-the-badge&logo=lock&logoColor=black)
![express-session](https://img.shields.io/badge/express--session-%23007ACC?style=for-the-badge&logo=session&logoColor=white)
![dotenv](https://img.shields.io/badge/dotenv-%23000000?style=for-the-badge&logo=dotenv&logoColor=white)
![nodemailer](https://img.shields.io/badge/Nodemailer-%23000000?style=for-the-badge&logo=maildotru&logoColor=white)
![method-override](https://img.shields.io/badge/Method--Override-FF6F61?style=for-the-badge&logo=overleaf&logoColor=white)
![helmet](https://img.shields.io/badge/helmet-%23007ACC?style=for-the-badge&logo=shieldsdotio&logoColor=white)
![morgan](https://img.shields.io/badge/morgan-%23000000?style=for-the-badge&logo=gnometerminal&logoColor=white)
![nanoid](https://img.shields.io/badge/Nanoid-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)
![validator](https://img.shields.io/badge/validator-%231ABC9C?style=for-the-badge&logo=checkmarx&logoColor=white)
