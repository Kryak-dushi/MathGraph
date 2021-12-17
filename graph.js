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
}

