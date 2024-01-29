// 🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥
// 🔥 DO NOT MODIFY THIS FILE!!!! OR ELSE! 🔥
// 🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥

// Testing Library Stuff:
const {
  fireEvent,
  getByText,
  getByRole,
  getByPlaceholderText,
  getByTestId,
} = require("@testing-library/dom");
require("@testing-library/jest-dom");
const { JSDOM } = require("jsdom");

// File-Reading Stuff:
const fs = require("fs");
const path = require("path");
const html = fs.readFileSync(
  path.resolve(__dirname, "../server/public/index.html"),
  "utf8"
);
const jsFile = fs.readFileSync(
  path.resolve(__dirname, "../server/public/scripts/client.js"),
  "utf8"
);

// Nifty Testing Tools, Authored by the Instructors You Know and Love:
const testCalculations = require("./__utils__/testCalculations.js");
const axios = require("./__utils__/axiosMock.js");
const briefPause = require("./__utils__/briefPause.js");
const resolveMockedFunctionPromises = require("./__utils__/resolveMockedFunctionPromises.js");
const e = require("express");

// Holds the jsdom instance that the tests run against:
let container;

describe(`Client-Side Tests:`, () => {
  const customOutputOptions = {
    showPrefix: false,
    showMatcherMessage: false,
  };

  beforeAll(() => {
    // Keep test output clean by disabling student console.log
    // statements during test output:
    console.log = () => {};
  });

  beforeEach(async () => {
    // Make the DOM:
    dom = new JSDOM(html, { runScripts: "dangerously" });

    // Reset our axios mock:
    axios.mockClear();

    // Reset the dummy data:
    axios.testData = [...testCalculations];

    // Attach our axios mock to the DOM and execute script.js:
    dom.window.axios = axios;
    dom.window.eval(jsFile);

    // Make sure we pause a moment for the axios GET request:
    await briefPause(100);

    // Stashing the DOM's body in a container. This is
    // what we test against:
    container = dom.window.document.body;
  });
  it("STRETCH ONLY - The equal button should remain disabled until a valid input is entered", () => {
    const addButton = getByRole(container, "button", { name: "+" });
    const one = getByTestId(container, "one");
    const two = getByTestId(container, "two");
    const three = getByTestId(container, "three");
    const equalsButton = getByRole(container, "button", { name: "=" });
    const clearButton = getByRole(container, "button", { name: "C" });

    fireEvent.click(one);
    fireEvent.click(two);
    addButton.click();
    expect(equalsButton.disabled).toEqual(true);
    fireEvent.click(three);
    fireEvent.click(two);
    expect(equalsButton.disabled).toEqual(false);
    clearButton.click();
    expect(equalsButton.disabled).toEqual(true);
    addButton.click();
    expect(equalsButton.disabled).toEqual(true);

    // Hard to pass if you dont care about going this deep or if you do it a different way
  });
  it(`STRETCH ONLY - Addition: A POST request's data is an object that contains the correct values for numOne, numTwo, and operator`, async () => {
    const addButton = getByRole(container, "button", { name: "+" });
    const calculatorView = getByTestId(container, "stretch-input");
    const one = getByTestId(container, "one");
    const two = getByTestId(container, "two");
    const three = getByTestId(container, "three");

    fireEvent.click(one);
    fireEvent.click(two);
    addButton.click();
    fireEvent.click(three);
    fireEvent.click(two);
    expect("12 + 32").toEqual(calculatorView.value);
    const equalsButton = getByRole(container, "button", { name: "=" });
    equalsButton.click();

    await briefPause(200);

    const mockedAxiosInteractions = await resolveMockedFunctionPromises(axios);
    const sentData = mockedAxiosInteractions[1].axiosWasCalledWith.data;

    // Not allowing strings.. probably a better pattern than allowing unsanitized strings
    expect(12).toEqual(sentData.numOne);
    expect(32).toEqual(sentData.numTwo);

    expect(sentData.operator).toBe("+");
  });

  it(`STRETCH ONLY - Subtraction: A POST request's data is an object that contains the correct values for numOne, numTwo, and operator`, async () => {
    // Select the inputs and an operator button:
    const addButton = getByRole(container, "button", { name: "-" });
    const calculatorView = getByTestId(container, "stretch-input");
    const one = getByTestId(container, "one");
    const two = getByTestId(container, "two");
    const three = getByTestId(container, "three");

    fireEvent.click(one);
    fireEvent.click(two);
    addButton.click();
    fireEvent.click(three);
    fireEvent.click(two);
    // Check calc view before resetting after equal is clicked
    expect("12 - 32").toEqual(calculatorView.value);
    // Click the '=' button:
    const equalsButton = getByRole(container, "button", { name: "=" });
    equalsButton.click();

    await briefPause(200);

    const mockedAxiosInteractions = await resolveMockedFunctionPromises(axios);
    const sentData = mockedAxiosInteractions[1].axiosWasCalledWith.data;

    // Not allowing strings.. probably a better pattern than allowing unsanitized strings
    expect(12).toEqual(sentData.numOne);
    expect(32).toEqual(sentData.numTwo);

    expect(sentData.operator).toBe("-");
  });

  it(`STRETCH ONLY - Multiplication: A POST request's data is an object that contains the correct values for numOne, numTwo, and operator`, async () => {
    // Select the inputs and an operator button:
    const addButton = getByRole(container, "button", { name: "*" });
    const calculatorView = getByTestId(container, "stretch-input");
    const one = getByTestId(container, "one");
    const two = getByTestId(container, "two");
    const three = getByTestId(container, "three");

    fireEvent.click(one);
    fireEvent.click(two);
    addButton.click();
    fireEvent.click(three);
    fireEvent.click(two);
    // Check calc view before resetting after equal is clicked
    expect("12 * 32").toEqual(calculatorView.value);
    // Click the '=' button:
    const equalsButton = getByRole(container, "button", { name: "=" });
    equalsButton.click();

    await briefPause(200);

    const mockedAxiosInteractions = await resolveMockedFunctionPromises(axios);
    const sentData = mockedAxiosInteractions[1].axiosWasCalledWith.data;

    // Not allowing strings.. probably a better pattern than allowing unsanitized strings
    expect(12).toEqual(sentData.numOne);
    expect(32).toEqual(sentData.numTwo);

    expect(sentData.operator).toBe("*");
  });

  it(`STRETCH ONLY - Division: A POST request's data is an object that contains the correct values for numOne, numTwo, and operator`, async () => {
    // Select the inputs and an operator button:
    const addButton = getByRole(container, "button", { name: "/" });
    const calculatorView = getByTestId(container, "stretch-input");
    const one = getByTestId(container, "one");
    const two = getByTestId(container, "two");
    const three = getByTestId(container, "three");

    fireEvent.click(one);
    fireEvent.click(two);
    addButton.click();
    fireEvent.click(three);
    fireEvent.click(two);
    // Check calc view before resetting after equal is clicked
    expect("12 / 32").toEqual(calculatorView.value);
    // Click the '=' button:
    const equalsButton = getByRole(container, "button", { name: "=" });
    equalsButton.click();

    await briefPause(200);

    const mockedAxiosInteractions = await resolveMockedFunctionPromises(axios);
    const sentData = mockedAxiosInteractions[1].axiosWasCalledWith.data;

    // Not allowing strings.. probably a better pattern than allowing unsanitized strings
    expect(12).toEqual(sentData.numOne);
    expect(32).toEqual(sentData.numTwo);

    expect(sentData.operator).toBe("/");
  });
});
