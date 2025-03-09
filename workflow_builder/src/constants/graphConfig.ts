import { NodeType } from '../types/Graph';

export const NODE_COLORS: Record<NodeType, string> = {
    Person: '#4CAF50',
    Company: '#2196F3',
    Technology: '#FF9800',
    Project: '#9C27B0',
    Community: '#F44336',
    Event: '#795548',
    Investor: '#607D8B'
};

export const GRAPH_LAYOUT_CONFIG = {
    FORCE_ATLAS: {
        iterations: 100,
        settings: {
            gravity: 1,
            scalingRatio: 2
        }
    },
    NODE_SIZES: {
        DEFAULT: 15,
        HOVERED: 20
    },
    LABEL_SIZES: {
        DEFAULT: 14,
        HOVERED: 16
    }
};

export const SIGMA_CONFIG = {
    minCameraRatio: 0.1,
    maxCameraRatio: 10,
    renderLabels: true,
    labelSize: 12,
    labelWeight: 'bold',
    labelColor: {
        color: '#000000'
    },
    labelDensity: 0.7,
    labelGridCellSize: 60,
    labelRenderedSizeThreshold: 6
}; 