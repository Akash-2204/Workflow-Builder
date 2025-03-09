export type NodeType = 'Person' | 'Company' | 'Technology' | 'Project' | 'Community' | 'Event' | 'Investor';

export interface Node {
    id: string;
    label: string;
    type: NodeType;
}

export interface Edge {
    source: string;
    target: string;
    relationship: string;
}

export interface GraphData {
    nodes: Node[];
    edges: Edge[];
}

export interface NodeAttributes {
    label: string;
    size: number;
    color: string;
    type: NodeType;
    hidden: boolean;
    x: number;
    y: number;
    labelSize?: number;
    labelColor?: string;
    labelWeight?: string;
}

export interface EdgeAttributes {
    label: string;
    size: number;
    color: string;
    hidden?: boolean;
}

export interface NodeDetails {
    node: Node;
    connections: Node[];
    relationships: Edge[];
}

export interface GraphState {
    selectedNode: string | null;
    filteredTypes: Set<NodeType>;
    hoveredNode: string | null;
} 