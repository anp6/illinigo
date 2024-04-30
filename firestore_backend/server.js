const admin = require('firebase-admin');
const express = require('express');
const app = express();
const sharp = require('sharp');
const multer = require('multer');
const upload = multer({ storage: multer.memoryStorage() });

app.use(express.json());

const serviceAccount = require('./secret.json');

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
  });

const db = admin.firestore();

const {Storage} = require('@google-cloud/storage');
const storage = new Storage({keyFilename: "./secret_bucket.json"});
const bucketName = 'illinigo';
const PORT = 3000;

app.get('/generate-signed-url', async (req, res) => {
  try {
      const options = {
          version: 'v4',
          action: 'write',
          expires: Date.now() + 15 * 60 * 1000, // 15 minutes
          contentType: 'application/octet-stream',
      };

      const [url] = await storage.bucket(bucketName).file(req.query.fileName).getSignedUrl(options);
      res.send({url});
  } catch (error) {
      console.error('Error generating signed URL', error);
      res.status(500).send('Error generating signed URL');
  }
});

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

app.put('/user/:userId/update', async (req, res) => {
  const userId = req.params.userId;
  const { found } = req.body;

  try {
    const userDoc = await db.collection('users').doc(userId).get();

    if (!userDoc.exists) {
      return res.status(404).send("User not found");
    }
    await db.collection('users').doc(userId).update({
      found: found
    });

    return res.status(200).send("User updated successfully");
  } catch (error) {
    console.error("Error updating user data", error);
    return res.status(500).send(error);
  }
});

app.put('/user/:userId/updateImage', async (req, res) => {
  const userId = req.params.userId;
  const { pictures } = req.body;

  try {
    const userDoc = await db.collection('users').doc(userId).get();

    if (!userDoc.exists) {
      return res.status(404).send("User not found");
    }
    await db.collection('users').doc(userId).update({
      pictures: pictures
    });

    return res.status(200).send("User updated successfully");
  } catch (error) {
    console.error("Error updating user data", error);
    return res.status(500).send(error);
  }
});

const addUserWithId = async (userId, userData) => {
    try {
      const docRef = db.collection('users').doc(userId);
      await docRef.set(userData);
      console.log('Document written with ID: ', docRef.id);
      return docRef.id;
    } catch (error) {
      console.error('Error adding document: ', error);
      throw error;
    }
  };

app.post('/create-user', async (req, res) => {
    try {
      const { id, ...userData } = req.body;
      const docId = await addUserWithId(id, userData);
      res.status(201).send({ id: docId });
    } catch (error) {
      res.status(400).send(error.message);
    }
  });

  app.post('/composite-image', upload.single('baseImage'), async (req, res) => {
    const baseImage = req.file.buffer;
    const overlayImagePath = './images/222_img.png';

    try {
        const overlayBuffer = await sharp(overlayImagePath)
            .resize(500, 500)  
            .toBuffer();

            const result = await sharp(baseImage)
            .rotate(90)
            .composite([{
              input: overlayBuffer,
              left: 100,
              top: 50 
          }])
            .toBuffer();

        res.type('png').send(result);
    } catch (error) {
        console.error('Error processing image:', error);
        res.status(500).send('Error processing image');
    }
});


app.listen(PORT, () => {
console.log(`Server is running on port ${PORT}`);
});