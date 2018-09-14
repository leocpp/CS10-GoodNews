require('dotenv').config();
const express = require('express');
const server = require('./server');
const path = require('path');
const port = process.env.PORT || 5000;
const mongoose = require('mongoose');
// const mongoURL = process.env.NODE_ENV === 'production' ? process.env.MONGOLAB_URL : process.env.MONGODB_LOCAL;
const mongoURL = process.env.NODE_ENV === 'production' ? process.env.MONGODB_URI : process.env.MONGODB_LOCAL;

//process.env if it exists OR local version for testing offline.

mongoose.set('useCreateIndex', true);
mongoose.set('useNewUrlParser', true);
mongoose.set('useFindAndModify', false);
mongoose
    .connect(mongoURL) //Whatever mongo db database we use will go here
    .then(mongo => {
        console.log('=== Connected to MongoDB server successfully! ===');
    })
    .catch(err => {
        console.error('error', err);
    });

// For serving static files to root endpoint
server.use(express.static(path.join(__dirname, 'client', 'build')));
server.listen(port, () => console.log(`=== API running on port: ${port}! ===`));