const mongoose = require('mongoose');

const characterSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Critter Name"]
  },
  description: {
    type: String,
    required: [true, "Critter Description/Info"]
  },
  image: { // TDB: Storing a 2d image of the character
    type: String,
    required: [true, "Critter Image (for Catalog)"]
  }, 
  render: { // TDB: Storing a 2d image of the character
    type: String,
    required: [true, "Critter 3D-model render"]
  },// TBD: A method of storing the 3d model of the character
  spawnLocations: [{
    radius: {
      type: Number,
      required: [true, "Spawn radius"],
      default: 1 // if unspecified, the spawn radius is 1m (Subject to change)
    },
    location: // Stores a coordinate point and a radius around the point within which the character can spawn
    {
      type: {
        type: String,
        enum: ['Point'],
        required: true
      },
      coordinates: {
        type: [Number], // Format: [<long>, <lat>], longitude range: (-180,180), latitude range(-90,90)
        required: true
      }
    },
  }],
  spawnProbability: {
    type: Number,
    required: [true, "Spawn probability"],
    default: 1 // default spawn probability is 100%
  }, 
  spawnConditions: {
    timesAvailable: [{ 
      type: String,
      required: false // if not provided, a critter can spawn at any time 
    }],
    // events: [{ type: String }], 
    // Other conditions can be added
  },
  // TBD: Snaps : [An array of images] 
  // Beyond MVP: Add Class and Stats
}, {timestamps: true});

characterSchema.index({ "spawnLocations.coordinates": '2dsphere' });

const Character = mongoose.model('Character', characterSchema);
module.exports = Character

