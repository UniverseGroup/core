import mongoose from 'mongoose'

/* PetSchema will correspond to a collection in your MongoDB database. */
const CommandIncSchema = new mongoose.Schema({
    _id:false,
    botid: {
        /* The name of this pet */

        type: String,
        required: true,
        unique: true
    },
    command: {
        /* The name of this pet */

        type: String,
        required: true,
        unique: true
    },
    count: {
        /* The name of this pet */

        type: Number,
        required: true,
    },

})

export default mongoose.models.Commandinc || mongoose.model('CommandInc', CommandIncSchema)
