const express = require('express')
const router = express.Router()
const Task = require('../models/task')

//create a new task
router.post('/tasks', async (req, res) => {
    const task = new Task(req.body)

    try{
        await task.save()
        res.status(201).send(task)
    }catch(e){
        res.status(400).send(e)
    }
})

//find all tasks
router.get('/tasks', async (req, res) => {

    try{
        const tasks = await Task.find({})
        res.send(tasks)
    }catch(e){
        res.status(500).send(e)
    }
})

//find task by id
router.get('/tasks/:id', async (req, res) => {
    const _id = req.params.id

    try{
        const task = await Task.findById(_id)
        if(!task){
            return res.status(404).send()
        }
        res.send(task)
    }catch(e){
        res.status(500).send(e)
    }
})

//update task by id
router.patch('/tasks/:id', async (req, res) => {
    const update = Object.keys(req.body)
    const allowedFields = ['des', 'compeleted']
    const isValidUpdate = update.every((update) => allowedFields.includes(update))

    if(!isValidUpdate){
        return res.status(400).send({error : 'Invalid Update'})
    }

    try{
        // const task = await Task.findByIdAndUpdate(req.params.id, req.body, { new : true, runValidators : true})
        const task = await Task.findById(req.params.id)
        update.forEach((update) => task[update] = req.body[update])
        await task.save()

        if(!task){
            return res.status(404).send()
        }

        res.send(task)
    }catch(e) {
        res.status(400).send(e)
    }
})

//delete task by id
router.delete('/tasks/:id', async (req, res) => {
    try{
        const task = await Task.findByIdAndDelete(req.params.id)
        if(!task){
            return res.status(404).send()
        }
        res.send(task)
    }catch(e){
        res.status(400).send(e)
    }
})

module.exports = router