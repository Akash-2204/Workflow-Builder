import { NodeProps } from 'reactflow';
import { NodeType } from './Graph';

export interface ReactFlowNodeData {
    label: string;
    type: NodeType;
    color: string;
}

export interface LayoutConfig {
    nodeWidth: number;
    nodeHeight: number;
    rankdir: string;
    nodesep: number;
    ranksep: number;
}

export type CustomNodeProps = NodeProps<ReactFlowNodeData>;

// Constants
export const DEFAULT_LAYOUT_CONFIG: LayoutConfig = {
    nodeWidth: 180,
    nodeHeight: 60,
    rankdir: 'TB',
    nodesep: 80,
    ranksep: 100
};

export const ZOOM_CONFIG = {
    minZoom: 0.1,
    maxZoom: 1.5
}; 