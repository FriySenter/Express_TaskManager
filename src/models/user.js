const mongoose = require('mongoose'); 
const validator = require('validator')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const Task = require('../models/task')

const userSchema = new mongoose.Schema({
    name : {
        type : String,
        required : true,
        trim : true
    },
    password : {
        type : String,
        required : true,
        trim : true,
        minlength : 7,
        validate(value){
            if(value.toLowerCase().includes('password')){
                throw new Error('password cannot contain "password"!');
            }
        }
    },
    email :{
        type : String,
        required : true,
        trim : true,
        unique : true,
        lowercase : true, 
        validate(value){
            if(!validator.isEmail(value)){
                throw new Error('Error email!');
            }
        }
    },
    age : {
        type : Number,
        default : 0,
        validate(value){
            if(value < 0){
                throw new Error('Age cannot be nagetive!');
            }
        }
    },
    tokens : [{
        token : {
            type : String,
            required : true
        }
    }],
    avatar : {
        type : Buffer
    }
}, {
    timestamps : true
})

userSchema.methods.toJSON = function(){
    const user = this
    const userObject = user.toObject()

    delete userObject.password
    delete userObject.tokens
    delete userObject.avatar

    return userObject
}

userSchema.methods.generateToken = async function() {
    const user = this
    const token = jwt.sign({ _id : user._id.toString()}, process.env.JWT_SECRET)
    user.tokens = user.tokens.concat( { token } )
    await user.save()
    return token
}

userSchema.statics.findByCreditials = async (email, password) => {
    const user = await User.findOne({ email : email })
    if(!user){
        throw new Error('Uable to login!')
    }

    const isMatch = await bcrypt.compare( password, user.password)
    if(!isMatch){
        throw new Error('Uable to login!')
    }

    return user
} 

userSchema.virtual('tasks', {
    ref : 'Task',
    localField : '_id',
    foreignField : 'owner'
})

//hash password before save
userSchema.pre('save', async function(next){
    // console.log('this is the save middle ware!') 

    if(this.isModified('password')){
        this.password = await bcrypt.hash(this.password, 8)
    }

    next() 
})

//delete tasks when user is removed
userSchema.pre('remove', async function(next) {
    const user = this
    await Task.deleteMany({ owner : user._id})
    next()
})

const User = mongoose.model('User', userSchema)

module.exports = User; 