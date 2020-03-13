const express = require('express');
const path = require('path');
const shortid = require('shortid');
const server = express();
// created data
const members = require('./data/members.js');
const users = require('./data/users.js');
// created middleware
const logger = require('./middleqare/logger.js');

const PORT = process.env.PORT || 4000;
server.listen(4000, () => {
    console.log(`Listening on ${PORT}`);
});

// set server to use and return json info
server.use(express.json());
//init logger middleware
server.use(logger);
// set static folder
server.use(express.static(path.join(__dirname, 'public')));





// route returns data from members array in data module
server.get("/api/members", (req, res) => {
    res.json(members);
})

server.get("/user", (req, res) => {
    res.send(user).json(user);
})


// When the client makes a POST request to /api/users:
// get to see the data
server.get("/api/users", (req, res) => {
    res.json(users);
})
// if the request is missing either the name of bio
server.post("/api/users", (req, res) => {
    const newUser = req.body;
    newUser.id = shortid.generate();

    const test1 = newUser.name;
    const test2 = newUser.bio;

    if(test1 === "" || test2 === "") {
        res.status(400).json({ msg: "Please provide name and bio for the user." });
    } else {
        users.push(newUser);
        res.status(201).json(newUser);
    }
    res.status(500).json({ msg: "There was an error while saving the user to the database" });
});

// When the client makes a GET request to /api/users/:id:
/**
 * using the .some() to compare id from data with id from req. return true or false.
 * assign the boolean from .some () to "found". If found is true, filter for the user
 * object, if false return a 404 with msg. If all fails return 500 with msg
 */
server.get("/api/users/:id", (req, res) => {
    const found = users.some(user => JSON.stringify(user.id) === JSON.stringify(req.params.id));

    if(found) {
        res.json(users.filter(user => JSON.stringify(user.id) === JSON.stringify(req.params.id)));
    }else {
        res.status(404).json({ msg: `oops, ${req.params.id} not found` });
    }

    res.status(500).json({ msg: "The user information could not be retrieved."});
});


/**
 * req is request and is the info you are sending in 
 * the body. Using post man I created a object with id,
 * name, and bio, in a json format. userInfo is the 
 * variable this info is shoved into. using shortid 
 * to generate a id for userInfo. I sent "01" in the 
 * body but got back something different. Then pushing 
 * the userInfo object into the user array above.
 */
// add new user
server.post('/api/users',(req, res) => {
    const userInfo = {
        id: shortid.generate(),
        name: req.body.name,
        bio: req.body.bio
    }
    if( !userInfo.name || !userInfo.email) {
        return res.status(400).json({ msg: 'Need both name and email please '});
    }
    users.push(userInfo);
    res.status(201).json(userInfo);
})

// update user
server.put('/api/users/:id', (req, res) => {
    const found = users.some(user => JSON.stringify(user.id) === JSON.stringify(req.params.id));

    if(found) {
        const updUser = req.body;
        users.forEach(user => {
            if(user.id === req.params.id) {
                user.name = updUser.name ? updUser.name : res.status(400).json({ msg: 'Please provide a name for the user.'});
                user.bio = updUser.bio ? updUser.bio : res.status(400).json({ msg: 'Please provide a bio for the user.'});

                return res.status(201).json(updUser, { msg: 'done' });
            }else {
                res.status(404).json({ msg: `oops, ${req.params.id} not found` });
            }
        })
    }

    res.status(500).json({ msg: "The user information could not be retrieved."});
})

// delete user
server.delete('/api/users/:id', (req, res) => {
    const {id} = req.params;
    const deleted = users.find(user => JSON.stringify(user.id) === JSON.stringify(req.params.id));

    if(deleted) {
        res.status(200).json(deleted);
    } else {
        res
            .status(404).json({success: false, message: "user id not found"});
    }
})


