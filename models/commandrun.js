import mongoose from 'mongoose'

/* PetSchema will correspond to a collection in your MongoDB database. */
const CommandRunSchema = new mongoose.Schema({
    _id:false,
    botid: {
        /* The name of this pet */

        type: String,
        required: true,
        unique: true
    },
    date_y: {
        /* The name of this pet */

        type: String,
        required: true,
    },
    date_d: {
        /* The name of this pet */

        type: String,
        required: true,
    },
    count: {
        /* The name of this pet */

        type: Number,
        required: true,
    },

})

export default mongoose.models.Commandrun || mongoose.model('CommandRun', CommandRunSchema)
