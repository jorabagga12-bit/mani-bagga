from bs4 import BeautifulSoup
with open('index.html', 'r') as f:
    soup = BeautifulSoup(f.read(), 'html.parser')
iframe = soup.find('iframe')
print(iframe)
