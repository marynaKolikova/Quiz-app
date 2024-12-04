"use strict";
const themeToggle = document.getElementById('theme-toggle');

themeToggle.addEventListener('click', () => {
  document.body.classList.toggle('dark-mode');
});

const choices = document.querySelectorAll('.chose');
const choicesArray = Array.from(choices);
const quizMenu = document.querySelector('.quiz-menu');
const quizQuestion = document.querySelector('.quiz-question');

// chose topic
choices.forEach(choice => {
  choice.addEventListener('click', (event) => {
    const clickedItem = event.currentTarget;
    const index = choicesArray.indexOf(clickedItem);
    quizMenu.classList.add('hidden');
    quizQuestion.classList.remove('hidden');
    choiceData(index);
  });
});

// get data
let data;
async function fetchData() {
  try {
    const response = await fetch('./data.json');
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    data = await response.json();
  } catch (error) {
    console.error('Error:', error);
  }
}
fetchData();

const selectedTitle = document.querySelector('.selected-title');
const selectedImg = document.querySelector('.selected-img');
const questions = document.querySelector('.questions');
const choseAnswer = document.querySelectorAll('.chose-answer');
const answers = document.querySelectorAll('.answers');
const selectBtn = document.querySelector('#submit');
const nextBtn = document.querySelector('#next-question');
const numQuestions = document.querySelector('.num-question');
const progress = document.querySelector('.progress');
const notSelectedAnswer = document.querySelector('.not-selected');
const result = document.querySelectorAll('.result');

let num = 0;
let score = 0;
let numAnswers;

function choiceData(index) {
  const firstQuiz = data.quizzes[index];
  selectedTitle.textContent = firstQuiz.title;
  selectedImg.innerHTML = `<img src="${firstQuiz.icon}" alt="${firstQuiz.title} icon">`;
  selectedImg.classList.add(firstQuiz.background);

  const questionsData = firstQuiz.questions;
  numAnswers = questionsData.length;
  
  question(num, questionsData);
  choiceAnswer();

  selectBtn.addEventListener('click', (e) => {
    const currentAnswerBox = document.querySelector('.chosen-answer');
    if (!currentAnswerBox) {
      notSelectedAnswer.classList.remove('hidden');
      return;
    }
    const currentAnswer = currentAnswerBox.querySelector('.answers').textContent;
    const correctAnswerText = questionsData[num].answer;

    if (currentAnswer === correctAnswerText) {
      score++;
      const currentTrue = currentAnswerBox.querySelector('.result');
      showChose(questionsData, currentTrue);
    } else {
      const currentTrue = currentAnswerBox.querySelector('.incorrect');
      showChose(questionsData, currentTrue);
      // find bloc refer to topic
      showTrueWhenFall(correctAnswerText,);
    }
    num++;
    if (num === numAnswers) finish(firstQuiz);
  });
}



function showTrueWhenFall(correctAnswerText) {
  answers.forEach((answerBox) => {
    if (answerBox.textContent == correctAnswerText) {
      // searching parent's bloc 
      const parent = answerBox.closest('.chose-answer');
      if (parent) {
        const incorrectBlock = parent.querySelector('.result');
        if (incorrectBlock) {
          // delete 'hidden' for incorrect
          incorrectBlock.classList.remove('hidden');
        }
      }
    }
  });
}

function question(num, questionsData) {
  numQuestions.textContent = `Questions ${num + 1} of 10`;
  progress.style.width = (num + 1) * 10 + '%';
  questions.textContent = questionsData[num].question;
  const optionData = questionsData[num].options;

  for (let j = 0; j < optionData.length; j++) {
    answers[j].textContent = optionData[j]
  }
}

function choiceAnswer() {
  choseAnswer.forEach(answer => {
    answer.addEventListener('click', () => {
      choseAnswer.forEach(ans => ans.classList.remove('chosen-answer'));
      answer.classList.add('chosen-answer');
      notSelectedAnswer.classList.add('hidden');
    });
  });
}

// check the number of questions
function checkAmount(questionsData) {
  if (num < numAnswers) {
    choseAnswer.forEach(ans => ans.classList.remove('chosen-answer'));
    question(num, questionsData);
  }
}

const quizCompleted = document.querySelector('.quiz-completed');
const completedTitle = document.querySelector('.completed-title');
const completedScore = document.querySelector('.completed-score');
const completedImg = document.querySelector('.completed-img');
const playAgain = document.getElementById('play-again');

// finish the quiz
function finish(firstQuiz) {
  quizQuestion.classList.add('hidden');
  quizCompleted.classList.remove('hidden');
  completedTitle.textContent = firstQuiz.title;
  completedImg.innerHTML = `<img src="${firstQuiz.icon}" alt="${firstQuiz.title} icon">`;
  completedImg.classList.add(firstQuiz.background);
  completedScore.textContent = score;

  playAgain.addEventListener('click', () => {
    location.reload();
  });

}

//  show the coincidence
function showChose(questionsData, currentTrue) {
  currentTrue.classList.remove('hidden');
  selectBtn.classList.add('hidden');
  nextBtn.classList.remove('hidden');

  nextBtn.addEventListener('click', () => {
    currentTrue.classList.add('hidden');
    nextBtn.classList.add('hidden');
    selectBtn.classList.remove('hidden');
    notSelectedAnswer.classList.add('hidden');
    result.forEach(answer => {     
      answer.classList.add('hidden');
    });
    checkAmount(questionsData);
  });
}