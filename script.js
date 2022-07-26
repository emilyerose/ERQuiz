var bigText = document.querySelector('.bigText');
var smallText = document.querySelector('.smallText');
var timer = document.querySelector('.timer');
var startButton = document.querySelector('.startBtn');
var scoresButton = document.querySelector('.viewScores'); //this isnt technically a button but it will act like one

//form created elements are going here so that they can be referenced (ie not null) later
var formEl = document.createElement('form');
var label = document.createElement('label');
var textBox = document.createElement('input');
var submitBtn = document.createElement('button');

var quizArr = [{
    question: 'How do you link a JavaScript file called script.js in your HTML?',
    answerSet: ['<script href="script.js">','<link href="script.js">', '<script src="script.js">', '<link src="script.js">'],
    correctIndex: 2
}, {
    question: 'Which of these is not a JavaScript method that runs on an HTML element?',
    answerSet: ['setStyleAttribute','addEventListener', 'append', 'remove'],
    correctIndex: 0
}, {question: 'Which of the following is NOT a JavaScript class?',
answerSet: ['string','undefined','float','null','boolean'],
correctIndex: 2}
];

var questionObj = {
    question: 'Which of the following is NOT a JavaScript class?',
    answerSet: ['string','undefined','float','null','boolean'],
    correctIndex: 2
};
var timeLeft = 0;

document.addEventListener('click', function (event) {
    if (event.target.matches('.viewScores')){
        seeHighScores()
    };
})

startButton.addEventListener('click', function () {
    startGame();
})

function startGame() {
    //first, make the game description and start button go away
    smallText.style.display = 'none';
    startButton.style.display = 'none';
    timeLeft = 60;
    timer.textContent= timeLeft;
    let q = getQ() //where q is the questionObj and getQ grabs that object, in whatever form we choose to do so
    //if there are no questions left, end the game
    if (!q) {
        clearInterval(countdownTimer);
        endGame(timeLeft);
    };
    //render the question
    renderQuestion(q);
    //timer
    countdownTimer = setInterval(function () {
        timeLeft = timeLeft - 1;
        timer.textContent = timeLeft;
        // game over if countdown reaches 0
        if (timeLeft <= 0) {
            clearInterval(countdownTimer);
            timeLeft = 0;
          endGame(0); //do all the things you need to do when the game ends. this might not actually end up staying in a funciton
        }
      }, 1000);

      //listen for clicks to list items
      document.addEventListener('click', function (event) {
        if (!countdownTimer) {return}; //checks to see whether the game is running. if not, do nothing
        //did we click one of the options? then do something.
        if (event.target.matches('li')) { 
            //render the next question if we have any remaining (gotta add an if for that)
            q=getQ();
            renderQuestion(q);
            var selectedOption = event.target.getAttribute('data-index');
            var answer = document.querySelector('.answer');
            //perform actions based on whether we answered right or wrong
            if (selectedOption != q.correctIndex) {
                timeLeft=timeLeft-10;
                answer.textContent ='---Wrong!---'
            }
            else {
                answer.textContent = '---Correct!---'
            }
        }
    })
}

function renderQuestion(qObj) {
    //set the header text to the question 
    bigText.textContent = qObj.question;
    let olEl = document.createElement("ol");
    olEl.setAttribute('type','A');
    let liEl;
    bigText.append(olEl);
    //we've added the ol element, now add all the list items (answer options)
    for (let x=0; x<qObj.answerSet.length; x++) {
        liEl = document.createElement("li");
        liEl.textContent = qObj.answerSet[x];
        liEl.setAttribute('class','listItem');
        liEl.setAttribute('data-index',x);
        liEl.style.cursor = 'pointer';
        olEl.appendChild(liEl);
    }
    //add an element to (later, if this is the first question) show whether your answer was right. by default, this is empty
    var answer = document.createElement("p");
    answer.setAttribute('class','answer');
    document.querySelector('main').lastElementChild.append(answer)
}

function getQ() {
    return questionObj;
}

