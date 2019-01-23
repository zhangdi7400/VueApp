const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const passport = require('passport');
const app = new express();

//import user.js profile.js
const users = require('./routers/api/user');
const profiles = require('./routers/api/profiles');
app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());


app.use("/api/users",users);
app.use("/api/profiles",profiles);
//DB config
const db = require('./config/keys').mongoUrl;

//use body-parser middleware


//connect to mongodb
mongoose.connect(db).then( () => {
    console.log('MongoDb is connected');
}).catch( (error)=> {
    console.log(error)
});
;

//config passport
app.use(passport.initialize());//initialize passport
require('./config/passport')(passport);



const port = process.env.port || 5000;

app.listen(port, () => {
    console.log(`Server is runing on port ${port}`);
});