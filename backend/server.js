const express = require("express");
const app = express();
app.use(express.json());

app.get("/", (req, res) => {
    res.send("Hello from backend!");
});

app.listen(5000, () => console.log("Server chạy tại http://localhost:5000"));
