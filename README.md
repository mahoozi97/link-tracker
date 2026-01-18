# Link Tracker 🔗

**Link Tracker** is a URL shortener and tracking application that allows users to create short links that redirect to original URLs while automatically tracking how many times each link is visited. The application supports user authentication, role-based dashboards, and full CRUD operations for link management.

---

## 🚀 Features
### Authentication & Authorization
- User **Sign Up** and **Log In**
- **Email Verification** for validating user email addresses
- Secure password hashing using **bcrypt**
- Session-based authentication
- Role-based access control (**User** / **Admin**)

---

### 👤 User Dashboard
- Create short links
- See a list of **all links you created** with visit counts
- Full **CRUD operations** on links
- Profile management:
  - Change username
  - Reset password

---

### 🛠 Admin Dashboard
- Fetch **all links**
- Delete **any link** regardless of ownership *(admin-only)*
- Manage users:
  - Fetch all users
  - Toggle user roles (**user / admin**)
  - Update usernames
  - Delete users

---

## 🧱 Tech Stack

| Technology | Description |
|-----------|-------------|
| **Node.js** | JavaScript runtime |
| **Express.js** | Web application framework |
| **MongoDB** | NoSQL database |
| **Mongoose** | MongoDB ODM |
| **EJS** | Templating engine for frontend |
| **Express-Session** | Session management |

---

## 📦 Dependencies

```json
express
mongoose
express-session
method-override
nodemailer
bcrypt
dotenv
ejs
helmet
morgan
nanoid
```