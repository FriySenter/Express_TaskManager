const experss = require('express')
require('./db/mongoose');
const userRouter = require('./routers/userRouter');
const taskRouter = require('./routers/taskRouter')
const multer = require('multer')

const app = experss();
const port = process.env.PORT

app.use(experss.json())
app.use(userRouter)
app.use(taskRouter)

//show port
app.listen(port, () =>{
    console.log('Server is listen at port ' + port)
})








