from pprint import pprint
import requests
import json
from bs4 import BeautifulSoup
def jokes_find():
	list_big = []
	a = 1
	for j in range(1,19):
		id_link = j
		link_1 = 'https://www.hindisoch.com/funnyjokes/sms/santa-banta-jokes-hindi/page/'+str(id_link)+'/'
		page = requests.get(link_1)
		# print(page)
		soup = BeautifulSoup(page.text,"html.parser")
		add = soup.find('div',class_='article')
		# print(add)
		div = add.find('div',attrs={'id':'content_box','class':None})
		data3 = div.findAll('article')
		# print(data3)
		for i in data3:
			jokes_data = i.text	
			dict_1 ={a:jokes_data}
			a+=1
			# print(dict_1)
			list_big.append(dict_1)
	with open('jokes.json','w+') as new_file:
		json.dump(list_big,new_file)
	return (list_big)
pprint(jokes_find())