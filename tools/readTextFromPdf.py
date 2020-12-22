

import PyPDF2
import os
from os import path
import tika
tika.initVM()
from tika import parser
import re
import json
import uuid

output_file = "extracted_text_hsk1.txt"
output_json_file = "extracted_text_hsk1.json"

if path.exists(output_file):

    with open(output_file, 'r', encoding="utf-8") as out_file:
        
        text = out_file.read()
        pattern = r"\s*([\u4e00-\u9fff]+)\s(.*?)\s(.*)$"

        matches = re.findall(pattern, text, re.MULTILINE)

        result = []

        for match in matches:
            [hanzi, pinyin, meanings] = match

            result.append({
                "id": str(uuid.uuid4()),
                "hanzi": hanzi,
                "meanings": meanings,
            })

        with open(output_json_file, "w") as out_json_file:
            json.dump(result, out_json_file)

    exit()

directory_path = os.path.dirname(__file__)
file_name = "HSK All Levels Vocabulary/HSK 1 Vocabulary list.pdf"
file_path = os.path.join(directory_path, file_name)

parsed = parser.from_file(file_path)
text = parsed["content"].encode("utf-8")

with open(output_file, 'wb') as the_file:
    the_file.write(text)

# file = open(file_path, "rb")

# fileReader = PyPDF2.PdfFileReader(file)

# num_pages = fileReader.numPages

# with open('somefile.txt', 'w') as the_file:

#     for index in range(num_pages):
#         page = fileReader.getPage(index)
#         text = page.extractText()
#         content = page.getContents()
        
#         print(text)
#         #the_file.write(text)
        