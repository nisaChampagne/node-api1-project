// implement your API here
const express = require('express');

//import darabase
const db = require('./data/db');


const server = express();

server.use(express.json());

server.get('/api/users', (request, response) => {
    db.find()//promise
        .then(users => response.status(200).json(users))
        .catch(err => {
            console.log(err);
            response.status(500).json({ error: "whoops"})
        })
})

server.get('/api/users/:id', (request, response) => {
    const id = request.params.id;
    db.findById(id)
        .then(user =>{
            console.log("user", user);
            if (user) {
                response.status(200).json(user);
            }else{
                response.status(404).json({error: "Oops"})
            }
        }) 
        .catch(err => {
            console.log(err);
            response.status(500).json({ error: "whoops"})
        })
})

server.post("/api/users", (request, response) => {
     console.log(request.body);
     const {name, bio} = request.body;
     if(!name || !bio){
         response.status(400).json({ error: "requires name and bio"})
     }
     db.insert({name, bio})
        .then(({id}) => db.findById(id))
        .then( user => {
            response.status(201).json(user);
        })
        .catch(err => {
            console.log(err);
            response.status(500).json({error: "server error"})
        })
})

server.put("/api/users/:id", (request, response) => {
    const { name, bio } = request.body;
    const { id } = request.params;
    if (!name && !bio){
       response.status(400).json({error: "Requires some changes"})     
    }
    db.update(id, { name, bio })
        .then(updated => {
            if (updated){
                db.findById(id)
                .then(user => response.status(200).json(user))
                .catch(err => {
                    console.log(err);
                    response.status(500).json({error: "Error Retrieving User"})
                })
            }else{
                response.status(404).json({error: "user with id not found"})
            }
        })
        .catch(err => {
            console.log(err);
            response.status(500).json({ error: "Error updating user"})
        })
})

server.delete("/api/users/:id", (request, response) => {
    const { id } = request.params;
    db.remove(id)
        .then(something => {
            console.log(something)
            response.status(204).end()
        })
        .catch(err => {
            console.log(err);
            response.status(500).json({error: "server error deleting"})
        })
})

server.listen(4444, () => {
    console.log("It's working!")
})