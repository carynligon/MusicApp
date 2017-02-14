import $ from 'jquery';

import settings from './settings';

let startBtn = document.querySelector('.start-game');
let questionsWrap = document.querySelector('.question-wrapper');
let questionP = document.querySelector('.question');
let answerList = document.querySelector('.answer-list');

$(document).ready(() => {
    $(questionsWrap).hide();
});

function buildQuestion(questionObj,i) {
    let answers = questionObj[i].incorrect_answers;
    let question = questionObj[i].question;
    if (question.indexOf('&#039;') !== -1) {
        let removeChars = question.split('&#039;');
        question = removeChars.join('');
    }
    if (question.indexOf('&quot;') !== -1) {
        let removeChars = question.split('&quot;');
        question = removeChars.join('');
    }
    answers.push(questionObj[i].correct_answer);
    $(questionP).empty();
    $(questionP).text(question);
    $(answerList).empty();
    answers.forEach((answer,i) => {
        $(answerList).append(`
            <fieldset>
                <input type="radio" id="answer-${i}" value=${i} name="answer" />
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
            let questions = $.parseJSON(sessionStorage.getItem('questions')).results;
            buildQuestion(questions,0);
        }
    });
}

startBtn.addEventListener('click', () => {
    $(questionsWrap).show();
    $('nav').addClass('in-game');
    getQuestions();
});