console.log("client.js is sourced!");
console.log("client.js is sourced!");
let lastOperator = "";

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
    numOne: Number(document.getElementById("first").value),
    numTwo: Number(document.getElementById("second").value),
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
function setOperator(event, operator) {
  lastOperator = operator;
  document.querySelector("#equals").disabled = false;
  clearOperator();

  event.target.classList = "selected";
}
function clearOperator(withEquals = false) {
  if (withEquals) {
    lastOperator = "";
    document.querySelector("#equals").disabled = true;
  }

  for (let child of document.querySelector("#calc-form").children) {
    if (child.tagName === "BUTTON") {
      child.classList.remove("selected");
    }
  }
}
function clearForm() {
  document.querySelector("#equals").disabled = true;
  document.getElementById("first").value = "";
  document.getElementById("second").value = "";
  clearOperator(true);
}
onLoad();
