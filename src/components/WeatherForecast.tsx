import React, { useState, useEffect } from "react";

interface ForecastData {
	date: string;
	description: string;
	high: number;
	low: number;
	windspeed: number;
	chanceOfRain: number;
	rainAmount: number;
	humidity: number;
}

interface WeatherForecastProps {
	lat: number;
	long: number;
}

const WeatherForecast: React.FC<WeatherForecastProps> = ({ lat, long }) => {
	const [forecastData, setForecastData] = useState<ForecastData[]>([]);

	useEffect(() => {
		const fetchData = async () => {
			const response = await fetch(
				`https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${long}&appid=4b8fd3f0df27eb2cb0d8f8e968543d57&unit=imperial`
			);
			const data = await response.json();
			const dailyData = data.list.reduce((acc: any, reading: any) => {
				const date = new Date(reading.dt * 1000);
				const weekday = date.toLocaleDateString(undefined, { weekday: 'long' });
				const month = date.getMonth() + 1;
				const day = date.getDate();
				const formattedDate = `${weekday}, ${month}/${day}/${date.getFullYear().toString().slice(2)}`;
				if (!acc[formattedDate]) {
					acc[formattedDate] = {
						high: -Infinity,
						low: Infinity,
						windspeed: 0,
						chanceOfRain: 0,
						rainAmount: 0,
						humidity: 0,
						description: reading.weather[0].description
					};
				}
				const { main, wind, pop, rain } = reading;
				acc[formattedDate].high = Math.max(acc[formattedDate].high, main.temp_max);
				acc[formattedDate].low = Math.min(acc[formattedDate].low, main.temp_min);
				acc[formattedDate].windspeed = wind.speed;
				acc[formattedDate].chanceOfRain = Math.max(acc[formattedDate].chanceOfRain, pop * 100);
				acc[formattedDate].rainAmount = Math.max(acc[formattedDate].rainAmount, rain?.["3h"] || 0);
				acc[formattedDate].humidity = Math.max(acc[formattedDate].humidity, main.humidity);
				return acc;
			}, {});
			const formattedData = Object.keys(dailyData).map((date) => ({
				date,
				description: dailyData[date].description,
				high: Math.round((dailyData[date].high - 273.15) * 9 / 5 + 32),
				low: Math.round((dailyData[date].low - 273.15) * 9 / 5 + 32),
				windspeed: dailyData[date].windspeed,
				chanceOfRain: dailyData[date].chanceOfRain,
				rainAmount: dailyData[date].rainAmount,
				humidity: dailyData[date].humidity,
			}));
			setForecastData(formattedData);
		};
		fetchData();
	}, [lat, long]);

	// TODO: add color indicator for green, yellow, and red based on amount of rain -> function


	return (


		<div className="flex gap-4 overflow-x-auto rounded p-2 shadow-md">
			{forecastData.map((data, index) => (
				<div key={data.date} className="flex-shrink-0 w-64 rounded-2xl p-4 m-2 bg-charcoal h-fit">
					<h3 className="mb-4 text-sm font-bold text-center text-white bg-blue-900 py-2">{data.date}</h3>
					<p className="text-gray-800 py-1 px-2 ml-2">{data.description}</p>
					<p className="text-gray-800 py-1 px-2 ml-2">{data.high}/{data.low}°F</p>
					<p className="text-gray-800 py-1 px-2 ml-2">{data.windspeed} mph</p>
					<p className="text-gray-800 py-1 px-2 ml-2">{data.chanceOfRain}% {data.rainAmount} in</p>
					<p className="text-gray-800 py-1 px-2 ml-2">{data.humidity}%</p>
				</div>
			))}
		</div>






	);
};

export default WeatherForecast;
