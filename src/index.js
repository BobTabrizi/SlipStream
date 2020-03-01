import React from "react";
import ReactDOM from "react-dom";

//ReactDOM.render(element, document.getElementById("root"));
function Square(props) {
  return (
    <button className="square" onClick={props.onClick}>
      {props.value}
    </button>
  );
}

class Board extends React.Component {
  renderSquare(i) {
    return <Square value={this.props.squares[i]} />;
  }

  render() {
    let table = [];

    for (let i = 0; i < 7; i++) {
      let children = [];
      for (let j = 0; j < 7; j++) {
        children.push(
          <span key={i * 7 + j}>{this.renderSquare(j + i * 7)}</span>
        );
      }
      table.push(
        <div className="board-row" key={i}>
          {children}
        </div>
      );
    }

    return (
      <div>
        <div className="status">{this.status}</div>
        <div className="board-row">{table}</div>
      </div>
    );
  }
}

class Game extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      history: [
        {
          squares: this.createArray(6, 42)
        }
      ],
      stepNumber: 0,
      PlayerLocation: 42,
      GoalLocation: 6,
      xIsNext: true
    };
  }

  createArray(PlayerLoc, GoalLoc) {
    var arr = [];
    for (let i = 0; i < 64; i++) {
      if (i === PlayerLoc) {
        arr[i] = "G";
        continue;
      }
      if (i === GoalLoc) {
        arr[i] = "P";
        continue;
      }
      arr[i] = null;
    }
    this.createObstacles(3, arr, PlayerLoc, GoalLoc);
    return arr;
  }

  createObstacles(numObstacle, arr, PlayerLoc, GoalLoc) {
    for (let i = 0; i < numObstacle; i++) {
      var location = Math.floor(Math.random() * 48);
      console.log(location);
      console.log(arr[location]);
      if (
        location === GoalLoc ||
        location === PlayerLoc ||
        arr[location] === "X"
      ) {
        i--;
        continue;
      }
      arr[location] = "X";
    }
  }

  handleKeyDown(event) {
    const history = this.state.history.slice(
      0,
      this.state.stepNumber + 1,
      this.state.PlayerLocation + 5,
      this.state.GoalLocation + 5
    );
    //console.log(history.length);
    const current = history[history.length - 1];
    console.log(this.state.PlayerLocation);
    const squares = current.squares.slice();
    let Distance = 0;
    if (event.keyCode === 39) {
      console.log("Right Key");

      Distance = this.movePlayer(6, "Right", squares);
    }
    if (event.keyCode === 37) {
      console.log("Left key");
      Distance = this.movePlayer(-6, "Left", squares);
    }
    if (event.keyCode === 38) {
      console.log("Up Key");
      Distance = this.movePlayer(-42, "Up", squares);
    }
    if (event.keyCode === 40) {
      console.log("Down Key");
      Distance = this.movePlayer(42, squares);
    }

    //if (calculateWinner(squares) || squares[i]) {
    //  return;
    // }
    //squares[34] = "R";

    this.setState({
      history: history.concat([
        {
          squares: squares
        }
      ]),
      stepNumber: history.length,
      PlayerLocation: Distance,
      xIsNext: !this.state.xIsNext
    });
  }

  movePlayer(ShiftFactor, Direction, squares) {
    let Dist = 0;
    let currPos = this.state.PlayerLocation;
    console.log(currPos);
    let blocked = false;
    if (Direction === "Right") {
      for (let i = currPos; i < currPos + 6; i++) {
        if (squares[i] === "X") {
          squares[i - 1] = "P";
          squares[currPos] = null;
          blocked = true;
          Dist++;
          break;
        }
      }
      if (blocked === false) {
        squares[currPos + 6] = "P";
        squares[currPos] = null;
        Dist = Math.abs(6);
      }
    }

    if (Direction === "Up") {
      for (let i = currPos; i > 0; i -= 7) {
        if (squares[i] === "X") {
          squares[i + 7] = "P";
          squares[currPos] = null;
          blocked = true;
          Dist -= 7;
          break;
        }
      }
      if (blocked === false) {
        squares[currPos - 42] = "P";
        squares[currPos] = null;
        Dist = -42;
      }
    }

    Dist = currPos + Dist;
    return Dist;
  }

  jumpTo(step) {
    this.setState({
      stepNumber: step,
      xIsNext: step % 2 === 0
    });
  }
  render() {
    //console.log(this.state.PlayerLocation);

    const history = this.state.history;
    console.log(this.state.stepNumber);
    //console.log(history[this.state.PlayerLocation]);
    const current = history[this.state.stepNumber];
    const winner = calculateWinner(current.squares);

    const moves = history.map((step, move) => {
      const desc = move ? "Go to move #" + move : "Go to Game Start";
      return (
        <li key={move}>
          <button onClick={() => this.jumpTo(move)}> {desc}</button>
        </li>
      );
    });

    let status;
    if (winner) {
      status = "Winner! ";
    } else {
      status = "Game Log: ";
    }

    return (
      <div className="game">
        <div
          className="game-board"
          onKeyDown={event => this.handleKeyDown(event)}
        >
          <Board
            squares={current.squares}
            onKeyDown={event => this.handleKeyDown(event)}
          />
        </div>
        <div className="game-info">
          <div>{status}</div>
          <ol>{moves}</ol>
        </div>
      </div>
    );
  }
}

// ========================================

ReactDOM.render(<Game />, document.getElementById("root"));

function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a];
    }
  }
  return null;
}
