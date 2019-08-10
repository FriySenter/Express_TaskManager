const mongoose = require('mongoose'); 
const validator = require('validator')
const bcrypt = require('bcryptjs')

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
    }
})


userSchema.statics.findByCreditials = async (email, password) => {
    const user = await User.findOne({ email : email})
    if(!user){
        throw new Error('Uable to login!')
    }

    const isMatch = await bcrypt.compare(password, user.password)
    if(!isMatch){
        throw new Error('Uable to login!')
    }

    return user
} 



//hash password before save
userSchema.pre('save', async function(next){
    // console.log('this is the save middle ware!') 

    if(this.isModified('password')){
        this.password = await bcrypt.hash(this.password, 8)
    }

    next() 
})

const User = mongoose.model('User', userSchema)

module.exports = User; 