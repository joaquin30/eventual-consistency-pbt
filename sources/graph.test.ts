import fc from 'fast-check';
import * as Y from 'yjs'
import { describe, it } from 'node:test';
import { Graph } from './graph.js';
import assert from 'assert';

type MonotonicModel = {
    previous_state: boolean,
    current_state: boolean,
}

class AddEdgeCommand implements fc.Command<MonotonicModel, Graph> {
    a: string
    b: string

    constructor(a: string, b: string) {
        this.a = a
        this.b = b
    }
    
    check(m: Readonly<MonotonicModel>): boolean {
        return true
    }

    run(m: MonotonicModel, r: Graph) {
        r.addEdge(this.a, this.b)
    }

    toString(): string {
        return `addEdge(${this.a}, ${this.b})`
    }
}

class IsInCycleCommand implements fc.Command<MonotonicModel, Graph> {
    node: string

    constructor(node: string) {
        this.node = node
    }
    
    check(m: Readonly<MonotonicModel>): boolean {
        return true
    }

    run(m: MonotonicModel, r: Graph) {
        m.previous_state = m.current_state
        m.current_state = r.isInCycle(this.node)
        assert(!(m.previous_state && !m.current_state))
    }

    toString(): string {
        return `isInCycle(${this.node})`
    }
}

class IsDisconectedCommand implements fc.Command<MonotonicModel, Graph> {
    start: string
    node: string

    constructor(start: string, node: string) {
        this.node = node
        this.start = start
    }
    
    check(m: Readonly<MonotonicModel>): boolean {
        return true
    }

    run(m: MonotonicModel, r: Graph) {
        m.previous_state = m.current_state
        m.current_state = r.isDisconected(this.start, this.node)
        assert(!(m.previous_state && !m.current_state))
    }

    toString(): string {
        return `isDisconnected(${this.start},${this.node})`
    }
}

describe('Consistencia eventual de Grafo CRDT', () => {
    const strConf = { minLength: 1, maxLength: 1 }

    it('isInCycle', () => {
        const allCommands = [
            fc.tuple(fc.string(strConf), fc.string(strConf)).map(t => new AddEdgeCommand(t[0], t[1])),
            fc.constant(new IsInCycleCommand('a')),
        ]
    
        fc.assert(
            fc.property(fc.commands(allCommands, { size: '+1'}), cmds => {
                let ydoc = new Y.Doc();
                const s = () => ({
                    model: { previous_state: false, current_state: false },
                    real: new Graph(ydoc.getMap('graph'))
                });
                fc.modelRun(s, cmds);
            })
        )
    })

    it('isDisconnected', () => {
        const allCommands = [
            fc.tuple(fc.string(strConf), fc.string(strConf)).map(t => new AddEdgeCommand(t[0], t[1])),
            fc.constant(new IsDisconectedCommand('a', 'z')),
        ]
    
        fc.assert(
            fc.property(fc.commands(allCommands, { size: '+1'}), cmds => {
                let ydoc = new Y.Doc();
                const s = () => ({
                    model: { previous_state: false, current_state: false },
                    real: new Graph(ydoc.getMap('graph'))
                });
                fc.modelRun(s, cmds);
            })
        )
    })
})
