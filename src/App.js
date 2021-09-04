import React, { useEffect, useReducer } from "react";

function App() {
  const defaultSession = 25;
  const defaultBreak = 5;
  const minuteMultiplier = 60;

  const [state, dispatch] = useReducer(
    (state, action) => {
      switch (action.type) {
        case "INC_SESSION": {
          return {
            ...state,
            session: state.session + 1,
            // will this get prev state or does it read the previous statement first?
            timeSeconds: state.timeSeconds + minuteMultiplier,
          };
        }
        case "SESSION_OVERFLOW": {
          return {
            ...state,
            session: 60,
          };
        }
        case "DEC_SESSION": {
          return {
            ...state,
            session: state.session - 1,
            // will this get prev state or does it read the previous statement first?
            timeSeconds: state.timeSeconds - minuteMultiplier,
          };
        }
        case "SESSION_UNDERFLOW": {
          return {
            ...state,
            session: 1,
          };
        }
        case "INC_BREAK": {
          return {
            ...state,
            breaktime: state.breaktime + 1,
            // will this get prev state or does it read the previous statement first?
            breakTimeSeconds: state.breakTimeSeconds + minuteMultiplier,
          };
        }
        case "BREAK_OVERFLOW": {
          return {
            ...state,
            session: 60,
          };
        }
        case "DEC_BREAK": {
          return {
            ...state,
            breaktime: state.breaktime - 1,
            // will this get prev state or does it read the previous statement first?
            breakTimeSeconds: state.breakTimeSeconds - minuteMultiplier,
          };
        }
        case "BREAK_UNDERFLOW": {
          return {
            ...state,
            session: 1,
          };
        }
        case "TOGGLE_PLAY_PAUSE": {
          return {
            ...state,
            isActive: !state.isActive,
          };
        }
        case "SESSION_RUNNING": {
          return {
            ...state,
            sessionState: true,
            breakState: false,
            timeSeconds: state.timeSeconds - 1,
          };
        }
        case "BREAK_RUNNING": {
          return {
            ...state,
            breakState: true,
            sessionState: false,
            breakTimeSeconds: state.breakTimeSeconds - 1,
          };
        }
        case "SESSION_BREAK": {
          return {
            ...state,
            sessionState: !state.sessionState,
            breakState: !state.breakState,
            timeSeconds: state.session * minuteMultiplier,
          };
        }
        case "BREAK_SESSION": {
          return {
            ...state,
            sessionState: !state.sessionState,
            breakState: !state.breakState,
            breakTimeSeconds: state.breaktime * minuteMultiplier,
          };
        }
        case "RESET": {
          return {
            session: defaultSession,
            breaktime: defaultBreak,
            isActive: false,
            timeSeconds: defaultSession * minuteMultiplier,
            breakTimeSeconds: defaultBreak * minuteMultiplier,
            sessionState: true,
            breakState: false,
          };
        }
        default:
          return state;
      }
    },
    {
      // intial state of my application
      session: 1,
      breaktime: 1,
      isActive: false,
      timeSeconds: 1 * minuteMultiplier,
      breakTimeSeconds: 1 * minuteMultiplier,
      sessionState: true,
      breakState: false,
    }
  );

  const toggle = () => {
    dispatch({ type: "TOGGLE_PLAY_PAUSE" });
  };

  const reset = () => {
    // timer resets to default
    dispatch({ type: "RESET" });
  };

  // function that takes in a number
  // converts that number to minutes using seconds
  // e.g 5min -> 300secs
  const calculateTimeLeft = () => {
    let difference = null;
    if (state.sessionState) {
      difference = state.timeSeconds;
    } else if (state.breakState) {
      difference = state.breakTimeSeconds;
    }

    console.log("diff: ", difference);
    let timeLeft = {};

    if (difference > 0) {
      timeLeft = {
        minutes: Math.floor(difference / 60),
        seconds: Math.floor(difference % 60),
      };
    } else if (difference === 0) {
      timeLeft = {
        minutes: 0,
        seconds: 0,
      };
    }

    return timeLeft;
  };

  useEffect(() => {
    let sessionInterval = null;
    let breakInterval = null;

    if (state.isActive) {
      if (state.sessionState) {
        sessionInterval = setInterval(() => {
          if (state.timeSeconds > 0) {
            dispatch({ type: "SESSION_RUNNING" });

            // behind by 1 render
            console.log("if sesh: ", state.timeSeconds);
          }
        }, 1000);
      } else if (state.breakState) {
        breakInterval = setInterval(() => {
          if (state.breakTimeSeconds > 0) {
            dispatch({ type: "BREAK_RUNNING" });

            console.log("if break: ", state.breakTimeSeconds);
          }
        }, 1000);
      }
    }
    if (state.timeSeconds === 0) {
      // hold for a second setTimeout?
      setTimeout(() => {
        console.log("timeout");
        dispatch({ type: "SESSION_BREAK" });
        // clearInterval(sessionInterval);
      }, 1000);
      console.log("else sesh: ", state.timeSeconds);
    } else if (state.breakTimeSeconds === 0) {
      setTimeout(() => {
        console.log("else break: ", state.breakTimeSeconds);
        dispatch({ type: "BREAK_SESSION" });
        clearInterval(breakInterval);
      }, 1000);
    }

    return () => {
      clearInterval(sessionInterval);
      clearInterval(breakInterval);
    };
  }, [
    state.isActive,
    state.timeSeconds,
    state.breakTimeSeconds,
    state.sessionState,
    state.breakState,
  ]);

  return (
    <div className="App">
      <section className="title">Pomodoro!</section>
      <section className="body">
        <div className="session-container">
          {/* Story 2 */}
          <p id="session-label">Session Length</p>
          {/* 4 */}
          <button
            id="session-increment"
            onClick={() => {
              // if the new state is computed using the prev state, you can pass a function to setState.
              // The function will receive the previous value and return an updated value.
              if (state.session > 59) {
                dispatch({ type: "SESSION_OVERFLOW" });
              } else {
                dispatch({ type: "INC_SESSION" });
              }
            }}
          >
            +
          </button>
          {/* 3 */}
          <button
            id="session-decrement"
            onClick={() => {
              if (state.session < 2) {
                dispatch({ type: "SESSION_UNDERFLOW" });
              } else {
                dispatch({ type: "DEC_SESSION" });
              }
            }}
          >
            -
          </button>
          {/* 6 */}
          <div id="session-length">
            {state.session ? state.session : defaultSession}
          </div>
        </div>
        <div className="break-container">
          {/* Story 1 */}
          <p id="break-label">Break Length</p>
          {/* 4 */}
          <button
            id="break-increment"
            onClick={() => {
              if (state.breaktime > 59) {
                dispatch({ type: "BREAK_OVERFLOW" });
              } else {
                dispatch({ type: "INC_BREAK" });
              }
            }}
          >
            +
          </button>
          {/* 3 */}
          <button
            id="break-decrement"
            onClick={() => {
              if (state.breaktime < 2) {
                dispatch({ type: "BREAK_UNDERFLOW" });
              } else {
                dispatch({ type: "DEC_BREAK" });
              }
            }}
          >
            -
          </button>
          {/* 5  */}
          <div id="break-length">
            {state.breaktime ? state.breaktime : defaultBreak}
          </div>
        </div>
        <div className="timer-container">
          {/* 7 */}
          <p id="timer-label">{`${
            state.isActive ? (state.sessionState ? "SESSION" : "BREAK") : "IDLE"
          }`}</p>
          {/* 8 */}
          <div id="time-left">
            {calculateTimeLeft().minutes < 10
              ? `0${calculateTimeLeft().minutes}`
              : calculateTimeLeft().minutes}
            :
            {calculateTimeLeft().seconds < 10
              ? `0${calculateTimeLeft().seconds}`
              : calculateTimeLeft().seconds}
          </div>
          {/* 9 */}
          <button id="start_stop" onClick={toggle}>
            {`${state.isActive ? "PAUSE" : "PLAY"}`}
          </button>
          {/* 10 */}
          <button id="reset" onClick={reset}>
            RESET
          </button>
        </div>
      </section>
      <section className="footer">MADE w/ ❤️ BY JOSEPH</section>
    </div>
  );
}

export default App;
