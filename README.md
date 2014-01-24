bipartite-vertex-cover
======================
Computes a [minimum vertex cover](http://en.wikipedia.org/wiki/Vertex_cover) of a bipartite graph.  Internally, this implementation uses the Hopcroft-Karp algorithm and [Konig's theorem](http://en.wikipedia.org/wiki/K%C3%B6nig's_theorem_\(graph_theory\)) to compute the minimal vertex cover of a bipartite graph in O(sqrt(V) * E) time.  This code works in both node.js and in a modern browser via [browserify](http://browserify.org/).

## Example

```javascript
var findCover = require("bipartite-vertex-cover")

var cover = findCover(4, 4, [
    [0, 1],
    [1, 0],
    [1, 1],
    [1, 2],
    [2, 1],
    [3, 2],
    [3, 3]
    ])

// Cover = [ [3, 1], [1] ]
```

## Install

```
npm install bipartite-vertex-cover
```

## `require("bipartite-vertex-cover")(n, m, edges)`
Finds a minimal vertex cover for a bipartite graph.

* `n` is the number of vertices in the left component
* `m` is the number of vertices in the right component
* `edges` is a list of edges from the left component connecting to the right component represented by pairs of integers between 0 and n-1,m-1 respectively

**Returns** A pair of lists representing the vertices in the left component and the right component respectively which are in the cover.

## Credits
(c) 2014 Mikola Lysenko. MIT License