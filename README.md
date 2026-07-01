# 🏦 SEVN Banking System

<p align="center">
  <img src="https://readme-typing-svg.demolab.com?font=Fira+Code&weight=500&size=22&pause=1000&color=27AE60&center=true&vCenter=true&width=435&lines=Welcome+to+SEVN+Banking;Full-Stack+MERN+Application;Secure.+Fast.+Reliable." alt="Typing SVG" />
</p>

<p align="center">
  <strong>Live Demo:</strong> <a href="https://sevnbank.netlify.app">https://sevnbank.netlify.app</a>
</p>

---

## About the Project

I built **SEVN Banking System** to understand how real-world banking applications handle secure transactions, authentication, and data consistency.

Rather than creating another CRUD project, I wanted to implement some concepts that are actually used in production systems like database transactions, idempotency, secure authentication, and asynchronous processing.

The application is built using the MERN stack with a completely separate frontend and backend deployment.

---

## Features

- JWT authentication using HTTP-only cookies
- Secure password hashing with bcrypt
- Real-time money transfers
- ACID-compliant MongoDB transactions
- Idempotency to prevent duplicate transfers
- Double-entry ledger for every transaction
- Background email notifications using a Fire-and-Forget approach
- Responsive UI built with React and Tailwind CSS

---

## Tech Stack

### Frontend

- React
- Vite
- Tailwind CSS
- Axios
- Netlify

### Backend

- Node.js
- Express.js
- MongoDB Atlas
- Mongoose
- JWT
- bcrypt
- Render

---

## What I Learned

Building this project taught me much more than writing backend APIs.

One of the biggest challenges was making authentication work across different domains after deploying the frontend on Netlify and the backend on Render. Understanding CORS, HTTP-only cookies, and `sameSite` cookie policies took quite a bit of experimentation.

Another interesting lesson was understanding the Node.js event loop. Initially, users had to wait until the email receipt was sent before the transfer request completed. Moving email sending to the background reduced the response time from nearly a minute to under a second.

I also learned how important database transactions are in financial applications. Using MongoDB sessions ensures that if anything fails during a transfer, every operation is rolled back automatically, keeping account balances consistent.

---

## Project Structure

```
SEVN-Banking-System/
│
├── frontend/
│
├── backend/
│
└── README.md
```

---

## Running Locally

### Clone the repository

```bash
git clone https://github.com/soumyabyabarta/SEVN-Banking-System.git
cd SEVN-Banking-System
```

### Backend

```bash
cd backend
npm install
```

Create a `.env` file inside the backend folder and add your environment variables.

```env
MONGODB_URI=your_mongodb_uri
JWT_SECRET=your_secret

EMAIL_USER=your_email
EMAIL_PASS=your_email_password
```

Start the backend server.

```bash
npm run dev
```

### Frontend

```bash
cd ../frontend
npm install
npm run dev
```

The application will run on:

```
http://localhost:5173
```

---

## Future Improvements

- Transaction history filters
- Admin dashboard
- Scheduled recurring transfers
- Two-factor authentication (2FA)
- Better analytics and reporting

---

## Feedback

If you have any suggestions or notice something that could be improved, feel free to open an issue or submit a pull request.

Thanks for checking out the project.
