const experss = require('express')

require('./db/mongoose');
const User = require('./models/user');
const Task = require('./models/task');
const userRouter = require('./routers/userRouter');
const taskRouter = require('./routers/taskRouter')

const app = experss();
const port = process.env.PORT || 3000

app.use(experss.json())
app.use(userRouter)
app.use(taskRouter)

//show port
app.listen(port, () =>{
    console.log('Server is listen at port ' + port)
})








