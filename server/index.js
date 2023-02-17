const express = require("express");
const mongoose = require("mongoose");
const app = express();
const colors = require("colors");
const UserModel = require("./models/User");
const TodoModel = require("./models/Todo");
const cors = require("cors");

app.use(express.json());
app.use(cors());

mongoose.set("strictQuery", false);
//MongoDB Connection
mongoose
  .connect(
    "mongodb+srv://admin:admin123@cluster0.a4j4hid.mongodb.net/users?retryWrites=true&w=majority",
    () => {
      useNewUrlParser: true;
    }
  )
  .then(() => {
    console.log("MongoDB is Connected Successfull !".bgRed.white);
  })
  .catch((err) => {
    console.log(err.bgRed.white);
  });

//User Registration api
app.post("/register", async (req, res) => {
  const name = req.body.user;
  const user = new UserModel({ name: name });

  try {
    await user.save();
    res.status(200).send("User Created Successfully");
  } catch (err) {
    console.log(err);
  }
});

//New todos list api
app.post("/newtodo", async (req, res) => {
  const title = req.body.todo;
  const todo = new TodoModel({ title: title });

  try {
    await todo.save();
    res.status(200).send("New todo added Successfully");
  } catch (err) {
    console.log(err);
  }
});

//Get all todos list from mongodb
app.get("/alltodos", (req, res) => {
  TodoModel.find({}, (err, result) => {
    if (err) {
      res.send(err);
    } else {
      res.send(result);
    }
  });
});

//Update
app.put("/update", async (req, res) => {
  const id = req.body._id;
  const newName = req.body.newName;

  try {
    await TodoModel.findById(id, (err, updatedTitle) => {
      updatedTitle.title = newName;
      updatedTitle.save();
      res.send("Updated");
    });
  } catch (err) {
    console.log(err);
  }
});

//Delete
app.delete("/delete/:id", async (req, res) => {
  const id = req.params.id;

  await TodoModel.findByIdAndRemove(id).exec();
  res.send("Deleted");
});

//Login
app.post("/login", async (req, res) => {
  const user = req.body.user;

  try {
    const newUser = await UserModel.findOne({ name: user });
    if (newUser.name == user) {
      // return res.send(`User ${user} exists in DB`);
      res.json({ status: "ok", data: newUser });
    } else return res.send("No User found");
  } catch (err) {
    console.log(err);
  }
});

const PORT = 3001;
const Mode = "Development";

app.listen(PORT, () => {
  console.log(
    `Server is running on Port ${PORT} on ${Mode} mode.`.bgGreen.white
  );
});
