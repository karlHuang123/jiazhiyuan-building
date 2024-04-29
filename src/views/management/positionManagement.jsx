import React, { useState } from "react";
import { useEffect } from "react";

const PositionManagement = () => {
  const [helloWorld, setHelloWorld] = useState('hey');

  useEffect(() => {
      setHelloWorld('hello position')
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

export default PositionManagement;
