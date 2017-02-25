import $ from 'jquery';
import Theater from 'theaterjs';

import settings from './settings';

let questions;
let score = {
    correct: 0,
    incorrect: 0,
    answered: 0
};
let index = 0;
const startBtn = document.querySelector('.start-game');
const questionsWrap = document.querySelector('.question-wrapper');
const questionP = document.querySelector('.question');
const answerList = document.querySelector('.answer-list');

$(document).ready(() => {
    let theater = Theater({
      "minSpeed": 100,
      "maxSpeed": 350
    });
    theater.addActor('game');
    theater
        .addScene('game:Let\'s play', 200, '.', 200, '.', 200, '. ', 'TRIVIA!!!')
    });

function checkAnswer(q,a) {
    let answer;
    const nextBtn = ('<input type="submit" value="continue" class="next-question" />');
    if (q.correct_answer === a) {
        score.correct++;
        answer = 'Yes!';
        questionP.innerHTML = answer;
        answerList.innerHTML = nextBtn;
    }
    else {
        score.incorrect++;
        answer = 'Nope!';
        questionP.innerHTML = `${answer} the correct answer was "${q.correct_answer}"`;
        answerList.innerHTML = nextBtn;
    }
    score.answered++;
    index++;
    document.querySelector('.next-question').addEventListener('click', (e) => {
        if (score.answered === 10) {
            endGame();
        }
        else{
            buildQuestion(questions,index);
        }
    });
}

function endGame() {
    $(answerList).empty();
    if (score.correct < 5) {
        questionP.innerHTML = `Your score: ${(score.correct/score.answered) * 100}% <span>That's ok, keep trying!</span>`;
    }
    else if (score.correct < 9 && score.correct > 4) {
        questionP.innerHTML = `Your score: ${score.correct/score.answered}% <span>Not too bad!</span>`;
    }
    else {
        questionP.innerHTML = `Your score: ${score.correct/score.answered}% <span>Wow, great job!</span>`;
    }
}

function buildQuestion(questionObj,i) {
    const answers = questionObj[i].incorrect_answers;
    let question = questionObj[i].question;
    if (question.indexOf('&#039;') !== -1) {
        const removeChars = question.split('&#039;');
        question = removeChars.join('');
    }
    if (question.indexOf('&quot;') !== -1) {
        const removeChars = question.split('&quot;');
        question = removeChars.join('');
    }
    answers.push(questionObj[i].correct_answer);
    $(questionP).empty();
    $(questionP).text(question);
    $(answerList).empty();
    answers.forEach((answer,i) => {
        $(answerList).append(`
            <fieldset>
                <input type="radio" id="answer-${i}" value="${answer}" name="answer" />
                <label for="answer-${i}">${answer}</label>
            </fieldset>
            `)
    });
    $(answerList).append('<div class="submit-wrapper"><input type="submit" value="submit" /></div>')
}

function getQuestions() {
    $.ajax({
        type: 'GET',
        url: settings.api,
        contentType: 'text/plain',
        xhrFields: {
            withCredentials: false
          },
        success: (d) => {
            sessionStorage.setItem('questions', JSON.stringify(d));
            questions = $.parseJSON(sessionStorage.getItem('questions')).results;
            buildQuestion(questions,0);
        }
    });
}

startBtn.addEventListener('click', () => {
    let score = {
        correct: 0,
        incorrect: 0,
        answered: 0
    }
    $('.scene').removeClass('in');
    $(questionsWrap).addClass('in');
    $('nav').addClass('in-game');
    getQuestions();
});

answerList.addEventListener('submit', (e) => {
    e.preventDefault();
    let guess = null;
    const answers = document.querySelectorAll('input[type="radio"]');
    answers.forEach((answer) => {
        if (answer.checked) {
            guess = answer.value;
        }
    });
    checkAnswer(questions[index],guess);
});