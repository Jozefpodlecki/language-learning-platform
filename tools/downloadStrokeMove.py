from urllib.parse import quote
from os import path, mkdir, remove
import requests
import base64
import subprocess

characters = ["哎", "哟"]
base_url = "https://dictionary.writtenchinese.com"

script_path = path.realpath(__file__)
directory_path = path.dirname(script_path)
file_name = path.splitext(path.basename(script_path))[0]

output_folder_path = path.abspath(path.join(directory_path, "..\\src\\assets\\hanzi-stroke-move"))

headers = {
    "user-agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/87.0.4280.88 Safari/537.36",
    "accept-Encoding": "gzip, deflate, br",
    "accept-Language": "en-US,en;q=0.9",
}

for char in characters:

    fileName = quote(quote(char + ".gif"))

    encoded_bytes = base64.b64encode(char.encode("utf-8"))
    encoded_character = str(encoded_bytes, "utf-8")
    # decoded_bytes = base64.b64decode(encoded_str)
    # decoded_str = str(decoded_bytes, "utf-8")

    url = "{base_url}//giffile.action?&localfile=true&fileName={fileName}".format(base_url = base_url, fileName = fileName)

    response = requests.get(url, allow_redirects=True, headers=headers)
    content = response.content

    gif_file_path = path.join(output_folder_path, "temp.gif")

    with open(gif_file_path, 'wb') as file:
        file.write(content)

    output_webm = encoded_character + '.webm'
    output_file_path = path.join(output_folder_path, output_webm)

    command = 'ffmpeg -y -i {input} -c:v libvpx -auto-alt-ref 0 -crf 4 -b:v 500K {output}'.format(input = gif_file_path, output = output_file_path)

    subprocess.call(command, shell=True)

remove(gif_file_path)