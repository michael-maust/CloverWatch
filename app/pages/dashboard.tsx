import React from "react";
import WeatherForecast from "~/components/WeatherForecast";

const App: React.FC = () => {
  return (
    <div>
      <WeatherForecast lat={40.7128} long={-74.006} />
    </div>
  );
};

export default App;