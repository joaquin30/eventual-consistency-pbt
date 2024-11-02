import fc from 'fast-check';
import * as Y from 'yjs'
import { describe, it } from 'node:test';
import { Graph } from './graph.js';

// Properties
describe('Grafo CRDT: Consistencia eventual de métodos', () => {
    const strConf = { minLength: 1, maxLength: 1 }
    const arrConf = { minLength: 50 } // numOps

    it('isInCycle es eventualmente consistente', () => {
        fc.assert(
            fc.property(fc.array(fc.tuple(fc.string(strConf), fc.string(strConf)), arrConf), fc.string(strConf), (commands, node) => {
                let ydoc = new Y.Doc()
                let graph = new Graph(ydoc.getMap('graph'))
                let pred = false
                for (let cmd of commands) {
                    graph.addEdge(cmd[0], cmd[1])
                    let newPred = graph.isInCycle(node)
                    if (pred && !newPred) {
                        return false
                    }
                    pred = newPred
                }
                return true
            })
        )
    })

    it('isDisconnected es eventualmente consistente', () => {
        fc.assert(
            fc.property(fc.array(fc.tuple(fc.string(strConf), fc.string(strConf)), arrConf), fc.string(strConf), fc.string(strConf), (commands, node1, node2) => {
                let ydoc = new Y.Doc()
                let graph = new Graph(ydoc.getMap('graph'))
                let pred = false
                for (let cmd of commands) {
                    graph.addEdge(cmd[0], cmd[1])
                    let newPred = graph.isDisconected(node1, node2)
                    if (pred && !newPred) {
                        return false
                    }
                    pred = newPred
                }
                return true
            })
        )
    })
})