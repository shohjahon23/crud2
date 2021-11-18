const mongoose = require('mongoose')
const schema = mongoose.Schema

const userDb = new schema({
    names : {
        type: String,
        required : true,
    },
    surname : {
        type : String,
        required : true
    },
    login : {
        type : String,
        required : true
    },
    password : {
        type: String,
        required: true,
    },
})

module.exports = mongoose.model('userDb' ,userDb )