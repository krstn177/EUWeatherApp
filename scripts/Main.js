//Importing the capitalsList object and Setting up the cities array and current index
import { capitalsList } from "./Cities.js";
const cities = Object.keys(capitalsList);
let currentCityIndex = 26;

//Setting the API information
const apiKey = "3d21015b97148f8ba8eff820e4ab5aa9";
const apiUrl = "https://api.openweathermap.org/data/2.5/weather?units=metric&q="

//Declaring the main elements from the html document
const searchBox = document.getElementById("searchBar");
const bgImage = document.getElementById("bgImage");
const previousBtn = document.getElementById("previous");
const nextBtn = document.getElementById("next");
const searchBtn = document.getElementById("searchBtn");
const weatherContainer = document.getElementById("weatherContainer");

//Adding event listeners to the buttons
searchBtn.addEventListener("click", searchBtnHandler);
previousBtn.addEventListener('click', pageBtnHandler);
nextBtn.addEventListener('click', pageBtnHandler);

checkWeather('paris');

//The function that handles the pressing of either one of the page buttons
async function pageBtnHandler(event) {
    const button = event.currentTarget;
    
    //Increments or decrements the currentCityIndex depending on which button was pressed
    if (button.id == 'next') {
        currentCityIndex++;
    } else{
        currentCityIndex--;
    }

    //Changing the visual elements of the page to indicate transition
    bgImage.style.opacity = '0';
    previousBtn.disabled = true;
    nextBtn.disabled = true;
    weatherContainer.style.opacity = '0';
    weatherContainer.style.visibility = 'hidden';
    
    //Calling the checkWeather function and resetting the visual elements
    setTimeout(async ()=>{
        await checkWeather(cities[currentCityIndex]);
        weatherContainer.style.opacity = '1';
        weatherContainer.style.visibility = 'visible';
    }, 1000);
};

//The function that handles the search button click
async function searchBtnHandler(){
    //Changing the visual elements of the page to indicate transition
    searchBtn.disabled = true;
    previousBtn.disabled = true;
    nextBtn.disabled = true;
    weatherContainer.style.opacity = '0';
    weatherContainer.style.visibility = 'hidden';
    bgImage.style.opacity = '0';

    //Calling the checkWeather function and resetting the visual elements
    setTimeout(async ()=>{
        await checkWeather(searchBox.value);
        weatherContainer.style.opacity = '1';
        weatherContainer.style.visibility = 'visible';
        searchBtn.disabled = false;
    }, 1000);
}

//The main function that makes an API call and updates the visual elements
async function checkWeather(city) {
    //Declare all elements that show the weather stats
    const temperatureText = document.getElementById('temperature');
    const cityText = document.getElementById('city');
    const detailsContainer = document.getElementById('detailsContainer');
    const mainWeatherIcon = document.getElementById('mainWeatherIcon');
    
    try{
        //Check if the city is in the european capitals list
        if (!cities.includes(city.toLowerCase())) {
            throw new Error();
        }
        
        //Set current city index 
        currentCityIndex = cities.indexOf(city.toLowerCase());
        
        //Log the index and the photo path of the city
        console.log(currentCityIndex);
        console.log(`url(${capitalsList[cities[currentCityIndex]]})`);
        
        
        //Making the request to fetch the data for the weather from OpenWeatherMap.org
        const response = await fetch(apiUrl + city + `&appid=${apiKey}`);
        if (response.status !== 200) {
            console.log('here');
            throw new Error();  
        }
        const data = await response.json();
        
        //Setting every stat to visible after possible error and restoring the bg color
        temperatureText.style.visibility = 'visible';
        cityText.style.visibility = 'visible';
        detailsContainer.style.visibility = 'visible';
        mainWeatherIcon.style.visibility = 'visible';
        weatherContainer.style.background = 'linear-gradient(180deg, rgba(27, 84, 243, 0.55), rgba(77, 77, 77, 0.55))';
        
        //Setting the bg image and giving it opacity again
        bgImage.style.backgroundImage = `url(${capitalsList[cities[currentCityIndex]]})`;
        bgImage.style.opacity = '1';
        
        //Setting all the retrieved data to the html elements for proper display
        temperatureText.textContent = `${data.main.temp.toFixed(1)}°C`;
        cityText.textContent = `${data.name}`;
        const detailsText = document.querySelectorAll('.detailsDesc');
        
        detailsText[0].textContent = `${data.main.humidity}% humidity`;
        detailsText[1].textContent = `${data.wind.speed} km/h wind`;
        
        //Changing the weather icon according to the conditions retrieved from the API
        mainWeatherIcon.src = `./images/Weather Icons/${data.weather[0].main.toLowerCase()}.png`;
        
        //Disable the page buttons if necessary
        if (currentCityIndex == 0) {
            nextBtn.disabled = false;
        }
        else if (currentCityIndex == cities.length - 1) {
            previousBtn.disabled = false;
        }
        else{
            previousBtn.disabled = false;
            nextBtn.disabled = false;
        }   
        
    } catch(e){
        //Hiding all the stat elements and changing the background to red gradient on error
        bgImage.style.backgroundImage = 'none';
        weatherContainer.style.background = 'linear-gradient(180deg, rgba(138, 21, 21, 0.55), rgba(77, 77, 77, 0.55))';
        temperatureText.textContent = `"${city}" NOT FOUND`;
        cityText.style.visibility = 'hidden';
        detailsContainer.style.visibility = 'hidden';
        mainWeatherIcon.style.visibility = 'hidden';

        //Disable the page buttons if necessary
        if (currentCityIndex == 0) {
            nextBtn.disabled = false;
        }
        else if (currentCityIndex == cities.length - 1) {
            previousBtn.disabled = false;
        }
        else{
            previousBtn.disabled = false;
            nextBtn.disabled = false;
        }
    }

}