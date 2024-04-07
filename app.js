const dotenv = require('dotenv');
dotenv.config({ path: './config.env' });

const connectDB = require('./db/conn');
connectDB();

const express = require('express');
const app = express();

const authRouter = require('./router/auth');
const eventRouter = require('./router/event');
const memberRouter = require('./router/member')
const taskRouter = require('./router/task')


const PORT = process.env.PORT;

// middleware
app.use(express.json());
app.use(authRouter);
app.use(eventRouter);
app.use(memberRouter);
app.use(taskRouter);

app.get('/', (req, res) => {
    res.send('Welcome to EventMingle Backend')
})


app.listen(PORT, () => {
    console.log(`server is running at port ${PORT}`);
})