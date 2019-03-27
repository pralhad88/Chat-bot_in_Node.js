const express = require("express");
const app = express();
const fs = require("fs");
const request = require('request');
const cheerio = require('cheerio');

const PORT = 3000;

app.use(express.json());

var data = fs.readFileSync("horoscopes.json");
var data1 = JSON.parse(data);

var signList = ['aries', 'taurus', 'gemini', 'cancer', 'leo', 'virgo', 'libra', 'scorpio', 'sagittarius', 'capricorn', 'aquarius', 'pisces'];

var dateObj = new Date();
var month = dateObj.getUTCMonth();
const monthName = ["01", "02", "03", "04", "05", "06", "07", "08", "09", "10", "11", "12"];
var day = dateObj.getUTCDate();
var year = dateObj.getUTCFullYear();

var todaysDate = day + "-" + monthName[month] + "-" + year;

if (todaysDate != data1[0]["Date"]){
    var stored_data = fs.readFileSync("daily_horoscope.json");
    var stored_data1 = JSON.parse(stored_data);
    stored_data1.push(data1);
    fs.writeFileSync("daily_horoscope.json", JSON.stringify(stored_data1, null, 2));
    
    i = 0;
    var data = [];
    while (true){
        request('https://www.ganeshaspeaks.com/horoscopes/daily-horoscope/' + signList[i] + '/', (err, resp, body) => {
            var dic = {};
            var $ = cheerio.load(body);
            var maindiv = $('p.margin-top-xs-0');
            var output = maindiv.text().trim();
            var date = $('div.daily-horoscope-content').find('p');
            var sign = $('a.breadcrumb').last().text().trim('\n');
            dic["sign"] = sign;
            dic["prediction"] = output;
            dic["Date"] = date.text();
            data.push(dic)
            fs.writeFileSync("horoscopes.json", JSON.stringify(data, null, 2));
        });
    
        if(request){
            i+=1
        }
    
        if(i == signList.length){
            break
        }
    }

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
        var number = Math.floor((Math.random() * (data1.length -1)) + 0);
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
            };
        };
    };
    
});

var server = app.listen(PORT, () => {
    console.log("Port is working")
});
