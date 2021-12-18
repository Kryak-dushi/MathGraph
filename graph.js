"use strict";

class Graph {
    constructor() {
        this.vertices = new Set();
        this.edges = new Set();
    }

    addVertex(name) {
        if (this.checkVertexPresence(name)) {
            alert('Такая вершина уже есть');
        } else this.vertices.add(JSON.stringify({
            vertexName: name
        }));
    }

    delVertex(name) {
        this.vertices.delete(JSON.stringify({ vertexName: name }));
    }

    addEdge(vertex1, vertex2, value) {
        if (this.checkVertexPresence(vertex1) && this.checkVertexPresence(vertex2) &&
            vertex2 != vertex1) {
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

    clear() {
        this.vertices.clear();
        this.edges.clear();
    }
}

let data;
let graph = new Graph();

function dataParse() {
    let array = data.split("\r\n");
    let vertexCount = Number(array[0]);
    let matrix = [[], []];
    for (let i = 1; i < array.length; i++) {
        matrix[i - 1] = array[i].split(" ");
    }

    graph.clear();
    for (let i = 1; i <= vertexCount; i++) {
        graph.addVertex(i);
    }
    return {
        graph: graph,
        matrix: matrix
    }
}

function getGraphFromMatrix() {
    let obj = dataParse();
    for (let i = 0; i < obj.matrix.length; i++) {
        for (let j = i + 1; j < obj.matrix.length; j++) {
            if (Number(obj.matrix[i][j]) != 0) {
                obj.graph.addEdge(i + 1, j + 1, Number(obj.matrix[i][j]))
            }
        }
    }
    return obj.graph;
}

function getGraphFromList() {
    let obj = dataParse();
    obj.matrix.forEach(item => {
        obj.graph.addEdge(Number(item[0]), Number(item[1]), Number(item[2]));
    })
    return obj.graph;
}

function readFile(input) {
    let file = input.files[0];
    let type = file.type.replace(/\/.+/, '');
    if (type == "text") {
        let reader = new FileReader();
        reader.readAsText(file);
        reader.onload = () => {
            data = reader.result;
        };
    }
}

function loadMatrix(input) {
    let file = input.files[0];
    let type = file.type.replace(/\/.+/, '');
    if (type == "text") {
        let reader = new FileReader();
        reader.readAsText(file);
        reader.onload = () => {
            data = reader.result;
            getGraphFromMatrix();
            displayGraph();
        };
    }
}

function loadList(input) {
    let file = input.files[0];
    let type = file.type.replace(/\/.+/, '');
    if (type == "text") {
        let reader = new FileReader();
        reader.readAsText(file);
        reader.onload = () => {
            data = reader.result;
            getGraphFromList();
            displayGraph();
        };
    }
}

function graphToMatrix() {
    let matrix = [[]];
    let tmp = '';
    matrix[0] = graph.getVerticesCount();
    for (let i = 0; i < graph.getVerticesCount(); i++) {
        for (let j = 0; j < graph.getVerticesCount(); j++) {
            if (graph.checkVerticesAdjacent(i + 1, j + 1)) {
                tmp = tmp.concat(`${graph.getEdgeWeight(i + 1, j + 1)} `);
            } else tmp = tmp.concat(`0 `);
        }
        matrix[matrix.length] = tmp;
        tmp = '';
    }
    return matrix;
}

function graphToList() {
    let list = [[]];
    list[0] = graph.getVerticesCount();
    let tmp = '';
    graph.getEdges().forEach(item => {
        let edge = JSON.parse(item);
        tmp = tmp.concat(`${edge.vertexX} ${edge.vertexY} ${edge.weight}`);
        list[list.length] = tmp;
        tmp = '';
    })
    return list;
}

function saveFile() {
    let name = document.getElementById('filename').value.concat('.txt');
    let text = '';
    let option;
    let options = document.querySelectorAll("div.group > input[type='radio']");
    for (var i = 0; i < options.length; i++) {
        if (options[i].checked) {
            option = options[i].value;
        }
    }
    let arr;
    if (option == "Matrix") {
        arr = graphToMatrix();
    } else arr = graphToList();

    arr.forEach(item => {
        text = text.concat(`${item}`, "\r\n")
    })
    let file = new Blob([text], { type: 'text/plain' });
    document.getElementById('link').setAttribute('download', name);
    document.getElementById('link').href = URL.createObjectURL(file);
}

function displayGraph() {
    let tmp = 'Вершины:';
    graph.getVertices().forEach(x => {
        tmp = tmp.concat(` ${vname(x)}`);
    })
    document.getElementById("ver").innerHTML = tmp;

    tmp = 'Ребра:';
    graph.getEdges().forEach(x => {
        tmp = tmp.concat(`<br>${ename(x)}`);
    })
    document.getElementById("ed").innerHTML = tmp;
}

function addVertex() {
    let name = document.querySelector("#addVertex > input").value;
    graph.addVertex(Number(name));
    displayGraph();
}

function delVertex() {
    let name = document.querySelector("#delVertex > input").value;
    graph.delVertex(Number(name));
    displayGraph();
}

function addEgde() {
    let input = document.querySelector("#addEdge > input").value;
    let edge = input.split(",");
    if (edge[2] === undefined || edge[2] == '') {
        alert('Вес ребра не задан');
    } else if (graph.checkVerticesAdjacent(Number(edge[0]), Number(edge[1]))) {
        alert('Такое ребро уже есть');
    } else graph.addEdge(Number(edge[0]), Number(edge[1]), Number(edge[2]));
    displayGraph();
}

function delEdge() {
    let input = document.querySelector("#delEdge > input").value;
    let edge = input.split(",");
    graph.delEdge(Number(edge[0]), Number(edge[1]));
    displayGraph();
}

function displayVerticesCount() {
    document.getElementsByName('vcount')[0].innerHTML = `Количество вершин: ${graph.getVerticesCount()}`;
}

function displayEdgesCount() {
    document.getElementsByName('ecount')[0].innerHTML = `Количество ребер: ${graph.getEdgesCount()}`;
}

function checkAdjacent() {
    let input = document.querySelector("#adjacent > input").value;
    let edge = input.split(",");
    document.querySelector("#adjacent > p").innerHTML = (graph.checkVerticesAdjacent(Number(edge[0]), Number(edge[1]))) ? 'Смежные' : 'Не смежные';
}

function getWeight() {
    let input = document.querySelector("#weight > input").value;
    let edge = input.split(",");
    document.querySelector("#weight > p").innerHTML = graph.getEdgeWeight(Number(edge[0]), Number(edge[1]));
}

function getShortcut() {
    let input = document.querySelector("#shortcut > input").value;
    let edge = input.split(",");
    document.querySelector("#shortcut > p").innerHTML = graph.getShortcut(Number(edge[0]), Number(edge[1]));
}

function getNeigbors() {
    let input = document.querySelector("#neigbors > input").value;
    let tmp = `Вершины, смежные с ${input}:`;
    graph.getNeighbors(Number(input)).forEach(x => {
        tmp = tmp.concat(` ${vname(x)}`);
    });
    document.querySelector("#neigbors > p").innerHTML = tmp;
}

function vname(vertex) {
    return JSON.parse(vertex).vertexName;
}

function ename(edge) {
    let o = JSON.parse(edge);
    return `{x: ${o.vertexX}, y: ${o.vertexY}, w: ${o.weight}}`
}

function clearGraph() {
    graph.clear();
    displayGraph();
}