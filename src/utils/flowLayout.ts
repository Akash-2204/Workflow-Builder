import dagre from 'dagre';
import { Node as ReactFlowNode, Edge as ReactFlowEdge } from 'reactflow';
import { DEFAULT_LAYOUT_CONFIG } from '../types/ReactFlowTypes';

export const getLayoutedElements = (nodes: ReactFlowNode[], edges: ReactFlowEdge[]) => {
    const dagreGraph = new dagre.graphlib.Graph();
    dagreGraph.setDefaultEdgeLabel(() => ({}));
    dagreGraph.setGraph({ 
        rankdir: DEFAULT_LAYOUT_CONFIG.rankdir, 
        nodesep: DEFAULT_LAYOUT_CONFIG.nodesep, 
        ranksep: DEFAULT_LAYOUT_CONFIG.ranksep 
    });

    // Add nodes to dagre
    nodes.forEach((node) => {
        dagreGraph.setNode(node.id, { 
            width: DEFAULT_LAYOUT_CONFIG.nodeWidth, 
            height: DEFAULT_LAYOUT_CONFIG.nodeHeight 
        });
    });

    // Add edges to dagre
    edges.forEach((edge) => {
        dagreGraph.setEdge(edge.source, edge.target);
    });

    // Layout the graph
    dagre.layout(dagreGraph);

    // Get the positioned nodes from dagre
    const layoutedNodes = nodes.map((node) => {
        const nodeWithPosition = dagreGraph.node(node.id);
        return {
            ...node,
            position: {
                x: nodeWithPosition.x - DEFAULT_LAYOUT_CONFIG.nodeWidth / 2,
                y: nodeWithPosition.y - DEFAULT_LAYOUT_CONFIG.nodeHeight / 2,
            },
        };
    });

    return { nodes: layoutedNodes, edges };
}; 