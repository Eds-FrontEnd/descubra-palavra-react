
import './App.css'

//React
import { useCallback, useEffect, useState } from 'react'

//Data
import { wordsList } from './data/Words'

//Components
import StartScreen from './components/StartScreen'
import Game from './components/Game'
import End from './components/End'

const stages = [
  {id: 1, name:"start"},
  {id: 2, name:"game"},
  {id: 3, name:"end"},
];

const guessesQty = 3;

function App() {
  const [gameState, setGameStage] = useState(stages[0].name);
  const [words] = useState(wordsList);
  const [pickedWord, setPickedWord] = useState("");
  const [pickedCategory, setPickedCategory] = useState("");
  const [letters, setLetters] = useState([]);
  const [guessedLetters, setGuessedLetters] = useState([]); 
  const [wrongLetters, setWrongLetters] = useState([]);
  const [guesses, setGuesses] = useState(guessesQty);
  const [score, setScore] = useState(0);

  const pickWordAndCategory = useCallback(() => {
    //Pick category random
    const categories = Object.keys(words);
    const category = categories[Math.floor(Math.random() * Object.keys(categories).length)];
    //console.log (category);

    //Pick a random word
    const word = words[category][Math.floor(Math.random() * words[category].length)];
    //console.log(word);

    return { word, category };
    
  }, [words]);

  // Start Game
  const startGame = useCallback(() => {
    
    //pick word an pick category
    const { word, category } = pickWordAndCategory();

    //Create an array of letters
    let wordLetters = word.split("");
    wordLetters = wordLetters.map((i) => i.toLowerCase());
    console.log(wordLetters);

    console.log(word, category);

    //Fill States
    setPickedWord(word);
    setPickedCategory(category);
    setLetters(wordLetters);

    setGameStage(stages[1].name);
    clearLetterStates();

  }, [pickWordAndCategory]);

  //Process Words
  const verifyLetter = (letter) => {
    const normalizedLetter = letter.toLowerCase();
  
    // Verifica se a letra já foi adivinhada ou errada
    if (guessedLetters.includes(normalizedLetter) || wrongLetters.includes(normalizedLetter)) {
      return;
    }
  
    if (letters.includes(normalizedLetter)) {
      setGuessedLetters((actualGuessedletters) => [
        ...actualGuessedletters,
        normalizedLetter, // Adiciona a letra adivinhada
      ]);
    } else {
      setWrongLetters((actualWrongLetters) => [
        ...actualWrongLetters,
        normalizedLetter, // Adiciona a letra errada
      ]);
      
      // Decrementa as tentativas restantes
      setGuesses((prevGuesses) => prevGuesses - 1); 
    }
  };
  
  const clearLetterStates = () => {
    setGuessedLetters([]);  // Limpa o array de letras adivinhadas
    setWrongLetters([]);    // Limpa o array de letras erradas
  };
  
    //Monitorando essa condição de guesses se chegar a 0 tem 3
    useEffect(() => {
      if (guesses <= 0) {
        clearLetterStates();  // Limpa as letras quando as tentativas acabarem
        setGameStage(stages[2].name);  // Muda para a tela de "fim"
      }
    }, [guesses]);

    useEffect(() => {

      const uniqueLetters = [... new Set(letters)];
 
      if(guessedLetters.length == uniqueLetters.length){
        setScore((actualScore) => actualScore += 100);
        startGame();
      }

    },[guessedLetters, letters, startGame])
    

  //Restart game
  const retry = () => {
    setScore(0);
    setGuesses(guessesQty);
    setGameStage(stages[0].name);
  }

  return (
    <div className='App'>
      {gameState === 'start' && <StartScreen startGame={startGame} />}
      {gameState === 'game' && <Game verifyLetter={verifyLetter} pickedWord={pickedWord} pickedCategory={pickedCategory} letters={letters} 
      guessedLetters={guessedLetters} wrongLetters={wrongLetters} guesses={guesses} score={score} />}
      {gameState === 'end' && <End retry={retry} score={score} />}
    </div>
  )
}

export default App