function endGame(timeRemaining) {
    //get rid of the right/wrong line:
    document.querySelector('.answer').textContent='';

    //display text
    bigText.textContent = "You finished the quiz!";
    smallText.textContent = "Your final score was " + timeRemaining + "."
    smallText.style.display = '';

    //make form
    formEl.style.textAlign='center';
    label.textContent = "Add your initials: ";
    textBox.setAttribute('maxlength',8);
    textBox.setAttribute('required',true);
    textBox.setAttribute('name','initials');
    submitBtn.textContent = "Submit!"
    smallText.insertAdjacentElement('afterend',formEl)
    formEl.appendChild(label);
    label.appendChild(textBox)
    label.appendChild(submitBtn)

    formEl.addEventListener('submit', function (event) {
        event.preventDefault()
        var initials = textBox.value; 
        initials=initials.toUpperCase();
        //deals with the score
        addScore(initials,timeRemaining);
    })
}

function addScore(initials,score) {
    let scoresToSave=[]; //scores array to be saved
    let initialsToSave=[]; //initials array to be saved
    let scoreIndex=0; //index of high score, defaults to 0
    //get the initials and scores arrays
    let savedInitials= JSON.parse(localStorage.getItem('names'))
    let savedScores=JSON.parse(localStorage.getItem('scores'));
    //if there are no scores saved
    if (!savedScores) {
        //add a scores and names array to localstorage with the current initials and score
        scoresToSave=[score];
        initialsToSave=[initials];
    }
    //otherwise, if there are scores saved:
    else {
        for (let i=0; i<savedScores.length;i++) {
            if (score > savedScores[i]){
                //add the score and initials to the proper place in their arrays
                savedScores.splice(i,0,score);
                scoresToSave=savedScores;
                savedInitials.splice(i,0,initials);
                initialsToSave=savedInitials;
                scoreIndex = i;
            }
            break;
        }
        //if the score is lower than all other scores
        savedScores.push(score);
        scoresToSave=savedScores;
        savedInitials.push(initials);
        initialsToSave= savedInitials;
        scoreIndex = savedScores.length-1;
    }
    //save the new scores and initials arrays to local storage
    localStorage.setItem('scores',JSON.stringify(scoresToSave));
    localStorage.setItem('names',JSON.stringify(initialsToSave));

    //render highscores page
    seeHighScores(scoreIndex);
}

function seeHighScores(index) { //index is an optional parameter here representing the index of the new score
    formEl.remove();
    bigText.textContent = 'High Scores';
    smallText.textContent = '';
    let olEl = document.createElement("ol");
    let liEl;
    bigText.append(olEl);
    //get scores and initials from local storage
    let savedScores=JSON.parse(localStorage.getItem('scores'));
    let savedInitials=JSON.parse(localStorage.getItem('names'));
    //we've added the ol element, now add all the list items (high scores)
    for (let x=0; x<savedScores.length; x++) {
        liEl = document.createElement("li");
        liEl.textContent = savedInitials[x] + ':  ' + savedScores[x];
        liEl.setAttribute('class','scoreItem');
        olEl.appendChild(liEl);
        //do a little styling for your score
        if (index && x===index) {
            liEl.style.backgroundColor = 'rgb(132,112,255)';
        }
    }
    //display play again and clear scores buttons
    let buttonDiv = document.createElement('div');
    buttonDiv.setAttribute('class','scoresheetButtons');
    let clearScores = document.createElement('p');
    let playAgain = document.createElement('p');
    clearScores.setAttribute('class','scoresBtn');
    playAgain.setAttribute('class','scoresBtn');
    clearScores.textContent = 'Clear Scores';
    playAgain.textContent = 'Play Again';
    bigText.append(buttonDiv);
    buttonDiv.appendChild(clearScores);
    buttonDiv.appendChild(playAgain);

    playAgain.addEventListener('click', function() {
        olEl.remove();
        startGame();
    })

    clearScores.addEventListener('click', function () {
        localStorage.clear();
        olEl.remove();
    })
}


