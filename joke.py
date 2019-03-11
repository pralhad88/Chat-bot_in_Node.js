url = 'http://kickasshumor.com/c/9/funny-dirty-jokes'
from pprint import pprint
def jokes_find(link):
	import requests
	import json
	from bs4 import BeautifulSoup
	page = requests.get(link)
	# print(page)
	soup = BeautifulSoup(page.text,"html.parser")
	# print(soup)
	div = soup.find_all('div',class_='joke cfix expand')
	# print(div)
	list_jokes = []
	add=1
	for i in div:
		# smal_list = []
		dict_1 = {}
		j = i.find('a').get_text().replace("\n", "")
        # print(j)
		# smal_list.append(j)
		dict_1[add]=j
		list_jokes.append(dict_1)
		add+=1
	
	with open("jokes.json","w+") as new_file:
		json.dump(list_jokes,new_file)
	return (list_jokes)

# jokes_find(url)
pprint(jokes_find(url))

