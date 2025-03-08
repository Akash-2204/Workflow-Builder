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