"use strict"

var pool = require("typedarray-pool")
var iota = require("iota-array")
var bipartiteMatching = require("bipartite-matching")

module.exports = bipartiteVertexCover

function walk(list, v, adjL, matchL, coverL, matchR, coverR) {
  if(coverL[v] || matchL[v] >= 0) {
    return
  }
  while(v >= 0) {
    coverL[v] = 1
    var adj = adjL[v]
    var next = -1
    for(var i=0,l=adj.length; i<l; ++i) {
      var u = adj[i]
      if(coverR[u]) {
        continue
      }
      next = u
    }
    if(next < 0) {
      break
    }
    coverR[next] = 1
    list.push(next)
    v = matchR[next]
  }
}

function bipartiteVertexCover(n, m, edges) {
  var match = bipartiteMatching(n, m, edges)

  //Initialize adjacency lists
  var adjL = new Array(n)
  var matchL = pool.mallocInt32(n)
  var matchCount = pool.mallocInt32(n)
  var coverL = pool.mallocInt32(n)
  for(var i=0; i<n; ++i) {
    adjL[i] = []
    matchL[i] = -1
    matchCount[i] = 0
    coverL[i] = 0
  }
  var adjR = new Array(m)
  var matchR = pool.mallocInt32(m)
  var coverR = pool.mallocInt32(m)
  for(var i=0; i<m; ++i) {
    adjR[i] = []
    matchR[i] = -1
    coverR[i] = 0
  }

  //Unpack matching
  for(var i=0,l=match.length; i<l; ++i) {
    var s = match[i][0]
    var t = match[i][1]
    matchL[s] = t
    matchR[t] = s
  }

  //Loop over edges
  for(var i=0,l=edges.length; i<l; ++i) {
    var e = edges[i]
    var s = e[0]
    var t = e[1]
    if(matchL[s] === t) {
      if(!(matchCount[s]++)) {
        continue
      }
    }
    adjL[s].push(t)
    adjR[t].push(s)
  }

  //Construct cover
  var left = []
  var right = []
  for(var i=0; i<n; ++i) {
    walk(right, i, adjL, matchL, coverL, matchR, coverR)
  }
  for(var i=0; i<m; ++i) {
    walk(left, i, adjR, matchR, coverR, matchL, coverL) 
  }

  //Clean up any left over edges
  for(var i=0; i<n; ++i) {
    if(!coverL[i] && matchL[i] >= 0) {
      coverR[matchL[i]] = coverL[i] = 1
      left.push(i)
    }
  }

  //Clean up data
  pool.free(coverR)
  pool.free(matchR)
  pool.free(coverL)
  pool.free(matchCount)
  pool.free(matchL)

  return [ left, right ]
}