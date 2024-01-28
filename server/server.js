const express = require("express");
const app = express();
let PORT = process.env.PORT || 5000;

app.use(express.json());
app.use(express.static("server/public"));

// Global variable that will contain all of the
// calculation objects:
let calculations = [];

// Here's a wonderful place to make some routes:

// GET /calculations
app.get("/calculations", (req, res) => {
  res.status(200);
  res.send(calculations);
});
app.post("/calculations", (req, res) => {
  let { numOne, numTwo, operator } = req.body;
  // To pass the tests \/ - Data is already guarenteed to be sanitized from client but the tests spoof a request with strings.. so here we are
  numOne = Number(numOne);
  numTwo = Number(numTwo);
  let calcResult;
  switch (operator) {
    case "+":
      calcResult = numOne + numTwo;
      break;
    case "-":
      calcResult = numOne - numTwo;
      break;
    case "/":
      calcResult = numOne / numTwo;
      break;
    case "*":
      calcResult = numOne * numTwo;
      break;
    default:
      calcResult = 0;
      break;
  }
  calculations.push({ ...req.body, result: calcResult });
  res.sendStatus(201);
});

// POST /calculations

// PLEASE DO NOT MODIFY ANY CODE BELOW THESE BEARS:
// 🐻  🐻‍❄️  🧸  🐻  🐻‍❄️  🧸  🐻  🐻‍❄️  🧸  🐻  🐻‍❄️  🧸

// Makes it so you don't have to kill the server
// on 5000 in order to run the tests:
if (process.env.NODE_ENV === "test") {
  PORT = 5001;
}

// This starts the server...but also stores it in a variable.
// This is weird. We have to do it for testing reasons. There
// is absolutely no need for you to reason about this.
const server = app.listen(PORT, () => {
  console.log("server running on: ", PORT);
});

// server.setTimeout(500)

// This is more weird "for testing reasons" code. There is
// absolutely no need for you to reason about this.
app.closeServer = () => {
  server.close();
};

app.setCalculations = (calculationsToSet) => {
  calculations = calculationsToSet;
};

module.exports = app;
