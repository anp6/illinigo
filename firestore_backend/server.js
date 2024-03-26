const admin = require('firebase-admin');
const express = require('express');
const app = express();

const serviceAccount = require('./secret.json');

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
  });

const db = admin.firestore();

const PORT = 3000;

app.get('/user/:userId', async (req, res) => {
const userId = req.params.userId;

try {
    const userDoc = await db.collection('users').doc(userId).get();

    if (!userDoc.exists) {
    return res.status(404).send("User not found");
    }

    const userData = userDoc.data();
    return res.status(200).json(userData);
} catch (error) {
    console.error("Error getting user data", error);
    return res.status(500).send(error);
}
});


app.listen(PORT, () => {
console.log(`Server is running on port ${PORT}`);
});