import React, { useEffect, useState } from "react";

function App() {
  const [session, setSession] = useState(1);
  const [breaktime, setBreaktime] = useState(5);
  const [timeSeconds, setTimeSeconds] = useState(session * 60);
  const [isActive, setIsActive] = useState(false);

  const toggle = () => {
    setIsActive(!isActive);
  };

  const reset = () => {
    // timer resets to default
    // setTimeSeconds(session * 60)
    setIsActive(false);
  };
  // function that takes in a number
  // converts that number to minutes using seconds
  // e.g 5min -> 300secs
  const calculateTimeLeft = () => {
    let difference = timeSeconds;
    let timeLeft = {};

    if (difference > 0) {
      timeLeft = {
        minutes: Math.floor((difference / 60) % 60),
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
            onClick={() => setSession(session + 1)}
          >
            +
          </button>
          {/* 3 */}
          <button
            id="session-decrement"
            onClick={() => setSession(session - 1)}
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
            onClick={() => setBreaktime(breaktime + 1)}
          >
            +
          </button>
          {/* 3 */}
          <button
            id="break-decrement"
            onClick={() => setBreaktime(breaktime - 1)}
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
            PLAY/PAUSE
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
