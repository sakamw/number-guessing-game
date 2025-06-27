import { useReducer } from "react";
import { Typography, Button, Stack } from "@mui/material";
import "./App.css";

type State = {
  newGameButtonDisabled: boolean;
  inputReadOnly: boolean;
  guessBtnDisabled: boolean;
  feedback: string | null;
  numTrial: number;
  playerGuess: string;
  secretNumber: number | null;
};

type Action =
  | { type: "SET_GAME"; payload: string }
  | { type: "MAKE_GUESS" }
  | { type: "NEW_GAME" };

const initialState: State = {
  secretNumber: null,
  playerGuess: "",
  numTrial: 10,
  feedback: null,
  inputReadOnly: true,
  guessBtnDisabled: true,
  newGameButtonDisabled: false,
};

function reducer(state: State, action: Action): State {
  if (action.type === "SET_GAME") {
    return { ...state, playerGuess: action.payload };
  }

  if (action.type === "MAKE_GUESS") {
    const guess = parseInt(state.playerGuess);

    if (
      isNaN(guess) ||
      guess < 0 ||
      guess > 100 ||
      state.playerGuess.trim() === ""
    ) {
      return {
        ...state,
        feedback: "Please enter a valid number between 0 and 100.",
      };
    }

    const isCorrect = guess === state.secretNumber;
    const trialsLeft = state.numTrial - 1;

    let feedback = "";
    let inputReadOnly = false;
    let guessBtnDisabled = false;
    let newGameButtonDisabled = true;

    if (isCorrect) {
      const scorePercent = ((trialsLeft / 10) * 100).toFixed(0);
      feedback = `${guess} is correct with ${scorePercent}%`;
      inputReadOnly = true;
      guessBtnDisabled = true;
      newGameButtonDisabled = false;
    } else if (trialsLeft <= 0) {
      feedback = `Out of trials! The number was ${state.secretNumber}.`;
      inputReadOnly = true;
      guessBtnDisabled = true;
      newGameButtonDisabled = false;
    } else {
      feedback =
        guess > state.secretNumber!
          ? `${guess} is too high`
          : `${guess} is too low`;
    }

    return {
      ...state,
      numTrial: trialsLeft,
      feedback,
      inputReadOnly,
      guessBtnDisabled,
      newGameButtonDisabled,
    };
  }

  if (action.type === "NEW_GAME") {
    return {
      ...initialState,
      secretNumber: Math.floor(Math.random() * 100),
      inputReadOnly: false,
      guessBtnDisabled: false,
      newGameButtonDisabled: true,
      feedback: "Secret number generated. Good luck guessing it",
      numTrial: 10,
      playerGuess: "",
    };
  }
  return state;
}

function App() {
  const [state, dispatch] = useReducer(reducer, {
    ...initialState,
    secretNumber: Math.floor(Math.random() * 100),
  });

  return (
    <>
      <div className="container">
        <div className="game-content">
          <Typography
            variant="h3"
            fontSize={22}
            style={{
              fontFamily: "inherit",
              marginBottom: "2rem",
              textTransform: "uppercase",
            }}
          >
            Guess a number between 0 and 100
          </Typography>
          <Typography sx={{ mb: "2rem", fontFamily: "inherit" }} variant="h6">
            {state.numTrial} Trials Remaining
          </Typography>

          <input
            type="number"
            value={state.playerGuess}
            placeholder="00"
            onChange={(e) =>
              dispatch({ type: "SET_GAME", payload: e.target.value })
            }
            readOnly={state.inputReadOnly}
            style={{
              fontSize: "2rem",
              textAlign: "center",
              width: "10rem",
              padding: "1rem",
            }}
          />
          <Typography
            variant="h6"
            style={{ marginTop: "2rem", fontWeight: "bold" }}
          >
            {state.feedback}
          </Typography>

          <Stack direction="row" justifyContent="center" mt={3} spacing={2}>
            <Button
              variant="contained"
              color="success"
              onClick={() => dispatch({ type: "MAKE_GUESS" })}
              disabled={state.guessBtnDisabled}
            >
              Guess
            </Button>

            <Button
              variant="outlined"
              color="secondary"
              onClick={() => dispatch({ type: "NEW_GAME" })}
              disabled={state.newGameButtonDisabled}
            >
              New Game
            </Button>
          </Stack>
        </div>
      </div>
    </>
  );
}

export default App;
