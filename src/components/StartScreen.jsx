import React from 'react';
import './StartScreen.css';

const StartScreen = ({startGame}) => {
  return (
    <div>
      <h1>Descubra a Palavra-Secreta</h1>
      <p>Clique no botão abaixo para começar o jogo</p>
      <button onClick={startGame}>Start</button>
    </div>
  );
}

export default StartScreen;
