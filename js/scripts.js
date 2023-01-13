window.onload = function() {
  populateQuestions();
  document.getElementById('settings-toggle').onpointerdown = function(e) {
    e.target.classList.toggle('open');
    document.querySelector('menu').classList.toggle('open');
  };
  [...document.getElementsByClassName('toggle')].forEach(function(toggle) {
    toggle.onpointerdown = function(e) {
      e.target.classList.toggle('yes');
    };
  });
  document.querySelector('form > button').onclick = function(e) {
    e.preventDefault();
    tallyScores();
    revealResults();
  }  
  document.getElementById('reset-button').onclick = function(e) {
    resetInputs();
    resetScores();
    revealQuestions();
  }  
}

function populateQuestions() {
  let questionArea = document.getElementById('question-area');
  questions.forEach(function(question, i) {
    let inputHTML;
    if (question.choices) {
      inputHTML = createSelectList(question.choices, i);
    } else {
      inputHTML = createYesNoToggle(i);
    }
    questionArea.innerHTML += `
      <div class="form-row">
        <p>${question.text}</p>
        ${inputHTML}
      </div>
    `;
  });
  document.querySelector('form').classList.remove('hidden');
}

function createSelectList(choiceArray, questionIndex) {
  let newElement = document.createElement("select");
  let newID = `select-${questionIndex}`;
  newElement.id = newID;
  newElement.classList.add('select-list');
  newElement.innerHTML = `<option value="">- Choose one -</option>`;
  choiceArray.forEach(function(choice) {
    newElement.innerHTML += `<option value="${choice}">${choice}</option>`
  });
  return newElement.outerHTML;
}
function createYesNoToggle(questionIndex) {
  return `
    <div id="toggle-${questionIndex}" class="toggle no">
      <div class="toggle-groove"></div>
      <div class="toggle-knob"></div>
    </div> 
  `;
}

function tallyScores() {
  // yes/no
  [...document.getElementsByClassName('toggle')].forEach(function(toggle) {
    let userAnswer = toggle.classList.contains('yes') ? 1 : 0;
    let questionObj = questions[parseInt(toggle.id[toggle.id.length-1])];
    let favoredLanguage = Object.entries(questionObj.scores[userAnswer])[0][0];
    let pointsToAdd = Object.entries(questionObj.scores[userAnswer])[0][1];
    possibleLanguages[favoredLanguage].totalScore += pointsToAdd;
  });
  // multiple choice
  [...document.getElementsByClassName('select-list')].forEach(function(list) {
    let userAnswer = list.value;
    if (userAnswer) {
      let questionObj = questions[parseInt(list.id[list.id.length-1])];
      let answerIndex = questionObj.choices.indexOf(userAnswer);
      let scoreObj = questionObj.scores[answerIndex];
      let favoredLanguage = Object.entries(questionObj.scores[answerIndex])[0][0];
      let pointsToAdd = Object.entries(questionObj.scores[answerIndex])[0][1];
      possibleLanguages[favoredLanguage].totalScore += pointsToAdd;
    }
  });
  console.log('tallied scores:');
  console.table(possibleLanguages);
}

function revealResults() {
  let winner = getWinner();
  let winnerObj = possibleLanguages[winner];
  document.querySelector('#result-image-area').innerHTML = `
    <img src="img/${winner.toLowerCase()}.png">
  `;
  document.querySelector('#results-area > h1').innerText = winnerObj.printName;
  document.getElementById('winning-message').innerHTML = winnerObj.winningMessage;
  document.querySelector('form').style.display = 'none';
  document.getElementById('intro').style.display = 'none';
  document.getElementById('results-area').classList.remove('hidden');
}
function revealQuestions() {
  document.querySelector('form').style.display = 'flex';
  document.getElementById('intro').style.display = 'block';
  document.getElementById('results-area').classList.add('hidden');
}

function resetInputs() {
  // yes/no
  [...document.getElementsByClassName('toggle')].forEach(function(toggle) {
    toggle.classList.remove('yes');
  });
  // multiple choice
  [...document.getElementsByClassName('select-list')].forEach(function(list) {
    list.selectedIndex = 0;
  });
}

function getWinner() {
  let winner;
  let highScore = 0;
  for (const language in possibleLanguages) {
    const languageObj = possibleLanguages[language];
    if (languageObj.totalScore > highScore) {
      highScore = languageObj.totalScore;
      winner = language;
    }
  }
  return winner;
}

function resetScores() {
  for (const language in possibleLanguages) {
    const languageObj = possibleLanguages[language];
    languageObj.totalScore = 0;
  }
}

const questions = [
  {
    text: "Do you prefer a humid environment?",
    scores: [
      {python: 1}, // no
      {dolphin: 1} // yes
    ]
  },
  {
    text: "Have you ever been bowling?",
    scores: [
      {dolphin: 1}, 
      {js: 1}
    ]
  },
  {
    text: "Do clowns frighten you?",
    scores: [
      {go: 1}, 
      {python: -1}
    ]
  },
  {
    text: "Is a hot dog a sandwich?",
    scores: [
      {js: 1}, 
      {rust: 1}
    ]
  },
  {
    text: "Do you own a vest?",
    scores: [
      {dolphin: 1}, 
      {dolphin: -3}
    ]
  },
  {
    text: "Hummus, falafel, or cashews?",
    choices: ["hummus", "falafel", "cashews"],
    scores: [ // correspond to same index in choices array
      {python: 1}, 
      {rust: 1},
      {js: 1}
    ]
  },
  {
    text: "Would you rather have wings or a jetpack?",
    choices: ["wings", "jetpack", "neither"],
    scores: [
      {rust: 1},
      {go: 1},
      {dolphin: 1},
    ]
  },
  {
    text: "What does the ideal grilled cheese sandwich contain?",
    choices: ["tomato", "onions", "anchovies", "tuna"],
    scores: [
      {go: 1},
      {js: 1},
      {dolphin: 2},
      {rust: 1},
    ]
  },
  {
    text: "Which type of bear is best?",
    choices: ["brown", "grizzly", "polar"],
    scores: [
      {js: 1},
      {go: 1},
      {rust: 1},
    ]
  },
  {
    text: "Select your ideal Sunday evening.",
    choices: ["ice skating", "television", "skiing", "wine tasting", "hunting for fish"],
    scores: [
      {rust: 1},
      {go: 1},
      {python: 1},
      {js: 1},
      {dolphin: 2},
    ]
  },
]

const possibleLanguages = {
  js: {
    printName: "JavaScript",
    winningMessage: `
      You have demonstrated a keen ability to synergize leveraging key value-adds with enterprise opportunities. Because of this, we recommend <strong>JavaScript</strong>.
    `,
    totalScore: 0
  },
  python: {
    printName: "Python",
    winningMessage: `
      Your humility is surpassed only by your competence. For this reason, we have determined that <strong>Python</strong> is the best language for you.
    `,
    totalScore: 0
  },
  rust: {
    printName: "Rust",
    winningMessage: `
      Because you possess the iron will of a steely-gazed outlaw, we would suggest <strong>Rust</strong> as the ideal language for you.
    `,
    totalScore: 0
  },
  go: {
    printName: "Go",
    winningMessage: `
      Due to your plucky and determined spirit, we have decided that <strong>Go</strong> is the best language for you.
    `,
    totalScore: 0
  },
  dolphin: {
    printName: "Dolphin language",
    winningMessage: `
      We have determined that you are a dolphin and therefore best suited to learn <strong>the secret language of the lost kingdom of Dolphinia</strong>.
    `,
    totalScore: 0
  },
}