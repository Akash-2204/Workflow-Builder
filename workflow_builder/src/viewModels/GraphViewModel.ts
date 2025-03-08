import { useState, useCallback } from 'react';
import { GraphModel } from '../models/GraphModel';
import { Node, Edge, NodeType, GraphData } from '../types/Graph';

export class GraphViewModel {
    private model: GraphModel;
    private selectedNode: string | null = null;
    private filteredNodeTypes: Set<NodeType> = new Set();
    private filterChangeCallbacks: (() => void)[] = [];

    constructor(data: GraphData) {
        this.model = new GraphModel(data);
    }

    getVisibleNodes(): Node[] {
        if (this.filteredNodeTypes.size === 0) {
            return this.model.getAllNodes();
        }
        return this.model.getAllNodes().filter(node => 
            this.filteredNodeTypes.has(node.type)
        );
    }

    getVisibleEdges(): Edge[] {
        const visibleNodes = new Set(this.getVisibleNodes().map(node => node.id));
        return this.model.getAllEdges().filter(edge => 
            visibleNodes.has(edge.source) && visibleNodes.has(edge.target)
        );
    }

    setSelectedNode(nodeId: string | null) {
        this.selectedNode = nodeId;
    }

    getSelectedNodeDetails(): { node: Node, connections: Node[], relationships: Edge[] } | null {
        if (!this.selectedNode) return null;

        const node = this.model.getNodeById(this.selectedNode);
        if (!node) return null;

        return {
            node,
            connections: this.model.getConnectedNodes(this.selectedNode),
            relationships: this.model.getRelationships(this.selectedNode)
        };
    }

    getSelectedTypes(): Set<NodeType> {
        return this.filteredNodeTypes;
    }

    onFiltersChange(callback: () => void) {
        this.filterChangeCallbacks.push(callback);
    }

    toggleNodeTypeFilter(type: NodeType) {
        if (this.filteredNodeTypes.has(type)) {
            this.filteredNodeTypes.delete(type);
        } else {
            this.filteredNodeTypes.add(type);
        }
        this.filterChangeCallbacks.forEach(callback => callback());
    }

    clearFilters() {
        this.filteredNodeTypes.clear();
        this.filterChangeCallbacks.forEach(callback => callback());
    }

    getNodeTypes(): NodeType[] {
        const types = new Set<NodeType>();
        this.model.getAllNodes().forEach(node => types.add(node.type));
        return Array.from(types);
    }

    getNodeById(id: string): Node | undefined {
        return this.model.getNodeById(id);
    }
}

// React Hook for using the GraphViewModel
export const useGraphViewModel = (initialData: GraphData) => {
    const [viewModel] = useState(() => new GraphViewModel(initialData));
    const [, setUpdateTrigger] = useState({});

    const forceUpdate = useCallback(() => {
        setUpdateTrigger({});
    }, []);

    return {
        viewModel,
        forceUpdate
    };
}; 