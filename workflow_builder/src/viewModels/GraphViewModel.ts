import { useState, useCallback } from 'react';
import { GraphModel } from '../models/GraphModel';
import { Node, Edge, NodeType, GraphData, NodeDetails, GraphState } from '../types/Graph';

export class GraphViewModel {
    private model: GraphModel;
    private state: GraphState = {
        selectedNode: null,
        filteredTypes: new Set<NodeType>(),
        hoveredNode: null
    };
    private stateChangeCallbacks: (() => void)[] = [];

    constructor(data: GraphData) {
        this.model = new GraphModel(data);
    }

    // State Management
    private notifyStateChange() {
        this.stateChangeCallbacks.forEach(callback => callback());
    }

    onStateChange(callback: () => void) {
        this.stateChangeCallbacks.push(callback);
        return () => {
            this.stateChangeCallbacks = this.stateChangeCallbacks.filter(cb => cb !== callback);
        };
    }

    // Node Visibility
    getVisibleNodes(): Node[] {
        const { filteredTypes } = this.state;
        if (filteredTypes.size === 0) {
            return this.model.getAllNodes();
        }
        return this.model.getAllNodes().filter(node => 
            filteredTypes.has(node.type)
        );
    }

    getVisibleEdges(): Edge[] {
        const visibleNodes = new Set(this.getVisibleNodes().map(node => node.id));
        return this.model.getAllEdges().filter(edge => 
            visibleNodes.has(edge.source) && visibleNodes.has(edge.target)
        );
    }

    // Node Selection
    setSelectedNode(nodeId: string | null) {
        this.state.selectedNode = nodeId;
        this.notifyStateChange();
    }

    getSelectedNodeDetails(): NodeDetails | null {
        const { selectedNode } = this.state;
        if (!selectedNode) return null;

        const node = this.model.getNodeById(selectedNode);
        if (!node) return null;

        return {
            node,
            connections: this.model.getConnectedNodes(selectedNode),
            relationships: this.model.getRelationships(selectedNode)
        };
    }

    // Node Hovering
    setHoveredNode(nodeId: string | null) {
        this.state.hoveredNode = nodeId;
        this.notifyStateChange();
    }

    getHoveredNodeNeighbors(): Set<string> {
        const { hoveredNode } = this.state;
        if (!hoveredNode) return new Set();
        return this.model.getNodeNeighbors(hoveredNode);
    }

    // Filtering
    getSelectedTypes(): Set<NodeType> {
        return this.state.filteredTypes;
    }

    toggleNodeTypeFilter(type: NodeType) {
        const { filteredTypes } = this.state;
        if (filteredTypes.has(type)) {
            filteredTypes.delete(type);
        } else {
            filteredTypes.add(type);
        }
        this.notifyStateChange();
    }

    clearFilters() {
        this.state.filteredTypes.clear();
        this.notifyStateChange();
    }

    // Utility Methods
    getNodeTypes(): NodeType[] {
        return this.model.getUniqueNodeTypes();
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

    // Subscribe to state changes
    useCallback(() => {
        return viewModel.onStateChange(forceUpdate);
    }, [viewModel, forceUpdate]);

    return {
        viewModel,
        forceUpdate
    };
}; 