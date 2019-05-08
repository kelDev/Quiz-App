import Question from "./Question.js";
import Quiz from "./Quiz.js";

const App = (() => {
  //cache the DOM
  const quizEl = document.querySelector('.jabquiz'),
    quizQuestionEl = document.querySelector('.jabquiz__question'),
    trackerEl = document.querySelector('.jabquiz__tracker'),
    taglineEl = document.querySelector('.jabquiz__tagline'),
    choicesEl = document.querySelector('.jabquiz__choices'),
    progressInnerEl = document.querySelector('.progress__inner'),
    nextButtonEl = document.querySelector('.next'),
    restartButtonEl = document.querySelector('.restart');

  //Create questions
  const q1 = new Question(
    "First President of US?",
    ["Barrack", "Osama", "Jorge", "Monkey"],
    2
  )
  const q2 = new Question(
    "When was JavaScript created?",
    ["June 1995", "May 1995", "July 1885", "Sept 1996"],
    1
  )
  const q3 = new Question(
    "What CSS stand for?",
    ["County Sheriff Service", "Cascading Sexy Sheets", "Cascading Style Sheets", "Can't Stop Swimming"],
    2
  )
  const q4 = new Question(
    "The full form of HTML...?",
    ["Hyper Text Markup Language", "Hold The Mic L", "ERROR", "Programming Language"],
    0
  )
  const q5 = new Question(
    "console.log(typeof []) would return what?",
    ["Array", "Object", "null", "unidentified"],
    1
  )

  const quiz = new Quiz([q1, q2, q3, q4, q5]);

  //event listeners
  const listeners = _ => {
    nextButtonEl.addEventListener('click', function(){
      const selectedRadioElem = document.querySelector('input[name=choice]:checked');

      if(selectedRadioElem){
        const key = Number(selectedRadioElem.getAttribute("data-order"));

        quiz.guess(key);

        renderAll();
      }

      
    });


    restartButtonEl.addEventListener('click', function(){
      //1.reset the quiz
      quiz.reset();
      //2.renderAll
      renderAll();
      //3.restore the next button
      nextButtonEl.style.opacity = 1;
      //4.restore tagline
      setValue(taglineEl,`Pick an option below!`);
    });
  }

  //change text function
  const setValue = (elem, value) => {
    elem.innerHTML = value
  }

  //render question
  const renderQuestion = _ => {
    const question = quiz.getCurrentQuestion().question;
    setValue(quizQuestionEl, question);

  }


  //render the choices
  const renderChoicesElements = _ => {
    let markup = "";
    const currentChoices = quiz.getCurrentQuestion().choices;
    currentChoices.forEach((elem, index) => {
      markup += `
        <li class="jabquiz__choice">
          <input type="radio" name="choice" class="jabquiz__input" data-order="${index}" id="choice${index}">
          <label for="choice${index}" class="jabquiz__label">
            <i></i>
            <span>${elem}<span>
          </label>
        </li>
      `
    });

    setValue(choicesEl, markup);
  }

  //render tracker
  const renderTracker = _ => {
    const index = quiz.currentIndex;
    setValue(trackerEl, `${index + 1} of ${quiz.questions.length}`);
  }

  //render end screen
  const renderEndScreen = _ => {
    setValue(quizQuestionEl, `Great Job`);
    setValue(taglineEl, `Complete`);
    setValue(trackerEl, `Your score: ${getPercentage(quiz.score, quiz.questions.length)}%`);
    nextButtonEl.style.opacity = 0;
    renderProgress();
  }

  //render progress, get percentage, and launch
  const getPercentage = (num1, num2) => {
    return Math.floor((num1/num2) * 100);
  }
  
  const launch = (width, maxPercent) => {
    let loadingBar = setInterval(function () {
      if(width > maxPercent){
        clearInterval(loadingBar);
      }else{
        width++;
        progressInnerEl.style.width = width + "%";
      }
    }, 3)
  }

  const renderProgress = _ => {
    //1. width
    const currentWidth = getPercentage(quiz.currentIndex, quiz.questions.length);
    //2. launch(0, width)
    launch(0, currentWidth);
  }



  //render UI's
  const renderAll = _ => {
    if (quiz.hasEnded()) {
      //render end screen
      renderEndScreen();
    } else {
      //1. render the questions
      renderQuestion();
      //2. render the choices elements
      renderChoicesElements();
      //3. render tracker
      renderTracker();
      //4. render progress
      renderProgress();
    }
  }

  return{
    renderAll : renderAll,
    listeners: listeners
  }
})();

App.renderAll();
App.listeners();