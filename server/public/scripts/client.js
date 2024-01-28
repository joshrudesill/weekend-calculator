console.log("client.js is sourced!");
console.log("client.js is sourced!");
let lastOperator = "";
let firstNumber = "";
let secondNumber = "";

function onLoad() {
  getHistory();
}

function getHistory() {
  axios({
    method: "GET",
    url: "/calculations",
  })
    .then((res) => {
      let lastRes = document.querySelector("#recentResult");
      let history = document.querySelector("#resultHistory");
      history.innerHTML = "";
      lastRes.innerHTML = "";
      if (res.data.length > 0) {
        lastRes.innerHTML = `<h2>${res.data.at(-1).result}</h2>`;
        res.data.forEach(
          (row) =>
            (history.innerHTML += `<p>${row.numOne} ${row.operator} ${row.numTwo} = ${row.result}</p>`)
        );
      }
    })
    .catch((err) => {
      console.error(err);
    });
}
function clearServer(event) {
  axios({
    method: "DELETE",
    url: "/calculations",
  })
    .then(function (_) {
      clearForm();
      getHistory();
    })
    .catch(function (error) {
      console.log("error", error);
    });
}

function addCalculation(event) {
  event.preventDefault();
  let calculation = {
    numOne: Number(firstNumber),
    numTwo: Number(secondNumber),
    operator: lastOperator,
  };
  axios({
    method: "POST",
    url: "/calculations",
    data: calculation,
  })
    .then(function (_) {
      clearForm();
      getHistory();
    })
    .catch(function (error) {
      console.log("error", error);
    });
}
function setInput(input) {
  if (lastOperator === "") {
    firstNumber += input;
  } else {
    secondNumber += input;
  }
  document.querySelector(
    "#calculation"
  ).value = `${firstNumber} ${lastOperator} ${secondNumber}`;
  updateEquals();
}
function setOperator(event, operator) {
  if (firstNumber !== "" && lastOperator === "") {
    lastOperator = operator;
  }

  document.querySelector(
    "#calculation"
  ).value = `${firstNumber} ${lastOperator} ${secondNumber}`;
}
function clearOperator(withEquals = false) {
  if (withEquals) {
    lastOperator = "";
    document.querySelector("#equals").disabled = true;
  }
}
function updateEquals() {
  if (firstNumber === "" || secondNumber === "" || lastOperator === "") {
    document.querySelector("#equals").disabled = true;
  } else {
    document.querySelector("#equals").disabled = false;
  }
}
function clearForm() {
  document.querySelector("#equals").disabled = true;
  document.getElementById("calculation").value = "";
  firstNumber = "";
  secondNumber = "";
  lastOperator = "";
  clearOperator(true);
}
onLoad();
