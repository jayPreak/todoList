//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const date = require(__dirname + "/date.js");
const mongoose = require("mongoose")

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

mongoose.connect ("mongodb+srv://admin:1234@cluster0.weydvek.mongodb.net/todoDB", {useNewUrlParser : true})

const itemSchema = {
  name : String
}

const Item = mongoose.model("Item", itemSchema)

const item1 = new Item({
  name : "Welcome to ToDoList"
})
const item2 = new Item({
  name : "Hit + to add more items ;)"
})
const item3 = new Item({
  name : "Click the checkbox to cross off items!"
})

const defaultItems = [item1, item2, item3]


// const items = ["Buy Food", "Cook Food", "Eat Food"];
// const workItems = [];

app.get("/", function(req, res) {
  

  const day = date.getDate();


  Item.find({}, function(err, foundItems){
    if (foundItems.length === 0) {
      Item.insertMany(defaultItems, function(err) {
        if (err) {
          console.log(err)
        } else {
          console.log("SUccessfully saved")
        }
      })

      res.redirect("/");
      
    } else {
      res.render("list", {listTitle: day, newListItems: foundItems});
    }
    
  })
  

});

app.post("/", function(req, res){

  const itemName = req.body.newItem;

  const item = new Item({
    name: itemName
  })

  item.save()

  res.redirect("/")
  
});

app.post("/delete", function(req, res){
  const checkedItemId = req.body.checkbox

  Item.findByIdAndRemove(checkedItemId, function(err){
    if (!err) {
      console.log("Deletedd")
      res.redirect("/")
    }
  })
})

app.get("/work", function(req,res){
  res.render("list", {listTitle: "Work List", newListItems: workItems});
});

app.get("/about", function(req, res){
  res.render("about");
});

let port = process.env.PORT;
if (port == null || port == "") {
  port = 3000;
}

app.listen(port, function() {
  console.log("Server started suicdeesfulky");
});
