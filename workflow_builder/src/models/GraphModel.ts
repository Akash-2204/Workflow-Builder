import { GraphData, Node, Edge, NodeType } from '../types/Graph';

export class GraphModel {
    private data: GraphData;

    constructor(data: GraphData) {
        this.data = data;
    }

    getAllNodes(): Node[] {
        return this.data.nodes;
    }

    getAllEdges(): Edge[] {
        return this.data.edges;
    }

    getNodesByType(type: NodeType): Node[] {
        return this.data.nodes.filter(node => node.type === type);
    }

    getNodeById(id: string): Node | undefined {
        return this.data.nodes.find(node => node.id === id);
    }

    getConnectedNodes(nodeId: string): Node[] {
        const connectedNodeIds = new Set<string>();
        
        this.data.edges.forEach(edge => {
            if (edge.source === nodeId) {
                connectedNodeIds.add(edge.target);
            }
            if (edge.target === nodeId) {
                connectedNodeIds.add(edge.source);
            }
        });

        return this.data.nodes.filter(node => connectedNodeIds.has(node.id));
    }

    getRelationships(nodeId: string): Edge[] {
        return this.data.edges.filter(edge => 
            edge.source === nodeId || edge.target === nodeId
        );
    }
} 