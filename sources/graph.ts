import * as Y from 'yjs'

export class Graph {
    private adj: Y.Map<string[]>

    constructor(map: Y.Map<string[]>) {
        this.adj = map
    }

    addEdge(u: string, v: string) {
        if (!this.adj.has(u)) {
            this.adj.set(u, [])
        }
        if (!this.adj.has(v)) {
            this.adj.set(v, [])
        }
        this.adj.get(u)?.push(v)
    }

    private dfs1(node: string, visited: Set<string>): boolean {
        visited.add(node)
        for (const neighbor of this.adj.get(node) || []) {
            if (visited.has(neighbor) || this.dfs1(neighbor, visited)) {
                return true
            }
        }
        return false
    }

    // Verifica que node se encuentre en algún ciclo
    isInCycle(node: string): boolean {
        if (!this.adj.has(node)) {
            return false
        }
        let visited = new Set<string>()
        return this.dfs1(node, visited)
    }

    private dfs2(node: string, visited: Set<string>) {
        visited.add(node)
        for (const neighbor of this.adj.get(node) || []) {
            if (!visited.has(neighbor)) {
                this.dfs2(neighbor, visited) 
            }
        }
    }
    
    // Verifica que node y obj esten desconectados
    isDisconected(node: string, obj: string): boolean {
        if (!this.adj.has(node)) {
            return false
        }
        let visited = new Set<string>()
        this.dfs2(node, visited)
        return visited.has(obj)
    }

    toJSON() {
        return this.adj.toJSON()
    }
}

