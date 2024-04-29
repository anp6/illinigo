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
  spawnLocations: {
    type: {
      type: String,
      enum: ['Point'], // more  types can be added for multiple types of spawn areas
      required: true
    },
    coordinates: {
      type: [Number], //  can vary, but Format: [<long>, <lat>], longitude range: (-180,180), latitude range(-90,90)
      required: true
    }
  },
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


characterSchema.index({ "spawnLocations": '2dsphere' });


const Character = mongoose.model('Character', characterSchema);
module.exports = Character

