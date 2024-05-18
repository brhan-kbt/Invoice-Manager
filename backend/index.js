const express = require("express");

const prisma = require("./common/prismaClient");
const app = express();
const userRoutes = require("./routes/userRoutes");
const authRoutes = require("./routes/authRoutes");
const invoiceRoutes = require("./routes/invoiceRoutes");


app.use(express.json());
app.use((req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
    next();
})

//test api with error 500 in case of error
app.get("/test", (req, res) => {
    try {
        res.status(200).json({message: "API is working!"});
    } catch (error) {
        res.status(500).json({message: error.message});
    }
});

app.use("/users", userRoutes);
app.use("/auth", authRoutes);
app.use("/invoices", invoiceRoutes);


//start server
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`Server started on port ${PORT}`));