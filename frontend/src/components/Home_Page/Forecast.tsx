import ReactWeather, { useVisualCrossing } from "react-open-weather";

declare module "react-open-weather" {
  export const useVisualCrossing: any;
  const ReactWeather: any;
  export default ReactWeather;
}

const Forecast = () => {
  const { data, isLoading, errorMessage } = useVisualCrossing({
    key: "ZVFFZBB5LK82E25RK72PDDEAE",
    lat: "3.1319",
    lon: "101.6841",
    lang: "en",
    unit: "metric",
  });

  const customStyles = {
    gradientStart: "Transparent",
    gradientMid: "Transparent",
    gradientEnd: "Transparent",
    locationFontColor: "#033f63",
    todayTempFontColor: "#033f63",
    todayDateFontColor: "#033f63",
    todayRangeFontColor: "#033f63",
    todayDescFontColor: "#033f63",
    todayInfoFontColor: "#033f63",
    todayIconColor: "#033f63",
  };

  return (
    <ReactWeather
      isLoading={isLoading}
      errorMessage={errorMessage}
      data={data}
      lang="en"
      locationLabel="Kuala Lumpur"
      unitsLabels={{ temperature: "C", windSpeed: "Km/h" }}
      showForecast={false}
      theme={customStyles}
    />
  );
};

export default Forecast;
