# Link Tracker 🔗

Link Tracker is a **URL Shortener and Tracking application** that allows users to create short links redirecting to original URLs while automatically tracking link visits. The application features user authentication, role-based dashboards, full CRUD operations for managing links, and provides analytics including total clicks, daily click records, and daily average clicks for each link.

---

## 🚀 Features

### Authentication & Authorization
- User signup with OTP email verification
- Login (Sign In)
- Password reset:
  - Reset password (authenticated user, OTP not required)
  - Forgot password with OTP
- Change email with OTP
- Secure password storage using `bcrypt`
- Session-based authentication with `express-session`
- Role-based access control: **User / Admin**

---

### User Dashboard
- Create short links
- View all created links with click counts
- Full CRUD operations for links
- Profile management:
  - Change username
- **Analytics:** Shows total clicks, daily clicks, and daily average clicks for each link.

---

### Admin Dashboard
- Manage all links:
  - View all links 
  - Delete link
- Manage users:
  - View all users
  - Update usernames
  - Toggle user roles (**User / Admin**)
  - Delete users
- **Analytics:**
  - View link data with total clicks count and daily averages
  - Aggregated for the **last 30 days**

---

## 📊 Entity Relationship Diagram (ERD)

![ERD Diagram](../link-tracker.drawio.svg)

Brief explanation of the main entities and relationships.

---

## 🧱 Tech Stack

| Technology        | Description                 |
|-------------------|-----------------------------|
| Node.js           | JavaScript runtime          |
| Express.js        | Web application framework   |
| MongoDB           | NoSQL database              |
| Mongoose          | MongoDB ODM                 |
| EJS               | Templating engine           |
| Express-Session   | Session management          |

---

## 📦 Dependencies

- express
- mongoose
- express-session
- method-override
- nodemailer
- bcrypt
- dotenv
- ejs
- helmet
- morgan
- nanoid