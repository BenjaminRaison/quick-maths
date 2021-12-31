`use strict`;

class Question {
    prompt;
    expectedAnswer;
    actualAnswer;

    constructor(prompt, expectedAnswer) {
        this.prompt = prompt;
        this.expectedAnswer = expectedAnswer;
    }
}

class State {
    questions = [];
    currentQuestion = 0;
}

function random(max) {
    return Math.floor(Math.random() * (max)) + 1
}

function generateQuestions(amount, max) {
    const questions = [];

    for (let i = 0; i < amount; i++) {
        const num1 = random(max);
        const num2 = random(max);

        switch (random(4)) {
            case 1:
                questions.push(new Question(`${num1} + ${num2} =`, num1 + num2))
                break;
            case 2:
                questions.push(new Question(`${num1} - ${num2} =`, num1 - num2))
                break;
            case 3:
                questions.push(new Question(`${num1} × ${num2} =`, num1 * num2))
                break;
            case 4:
                const product = num1 * num2;
                questions.push(new Question(`${product} ÷ ${num1} =`, num2))

        }
    }

    return questions;
}

function writeResult(parent, question) {
    const li = document.createElement('li');
    li.className = 'r-item';

    const q = document.createElement('span')
    q.innerText = question.prompt;
    li.append(q);

    const correctA = document.createElement('span');
    correctA.className = 'correct-a';
    correctA.innerText = question.expectedAnswer;
    li.append(correctA);

    if (question.expectedAnswer !== question.actualAnswer) {
        const wrongA = document.createElement('span');
        wrongA.className = 'wrong-a';
        wrongA.innerText = question.actualAnswer;
        wrongA.title = question.actualAnswer;
        li.append(wrongA);
    }

    parent.append(li);
}

function showResults() {
    const parent = document.getElementById('r-list');
    parent.innerHTML = '';

    state.questions.forEach(q => writeResult(parent, q));

    const correct = state.questions.filter(q => q.expectedAnswer === q.actualAnswer).length;
    const total = state.questions.length;
    const perc = Number(correct / total * 100);

    document.getElementById('r-correct').innerText = String(correct);
    document.getElementById('r-total').innerText = String(total);
    document.getElementById('r-perc').innerText = String(perc);

    if (perc === 100) {
        document.getElementById('r-summary').className = 'r-perfect';
    } else {
        document.getElementById('r-summary').className = '';
    }

    document.getElementById('qa').className = 'hidden';
    document.getElementById('results').className = '';
}

function stateChanged() {
    if (state.currentQuestion >= state.questions.length) {
        showResults();
    } else {
        document.getElementById('question').innerText = state.questions[state.currentQuestion].prompt;
        document.getElementById('question').focus();
        document.getElementById('answer-field').value = null;
    }
    console.info(state);
}

function onInput() {
    const value = document.getElementById('answer-field').value;

    if (!!value) {
        state.questions[state.currentQuestion].actualAnswer = Number(value);
        state.currentQuestion++;
        stateChanged();
    }
}

let state = new State();

function init() {
    document.getElementById('qa').className = 'hidden';
    document.getElementById('results').className = 'hidden';
    document.getElementById('setup').className = '';
    document.getElementById('question').innerText = '';
    document.getElementById('answer-field').value = null;

    state = new State();
}

function setup() {
    const amount = Number(document.getElementById('q-amount').value);
    const max = Number(document.getElementById('q-max-size').value);

    state.questions = generateQuestions(amount, max);
    state.currentQuestion = 0;

    document.getElementById('qa').className = '';
    document.getElementById('setup').className = 'hidden';

    stateChanged();
}

// Taking the piss? Probably.
function americanise() {
    // Only americanise if en-US is declared before any other en-* language region
    const languages = navigator?.languages ?? [];
    let isAmerican = false;
    for (let language of languages) {
        if (language === 'en-US') {
            isAmerican = true;
            break; //
        }
        if (language.startsWith('en-')) {
            return; // First english region was not en-US, no need to americanise
        }
    }

    if (isAmerican) {
        document.title = 'Quick Math';
        document.getElementsByTagName('h1')[0].innerText = 'Quick Math';
    }
}

americanise();
