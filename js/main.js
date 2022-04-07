
//2. ========> To store the output, a calulator class is created with a constructor that takes all the inputs and all the calc function. Constructor takes the previousOperandTextElement and currentOperandTextElement to help determine where to place the calc display text.
//this.clear() function is called ASAP to reset the inputs
class Calculator {
  constructor(previousOperandTextElement, currentOperandTextElement) {
    this.previousOperandTextElement = previousOperandTextElement
    this.currentOperandTextElement = currentOperandTextElement
    this.clear()
  }

//3.=======> Calc functions
// Clears all the different variables, deleting all the displayed values. Current and previous operands equal empty strings if values are removed, while operation is undefined
  clear() {
    this.currentOperand = ''
    this.previousOperand = ''
    this.operation = undefined
  }
//Clearing a single number. Setting this.currentOperand = this.currentOperand and converting it to a string and using slice(0, -1) to remove the last element upon every click
  delete() {
    this.currentOperand = this.currentOperand.toString().slice(0, -1)
  }
//Determining what happens when a number button is clicked to add to the display. the current operand vale is updated and the number appended.use this.currentOperand and convert it to a string if it’s a number. This way, we can easily append something to the end by using “+”.
//pRventing repeated conc' of the . by checking if the string of numbers in the output includes a period then return to stop the function from executing any further.
  appendNumber(number) {
    if (number === '.' && this.currentOperand.includes('.')) return
    this.currentOperand = this.currentOperand.toString() + number.toString()
  }
//Controlling what happens when an operation button is clicked. ///Moving the initial number and operand clicked up to the previous operand section. The this.operation is initially set to equal the operation passed. Then this.previousOperand = this. currentOperand. the current operand is also set to an empty string while display has to be updated

//Adding the feature of computing an operation automatically while simultaneously completing another ====> Check whether the previous operand is not equal to an empty string and invoking the this.compute() method
  chooseOperation(operation) {
    if (this.currentOperand === '') return
    if (this.previousOperand !== '') {
      this.compute()
    }
    this.operation = operation
    this.previousOperand = this.currentOperand
    this.currentOperand = ''
  }
//Taking input values and computing the results and displaying

  compute() {
//first step, creating a variable to store the compuation result
    let computation
//create two variables; a preceeding variable which is gonna be the actual number vesion of the previous operand
    const prev = parseFloat(this.previousOperand)
    const current = parseFloat(this.currentOperand)
//Preventing the code from running when the user clicks on the equal button without clicking any before it. If both previous and current are not numbers ie isNaN, return which cancels the function immediately
    if (isNaN(prev) || isNaN(current)) return
    switch (this.operation) {
      case '+':
        computation = prev + current
        break
      case '-':
        computation = prev - current
        break
      case '*':
        computation = prev * current
        break
      case '÷':
        computation = prev / current
        break
      default:
        return
    }
    this.currentOperand = computation
    this.operation = undefined
    this.previousOperand = ''
  }
//Updating the values inside of the output
//Adding commas to make numbers more definitive using a 
//======> helper function getDisplayNumber

//We need to deal with a minor error. When you type in a value such as 0.0001, it would not show up unless you click a different number like 0.2 or 0.3.

//This is because the value cannot be converted into a float. We can fix this by splitting the number you get into two: the integer part and the decimal part. We also eliminate unnecessary decimal points by setting the maximum fraction digits to zero, as demonstrated below:
  getDisplayNumber(number) {
    const stringNumber = number.toString()
    const integerDigits = parseFloat(stringNumber.split('.')[0])
    const decimalDigits = stringNumber.split('.')[1]
    let integerDisplay
    if (isNaN(integerDigits)) {
      integerDisplay = ''
    } else {
      integerDisplay = integerDigits.toLocaleString('en', { maximumFractionDigits: 0 })
    }
    if (decimalDigits != null) {
      return `${integerDisplay}.${decimalDigits}`
    } else {
      return integerDisplay
    }
  }
//Add an if ststement so that if the operation is not null, we display the previous operand text element
  updateDisplay() {
    this.currentOperandTextElement.innerText =
      this.getDisplayNumber(this.currentOperand)
    if (this.operation != null) {
      this.previousOperandTextElement.innerText =
        `${this.getDisplayNumber(this.previousOperand)} ${this.operation}`
    } else {
      this.previousOperandTextElement.innerText = ''
    }
  }
}

//1. ========> Defining constant variables to rep the buttons and follow with a document.querySelecor to capture all the buttons with specific data attribute strings.
const numberButtons = document.querySelectorAll('[data-number]')
const operationButtons = document.querySelectorAll('[data-operation]')
const equalsButton = document.querySelector('[data-equals]')
const deleteButton = document.querySelector('[data-delete]')
const allClearButton = document.querySelector('[data-all-clear]')
const previousOperandTextElement = document.querySelector('[data-previous-operand]')
const currentOperandTextElement = document.querySelector('[data-current-operand]')

//4. ========> Hooking variables to make them operate on the calc object. Creating a calc constant and setting it to new calc and pass everything from the constructor into it
const calculator = new Calculator(previousOperandTextElement, currentOperandTextElement)

//Using the calculator object 
//use the .forEach() to loop over the buttons with an event listener added that invokes an action when the button is clicked ie add a number to the calculator by calling the appendNumber and displaying it using the button.innerText. 
//The the calculator.updateDisplay method is called which constantly updates the displayed values once a calc button has been clicked
numberButtons.forEach(button => {
  button.addEventListener('click', () => {
    calculator.appendNumber(button.innerText)
    calculator.updateDisplay()
  })
})

operationButtons.forEach(button => {
  button.addEventListener('click', () => {
    calculator.chooseOperation(button.innerText)
    calculator.updateDisplay()
  })
})
// To facilitate computation, adding an eventListener to the equals button that invokes the compute function and return results, followed by updating the calc's display
equalsButton.addEventListener('click', button => {
  calculator.compute()
  calculator.updateDisplay()
})
// Clearing the dsiplay of the calculator
allClearButton.addEventListener('click', button => {
  calculator.clear()
  calculator.updateDisplay()
})

deleteButton.addEventListener('click', button => {
  calculator.delete()
  calculator.updateDisplay()
})

document.addEventListener('keydown', function (event) {
  let patternForNumbers = /[0-9]/g;
  let patternForOperators = /[+\-*\/]/g
  if (event.key.match(patternForNumbers)) {
    event.preventDefault();
    calculator.appendNumber(event.key)
    calculator.updateDisplay()
  }
  if (event.key === '.') {
    event.preventDefault();
    calculator.appendNumber(event.key)
    calculator.updateDisplay()
  }
  if (event.key.match(patternForOperators)) {
    event.preventDefault();
    calculator.chooseOperation(event.key)
    calculator.updateDisplay()
  }
  if (event.key === 'Enter' || event.key === '=') {
    event.preventDefault();
    calculator.compute()
    calculator.updateDisplay()
  }
  if (event.key === "Backspace") {
    event.preventDefault();
    calculator.delete()
    calculator.updateDisplay()
  }
  if (event.key == 'Delete') {
    event.preventDefault();
    calculator.clear()
    calculator.updateDisplay()
  }

});