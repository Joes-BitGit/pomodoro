import React, { useEffect, useState } from "react";

function App() {
  const defaultSession = 25;
  const defaultBreak = 5;
  const minuteMultiplier = 60;
  const [session, setSession] = useState(55);
  const [breaktime, setBreaktime] = useState(5);
  const [timeSeconds, setTimeSeconds] = useState(session * minuteMultiplier);
  const [isActive, setIsActive] = useState(false);
  // current state
  const [sessionState, setSessionState] = useState(false);
  const [breakState, setBreakState] = useState(false);
  const [idleState, setIdleState] = useState(true);

  const toggle = () => {
    setIsActive(!isActive);
  };

  const reset = () => {
    // timer resets to default
    setSession(defaultSession);
    setBreaktime(defaultBreak);
    setTimeSeconds(defaultSession * minuteMultiplier);
    setIsActive(false);
  };

  // function that takes in a number
  // converts that number to minutes using seconds
  // e.g 5min -> 300secs
  const calculateTimeLeft = () => {
    let difference = timeSeconds;
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
    let myInterval = null;
    if (isActive) {
      myInterval = setInterval(() => {
        if (timeSeconds > 0) {
          setTimeSeconds((timeSeconds) => timeSeconds - 1);

          console.log("if", timeSeconds);
        }
      }, 1000);
    }
    // && !isActive
    if (timeSeconds === 0) {
      console.log("else", timeSeconds);
      clearInterval(myInterval);
    }

    return () => clearInterval(myInterval);
  }, [isActive, timeSeconds]);

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
              if (session > 59) {
                setSession(60);
                // setTimeSeconds(60 * minuteMultiplier);
              } else {
                setSession((session) => session + 1);
                setTimeSeconds((timeSeconds) => timeSeconds + 60);
              }
            }}
          >
            +
          </button>
          {/* 3 */}
          <button
            id="session-decrement"
            onClick={() => {
              if (session < 2) {
                setSession(1);
              } else {
                setSession((session) => session - 1);
                setTimeSeconds((timeSeconds) => timeSeconds - 60);
              }
            }}
          >
            -
          </button>
          {/* 6 */}
          <div id="session-length">{session}</div>
        </div>
        <div className="break-container">
          {/* Story 1 */}
          <p id="break-label">Break Length</p>
          {/* 4 */}
          <button
            id="break-increment"
            onClick={() => {
              if (breaktime > 59) {
                setBreaktime(60);
              } else {
                setBreaktime((breaktime) => breaktime + 1);
                setTimeSeconds((timeSeconds) => timeSeconds + 60);
              }
            }}
          >
            +
          </button>
          {/* 3 */}
          <button
            id="break-decrement"
            onClick={() => {
              if (breaktime < 2) {
                setBreaktime(1);
              } else {
                setBreaktime((breaktime) => breaktime - 1);
                setTimeSeconds((timeSeconds) => timeSeconds - 60);
              }
            }}
          >
            -
          </button>
          {/* 5  */}
          <div id="break-length">{breaktime}</div>
        </div>
        <div className="timer-container">
          {/* 7 */}
          <p id="timer-label">Session/Idle/Break</p>
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
            {`${isActive ? "PAUSE" : "PLAY"}`}
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
