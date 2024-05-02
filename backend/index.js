require('dotenv').config({path: './.env'})
// websocket 
const http = require('http'); // using http instead of https for testing purposes
const fs = require('fs');
const WebSocket = require('ws');
const express = require('express')
const mongoose = require('mongoose');
const Character = require('./models/character.model.js');
// Key and Cert are neede only for a wss connection
// const serverOptions = {
//     key: fs.readFileSync('key.pem'),
//     cert: fs.readFileSync('cert.pem')
//   };
const app = express()
// for wss connection only 
//const server = https.createServer(serverOptions, app);
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

const user_id = process.env.USER_ID
const password = process.env.PASSWORD

// uri string should be actual database in practice, this is just a test url
let uri = `mongodb+srv://${user_id}:${password}@test.jltbpk9.mongodb.net/?retryWrites=true&w=majority&appName=test`;

// middleware
app.use(express.json());
app.use(express.urlencoded({extended: false}));

mongoose.connect(uri)
.then(() => {
    console.log("Connected to database!");
    server.listen(8080, () => {
        console.log('Secure Server and WebSocket server running on port 8080');
});
}).catch((err) => {
    console.log("Connection failed!", err);
})

// checking if characterSchema is intialized 
Character.init().then(() => {
    console.log('Indexes have been created!');
}).catch(error => {
    console.error('Index creation failed:', error);
});


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



// getting nearby critters and sending them to the frontend
wss.on('connection', (ws) => {
    console.log('New WebSocket connection established'); // Logging new connection

    ws.on('message', async (message) => {
        console.log('Received location'); // Log received messages

        try {
            const { latitude, longitude} = JSON.parse(message);
            console.log("latitude: ", latitude);
            console.log("longitude: ", longitude);
            const crittersInRange = await Character.find({
                spawnLocations: {
                    $nearSphere: {
                        $geometry: {
                            type: "Point",
                            coordinates: [longitude, latitude]
                        },
                        $maxDistance: 50  // Adjust maxDistance as necessary in meters
                    }
                }
            });


            // console.log(`Critters within range: ${critters.map(critter => critter.name).join(', ')}`);

            if (crittersInRange.length > 0) {
                const randomCritter = crittersInRange[Math.floor(Math.random() * crittersInRange.length)];
                ws.send(JSON.stringify(randomCritter)); // Send a random critter
                console.log('Sent critter:', randomCritter); // Log sent critter
            } else {
                const crittersNearby = await Character.find({
                    spawnLocations: {
                        $nearSphere: {
                            $geometry: {
                                type: "Point",
                                coordinates: [longitude, latitude]
                            },
                            $maxDistance: 500  // Adjust maxDistance as necessary in meters
                        }
                    }
                });
                if (crittersNearby.length > 0) {
                    console.log("There are ", crittersNearby.length, " critters nearby! Keep looking")
                } else {
                    console.log('There are no critters nearby');
                }
                ws.send(JSON.stringify({})); // Send an empty object if no critters are found
                
            }
        } catch (error) {
            console.error("Failed to fetch critters:", error);
            ws.send(JSON.stringify({ error: "Failed to fetch critters", message: error.message }));
        }
    });
    ws.on('close', () => {
        console.log('WebSocket connection closed');
    });

    ws.on('error', (error) => {
        console.error('WebSocket error:', error);
    });
});

