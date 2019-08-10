const mongoose = require('mongoose')
const taskSchema = new mongoose.Schema({
    des : {
        type : String,
        required : true,
        trim : true
    },
    compeleted : {
        type : Boolean,
        default : false
    }
})


const Task = mongoose.model('Task', taskSchema)

module.exports = Task