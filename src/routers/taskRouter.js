const express = require('express')
const router = express.Router()
const Task = require('../models/task')
const auth = require('../middleware/auth')

//create a new task
router.post('/tasks', auth, async (req, res) => {
    // const task = new Task(req.body)
    const task = new Task({
        ...req.body,
        owner : req.user._id
    })

    try{
        await task.save()
        res.status(201).send(task)
    }catch(e){
        res.status(400).send(e)
    }
})

//find all tasks
//GET tasks?compeleted=true...
//GET tasks?limit=10&skip=10
//GET tasks?sortBy=
router.get('/tasks', auth, async (req, res) => {
    const match = {}
    const sort = {}

    if(req.query.compeleted){
        match.compeleted = req.query.compeleted === 'true'
    }

    if(req.query.sortBy){
        const parts = req.query.sortBy.split(':')
        sort[parts[0]] = parts[1] === 'desc' ? -1 : 1
    }

    try{
        await req.user.populate({
            path : 'tasks',
            match,
            options: {
                limit : parseInt(req.query.limit),
                skip : parseInt(req.query.skip),
                sort
            }
        }).execPopulate()
        res.send(req.user.tasks)
    }catch(e){
        res.status(500).send(e)
    }
})

//find task by id
router.get('/tasks/:id', auth, async (req, res) => {
    const _id = req.params.id

    try{
        const task = await Task.findOne({ _id, owner : req.user._id})
        if(!task){
            return res.status(404).send()
        }
        res.send(task)
    }catch(e){
        res.status(500).send(e)
    }
})

//update task by id
router.patch('/tasks/:id', auth, async (req, res) => {
    const update = Object.keys(req.body)
    const allowedFields = ['des', 'compeleted']
    const isValidUpdate = update.every((update) => allowedFields.includes(update))

    if(!isValidUpdate){
        return res.status(400).send({error : 'Invalid Update'})
    }

    try{
        // const task = await Task.findByIdAndUpdate(req.params.id, req.body, { new : true, runValidators : true})
        const task = await Task.findOne({ _id : req.params.id, owner : req.user._id})
        if(!task){
            return res.status(404).send()
        }
        update.forEach((update) => task[update] = req.body[update])
        await task.save()
        res.send(task)
    }catch(e) {
        res.status(400).send(e)
    }
})

//delete task by id
router.delete('/tasks/:id', auth, async (req, res) => {
    try{
        const task = await Task.findOneAndDelete({ _id : req.params.id, owner : req.user._id})
        if(!task){
            return res.status(404).send()
        }
        res.send(task)
    }catch(e){
        res.status(400).send(e)
    }
})

module.exports = router