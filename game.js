//To be honest, I didnt fully write *this* page's code myself. Idk js, so tried the generate code option with my own java hangman code. HOWEVER, I will not keep any code in here unless I can reverse engineer it and understand it, cuz mama didn't raise no vibe coder. I just learn better this way. Thank you for coming to my ted talk.
const words = [
  'software', 'christian', 'programming', 'developer', 'pink', 'dallas', 'inkspire', 'straykids', 'internship', 'art', 'utdallas', 'swift', 'java', 'coffee', 'comet', 'whoosh', 'newjeans', 'ecs', 'temoc', 'tobor'
]
//maybe like a hashmap with hints to be displayed, still need to figure how to incorporate that in tho -- UPDATE: We got it!! it now can display hints
const wordshints = {
  'software': 'My field of study.', 'christian': 'My religion.', 'programming': 'A verb regularly done by developers.', 'developer': 'Synonym of creator', 'pink': 'My obviously favorite color.', 'dallas': 'Where I am based out of right now.', 'inkspire': 'The graphic design company I interned for', 'straykids': 'My number one favorite group. Synonymous with homeless children. PS. two words without a space.', 'internship': 'A paid or unpaid temporary position often offered to students in a company or startup.', 'art': 'My second main hobby.', 'utdallas': "Where I am going to pursue my education. PS. first two words abbreviated AND no spaces in between.", 'swift': "Apple's coding language", 'java': 'A coding language named like a coffee type.','coffee': 'A caffeinated beverage I cant live without.', 'comet': 'Name of a student at my college', 'whoosh': 'The sound a comet makes and the traditional salute at UTD.', 'newjeans': 'The girl group under ADOR entertainment which has unfortunately lost a member.', "ecs": 'The abbreviation of the buildings in my college for my designated major.', 'temoc': 'The main mascot for UTD. Related to "comet".', 'tobor': 'The secondary mascot for UTD. Launched in 2019, was the remote delivery mode for food, now replaced with AVRIDE.'
};

let currentWord = '';
let guessedLetters = [];
let correctLetters = [];
let attemptCount = 7;
let score = 0;
let totalGames = 0;
let gameOver = false;
let currentHint= '';

const hangmanStages = [
  `
    ------
    |    |
    |
    |
    |
    |
    --------`,
  `
    ------
    |    |
    |    O
    |
    |
    |
    --------`,
  `
    ------
    |    |
    |    O
    |    |
    |
    |
    --------`,
  `
    ------
    |    |
    |    O
    |   /|
    |
    |
    --------`,
  `
    ------
    |    |
    |    O
    |   /|\\
    |
    |
    --------`,
  `
    ------
    |    |
    |    O
    |   /|\\
    |   /
    |
    --------`,
  `
    ------
    |    |
    |    O
    |   /|\\
    |   / \\
    |
    --------`,
  `
    ------
    |    |
    |    O
    |   /|\\
    |   / \\
    |  DEAD
    --------`
];

function initGame() {
  currentWord = words[Math.floor(Math.random() * words.length)];
  guessedLetters = [];
  correctLetters = [];
  attemptCount = 7;
  gameOver = false;
  totalGames++;
  currentHint = "";
  render();
}

function displayWord() {
  return currentWord
    .split('')
    .map(letter => (correctLetters.includes(letter) ? letter : '_'))
    .join(' ');
}

function guessLetter(letter) {
  letter = letter.toLowerCase();
  
  if (gameOver || guessedLetters.includes(letter)) return;
  
  guessedLetters.push(letter);
  
  if (currentWord.includes(letter)) {
    correctLetters.push(letter);
    if (displayWord().indexOf('_') === -1) {
      gameOver = true;
      score++;
    }
  } else {
    attemptCount--;
    if (attemptCount === 0) {
      gameOver = true;
    }
  }
  
  render();
}

function guessWord(word) {
  if (gameOver) return;
  
  if (word.toLowerCase() === currentWord) {
    correctLetters = currentWord.split('');
    gameOver = true;
    score++;
  } else {
    attemptCount--;
    if (attemptCount === 0) {
      gameOver = true;
    }
  }
  
  render();
}

function getHint(word){
  currentHint = wordshints[currentWord];
  render();
}

function render() {
  const container = document.getElementById('game-container');
  
  container.innerHTML = `
    <div class="hangman-container">
      <h1> HANGMAN </h1>
      
      <div class="game-stats">
        <div class="stat">Score: <span>${score}/${totalGames}</span></div>
        <div class="stat">Attempts Left: <span class="attempts">${attemptCount}</span></div>
      </div>
      
      <pre class="hangman-drawing">${hangmanStages[7 - attemptCount]}</pre>
      
      <div class="word-display">
        <h2>${displayWord()}</h2>
      </div>
      
      <div class="guessed-letters">
        <p><strong>Guessed Letters:</strong></p>
        <div class="letters-grid">
          ${guessedLetters.map(l => `<span class="letter">${l}</span>`).join('')}
        </div>
      </div>
      
      <div class="controls">
        <input 
        type="text" 
        id="letter-input" 
        placeholder="Guess a letter..." 
        maxlength="1" 
        ${gameOver ? 'disabled' : ''} 
        onkeypress="if(event.key==='Enter'){
          guessLetter(this.value); 
          this.value='';}
          ">
          
        <button onclick="
        guessLetter(document.getElementById('letter-input').value);
        document.getElementById('letter-input').value='';
        document.getElementById('letter-input').focus();
        ">
        Guess Letter</button>
      </div>


      
      <div class="word-guess">
        <input
          type="text"
          id="word-input"
          placeholder="Guess the word..."
          ${gameOver ? 'disabled' : ''}
          onkeypress="if(event.key==='Enter'){
            guessWord(this.value);
            this.value='';
            }">

        <button onclick="
          guessWord(document.getElementById('word-input').value);
          document.getElementById('word-input').value='';
          document.getElementById('word-input').focus();
        ">
          Guess Word
        </button>
      </div>

      <div class="hint">
        <button onclick="
        getHint(currentWord)
        ">
        Hint?
        </button>
        ${currentHint ? `<p>${currentHint}</p>` : ""}

      </div>
      
      ${gameOver ? `
        <div class="game-end">
          <h2>${attemptCount === 0 ? ' GAME OVER! Play again?' : ' YOU WON! '}</h2>
          <p>The word was: <strong>${currentWord}</strong></p>
          <button onclick="initGame()">Next Word</button>
        </div>
      ` : ''}
    </div>
  `;
  
  if (!gameOver) {
    document.getElementById('letter-input').focus();
  }
}

// Initialize game on load
document.addEventListener('DOMContentLoaded', initGame);
