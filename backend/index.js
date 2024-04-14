const express = require('express')
const mongoose = require('mongoose');
const Character = require('./models/character.model.js');
const app = express()

// const user_id = process.env.USER_ID
// const password = process.env.PASSWORD
const user_id = 'admin'
const password = 'Y60EFoBqRd9oe7a4'
// uri string should be actual database in practice, this is just a test url
let uri = `mongodb+srv://${user_id}:${password}@test.jltbpk9.mongodb.net/?retryWrites=true&w=majority&appName=test`;

// middleware
app.use(express.json());
app.use(express.urlencoded({extended: false}));

app.listen(3000, () => {
    console.log('Server is running on port 3000');
});

// routes
// app.use("/api/characters", characterRoute);

app.get('/', (req, res) => {
    res.send("Home Page");
});

app.get('/api/characters', async(req, res) => {
    try {
        const characters = await Character.find({});
        res.status(200).json(characters);
    } catch (error) {
        res.status(500).json({message: error.message});
    }
})

app.get('/api/characters/:id', async(req, res) => {
    try {
        const {id} = req.params;
        const character = await Character.findById(id);
        res.status(200).json(character);
    } catch (error) {
        res.status(500).json({message: error.message});
    }
});

app.post('/api/characters', async(req, res) => {
    try {
        const character = await Character.create(req.body);
        res.status(200).json(character);
    } catch (error) {
        res.status(500).json({message: error.message});
    }
});

// update a character's data
app.put('/api/characters/:id', async(req, res) => {
    try {
        const {id} = req.params;
        const character = await Character.findByIdAndUpdate(id, req.body);
        if (!character) {
            return res.status(404).json({message: "Character data not available"});
        }
        const updatedCharacter = await Character.findById(id);
        res.status(200).json(updatedCharacter);
    } catch (error) {
        res.status(500).json({message: error.message});
    }
});

// delete a character's data
app.delete('/api/characters/:id', async(req, res) => {
    try {
        const {id} = req.params;
        const character = await Character.findByIdAndDelete(id);
        if (!character) {
            return res.status(404).json({message: "Character data not available"});
        }
        res.status(200).json({message: "Character data deleted succesfully"});
    } catch (error) {
        res.status(500).json({message: error.message});
    }
});


mongoose.connect(uri)
.then(() => {
    console.log("Connected to database!");
})
.catch(() => {
    console.log("Connection failed!");
})



