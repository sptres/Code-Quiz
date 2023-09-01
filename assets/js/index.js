// variables to set quiz state
var questionIndex = 0;
var time = questions.length * 10;
var timerId;

// set variables that referneces the id from html elements
var questionsEl = document.getElementById('questions');
var timerEl = document.getElementById('time');
var choicesEl = document.getElementById('choices');
var initialsEl = document.getElementById('initials');
var gradingEl = document.getElementById('grading');
var startBtn = document.getElementById('start');
var submitBtn = document.getElementById('submit');

// creates a function to start quiz
function startQuiz() {
    // hide the start page
    var startPageEl = document.getElementById('start-page');
    startPageEl.setAttribute('class', 'hidden');

    // unhide the questions that were hidden orignially
    questionsEl.removeAttribute('class');

    // call timer function to start timer
    timerId = setInterval(timer, 1000);

    // show the starting time
    timerEl.textContent = time;

    // calls getQuestion function to get new question
    getQuestion();
}

function getQuestion() {
    var question = questions[questionIndex];

    var questionEl = document.getElementById('question');
    questionEl.textContent = question.title;

    choicesEl.innerHTML = '';

    for (var i = 0; i < question.choices.length; i++) {
        var choice = question.choices[i];
        var chosen = document.createElement('button');
        chosen.setAttribute('class', 'choice');
        chosen.setAttribute('value', choice);

        chosen.textContent = i + 1 + '. ' + choice;

        choicesEl.appendChild(chosen);
    }
}

function submitChoice(event) {
    // creates buttonEl variable to get the target input
    var buttonEl = event.target;

    //if the clicked element isn't choice, return
    if (!buttonEl.matches('.choice')) {
        return;
    }

    if (buttonEl.value !== questions[questionIndex].answer) {
        //reduce time upon wrong answer
        time -= 10;

        // sets a limit so if timer goes < 0 set it to 0
        if (time < 0) {
            time = 0;
        }

        // display updated time
        timerEl.textContent = time;

        // display 
        gradingEl.textContent = 'Incorrect!';
    } else {
        gradingEl.textContent = 'Correct!';
    }

    // show grading element on page and then hide after timeout
    gradingEl.setAttribute('class', 'grading');
    setTimeout(function () {
        gradingEl.setAttribute('class', 'grading hidden');
    }, 1000);

    // calls next questions
    questionIndex++;

    // if all questions have been answered, end quiz. if not keep getting question
    if (time <= 0 || questionIndex === questions.length) {
        endQuiz();
    } else {
        getQuestion();
    }
}

function endQuiz () {
    // stop timer
    clearInterval(timerId);

    // unhide the end-page
    var endPageEl = document.getElementById('end-page');
    endPageEl.removeAttribute('class');

    // show final score
    var finalScoreEl = document.getElementById('final-score');
    finalScoreEl.textContent = time;

    // hide the questions
    questionsEl.setAttribute('class', 'hide');
}

// creates a function so that timer works
function timer() {
    // update time in timer 
    time--;
    timerEl.textContent = time;

    // if there is no time left, call stopQuiz function to stop quiz
    if(time <= 0) {
        endQuiz();
    }
}

function saveScore() {
    // get value of initials text input
    var initials = initialsEl.value.trim();

    // verify the value isn't empty
    if (initials !== '') {
        // get scores from local storage, if there isn't any set the array empty
        var scores = JSON.parse(window.localStorage.getItem('scores')) || [];
        
        // create new score object for new user
        var newScore = {
            score: time,
            initials: initials,
        };

        // push new score into scores and save it to local storage
        scores.push(newScore);
        window.localStorage.setItem('scores', JSON.stringify(scores));

        // redirect to scores page
        window.location.href = 'score.html';
    }
}

// function to check for enter key and then call save score function
// add a event listener to the function so it only takes it when enter key is pressed
function submitScore(event) {
    if (event.key === 'Enter') {
        saveScore();
    }
}

// submit initials button save scores
submitBtn.onclick = saveScore;

// start buttton starts quiz
startBtn.onclick = startQuiz;

// user clicks on choice that triggers submitChoice function
choicesEl.onclick = submitChoice;

// submitting initials entered to trigger submitScore
initialsEl.onkeyup = submitScore;