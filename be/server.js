const express = require('express');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config();

const app = express();

const blogRoutes = require('./routes/blog.js');
const authRoutes = require('./routes/auth.js')
const userRoutes = require('./routes/user.js')
//helpers
app.use(morgan('dev'));
app.use(bodyParser.json());
app.use(cookieParser());

app.use(cors());

//routes
app.get('/api', (req,res) =>{
    res.json({time: Date().toString()});
})

//routes middleware
app.use('/api',blogRoutes);
app.use('/api', authRoutes);
app.use('/api',userRoutes)


//db
mongoose.connect(process.env.DB, {})
    .then(() => console.log("DB connected"))
    .catch((err)=>console.log("DB Error =>", err))

const port = process.env.PORT || 8100

app.listen(port, () =>{
    console.log(`Server is running on the port ${port}`);
})