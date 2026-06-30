require("dotenv").config();

const app = require("./src/app");
const connectDB = require("./src/config/db");

connectDB();

// Use dynamic port for Render deployment, fallback to 3000 for local
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});