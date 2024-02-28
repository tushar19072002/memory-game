import React, { useState, useEffect } from 'react';
import './Grid.css';

const Grid = () => {
  const [time, setTime] = useState(10);
  const [sequence, setSequence] = useState([]);
  const [userInput, setUserInput] = useState([]);
  const [isUserTurn, setIsUserTurn] = useState(false);
  const [gameResult, setGameResult] = useState(null);

  useEffect(() => {
    
    const initialTimerId = setInterval(() => {
      setTime((prevTime) => {
        if (prevTime === 1) {
          clearInterval(initialTimerId);
          setTimeout(() => {
            setIsUserTurn(true);
            resetGrid();
            startUserTurn();
          }, 3000);
          return 0;
        }
        return prevTime - 1;
      });

      if (sequence.length < 10) {
        const cellIndex = changeRandomCellColor(new Set(sequence));
        setSequence((prevSequence) => [...prevSequence, cellIndex]);
      }
    }, 1000);

    
    return () => clearInterval(initialTimerId);
  }, []);

  
  const startUserTurn = () => {
    setTime(20);
  };

  
  useEffect(() => {
    let userTimerId;

    if (isUserTurn) {
      userTimerId = setInterval(() => {
        setTime((prevTime) => {
          if (prevTime === 0) {
            clearInterval(userTimerId);
            checkGameResult();
            setIsUserTurn(false);
          }
          return prevTime - 1;
        });
      }, 1000);
    } else {
      clearInterval(userTimerId);
    }

    
    return () => clearInterval(userTimerId);
  }, [isUserTurn]);

  
  const changeRandomCellColor = (usedIndices) => {
    const cells = document.querySelectorAll('.cell');
    let randomIndex;
    do {
      randomIndex = Math.floor(Math.random() * cells.length);
    } while (usedIndices.has(randomIndex));
    cells[randomIndex].style.backgroundColor = 'blue';
    return randomIndex; 
  };

  
  const resetGrid = () => {
    const cells = document.querySelectorAll('.cell');
    cells.forEach((cell) => {
      cell.style.backgroundColor = '#ddd';
    });
  };

  
  const handleCellClick = (index) => {
    if (isUserTurn) {
      const newInput = [...userInput, index];
      setUserInput(newInput);

      
      const cells = document.querySelectorAll('.cell');
      cells[index].style.backgroundColor = 'green';

      
      if (newInput.length === sequence.length) {
        checkGameResult();
        setIsUserTurn(false);
      }
    }
  };

  
  const checkGameResult = () => {
    if (JSON.stringify(userInput) === JSON.stringify(sequence)) {
      setGameResult('Congratulations! You got it right!');
    } else {
      setGameResult(`Oops! Incorrect sequence. The correct sequence is: ${sequence.join(', ')}`);
    }
  };

  return (
    <div className="container">
      <div className="grid">
        {[...Array(100)].map((_, index) => (
          <div
            key={index}
            className="cell"
            onClick={() => handleCellClick(index)}
          ></div>
        ))}
      </div>
      <div className="bottom-section">
        <div className="result">{gameResult}</div>
        <div className="timer">{time}</div>
      </div>
    </div>
  );
};

export default Grid;
