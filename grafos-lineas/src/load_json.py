from os import path
import json

with open(path.abspath("./src/lineas.json"), "r") as f:
    content = json.load(f)
