const express = require("express");
const app = express();
var fs = require("fs");
const PORT = 3000;

app.use(express.json());

var data = fs.readFileSync("horoscopes.json");
var data1 = JSON.parse(data);

var signList = ['Aries', 'Tauras', 'Gemini', 'Cancer', 'Leo', 'Virgo', 'Libra', 'Scorpio', 'Sagittarius', 'Capricorn', 'Aquarius', 'Pisces'];

var dateObj = new Date();
var month = dateObj.getUTCMonth();
const monthName = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
var day = dateObj.getUTCDate();
var year = dateObj.getUTCFullYear();

var todaysDate = monthName[month] + " " + day + ", " + year;

if (todaysDate != data1[0]["Date"]){
    var stored_data = fs.readFileSync("daily_horoscope.json");
    var stored_data1 = JSON.parse(stored_data);
    stored_data1.push(data1);
    fs.writeFileSync("daily_horoscope.json", JSON.stringify(stored_data1, null, 2));
}

app.get("/horoscope", (req,res) => {
    return res.json(data1);   
});

app.get("/horoscope/:id", (req, res) => {
    var sign = req.params.id.toLowerCase();
    var data = fs.readFileSync("horoscopes.json");
    var data1 = JSON.parse(data);
    for (var i = 0; i < data1.length; i++){
        if (sign == data1[i]["Sign"].toLowerCase() && todaysDate == data1[i]["Date"]){
            return res.json(data1[i]["Prediction"])
        }
    }
    return res.json({"Error": "Your Sunsign doesn't match Please enter right Sunsign"});
});

app.get("/joke", (req,res) => {
    var email = req.query.email;    
    var data = fs.readFileSync("jokes.json");
    var data1 = JSON.parse(data);
    var stored_data = fs.readFileSync("stored.json");
    var array = JSON.parse(stored_data);
    
    while (true){
        var number = Math.floor((Math.random() * 29) + 0);
        if (!array[0].hasOwnProperty(email)){
            array[0][email] = [number];
            fs.writeFileSync("stored.json", JSON.stringify(array, null, 2));
            console.log(array);
            return res.json(data1[number][number+1])
            break
        }else{
            if (!array[0][email].includes(number)){
                array[0][email].push(number);
                fs.writeFileSync("stored.json", JSON.stringify(array, null, 2));
                return res.json(data1[number][number+1])
                break
            }
        }
    }
    
});

var server = app.listen(PORT, () => {
    console.log("Port is working")
})