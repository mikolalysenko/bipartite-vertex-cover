"use strict"

var bipartiteCover = require("../vcover")
var tape = require("tape")
var dup = require("dup")

tape("bipartite-vertex-cover", function(t) {

  function verifyCover(n, m, edges, expectedCount) {
    var cover = bipartiteCover(n, m, edges)
    var lc = dup(n)
    for(var i=0; i<cover[0].length; ++i) {
      t.equals(lc[cover[0][i]], 0, "make sure no vertex is double counted")
      lc[cover[0][i]] = 1
    }
    var rc = dup(m)
    for(var i=0; i<cover[1].length; ++i) {
      t.equals(rc[cover[1][i]], 0, "make sure no vertex is double counted")
      rc[cover[1][i]] = 1
    }
    for(var i=0; i<edges.length; ++i) {
      var e = edges[i]
      var a = e[0]
      var b = e[1]
      t.ok(lc[a] || rc[b], "checking edge " + e + " is covered")
    }
    t.equals(cover[0].length + cover[1].length, expectedCount, "checking cover appropriate size")
  }

  function test(n, m, edges, expectedCount) {
    verifyCover(n, m, edges, expectedCount)
    var nedges = new Array(edges.length)
    for(var i=0; i<edges.length; ++i) {
      nedges[i] = [ edges[i][1], edges[i][0] ]
    }
    verifyCover(m, n, nedges, expectedCount)
  }

  test(4, 4, [
    [0, 1],
    [1, 0],
    [1, 1],
    [1, 2],
    [2, 1],
    [3, 2],
    [3, 3]
    ], 3)

  test(5, 1, [], 0)

  test(1, 1, [[0,0]], 1)

  test(2, 1, [[0, 0], [1,0]], 1)


  t.end()
})