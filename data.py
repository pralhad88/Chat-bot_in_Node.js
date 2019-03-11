import requests, json, pprint
from bs4 import BeautifulSoup
from os import path

jsonFile = {}
sign_data = []
for i in range(12):
    signList = ['Aries', 'Tauras', 'Gemini', 'Cancer', 'Leo', 'Virgo', 'Libra', 'Scorpio', 'Sagittarius', 'Capricorn', 'Aquarius', 'Pisces']
    
    get_request = requests.get("https://www.horoscope.com/us/horoscopes/general/horoscope-general-daily-today.aspx?sign="+str(i+1))
    parse = BeautifulSoup(get_request.text, "html.parser")
    
    maindiv = parse.find('div', class_ = 'grid grid-right-sidebar')
    maindiv1 = maindiv.find('div', class_ = 'tablet-ad')
    ptag = maindiv1.find('p')
    date = ptag.find('strong', class_ = 'date').text
    prediction = ptag.text
    
    jsonFile["Sign"] = signList[i]
    jsonFile["Prediction"] = prediction
    jsonFile["Date"] = date
    jsonFile["id"] = i + 1
    
    sign_data.append(jsonFile)
    jsonFile = {}

with open('horoscopes.json', 'w+') as newfile:
    horoscopeData = json.dumps(sign_data)
    newfile.write(horoscopeData)