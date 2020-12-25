

import PyPDF2
import os
from os import path
import tika
tika.initVM()
from tika import parser
import re
import json
import uuid
import glob, os

directory_path = path.dirname(__file__)

for root, dirs, files in os.walk(directory_path):

    directory_name = path.basename(root)

    if not directory_name == "HSK All Levels Vocabulary":
        continue

    for file in files:

        if not file.endswith(".pdf"):
            continue

        file_path = path.join(root, file)

        file_name = path.splitext(file)[0]
        output_file = path.join(directory_path, file_name + ".txt")
        
        if not path.isfile(output_file):
            parsed = parser.from_file(file_path)
            text = parsed["content"].encode("utf-8")
        
            with open(output_file, 'wb') as the_file:
                the_file.write(text)

        output_json_file = path.join(directory_path, file_name + ".json")

        with open(output_file, 'r', encoding="utf-8") as the_file:

            text = the_file.read()
            pattern = r"\s*([\u4e00-\u9fff]+)\s(.*?)\s(.*)$"

            matches = re.findall(pattern, text, re.MULTILINE)

            result = []

            for match in matches:
                [hanzi, pinyin, meanings] = match

                if not hanzi:
                    print("could not find hanzi")
                    continue

                if not meanings:
                    print("could not find meaning for {} {}".format(hanzi, pinyin))
                    continue

                result.append({
                    "id": str(uuid.uuid4()),
                    "hanzi": hanzi,
                    "meanings": meanings,
                })

            with open(output_json_file, "w") as out_json_file:
                json.dump(result, out_json_file)