import React, { useState } from 'react';
import './app.sass';
import uniqueId from 'lodash.uniqueid';

const App = () => {
  const startsSate = [
    ['', '', ''],
    ['', '', ''],
    ['', '', ''],
  ];

  const [names, setName] = useState({ name1: '', name2: '' });
  const [isStart, setStart] = useState(false);
  const [field, setField] = useState(startsSate);
  const [step, setStep] = useState(1);
  const [player, setPlayer] = useState('X');
  const [log, setLog] = useState([]);
  const [gameLog, setGameLog] = useState({ X: [], O: [] });
  const [isStop, setStop] = useState(false);
  const [activeCell, setActiveCell] = useState(null);
  const [winPosition, setWinPosition] = useState(null);

  const cellIndex = {
    0: (cell) => cell,
    1: (cell) => cell + 3,
    2: (cell) => cell + 6,
  };

  const winPositions = {
    1: [0, 1, 2],
    2: [3, 4, 5],
    3: [6, 7, 8],
    4: [0, 3, 6],
    5: [1, 4, 7],
    6: [2, 5, 8],
    7: [0, 4, 8],
    8: [2, 4, 6],
  };

  const handleTapNames = ({ target: { id, value } }) => {
    setName({ ...names, [id]: value });
  };

  const handleStartGame = (isWithPrev = '') => () => {
    if (isWithPrev === 'newGame' && names.name1.length > 0 && names.name2.length > 0) {
      setStart(!isStart);
    }
    if (isWithPrev === 'prev') {
      setStop(false);
      setStart(!isStart);
    }
    if (isWithPrev === 'newPlayers') {
      setName({ name1: '', name2: '' });
      setStop(false);
    }
  };

  const isFinish = (cGameLog, cPlayer) => {
    const maxStep = 9;
    const isStopGame = Object.keys(winPositions)
      .some((key) => cGameLog[cPlayer].length >= winPositions[key].length && winPositions[key]
        .every((n) => cGameLog[cPlayer].includes(n)));
    const position = Object.keys(winPositions)
      .find((key) => cGameLog[cPlayer].length >= winPositions[key].length && winPositions[key]
        .every((n) => cGameLog[cPlayer].includes(n)));
    if (step === maxStep) {
      setStop('nobody');
    }
    if (isStopGame) {
      setWinPosition(position);
      setStop('stop');
    }
  };

  const handleSetValue = ({ target }) => {
    const cField = field;
    if (target.textContent !== '' || isStop || !isStart) {
      return;
    }
    const c = target.cellIndex;
    const r = target.closest('tr').rowIndex;
    cField[r][c] = player;
    setField(cField);
    setStep(step + 1);
    setPlayer(player === 'X' ? 'O' : 'X');
    setLog([...log, { s: step, p: player, cell: cellIndex[r](c) + 1 }]);

    const updatedGameLog = { ...gameLog, [player]: [...gameLog[player], cellIndex[r](c)] };
    setGameLog(updatedGameLog);
    isFinish(updatedGameLog, player);
  };

  const handleResetGame = (e) => {
    e.preventDefault();
    setStart(false);
    setField(startsSate);
    setStep(1);
    setPlayer('X');
    setLog([]);
    setGameLog({ X: [], O: [] });
    setWinPosition(null);
  };

  const handleMouseEnter = (c) => () => {
    setActiveCell(Number(c));
  };

  const handleMouseLeave = () => {
    setActiveCell(null);
  };

  const createLine = (pos) => {
    if (pos <= 3) { return (<div className={`line line_horisontal line_${pos}`} />); }
    if (pos <= 6) { return (<div className={`line line_vertical line_${pos}`} />); }
    return (<div className={`line line_diagonal line_${pos}`} />);
  };

  let i = 0;
  return (
    <>
      <h1>Tic tac toe</h1>
      <div className="container">
        {!isStop && (
        <div className="current-player" data-testid="player">
          Current player:
          {' '}
          <b>{ player }</b>
        </div>
        )}
        {isStop === 'stop' && (
        <div className="finish_show" data-testid="stop">
          <b>{step % 2 === 0 ? names.name1 : names.name2}</b>
          {' '}
          won this game
        </div>
        )}
        {isStop === 'nobody' && <div className="finish_show" data-testid="stop">Nobody won</div>}
        <div className="field">
          <table>
            <tbody>
              {
                field.map((r) => (
                  <tr key={uniqueId()}>
                    {
                        r.map((c) => {
                          i += 1;
                          return (
                            <td
                              className={activeCell === i ? 'active-cell' : ''}
                              key={uniqueId()}
                              onClick={handleSetValue}
                              onKeyPress={() => {}}
                              data-testid={i}
                            >
                              { c }
                            </td>
                          );
                        })
                      }
                  </tr>
                ))
              }
            </tbody>
          </table>
          {
            isStop && isStop !== 'nobody' && log.length > 0 && createLine(winPosition)
          }
        </div>
        <div className="stats">
          <div className="log">
            <table>
              <tbody>
                <tr>
                  <th colSpan="3">Player X</th>
                  <th colSpan="3">Player O</th>
                </tr>
                <tr>
                  <th colSpan="3">{names.name1}</th>
                  <th colSpan="3">{names.name2}</th>
                </tr>
                <tr>
                  <th colSpan="2">Step</th>
                  <th colSpan="2">Player</th>
                  <th colSpan="2">Cell</th>
                </tr>
                {
                log.map(({ s, p, cell }) => (
                  <tr
                    key={uniqueId()}
                    onMouseEnter={handleMouseEnter(cell)}
                    onMouseLeave={handleMouseLeave}
                  >
                    <td colSpan="2">{s}</td>
                    <td colSpan="2">{p === 'X' ? `${names.name1} (${s})` : `${names.name2} (${p})`}</td>
                    <td colSpan="2">{cell}</td>
                  </tr>
                ))
              }
              </tbody>
            </table>
          </div>
        </div>
      </div>
      {
        isStop
        && (
        <button
          type="button"
          className="resetBtn"
          data-testid="resetBtn"
          onClick={handleResetGame}
        >
          Start again
        </button>
        )
      }
      {
        !isStart
        && (
        <div className="popup">
          {
            !isStop ? (
              <div className="popup__container">
                <h2 className="popup__title">Please, tap your names!</h2>
                <input
                  type="text"
                  id="name1"
                  className="popup__input"
                  data-testid="name1"
                  placeholder="Player 1 (X)"
                  onChange={handleTapNames}
                  value={names.name1}
                />
                <input
                  type="text"
                  id="name2"
                  className="popup__input"
                  data-testid="name2"
                  placeholder="Player 2 (O)"
                  onChange={handleTapNames}
                  value={names.name2}
                />
                <button
                  type="button"
                  className="popup__start-game"
                  onClick={handleStartGame('newGame')}
                  data-testid="startGame"
                >
                  Let`s start!
                </button>
              </div>
            ) : (
              <div className="popup__container">
                <button
                  type="button"
                  className="popup__start-game"
                  onClick={handleStartGame('newPlayers')}
                  data-testid="startGame"
                >
                  Start with new Players!
                </button>
                <button
                  type="button"
                  className="popup__start-game"
                  onClick={handleStartGame('prev')}
                  data-testid="startGame"
                >
                  Start with prev Players!
                </button>
              </div>
            )
          }
        </div>
        )
      }
    </>
  );
};

export default App;
