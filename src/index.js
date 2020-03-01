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
          <span key={i * 9 + j + 10}>{this.renderSquare(j + i * 9 + 10)}</span>
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
          squares: this.createArray(16, 64)
        }
      ],
      stepNumber: 0,
      PlayerLocation: 64,
      GoalLocation: 16,
      xIsNext: true
    };
  }

  createArray(PlayerLoc, GoalLoc) {
    var arr = [];
    for (let i = 0; i < 82; i++) {
      if (i === PlayerLoc) {
        arr[i] = "G";
        continue;
      }
      if (i === GoalLoc) {
        arr[i] = "P";
        continue;
      }
      if (i < 10 || i > 70 || i % 9 === 0) {
        arr[i] = "";
        continue;
      }

      if (
        i === 8 ||
        i === 17 ||
        i === 26 ||
        i === 35 ||
        i === 44 ||
        i === 53 ||
        i === 62 ||
        i === 71
      ) {
        arr[i] = "";
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
        arr[location] === "X" ||
        arr[location] === ""
      ) {
        i--;
        continue;
      }

      arr[location] = "X";
    }
  }

  handleKeyDown(event) {
    const history = this.state.history.slice(0, this.state.stepNumber + 1);
    //console.log(history.length);
    const current = history[history.length - 1];
    console.log(this.state.PlayerLocation);
    const squares = current.squares.slice();
    let Distance = 0;
    if (event.keyCode === 39) {
      console.log("Right Key");
      for (let i = 0; i < 82; i++) {
        squares[i] = i;
      }
      // Distance = this.movePlayer(6, "Right", squares);
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
    let Moved = false;
    let currPos = this.state.PlayerLocation;
    console.log(currPos);
    let blocked = false;
    if (Direction === "Right") {
      for (let i = currPos; i < currPos + 6; i++) {
        if (squares[i] === "X" || i > 48) {
          squares[currPos] = null;
          squares[i - 1] = "P";
          blocked = true;
          break;
        }
        if (Moved === true) {
          Dist++;
        }
        Moved = true;
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
          if (Moved === true) {
            Dist -= 6;
          }
          break;
        }
        Dist -= 7;
        Moved = true;
      }
      if (blocked === false) {
        squares[currPos - 42] = "P";
        squares[currPos] = null;
        Dist = -42;
      }
    }

    Dist = currPos + Dist;
    console.log("Location: " + Dist);
    return Dist;
  }

  jumpTo(step) {
    this.setState({
      stepNumber: step,
      xIsNext: step % 2 === 0
    });
  }
  render() {
    console.log(this.state.PlayerLocation);

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
