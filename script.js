$(document).ready(function() {

  // $('.search').on("click", "li", fucntion() {

  // })


function makeRow(city) {
    var li = $("<li>").addClass("list-group-item list-group-item-action").text(city);
     $("#recent").append(li);
     console.log("history")
  }
  


    document.getElementById('search').addEventListener('click', event => {
        event.preventDefault()
       
  
        let city = document.getElementById('city').value 
      
        makeRow(city)
    
  
        axios.get(`https://api.openweathermap.org/data/2.5/weather?q=${city}&units=imperial&appid=1dd25ac798a84daed3b612ef4b3c9a3e`)
          .then(res => {
            console.log(res.data)
            console.log(moment().format("dddd, MMMM YYYY"))
            let lat = res.data.coord.lat
            let lon = res.data.coord.lon
    
            let image = "https://openweathermap.org/img/w/" + res.data.weather[0].icon + ".png"

            

            document.getElementById('weather').innerHTML = `
                 <h1>${res.data.name}</h1>
                 <h2>${moment().format('dddd, MMMM Do')}</h2>
                 <h2>Weather: ${res.data.weather[0].description}</h2>
                 <h3>Temperature: ${res.data.main.temp}</h3>
                 <h3>Humidity: ${res.data.main.humidity}</h3>
                 <h3>Wind Speed: ${res.data.wind.speed}</h3>
                 <img  src= "${image}">`

              


            axios.get(`http://api.openweathermap.org/data/2.5/uvi/forecast?appid=1dd25ac798a84daed3b612ef4b3c9a3e&lat=${lat}&lon=${lon}&cnt=1`)
                .then(res => {
                 event.preventDefault()
                 uv = res.data[0].value
                 console.log(uv)  
                 if (res.data.value < 3 ) {
                   console.log('1')
                   $('#uv').addClass('favorable')
              
                } else if ( res.data.value > 3 && res.data.value > 7) {
                  console.log('2')
                  $('#uv').addClass('moderate')
                
                } else {
                  console.log('3')
                  $('#uv').addClass('severe')
                  
                }
      
                 
                 document.getElementById('uv').innerHTML = `
                 <h4>UX: ${uv}`
                

            
                })
                 .catch(err => { console.log(err) })
          })
          .catch(err => { console.log(err) })

        axios.get(`https://api.openweathermap.org/data/2.5/forecast?q=${city}&units=imperial&appid=1dd25ac798a84daed3b612ef4b3c9a3e`)
          .then(res => {
            let forecast = res.data.list
  
            for (let i = 5; i < forecast.length; i += 8) {

              console.log(forecast[i])
              let image = "https://openweathermap.org/img/w/" + res.data.list[i].weather[0].icon + ".png"
              let forecastElem = document.createElement('div')
              forecastElem.innerHTML = `
              <h1>${forecast[i].dt_txt}</h1>
              <h2>Weather: ${forecast[i].weather[0].description}</h2>
              <h3>Temperature: ${forecast[i].main.temp}</h3>
              <h3>Humidity: ${forecast[i].main.humidity}</h3>
              <h3>Wind Speed: ${forecast[i].wind.speed}</h3>
              <img  src= "${image}">
              `
              document.getElementById('forecast').append(forecastElem)
            }
          })
          .catch(err => { console.log(err) })

      })


})



    // recent searches 
    let searches = JSON.parse(window.localStorage.getItem('city')) || []
  
    if (searches.length > 0) {
        forcast(searches[searches.length-1])
    }
      for(var i=0; i <searches.length; i++) {
          makeRow(searches[i])
          localStorage.setItem(searches)

      }
