import type { Attributes } from 'graphology-types';
import type { NodeType, GraphData } from './Graph';

export type LayoutType = 'circular' | 'force' | 'random' | 'circlepack';

export interface NodeAttributes extends Attributes {
    label: string;
    size: number;
    color: string;
    nodeType: NodeType;
    hidden: boolean;
    x: number;
    y: number;
    labelSize?: number;
    labelColor?: string;
    labelWeight?: string;
}

export interface GraphVisualizationProps {
    data?: GraphData;
}

// Define node colors based on type
export const NODE_COLORS: Record<NodeType, string> = {
    Person: '#4CAF50',
    Company: '#2196F3',
    Technology: '#FF9800',
    Project: '#9C27B0',
    Community: '#F44336',
    Event: '#795548',
    Investor: '#607D8B'
}; 