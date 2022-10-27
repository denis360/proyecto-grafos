import networkx as nx
import matplotlib.pyplot as plot
from src.load_json import content

g = nx.Graph()
linea = "Linea 7"

for estacion in content[linea]["estaciones"]:
    g.add_node(estacion)

for estacion in content[linea]["relaciones"]:
    for item in content[linea]["relaciones"][estacion]:
        destino, _ = item
        g.add_edge(estacion, destino)

# crear el grafo
nx.draw_networkx(
    g, pos=nx.spring_layout(g), with_labels=True,
    node_size=700, arrows=True,
    arrowsize=25, arrowstyle='-|>',
    edge_color="b", connectionstyle="arc3",
)

plot.show()