import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import App from '../components/App/App';

describe('tictactoe game before login', () => {
  let byId;

  beforeEach(() => {
    const { getByTestId } = render(<App />);
    byId = getByTestId;
  })

  afterEach(() => {
    byId = null;
  })

  it('click to cell 5 and check current player with players', () => {
    const player = byId('player');
    const input1 = byId('name1');
    const input2 = byId('name2');
    const startGame = byId('startGame');

    fireEvent.change(input1, { target: { value: 'Player1' } })
    fireEvent.change(input2, { target: { value: 'Player2' } })
    fireEvent.click(startGame, { bubbles: true });
    fireEvent.click(byId('5'), { bubbles: true });

    expect(byId('5').textContent).toBe('X');
    expect(player.textContent).toBe('Current player: O');
  });

  it('try start game with one player and without players', () => {
    const player = byId('player');
    const input1 = byId('name1');
    const input2 = byId('name2');
    const startGame = byId('startGame');

    fireEvent.click(byId('5'), { bubbles: true });
    expect(byId('5').textContent).toBe('');
    expect(player.textContent).toBe('Current player: X');

    fireEvent.change(input1, { target: { value: 'Player1' } });
    fireEvent.click(startGame, { bubbles: true });
    fireEvent.click(byId('5'), { bubbles: true });
    expect(byId('5').textContent).toBe('');
    expect(player.textContent).toBe('Current player: X');

    fireEvent.change(input2, { target: { value: 'Player2' } });
    fireEvent.click(startGame, { bubbles: true });
    fireEvent.click(byId('5'), { bubbles: true });
    expect(byId('5').textContent).toBe('X');
    expect(player.textContent).toBe('Current player: O');
  });

})

describe('tictactoe game after login', () => {

  let byId;
  let app;
  let queryById;

  beforeEach(() => {
    const { container, getByTestId, queryByTestId } = render(<App />);
    app = container;
    byId = getByTestId;
    queryById = queryByTestId;
    const input1 = byId('name1');
    const input2 = byId('name2');
    const startGame = byId('startGame');

    fireEvent.change(input1, { target: { value: 'Player1' } })
    fireEvent.change(input2, { target: { value: 'Player2' } })
    fireEvent.click(startGame, { bubbles: true });
  })

  afterEach(() => {
    app = null;
    byId = null;
    queryById = null;
  })

  it('render app', () => {
    expect(app).toBeDefined();
    expect(queryById('stop')).toBeNull();

    for(let i = 1; i < 9; i += 1) {
      expect(byId(String(i)).textContent).toBe('');
    }
  });

  it('check current player', () => {
    const player = byId('player')
    expect(player.textContent).toBe('Current player: X');
  });

  it('click to cell 5 and check current player', () => {
    const player = byId('player');
    fireEvent.click(byId('5'), { bubbles: true });

    expect(byId('5').textContent).toBe('X');
    expect(player.textContent).toBe('Current player: O');
  });

  it('double click to one cell', () => {
    fireEvent.click(byId('1'), { bubbles: true });
    fireEvent.click(byId('1'), { bubbles: true });

    expect(byId('1').textContent).toBe('X');
  });

  it('check win X', () => {
    fireEvent.click(byId('1'), { bubbles: true });
    fireEvent.click(byId('2'), { bubbles: true });
    fireEvent.click(byId('5'), { bubbles: true });
    fireEvent.click(byId('6'), { bubbles: true });
    fireEvent.click(byId('9'), { bubbles: true });

    expect(byId('stop').textContent).toBe('Player1 won this game');
    expect(byId('resetBtn')).toBeDefined();
  });

  it('check win X 2', () => {
    fireEvent.click(byId('1'), { bubbles: true });
    fireEvent.click(byId('2'), { bubbles: true });
    fireEvent.click(byId('3'), { bubbles: true });
    fireEvent.click(byId('4'), { bubbles: true });
    fireEvent.click(byId('5'), { bubbles: true });
    fireEvent.click(byId('6'), { bubbles: true });
    fireEvent.click(byId('7'), { bubbles: true });

    expect(byId('stop').textContent).toBe('Player1 won this game');
    expect(byId('resetBtn')).toBeDefined();
  });

  it('check win O', () => {
    fireEvent.click(byId('1'), { bubbles: true });
    fireEvent.click(byId('2'), { bubbles: true });
    fireEvent.click(byId('4'), { bubbles: true });
    fireEvent.click(byId('5'), { bubbles: true });
    fireEvent.click(byId('6'), { bubbles: true });
    fireEvent.click(byId('8'), { bubbles: true });

    expect(byId('stop').textContent).toBe('Player2 won this game');
    expect(byId('resetBtn')).toBeDefined();
  });

  it('check win O 2', () => {
    fireEvent.click(byId('1'), { bubbles: true });
    fireEvent.click(byId('3'), { bubbles: true });
    fireEvent.click(byId('5'), { bubbles: true });
    fireEvent.click(byId('6'), { bubbles: true });
    fireEvent.click(byId('7'), { bubbles: true });
    fireEvent.click(byId('9'), { bubbles: true });

    expect(byId('stop').textContent).toBe('Player2 won this game');
    expect(byId('resetBtn')).toBeDefined();
  });

  it('click after win', () => {
    fireEvent.click(byId('1'), { bubbles: true });
    fireEvent.click(byId('2'), { bubbles: true });
    fireEvent.click(byId('4'), { bubbles: true });
    fireEvent.click(byId('5'), { bubbles: true });
    fireEvent.click(byId('6'), { bubbles: true });
    fireEvent.click(byId('8'), { bubbles: true });
    fireEvent.click(byId('9'), { bubbles: true });

    expect(byId('9').textContent).toBe('');
  });

  it('nobody won', () => {
    fireEvent.click(byId('6'), { bubbles: true });
    fireEvent.click(byId('3'), { bubbles: true });
    fireEvent.click(byId('7'), { bubbles: true });
    fireEvent.click(byId('4'), { bubbles: true });
    fireEvent.click(byId('1'), { bubbles: true });
    fireEvent.click(byId('2'), { bubbles: true });
    fireEvent.click(byId('5'), { bubbles: true });
    fireEvent.click(byId('9'), { bubbles: true });
    fireEvent.click(byId('8'), { bubbles: true });

    expect(byId('stop').textContent).toBe('Nobody won');
    expect(byId('resetBtn')).toBeDefined();
  });

  it('click reset', () => {
    fireEvent.click(byId('1'), { bubbles: true });
    fireEvent.click(byId('3'), { bubbles: true });
    fireEvent.click(byId('8'), { bubbles: true });
    fireEvent.click(byId('6'), { bubbles: true });
    fireEvent.click(byId('4'), { bubbles: true });
    fireEvent.click(byId('7'), { bubbles: true });
    fireEvent.click(byId('2'), { bubbles: true });
    fireEvent.click(byId('5'), { bubbles: true });
    fireEvent.click(byId('9'), { bubbles: true });

    fireEvent.click(byId('resetBtn'), { bubbles: true });

    for(let i = 1; i < 9; i += 1) {
      expect(byId(String(i)).textContent).toBe('');
    }
  });
  
});