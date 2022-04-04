import mongoose from 'mongoose'

/* PetSchema will correspond to a collection in your MongoDB database. */
const PendBotSchema = new mongoose.Schema({
    id: {
        type: String,
        required: true,
        unique: true
    },
    botid: {
        /* The name of this pet */

        type: String,
        required: true,
    },
    ownerid: {
        /* The owner of this pet */

        type: String,
        required: true,
    },
    approved: {
        /* The species of your pet */

        type: Boolean,
        default: false
    },
    prefix:{
        type: String,
        required: true,
    },
    denyReason : {
        /* Pet's age, if applicable */

        type: String,
        default: ""
    },
    pending: {

        type: Boolean,
        default: false
    },
    botdescription: {
        type: String,
        default: "정보없음"
    },
    slug: {
        type: String,
        default: "정보없음"
    },
    deny: {
        type: Boolean,
        default: false
    },

},)

export default mongoose.models.PendBot || mongoose.model('PendBot', PendBotSchema)
