      const config = {
          cUrl: "https://api.countrystatecity.in/v1/countries",
          cKey: "SmRDQnBpSFVzNTRlRHp2MExWbm80M0p4aFI1N3pYTDBCS2pKeVhqYQ==",
          wUrl: "http://api.openweathermap.org/data/2.5/",
          wKey: "e9673f59a71129cbce8c3ea421473481",
      };

        const currDate = document.getElementById("date");
        const weather_cond  = document.getElementById("weather-cond");
        const temperature = document.getElementById("temperature");
        const min_max_temp = document.getElementById("temperature_min_max");
        const loc = document.getElementById("loc");

        // target all select tag
        const countriesListDropDown = document.querySelector("#countrylist");
        const statesListDropDown = document.querySelector("#statelist");
        const citiesListDropDown = document.querySelector("#citylist");
        

        // const tempStatus = "{%tempstatus%}";

        const getCurrentDay = () =>{
            const weekday = ["SUN","MON","TUE","WED","THU","FRI","SAT"];
            let currentTime = new Date();
            let day = weekday[currentTime.getDay()];
            return day;
        };

        const getCurrentTime = () =>{
            const months = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sept","Oct","Nov","Dec"];
            let now = new Date();
            let month = months[now.getMonth()];
            let date = now.getDate();

            let hours = now.getHours();
            let mins = now.getMinutes();

            let periods = "AM";
            if(hours>11){
                periods = "PM";
                if(hours > 12){
                    hours -= 12;
                }
            }

            if(mins<10){
                mins = "0" + mins;
            }
        return `${month} ${date} | ${hours}:${mins}${periods}`;
        };
        currDate.innerHTML = getCurrentDay() + "  |  " + getCurrentTime();

        // get countries function

        const getCountries = async (fildName, ...args) =>{
            // let apiEndPoint = config.cUrl;
            let apiEndPoint;
            switch(fildName)
            {
                case "countries" : 
                    apiEndPoint = config.cUrl;
                    break;
                case "states" : 
                    apiEndPoint = `${config.cUrl}/${args[0]}/states`;       //https://api.countrystatecity.in/v1/countries/[ciso]/states
                    break;
                case "cities" : 
                    apiEndPoint = `${config.cUrl}/${args[0]}/states/${args[1]}/cities`;     //https://api.countrystatecity.in/v1/countries/[ciso]/states/[siso]/cities
                    break;
                default:
            }
            const response = await fetch(apiEndPoint, {
                headers:{"X-CSCAPI-KEY" : config.cKey},
            });

            if(response.status != 200){
                throw new Error(`Something went wrong, status cosd: ${response.status}`);
            }

            const countries = await response.json();
            return countries;
        };

        // get weather info

        

        // ON CONTENT LOAD
        document.addEventListener("DOMContentLoaded", async () =>{
            const countries = await getCountries("countries");
            // console.log(countries);
            let countriesOption = "";
            if(countries){
                countriesOption +=`<option value="">Select Country`;

                countries.forEach((country) =>{
                    countriesOption += `<option value="${country.iso2}">${country.name}`;
                    // console.log(countriesOption);
                });

                countriesListDropDown.innerHTML =  countriesOption;
            }

            // List states
            countriesListDropDown.addEventListener("change", async function(){
                const selectedCountryCode = this.value;
                // console.log(selectedCountryCode);
                const states = await await getCountries("states",selectedCountryCode);
                // console.log(states);
                let statesOption = "";
                if(states){
                    statesOption +=`<option value="">Select States`;

                states.forEach((state) =>{
                    statesOption +=`<option value="${state.iso2}">${state.name}`;
                });

                statesListDropDown.innerHTML =  statesOption;
                statesListDropDown.disabled = false;
            }

            });

            statesListDropDown.addEventListener("change", async function(){
                const selectedCountryCode = countriesListDropDown.value;
                const selectedStateCode = this.value;
                const cities = await getCountries("cities",selectedCountryCode,selectedStateCode);
                // console.log(cities);
                let citiesOption = "";
                if(cities){
                    citiesOption +=`<option value="">Select City`;

                cities.forEach((city) =>{
                    citiesOption +=`<option value="${city.name}">${city.name}`;
                });

                citiesListDropDown.innerHTML =  citiesOption;
                citiesListDropDown.disabled = false;
            }
            });

            
        });
        
        // select city
        citiesListDropDown.addEventListener("change", function(){
            const selectedCountryCode = countriesListDropDown.value;
            const selectedCity = this.value;
            // console.log(selectedCountryCode);
            // console.log(selectedCity);
            getWeather(selectedCity,selectedCountryCode);
         });

       async function getWeather(cityName, countryCode){
            fetch(`${config.wUrl}weather?q=${cityName},${countryCode.toLowerCase()}&units=metric&APPID=${config.wKey}`)
            .then((response)=>{
                // console.log(response.json());
                return response.json();
                })
                .then((data)=>{
                // console.log(data.weather);
                // console.log(data.weather[0].main);
                const tempStatus = data.weather[0].main;
                // console.log(tempStatus);
                switch(tempStatus)
                {
                    case 'Sunny' :
                        weather_cond.innerHTML = `<i class="fa-solid fa-sun wea" style="color: #eccc68;"></i>`;
                        break;
                    case 'Clouds' :
                        weather_cond.innerHTML = `<i class="fas fa-cloud wea" style="color: #dfe4ea;"></i>`;
                        break;
                    case 'Rainy' :
                        weather_cond.innerHTML = `<i class="fas fa-cloud-rain wea" style="color: #a4b0be;"></i>`;
                        break;
                    case 'Haze' :
                        weather_cond.innerHTML = `<i class="fas fa-smog wea" style="color: #dfe4ea;"></i>`;
                        break;
                    default:
                        weather_cond.innerHTML = `<i class="fa-solid fa-sun wea" style="color: #eccc68;"></i>`;
                    
                }


                temperature.innerText = data.main.temp+"°C";
                min_max_temp.innerText = "Max - "+data.main.temp_max+"°C  | Min - "+data.main.temp_min+"°C";
                // loc.innerHTML=`<i class="fa-solid fa-street-view"></i>`;\
                // let locAdd = document.createElement("p")
                loc.innerHTML = `<i class="fa-solid fa-street-view"> </i>${data.name+" , "+data.sys.country}`;
                // console.log(data.name);
                })
                .catch((error)=>{
                console.log(error);
                });
        }



        



            