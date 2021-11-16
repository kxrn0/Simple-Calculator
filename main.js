const topDisplay = document.querySelector(".top-display");
const mainDisplay = document.querySelector(".main-display");
const clear = document.querySelector(".clear");
const backspace = document.querySelector(".delete");
const numbers = document.querySelectorAll(".number");
const operations = document.querySelectorAll(".operation");
const memoryButton = document.querySelector(".memory");
const memoryPlus = document.querySelector(".memory-plus");
const leftButt = document.querySelector(".left");
const rightButt = document.querySelector(".right");

let operator, maxLength, memoryValue, memA, memB;
let operands, index;

memoryButton.addEventListener("click", () => {
    if (memoryValue) {
        index = operator ? 1 : 0;
        operands[index] = memoryValue;
        if (index)
            memB = true;
        else
            memA = true;

        display();
    }
});

memoryPlus.addEventListener("click", () => {
    index = operator ? 1 : 0;
    memoryValue = operands[index];
});

function init(initial) {
    operator = '';
    maxLength = 15;
    memA = false;
    memB = false;

    operands = [];
    operands.push(initial);
    operands.push('');
    index = 0;

    mainDisplay.innerText = ''; 
    topDisplay.innerText = '';
}

function display() {
    index = operator ? 1 : 0;

    if (operands[index] > maxLength)
        operands[index] = operands[index].slice(0, maxLength);

    if (!index) {
        if (memA)
            mainDisplay.innerText = 'M';
        else 
            mainDisplay.innerText = operands[index];
    }
    else {
        if (memA)
            topDisplay.innerText = `M ${operator}`;
        else
            topDisplay.innerText = `${operands[0]} ${operator}`

        if (memB)
            mainDisplay.innerText = 'M';
        else
            mainDisplay.innerText = operands[index];
    }
}

clear.addEventListener("click", () => {
    init('');
});

numbers.forEach(number => number.addEventListener("click", () => {
    index = operator ? 1 : 0;

    if (number.innerText == '.') {
        if (operands[index].indexOf('.') == -1) {
            if (!operands[index] == operands[index] == '0')
                operands[index] = "0.";
            else
                operands[index] += '.';
        }
    }
    else {
        if (operands[index] == '0')
            operands[index] = number.innerText;
        else
            operands[index] += number.innerText;
    }
    if (operands[index][operands[index].length] == '.')
        operands[index] = operands[index].slice(0, operands[index].length);

    display();
}));

operations.forEach(button => button.addEventListener("click", () => {
    if (operands[0]) {
        if (button.innerText == "+/-") {
            index = operator ? 1 : 0;

            if (memA && !index)
                memA = false;
            else if (memB)
                memB = false;

            operands[index] = String(-1 * parseFloat(operands[0]));
        }
        else if (button.innerText == '=') {
            if (operator && operands[1]) {
                switch (operator) {
                    case '+':
                        operands[0] = String(parseFloat(operands[0]) + parseFloat(operands[1]));
                        break;
                    case '-':
                        operands[0] = String(parseFloat(operands[0]) - parseFloat(operands[1]));
                        break;
                    case '×':
                        operands[0] = String(parseFloat(operands[0]) * parseFloat(operands[1]));
                        break;
                    case '÷':
                        operands[0] = String(parseFloat(operands[0]) / parseFloat(operands[1]));
                        break;
                }
                init(operands[0]);
            }
        }
        else
            operator = button.innerText;
    }

    display();
}));

backspace.addEventListener("click", () => {
    index = operator ? 1 : 0;

    operands[index] = operands[index].substring(0, operands[index].length - 1);

    display();
});

init('');