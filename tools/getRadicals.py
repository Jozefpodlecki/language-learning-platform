from urllib.request import urlopen
from bs4 import BeautifulSoup
import json
import os
import re
import uuid

#page = urlopen("https://www.archchinese.com/arch_chinese_radicals.html")

# html = page.read().decode("utf-8-sig")
# html = page.read()

ffile = open("C:\\Users\\jozefpodlecki\\Documents\\language-learning-platform\\tools\\html.html", "r", encoding="utf8")
content = ffile.read()
ffile.close()

soup = BeautifulSoup(content, "html.parser")

tables = soup.findAll("table")
table = tables[0]

result = []
rows = table.findAll("tr" , recursive=True)
header = False

regex = re.compile("'(.*)'")

for row in rows:
    columns = row.findAll("td" , recursive=True)

    if not columns or len(columns) < 2:
        continue

    if not header:
        header = True
        continue

    radical = columns[1].get_text()
    meaning = columns[2].get_text()
    pinyin = columns[3].get_text()
    onclick = columns[3].find("a")["onclick"]
    regex_result = regex.search(onclick)
    pinyin_yale_romanized = regex_result.group(1)

    stroke_count = columns[4].get_text()
    variant = columns[5].get_text()

    result.append({
        "id": str(uuid.uuid4()),
        "radical": radical,
        "meaning": meaning,
        "pinyin": pinyin,
        "pinyin_yale_romanized": pinyin_yale_romanized,
        "stroke_count": int(stroke_count),
        "variant": variant,
        "audio_src": "./{}.mp3".format(pinyin_yale_romanized)
    })

directory_path = os.path.dirname(__file__)
filename = os.path.join(directory_path, "../src/assets/data/radicals.json")

with open(filename, "w") as outfile:
    json.dump(result, outfile)