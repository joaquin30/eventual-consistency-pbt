import * as Y from 'yjs'
// import * as A from "@automerge/automerge/next"
import { Graph } from './graph.js'

let ydoc = new Y.Doc()
let graph = new Graph(ydoc.getMap('graph'))
console.log(graph.toJSON())