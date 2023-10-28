const express = require('express')
const cookieParser = require('cookie-parser');
const session = require('express-session');
const mongoose = require('mongoose')
const route = require('./src/routes/routes.js')

require('dotenv').config()
const app = express()

app.set('view engine', 'ejs')
app.use(express.json())
app.use(cookieParser());
app.use(session({ secret: 'vaibhav_1234', resave: false, saveUninitialized: false }));
app.use(express.urlencoded({ extended: false }));
app.use('/assets', express.static('assets'))

mongoose.set('strictQuery', false)
mongoose.connect(process.env.DB, { useNewUrlParser: true })
    .then(() => console.log('MongoDB is Connected Successfully...'))
    .catch((error) => console.log(error))

app.use('/', route)

app.get('/', (req, res) => { res.render('Home') })
app.get('/login', (req, res) => { res.render('Login') })
app.get('/register', (req, res) => { res.render('SignUp') })

app.listen(process.env.PORT, () => {
    console.log(`App is running on port: ${process.env.PORT}...`)
})