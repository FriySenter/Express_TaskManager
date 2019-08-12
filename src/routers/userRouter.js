const express = require('express')
const router = new express.Router()
const auth = require('../middleware/auth')
const User = require('../models/user')
const multer = require('multer')
const sharp = require('sharp')
const {sendWelcomeEmail} = require('../emails/account')

//create new user
router.post('/users', async (req, res) => {
    const user = new User(req.body)
    
    try{
         await user.save()
         sendWelcomeEmail(user.email, user.name)
         const token = await user.generateToken()
         res.status(201).send({ user, token } )
    }catch(e){
         res.status(400).send(e)
    }
 }) 

 //user login
 router.post('/users/login', async (req, res) => {
    try{
        const user = await User.findByCreditials(req.body.email, req.body.password)
        const token = await user.generateToken()
        res.send({ user, token})
    }catch(e){
        res.status(400).send(e)
    }
 })

 //user logout
 router.post('/users/logout', auth, async (req, res) => {
     try{
        req.user.tokens = req.user.tokens.filter((token) => {
            return token.token !== req.token
        })

        await req.user.save()
        res.send()
     }catch(e){
        res.status(500).send()
     }
 })

 //user logoutall
 router.post('/users/logoutAll', auth, async (req, res) => {
     try{
        req.user.tokens = []
        await req.user.save()
        res.send()
     }catch(e){
        res.status(500).send()
     }
 })
 
 //find all users
 router.get('/users/me', auth, async (req, res) => {
     res.send(req.user)
    //  try{
    //      const users = await User.find({})
    //      res.send(users)
    //  }catch(e){
    //      res.status(500).send(e)
    //  }
 })
 
 //find user by id
 router.get('/users/:id', async (req, res) => {
     const _id = req.params.id
 
     try{
         const user = await User.findById(_id)
         if(!user){
             return res.status(404).send()
         }
         res.send(user)
     }catch(e){
         res.status(500).send(e)
     }
 })
 
 //update a user
 router.patch('/users/me',auth, async (req, res) => {
     //corner case
     const update = Object.keys(req.body)
     const allowedFields = ['name', 'email', 'password', 'age']
     const isValidUpdate = update.every((update) => allowedFields.includes(update))
 
     if(!isValidUpdate){
         return res.status(404).send({error : 'Invalid Update!'})
     }
 
     try{
        //  const user = await User.findByIdAndUpdate(req.params.id, req.body, { new : true, runValidators : true})
        const user = req.user
        update.forEach((update) => user[update] = req.body[update])
        await user.save()

         if(!user){
             return res.status(404).send()
         }
  
         res.send(user)
     }catch(e){
         res.status(400).send(e)
     }
     
 })
 
 //delete user
 router.delete('/users/me', auth, async (req, res) => {
     try{
        await req.user.remove()
         res.send(req.user)
     }catch(e){
         res.status(500).send(e)
     }
 })

 const upload = multer({
     limits : {
         fileSize : 5000000
     },
     fileFilter(req, file, cb) {
         if(!file.originalname.match(/\.(jpg|jpeg|png|gif)$/)){
             return cb(new Error('Please upload valid file'))
         }

         cb(undefined,true)
     }
 })

 //upload user avator
 router.post('/users/me/avatar', auth, upload.single('avatar'), async (req, res) => {
    
    const buffer = await sharp(req.file.buffer).resize({ width : 250, height : 250 }).png().toBuffer()
    req.user.avatar = buffer
    await req.user.save()
     res.send()
 }, (error, req, res, next) => {
     res.status(400).send({error : error.message})
 })

 //delete user avatar
 router.delete('/users/me/avatar', auth, async (req, res) => {
     req.user.avatar = undefined
     await req.user.save()
     res.send(req.user)
 }, (error, req, res, next) => {
     res.status(400).send({error : error.message})
 })

 //get user's avatar
 router.get('/users/:id/avatar', auth, async (req, res) => {
    try{
        const user = await User.findById(req.params.id)

        if(!user || !user.avatar){
            throw new Error()
        }

        res.set('Content-Type', 'image/png')
        res.send(user.avatar)
    }catch (e) {
        res.status(404).send(e)
    }
 })

 module.exports = router