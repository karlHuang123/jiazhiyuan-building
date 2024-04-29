import React, { useState } from "react";
import { useEffect } from "react";

const Calendar = () => {
  const [helloWorld, setHelloWorld] = useState('hey');

  useEffect(() => {
      setHelloWorld('hello user dispatch')
  }, [])

  useEffect(() => {
    console.log(helloWorld)
  }, [helloWorld])

  return (
    <div className="app-container">
        {helloWorld}
    </div>
  );
};

export default Calendar;
