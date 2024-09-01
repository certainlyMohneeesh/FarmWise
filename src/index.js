const express = require("express");
const path = require("path");
const bcrypt = require('bcrypt');
const collection = require("./config");
const multer = require("multer");
const { spawn } = require("child_process");
const fs = require("fs");

const app = express();
// convert data into json format
app.use(express.json());
// Static file
app.use(express.static("public"));

app.use(express.urlencoded({ extended: false }));
//use EJS as the view engine
app.set("view engine", "ejs");

// Multer setup for handling file uploads
const upload = multer({ dest: "uploads/" });

app.get("/", (req, res) => {
    res.render("landing-page");

});

app.post("landing-page", (req, res)=>{
    res.render("login");
} );

app.get("/login", (req, res) => {
    res.render("login");
});

app.get("/signup", (req, res) => {
    res.render("signup");
});

app.post("/signup", async (req, res) => {
    const username = req.body.username.toLowerCase();  // Convert to lowercase
    const password = req.body.password;

    // Log incoming data
    console.log("Received data:", req.body);

    if (!username || !password) {
        return res.status(400).send("Username and password are required.");
    }

    const data = {
        name: username,
        password: password
    };

    const existingUser = await collection.findOne({ name: data.name });

    if (existingUser) {
        return res.send('User already exists. Please choose a different username.');
    } else {
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(data.password, saltRounds);

        data.password = hashedPassword;

        const userdata = await collection.insertMany(data);
        console.log(userdata);
        return res.send("User registered successfully!");
    }
});


// Login user 
app.post("/login", async (req, res) => {
    // try {
    //     const username = req.body.username.toLowerCase();  // Convert to lowercase
    //     const password = req.body.password;

    //     const check = await collection.findOne({ name: username });
    //     console.log("Database query result:", check);

    //     if (!check) {
    //         return res.send("User name cannot found")
    //     }
    //     // Compare the hashed password from the database with the plaintext password
    //     const isPasswordMatch = await bcrypt.compare(req.body.password, check.password);

    //     if (!isPasswordMatch) {
    //         return res.send("wrong Password");
    //     }
    //     else {
    //         return res.render("/home");
    //     }
    // }
    // catch {
    //     return res.send("wrong Details");
    // }
    return res.render("home");
});





app.get("/upload", (req, res) => {
    res.render("upload");  //  page where users can upload images
});

app.post("/upload", upload.single("image"), async (req, res) => {
    const imagePath = req.file.path;

    // Call the ML script with the uploaded image
    const pythonProcess = spawn('python3', ['uploads/ml_script.py', imagePath]);

    pythonProcess.stdout.on('data', (data) => {
        const result = data.toString().trim();
        console.log(`Prediction result: ${result}`);

        // Send result back to the frontend
        return res.render("result", { prediction: result });
    });
    pythonProcess.stderr.on('data', (data) => {
        console.error(`Error: ${data}`);
        return res.status(500).send("Error during prediction");
    });

    pythonProcess.on('close', () => {
        // Delete the uploaded image after processing
        fs.unlinkSync(imagePath);
    });
});




// Define Port for Application
const port = 5000;
app.listen(port, () => {
    console.log(`Server listening on port ${port}`)
});
