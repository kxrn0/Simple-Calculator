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
const numPads = [];

let operator, maxLength, memoryValue, memA, memB, operands, index, cursor;

function init_pads() {
    maxLength = 18;
    for (let i = 0; i < maxLength; i++) {
        let divGit = document.createElement("div");
        divGit.classList.add("digit");
        numPads.push(divGit);
        mainDisplay.appendChild(divGit);
    }

    cursor = numPads.length - 1;
    numPads[cursor].classList.add("blink");
}

function init(initial) {
    operator = '';
    memA = false;
    memB = false;

    operands = [initial, ''];
    index = 0;

    if (cursor)
        numPads[cursor].classList.remove("blink");
    cursor = numPads.length - 1;
    numPads[cursor].classList.add("blink");

    for (let i = 0; i < numPads.length; i++)
        numPads[i].innerText = '';
    topDisplay.innerText = '';
}

function move(dir, index) {
    if (!operands[index])
        return;

    numPads[cursor].classList.remove("blink");
    cursor += dir;

    if (dir == 1) {
        if (cursor > numPads.length - 1)
            cursor = numPads.length - operands[index].length;
    }
    else if (dir == -1) {
        if (cursor + operands[index].length == numPads.length - 1)
            cursor = numPads.length - 1;
    }

    numPads[cursor].classList.add("blink");
}

function memory() {
    if (memoryValue) {
        index = operator ? 1 : 0;
        operands[index] = String(memoryValue);
        if (index)
            memB = true;
        else
            memA = true;

        display();
    }
}

function memory_plus() {
    index = operator ? 1 : 0;

    for (let char of operands[index])
        if (!valid_char(char))
            return;

    memoryValue = operands[index];
}

function display_numbers(index) {
    for (let i = numPads.length - 1, j = operands[index].length - 1; j >= 0; i--, j--)
        numPads[i].innerText = operands[index][j];  
}

function display() {
    for (let i = 0; i < numPads.length; i++)
        numPads[i].innerText = '';

    index = operator ? 1 : 0;

    if (operator)
        if (operands[0][operands[0].length - 1] == '.')
            operands[0] = operands[0].slice(0, operands[0].length - 1);

    if (operands[index] > maxLength)
        operands[index] = operands[index].slice(0, maxLength);

    if (!index) {
        if (memA)
            numPads[numPads.length - 1].innerText = 'M';
        else 
            display_numbers(index);
    }
    else {
        if (memA)
            topDisplay.innerText = `M ${operator}`;
        else
            topDisplay.innerText = `${operands[0]} ${operator}`

        if (memB)
            numPads[numPads.length - 1].innerText = 'M';
        else
            display_numbers(index);
    }
}

function valid_char(char) {
    return 48 <= char.charCodeAt() && char.charCodeAt() <= 57 || char == '-' || char == '.';
}

function get_number(number) {
    index = operator ? 1 : 0;

    for (let char of operands[0])
        if (!valid_char(char))
            operands[0] = '';

    if (memA || memB) {
        if (index)
            memB = false;
        else 
            memA = false;
        
        operands[index] = '';
    }

    let shiftedIndex = cursor - numPads.length + operands[index].length + 1;

    if (number == '.') {
        if (operands[index].indexOf('.') == -1) {
            if (!operands[index] || operands[index] == '0')
                operands[index] = "0.";
            else
                operands[index] += '.';
        }
    }
    else {
        if (operands[index] == '0')
            operands[index] = String(number);
        else
            operands[index] = operands[index].slice(0, shiftedIndex) + number + operands[index].slice(shiftedIndex);
    }

    display();
}

function operate(operator) {
    switch (operator) {
        case '+':
            return String(parseFloat(operands[0]) + parseFloat(operands[1]));
        case '-':
            return String(parseFloat(operands[0]) - parseFloat(operands[1]));
        case '×':
        case '*':
            return String(parseFloat(operands[0]) * parseFloat(operands[1]));
        case '÷':
        case '/':
            return String(parseFloat(operands[0]) / parseFloat(operands[1]));
    }
}

function handle_operations(command) {
    if (!operands[0])
        return;

    for (let char of operands[0])
        if (!valid_char(char))
            return;

    if (command == "+/-") {
        index = operator ? 1 : 0;

        if (memA && !index)
            memA = false;
        else if (memB)
            memB = false;

        operands[index] = String(-1 * parseFloat(operands[index]));
    }
    else if (command == '=' || command == "Enter") {
        if (memA && !index)
            init(memoryValue);
        else if (operator && operands[1]) {
            operands[0] = operate(operator);
            init(operands[0]);
        }
    }
    else {
        if (operator) {
            operands[0] = operate(operator);
            init(operands[0]);
        }
        operator = command;
    }


    display();
}

function delet() {
    index = operator ? 1 : 0;

    if (memA || memB) {
        if (index)
            memB = false;
        else 
            memA = false;
        
        operands[index] = '';
        numPads[numPads.length - 1].innerText = '';
    }

    if (!operands[index])
        return;

    let shiftedIndex = cursor - numPads.length + operands[index].length;
    operands[index] = operands[index].slice(0, shiftedIndex) + operands[index].slice(shiftedIndex + 1);

    if (shiftedIndex != operands[index].length)
        move(1, index);

    display();
}

operations.forEach(button => button.addEventListener("click", () => {
    switch (button.innerText) {
        case '×':
            handle_operations('*');
            break;
        case '÷':
            handle_operations('/');
            break;
        default:
            handle_operations(button.innerText);
    }
}));

clear.addEventListener("click", () => {
    init('');
});

numbers.forEach(number => number.addEventListener("click", () => get_number(number.innerText)));

backspace.addEventListener("click", delet);

memoryButton.addEventListener("click", memory);

memoryPlus.addEventListener("click", memory_plus);

leftButt.addEventListener("click", () => move(-1, operator ? 1 : 0));

rightButt.addEventListener("click", () => move(1, operator ? 1 : 0));

window.addEventListener("keydown", event => {
    switch (event.key) {
        case "ArrowLeft":
            move(-1, operator ? 1 : 0);
            break;
        case "ArrowRight":
            move(1, operator ? 1 : 0);
            break;
        case '+':
        case '-':
        case '*':
        case '/':
        case '=':
        case "Enter":
        case "+/-":
            handle_operations(event.key);
            break;
        case '1':
        case '2':
        case '3':
        case '4':
        case '5':
        case '6':
        case '7':
        case '8':
        case '9':
        case '0':
        case '.':
            get_number(event.key);
            break;
        case 'd':
        case 'D':
            delet();
            break;
        case "Backspace":
            init('');
            break;
        case 'm':
        case 'M':
            memory();
            break;
        case 'p':
        case 'P':
            memory_plus();
            break;
    }
});

init_pads();

init('');