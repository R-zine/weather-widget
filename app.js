const widget = document.querySelector(".widget");
const locCont = document.querySelector(".location");
const number = document.querySelector(".number");
const icon = document.querySelector(".weather-icon");
const video = document.querySelector(".hero");
const toggle = document.querySelector(".toggle");
var condition = "";

getLocation = () =>
  navigator.geolocation
    ? navigator.geolocation.getCurrentPosition(showPosition, showError)
    : window.alert("The Browser Does not Support Geolocation");

getCity = async (position) => {
  let list = await fetch(
    `https://nominatim.openstreetmap.org/reverse?lat=${position.coords.latitude}&lon=${position.coords.longitude}&format=json`
  );
  let result = await list.json();
  return (format = `${result.address.city}, ${result.address.country}`);
};

getWeather = async (position) => {
  let list = await fetch(
    `https://api.openweathermap.org/data/2.5/weather?lat=${position.coords.latitude}&lon=${position.coords.longitude}&units=metric&appid=a04360dd4c57275c133fce13c06a6b80`
  );
  let result = await list.json();
  return (format = [
    Math.round(result.main.temp),
    result.weather[0].icon,
    result.weather[0].main,
  ]);
};

// Change the color of the widget bar to reflect the temperature

getColor = (temp) =>
  temp < 40
    ? [255 * (temp / 40), 255 * (temp / 40), 255 - temp * 6.37]
    : [255, 255 - (temp - 40) * 6.37, 0];

setRGB = (temp) =>
  (widget.style.background = `rgb(${getColor(temp)[0]}, ${getColor(temp)[1]}, ${
    getColor(temp)[2]
  })`);

showPosition = (position) => {
  getCity(position).then((x) => (locCont.textContent = x));
  getWeather(position).then((x) => {
    number.textContent = x[0];
    icon.innerHTML = `<img src="http://openweathermap.org/img/w/${x[1]}.png">`;
    condition = x[2];
    setRGB(parseInt(x[0]) + 30);
    switch (condition) {
      case "Clouds":
        video.src = "./clouds.mp4";
        break;
      case "Thunderstorm":
        video.src = "./thunder.mp4";
        break;
      case "Drizzle":
        video.src = "./drizzle.mp4";
        break;
      case "Rain":
        video.src = "./rain.mp4";
        break;
      case "Snow":
        video.src = "./snow.mp4";
        break;
      case "Clear":
        video.src = "./sunny.mp4";
        break;
      default:
        video.src = "./fog.mp4";
        break;
    }
  });
};

showError = (error) => {
  if (error.PERMISSION_DENIED)
    window.alert("The user has denied the request for Geolocation.");
};

getLocation();

// Toggle between C and F

toggle.addEventListener("click", () => {
  if (toggle.id == "c") {
    document.querySelector(".measurement").textContent = "F";
    number.textContent = Math.round(parseInt(number.textContent) * 1.8 + 32);
    toggle.src = "./off.svg";
  }
  if (toggle.id == "f") {
    document.querySelector(".measurement").textContent = "C";
    number.textContent = Math.round(
      (parseInt(number.textContent) - 32) * 0.5556
    );
    toggle.src = "./on.svg";
  }
  toggle.id == "c" ? (toggle.id = "f") : (toggle.id = "c");
});
