from .load_json import content


class Nodo:
    def __init__(self, linea, nombre):
        self.info = {
            "visitado": False,
            "linea": linea,
            "nombre": nombre,
            "predecesor": None,
            "vertices_conectados": []
        }

    def __str__(self):
        return str(self.info)

    def agregar_vertice(self, nodo):
        self.info["vertices_conectados"].append(nodo)


class Arista:
    def __init__(self, linea, elemento, distancia):
        self.info = [linea, elemento, distancia]

    def __str__(self):
        return str(self.info)


class Grafo:
    def __init__(self):
        self.info = {
            "nodos": [],
            "relaciones": {}
        }

    def __str__(self):
        return str(self.info)

    def agregar_nodo(self, nodo):
        if nodo.info["nombre"] not in self.info["nodos"]:
            self.info["nodos"].append(nodo.info)
            self.info["relaciones"].update({nodo.info["nombre"]: []})

    def relacionar(self, linea, nodo, destino, distancia):
        nodo.agregar_vertice([destino, distancia])
        self.info["relaciones"][nodo.info["nombre"]].append(Arista(linea, destino, distancia).info)


grafo = Grafo()

for linea in content.keys():
    for estacion in content[linea]["estaciones"]:
        nodo = Nodo(linea, estacion)
        grafo.agregar_nodo(nodo)

        for info in content[linea]["relaciones"][nodo.info["nombre"]]:
            destino, distancia = info
            grafo.relacionar(linea, nodo, destino, distancia)
