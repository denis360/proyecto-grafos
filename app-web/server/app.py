from flask import Flask, jsonify
from flask_cors import CORS
from src.Grafos import grafo, content

app = Flask(__name__)
app.config["JSON_AS_ASCII"] = False
CORS(app)


@app.route("/")
def init():
    return jsonify({"grafo": grafo.info, "content": content})


if __name__ == "__main__":
    app.run(host="0.0.0.0")
