import mongoose from 'mongoose'

/* PetSchema will correspond to a collection in your MongoDB database. */
const UserSchema = new mongoose.Schema({
    userid: {
        /* The name of this pet */

        type: String,
        required: true,
        unique: true
    },
    username:{
        type: String,
        required: true,
    },
    discriminator :{
        type: String,
        required: true,
    },
    useravatar:{
        type: String,
        required: true,
    },
    bots: {
        /* The owner of this pet */

        type: Array,
        default: []
    },
    permissions: {
        /* The owner of this pet */

        type: Number,
        default: 0
    },
    hearts: {
        type: Array,
        default: []
    },
    badges:{
        type: Array,
        default: []
    },

},)

export default mongoose.models.User || mongoose.model('User', UserSchema)
