# Link Tracker 🔗

Link Tracker is a **URL Shortener and Tracking application** that allows users to create short links redirecting to original URLs while automatically tracking link visits. The application features user authentication, role-based dashboards, full CRUD operations for managing links, and provides analytics including total clicks, daily click records, and daily average clicks for each link.

---

## Live Demo

[Deployed Website](https://link-tracker-rzup.onrender.com)

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

## 🚀 Features

### Authentication & Authorization

- User signup with OTP email verification
- Sign In
- Password reset:
  - Reset password
  - Forgot password with OTP
- Change email with OTP
- Secure password storage using `bcrypt`
- Session-based authentication with `express-session`
- Role-based access control: **User / Admin**

---

### User Dashboard

- Create short links
- View all created links with click counts
- **Analytics:** Shows total clicks, daily clicks, and daily average clicks for each link.
- Full CRUD operations for links
- Profile management:
  - Change username

---

### Admin Dashboard

- Manage all links:
  - View all links
  - Delete link
- Manage users:
  - View all users
  - Toggle user roles (**User / Admin**)
  - Delete users
- **Analytics:**
  - View link data with total clicks count and daily averages
  - Aggregated for the **last 30 days**

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
