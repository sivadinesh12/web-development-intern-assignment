const express = require("express");
const mongoose = require("mongoose");
const app = express();
const Todos = require("./todo");
const cors = require("cors")

app.use(express.json());
app.use(cors())

app.listen(5000, () => {
  console.log("App running on localhost 5000");
});

main().catch((err) => console.log(err.message));

async function main() {
  await mongoose.connect("mongodb://localhost:27017/todoDB");
  console.log("db connected");
}

app.post("/newTodo", async (req, res) => {
  try {
    const { todo } = req.body;
    const newTodo = await Todos.create({ todo });
    res.status(201).json(newTodo);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

app.get("/getTodo", async (req, res) => {
  try {
    const todos = await Todos.find();
    res.status(200).json(todos);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

app.put("/updateTodo/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { todo } = req.body;
    const updatedTodo = await Todos.findByIdAndUpdate(
      id,
      { todo },
      { new: true, runValidators: true }
    );
    if (!updatedTodo) {
      return res.status(404).json({ error: "Todo not found" });
    }
    res.status(200).json(updatedTodo);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

app.delete("/deleteTodo/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const deletedTodo = await Todos.findByIdAndDelete(id);
    if (!deletedTodo) {
      return res.status(404).json({ error: "Todo not found" });
    }
    res.status(200).json({ message: "Todo deleted successfully" });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});
