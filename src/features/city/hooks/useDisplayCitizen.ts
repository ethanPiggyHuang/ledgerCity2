import { useEffect, useState } from 'react';

const useDisplayCitizen = () => {
  const [figurePosition, setFigurePosition] = useState(0);

  useEffect(() => {
    const handlePosition = () => {
      setFigurePosition((prev) => prev + 30);
    };
    const interval = setInterval(handlePosition, 2000);
    const timeout = setTimeout(() => clearInterval(interval), 8000);

    return () => {
      clearInterval(interval);
      clearTimeout(timeout);
    };
  }, []);
  return figurePosition;
};

export default useDisplayCitizen;
