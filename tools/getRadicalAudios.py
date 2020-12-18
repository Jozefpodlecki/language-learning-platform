import requests
from os import path, mkdir
import json
import time
import numpy as np

script_path = path.realpath(__file__)
directory_path = path.dirname(script_path)
file_name = path.splitext(path.basename(script_path))[0]

file_name = "radicals.json"
radicals_path = path.join(directory_path, file_name)

audio_path = path.join(directory_path, "audio")

if not path.exists(audio_path):
    mkdir(audio_path)


headers = {
    "referer": "https://www.archchinese.com/arch_chinese_radicals.html",
    "user-agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/87.0.4280.88 Safari/537.36",
    "accept-Encoding": "gzip, deflate, br",
    "accept-Language": "en-US,en;q=0.9",
}

delays = [1.0, 1.1, 1.2, 1.3, 1.4, 1.5]

with open(radicals_path) as radicals_file:
    
    radicals = json.load(radicals_file)

    for radical in radicals:

        audio_src = radical["audio_src"]

        file_path = path.join(audio_path, audio_src)

        if path.exists(file_path):
            print("skipping {}".format(audio_src))
            continue

        url = "https://www.archchinese.com/swf/{}".format(audio_src)

        print("downloading {}".format(url))

        response = requests.get(url, allow_redirects=True, headers=headers)
        content = response.content

        delay = np.random.choice(delays)
        time.sleep(delay)

        with open(file_path, 'wb') as file:
            file.write(content)

笔
Written Chinese Dictionary "笔" Character Details

            https://dictionary.writtenchinese.com/giffile.action?&localfile=true&fileName=%25E7%25AC%2594.gif
            https://dictionary.writtenchinese.com/giffile.action?&localfile=true&fileName=%25E6%258B%25BF.gif