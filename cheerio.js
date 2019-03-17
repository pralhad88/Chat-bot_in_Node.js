const request = require('request');
const cheerio = require('cheerio');
const fs = require("fs");


var data = fs.readFileSync("horoscopes.json");
var data1 = JSON.parse(data);

var signList = ['aries', 'taurus', 'gemini', 'cancer', 'leo', 'virgo', 'libra', 'scorpio', 'sagittarius', 'capricorn', 'aquarius', 'pisces'];

var dateObj = new Date();
var month = dateObj.getUTCMonth();
const monthName = ["01", "02", "03", "04", "05", "06", "07", "08", "09", "10", "11", "12"];
var day = dateObj.getUTCDate();
var year = dateObj.getUTCFullYear();

var todaysDate = day + "-" + monthName[month] + "-" + year;
console.log(todaysDate);


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
            console.log(data);
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
