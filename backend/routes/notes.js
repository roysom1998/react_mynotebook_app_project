const express = require('express');
const router = express.Router();
var fetchUsers = require('../middleware/fetchUsers');
const Note = require('../models/Note');
const { validationResult, body } = require('express-validator');

//ROUTE:1 - fetch all the notes: GET "/api/notes/fetchallnotes".Login required.
router.get('/fetchallnotes', fetchUsers, async (req, res) => {
  try {
    const notes = await Note.find({ user: req.user.id })
    res.json(notes);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Internal server error");
  }

})

//ROUTE:2 - adding the notes: POST "/api/notes/addnotes".Login required.
router.post('/addnotes', fetchUsers,
  [body('title', "Enter valid title").isLength({ min: 3 }),
  body('description', "Enter valid description").isLength({ min: 5 })],
  async (req, res) => {
    try {
      const { title, description, tags } = req.body;
      //If there are errors then return the error and the bad request.
      const result = validationResult(req);
      if (!result.isEmpty()) {
        return res.status(400).json({ errors: result.array() });
      }
      const note = new Note({
        title, description, tags, user: req.user.id
      })
      const savedNote = await note.save();
      res.json(savedNote);
    } catch (error) {
      console.error(error.message);
      res.status(500).send("Internal server error");
    }

  })

  //ROUTE:3 - updating the notes: PUT "/api/notes/updatenotes/:id".Login required.
router.put('/updatenotes/:id', fetchUsers,
async (req, res) => {
  const {title,description,tags}=req.body;

  //creating a newNote object
  const newNote={};

  //if the request has title put it in newNote object
  if(title){newNote.title=title};
  if(description){newNote.description=description};
  if(tags){newNote.tags=tags};

  //find the note to be updated and update it
  let note=await Note.findById(req.params.id);
  if(!note){return res.status(404).send("Not Found")}

  // note.user.toString() - will give the id of the user
  if(note.user.toString() !== req.user.id){
    return res.status(401).send("Not Allowed");
  }

  note=await Note.findByIdAndUpdate(req.params.id,{$set:newNote},{new:true});
  res.json({note});
})

module.exports = router