const express = require('express')
const router = new express.Router()
const User = require('../models/user')

//create new user
router.post('/users', async (req, res) => {
    const user = new User(req.body)
 
    try{
         await user.save()
         res.status(201).send(user)
    }catch(e){
         res.status(400).send(e)
    }
 }) 

 //user login
 router.post('/users/login', async (req, res) => {
    try{
        const user = await User.findByCreditials(req.body.email, req.body.password)
        res.send(user)
    }catch(e){
        res.status(400).send(e)
    }
 })
 
 //find all users
 router.get('/users', async (req, res) => {
     try{
         const users = await User.find({})
         res.send(users)
     }catch(e){
         res.status(500).send(e)
     }
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
 router.patch('/users/:id', async (req, res) => {
     //corner case
     const update = Object.keys(req.body)
     const allowedFields = ['name', 'email', 'password', 'age']
     const isValidUpdate = update.every((update) => allowedFields.includes(update))
 
     if(!isValidUpdate){
         return res.status(404).send({error : 'Invalid Update!'})
     }
 
     try{
        //  const user = await User.findByIdAndUpdate(req.params.id, req.body, { new : true, runValidators : true})
        const user = await User.findById(req.params.id)
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
 router.delete('/users/:id', async (req, res) => {
     try{
         const user = await User.findByIdAndDelete(req.params.id)
         if(!user){
             return res.status(404).send()
         }
         res.send(user)
     }catch(e){
         res.status(400).send(e)
     }
 })

 module.exports = router