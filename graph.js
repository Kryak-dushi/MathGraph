"use strict";

class Graph {
    constructor() {
        this.vertices = new Set();
        this.edges = new Set();
    }

    addVertex(name) {
        this.vertices.add(JSON.stringify({
            vertexName: name
        }));
    }

    delVertex(name) {
        this.vertices.delete(JSON.stringify({ vertexName: name }));
    }

    addEdge(vertex1, vertex2, value) {
        if (this.checkVertexPresence(vertex1) && this.checkVertexPresence(vertex2) && vertex2 != vertex1) {
            this.edges.add(JSON.stringify({
                vertexX: (vertex1 < vertex2) ? vertex1 : vertex2,
                vertexY: (vertex1 > vertex2) ? vertex1 : vertex2,
                weight: value
            }))
        }
    }

    delEdge(vertex1, vertex2) {
        this.edges.delete(this.getEdge(vertex1, vertex2));
    }

    getVerticesCount() { return this.vertices.size; }

    getEdgesCount() { return this.edges.size; }

    checkVerticesAdjacent(vertex1, vertex2) {
        if (this.edges.has(this.getEdge(vertex1, vertex2))) {
            return true;
        } else return false;
    }

    getEdgeWeight(vertex1, vertex2) {
        let edge = this.getEdge(vertex1, vertex2);
        if (edge != undefined) {
            return JSON.parse(edge).weight;
        } else return 0;
    }

    getEdges() { return this.edges; }

    getVertices() { return this.vertices }

    checkVertexPresence(name) {
        if (this.vertices.has(JSON.stringify({ vertexName: name }))) {
            return true;
        } else return false;
    }

    getEdge(vertex1, vertex2) {
        if (this.checkVertexPresence(vertex1) &&
            this.checkVertexPresence(vertex2) &&
            vertex1 != vertex2) {
            let res;
            this.edges.forEach(x => {
                let obj = JSON.parse(x);
                let val1 = (vertex1 < vertex2) ? vertex1 : vertex2;
                let val2 = (vertex1 > vertex2) ? vertex1 : vertex2
                if (obj.vertexX == val1 && obj.vertexY == val2) {
                    res = JSON.stringify(obj);
                }
            })
            return res;
        }
    }

    getDistances(startVertex) {
        let distances = new Map();

        this.vertices.forEach(x => {
            if (x != JSON.stringify({ vertexName: startVertex })) {
                distances.set(x, Infinity);
            } else distances.set(x, 0);
        })

        /*for (let i = 0; i < this.getEdgesCount(); i++) {
            this.vertices.forEach(vertex => {
                this.getNeighbors(JSON.parse(vertex).vertexName).forEach(x => {
                    let edge = this.getEdge(JSON.parse(vertex).vertexName, JSON.parse(x).vertexName);
                    if (distances.get(vertex) + JSON.parse(edge).weight < distances.get(x)) {
                        distances.set(x, distances.get(vertex) + JSON.parse(edge).weight);
                    }
                })
            })
        }*/

        this.vertices.forEach(x => {
            this.edges.forEach(ed => {
                let edge = JSON.parse(ed);
                let vertex1 = JSON.stringify({ vertexName: edge.vertexX });
                let vertex2 = JSON.stringify({ vertexName: edge.vertexY });
                if (distances.get(vertex2) > distances.get(vertex1) + edge.weight) {
                    distances.set(vertex2, distances.get(vertex1) + edge.weight)
                }
                if (distances.get(vertex1) > distances.get(vertex2) + edge.weight) {
                    distances.set(vertex1, distances.get(vertex2) + edge.weight)
                }
            })
        })

        return distances;
    }

    getShortcut(vertex1, vertex2) {
        if (this.checkVertexPresence(vertex1) &&
            this.checkVertexPresence(vertex2)) {
            return this.getDistances(vertex1).get(JSON.stringify({ vertexName: vertex2 }));
        } else return 0;
    }

    getNeighbors(vertex) {
        let list = new Set();
        this.vertices.forEach(x => {
            if (this.checkVerticesAdjacent(vertex, JSON.parse(x).vertexName)) {
                list.add(x);
            }
        })
        return list;
    }
}
function test() {
    let g = new Graph();
    g.addVertex(1);
    g.addVertex(3);
    g.addVertex(4);
    g.addVertex(2);
    g.addVertex(5);

    g.addEdge(1, 2, 1);
    g.addEdge(1, 5, 2);
    g.addEdge(2, 4, 1);
    g.addEdge(2, 3, 6);
    g.addEdge(5, 4, 4);
    g.addEdge(4, 3, 1);

    console.log(g.getShortcut(1, 3));
}

