'use client';

import React, { useCallback, useEffect, useMemo } from 'react';
import ReactFlow, {
    Node as ReactFlowNode,
    Edge as ReactFlowEdge,
    Background,
    Controls,
    MiniMap,
    useNodesState,
    useEdgesState,
    NodeProps,
    Handle,
    Position,
    Panel,
} from 'reactflow';
import dagre from 'dagre';
import 'reactflow/dist/style.css';
import { useGraphViewModel } from '../viewModels/GraphViewModel';
import { GraphData, NodeType } from '../types/Graph';
import { NODE_COLORS, GRAPH_LAYOUT_CONFIG } from '../constants/graphConfig';

// Layout configuration
const nodeWidth = 180;
const nodeHeight = 60;

const getLayoutedElements = (nodes: ReactFlowNode[], edges: ReactFlowEdge[]) => {
    const dagreGraph = new dagre.graphlib.Graph();
    dagreGraph.setDefaultEdgeLabel(() => ({}));
    dagreGraph.setGraph({ rankdir: 'TB', nodesep: 80, ranksep: 100 });

    // Add nodes to dagre
    nodes.forEach((node) => {
        dagreGraph.setNode(node.id, { width: nodeWidth, height: nodeHeight });
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
                x: nodeWithPosition.x - nodeWidth / 2,
                y: nodeWithPosition.y - nodeHeight / 2,
            },
        };
    });

    return { nodes: layoutedNodes, edges };
};

// Custom Node Component
const CustomNode = ({ data, selected }: NodeProps) => {
    return (
        <div
            className={`px-4 py-2 shadow-md rounded-lg border ${
                selected ? 'border-blue-500 ring-2 ring-blue-300' : 'border-gray-300'
            }`}
            style={{
                background: data.color,
                width: nodeWidth - 10,
                height: nodeHeight - 10,
            }}
        >
            <Handle 
                type="target" 
                position={Position.Top} 
                className="!bg-gray-400 !w-2 !h-2"
            />
            <div className="flex flex-col justify-center h-full">
                <div className="text-sm font-bold text-white text-center">{data.label}</div>
                <div className="text-xs text-white opacity-80 text-center">{data.type}</div>
            </div>
            <Handle 
                type="source" 
                position={Position.Bottom} 
                className="!bg-gray-400 !w-2 !h-2"
            />
        </div>
    );
};

const nodeTypes = {
    custom: CustomNode,
};

const ReactFlowVisualization: React.FC<{ data: GraphData }> = ({ data }) => {
    const { viewModel, forceUpdate } = useGraphViewModel(data);
    const [nodes, setNodes, onNodesChange] = useNodesState([]);
    const [edges, setEdges, onEdgesChange] = useEdgesState([]);

    // Convert graph data to React Flow format and apply layout
    const { initialNodes, initialEdges } = useMemo(() => {
        const graphNodes = viewModel.getVisibleNodes().map((node) => ({
            id: node.id,
            type: 'custom',
            position: { x: 0, y: 0 },
            data: {
                label: node.label,
                type: node.type,
                color: NODE_COLORS[node.type],
            },
        }));

        const graphEdges = viewModel.getVisibleEdges().map((edge) => ({
            id: `${edge.source}-${edge.target}`,
            source: edge.source,
            target: edge.target,
            label: edge.relationship,
            type: 'smoothstep',
            animated: false,
            style: { stroke: '#999' },
            labelStyle: { fill: '#666', fontSize: 12 },
        }));

        const { nodes: layoutedNodes, edges: layoutedEdges } = getLayoutedElements(
            graphNodes,
            graphEdges
        );

        return { initialNodes: layoutedNodes, initialEdges: layoutedEdges };
    }, [viewModel]);

    // Update layout when filters change
    const updateLayout = useCallback(() => {
        const graphNodes = viewModel.getVisibleNodes().map((node) => ({
            id: node.id,
            type: 'custom',
            position: { x: 0, y: 0 },
            data: {
                label: node.label,
                type: node.type,
                color: NODE_COLORS[node.type],
            },
        }));

        const graphEdges = viewModel.getVisibleEdges().map((edge) => ({
            id: `${edge.source}-${edge.target}`,
            source: edge.source,
            target: edge.target,
            label: edge.relationship,
            type: 'smoothstep',
            animated: false,
            style: { stroke: '#999' },
            labelStyle: { fill: '#666', fontSize: 12 },
        }));

        const { nodes: layoutedNodes, edges: layoutedEdges } = getLayoutedElements(
            graphNodes,
            graphEdges
        );

        setNodes(layoutedNodes);
        setEdges(layoutedEdges);
    }, [viewModel, setNodes, setEdges]);

    // Initialize nodes and edges
    useEffect(() => {
        setNodes(initialNodes);
        setEdges(initialEdges);
    }, [initialNodes, initialEdges, setNodes, setEdges]);

    // Handle node selection
    const onNodeClick = useCallback(
        (_: React.MouseEvent, node: ReactFlowNode) => {
            viewModel.setSelectedNode(node.id);
            forceUpdate();
        },
        [viewModel, forceUpdate]
    );

    // Handle node hover
    const onNodeMouseEnter = useCallback(
        (_: React.MouseEvent, node: ReactFlowNode) => {
            viewModel.setHoveredNode(node.id);
            const neighbors = viewModel.getHoveredNodeNeighbors();
            
            setNodes((nds) =>
                nds.map((n) => ({
                    ...n,
                    style: {
                        ...n.style,
                        opacity: neighbors.has(n.id) || n.id === node.id ? 1 : 0.2,
                    },
                }))
            );

            setEdges((eds) =>
                eds.map((e) => ({
                    ...e,
                    style: {
                        ...e.style,
                        opacity:
                            (neighbors.has(e.source) && neighbors.has(e.target)) ||
                            e.source === node.id ||
                            e.target === node.id
                                ? 1
                                : 0.2,
                    },
                }))
            );
        },
        [viewModel, setNodes, setEdges]
    );

    const onNodeMouseLeave = useCallback(() => {
        viewModel.setHoveredNode(null);
        setNodes((nds) =>
            nds.map((n) => ({
                ...n,
                style: { ...n.style, opacity: 1 },
            }))
        );
        setEdges((eds) =>
            eds.map((e) => ({
                ...e,
                style: { ...e.style, opacity: 1 },
            }))
        );
    }, [viewModel, setNodes, setEdges]);

    // Filter controls
    const renderFilterControls = () => {
        const nodeTypes = viewModel.getNodeTypes();
        const selectedTypes = viewModel.getSelectedTypes();

        return (
            <Panel position="top-left" className="bg-white p-4 rounded-lg shadow-lg">
                <h3 className="text-lg font-semibold mb-3">Filter by Type</h3>
                <div className="space-y-2">
                    {nodeTypes.map((type: NodeType) => (
                        <label
                            key={type}
                            className="flex items-center space-x-2 cursor-pointer"
                        >
                            <input
                                type="checkbox"
                                checked={selectedTypes.has(type)}
                                onChange={() => {
                                    viewModel.toggleNodeTypeFilter(type);
                                    forceUpdate();
                                    updateLayout();
                                }}
                                className="form-checkbox h-4 w-4 text-blue-600"
                            />
                            <span className="text-sm text-gray-700">{type}</span>
                        </label>
                    ))}
                </div>
                <button
                    onClick={() => {
                        viewModel.clearFilters();
                        forceUpdate();
                        updateLayout();
                    }}
                    className="mt-4 w-full px-3 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-md text-sm font-medium transition-colors"
                >
                    Clear Filters
                </button>
            </Panel>
        );
    };

    // Node details panel
    const renderNodeDetails = () => {
        const details = viewModel.getSelectedNodeDetails();
        if (!details) return null;

        return (
            <Panel position="top-right" className="bg-white p-4 rounded-lg shadow-lg w-80">
                <h3 className="text-xl font-semibold text-gray-800 mb-4">
                    {details.node.label}
                </h3>
                <div
                    className="inline-block px-2 py-1 rounded-full text-sm font-medium text-white mb-4"
                    style={{ backgroundColor: NODE_COLORS[details.node.type] }}
                >
                    {details.node.type}
                </div>
                <div className="space-y-4">
                    <div>
                        <h4 className="text-lg font-medium text-gray-700 mb-2">
                            Connections
                        </h4>
                        <ul className="space-y-2">
                            {details.connections.map((node) => (
                                <li
                                    key={node.id}
                                    className="flex items-center space-x-2 p-2 bg-gray-50 rounded-md"
                                >
                                    <div
                                        className="w-3 h-3 rounded-full"
                                        style={{
                                            backgroundColor: NODE_COLORS[node.type],
                                        }}
                                    />
                                    <span className="text-sm text-gray-800">
                                        {node.label}
                                    </span>
                                    <span className="text-xs text-gray-500 ml-auto">
                                        {node.type}
                                    </span>
                                </li>
                            ))}
                        </ul>
                    </div>
                    <div>
                        <h4 className="text-lg font-medium text-gray-700 mb-2">
                            Relationships
                        </h4>
                        <ul className="space-y-2">
                            {details.relationships.map((edge) => (
                                <li
                                    key={`${edge.source}-${edge.target}`}
                                    className="p-2 bg-gray-50 rounded-md text-sm text-gray-700"
                                >
                                    {edge.relationship} with{' '}
                                    {edge.source === details.node.id
                                        ? viewModel.getNodeById(edge.target)?.label
                                        : viewModel.getNodeById(edge.source)?.label}
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            </Panel>
        );
    };

    return (
        <div className="w-full h-screen">
            <ReactFlow
                nodes={nodes}
                edges={edges}
                onNodesChange={onNodesChange}
                onEdgesChange={onEdgesChange}
                onNodeClick={onNodeClick}
                onNodeMouseEnter={onNodeMouseEnter}
                onNodeMouseLeave={onNodeMouseLeave}
                nodeTypes={nodeTypes}
                fitView
                minZoom={0.1}
                maxZoom={1.5}
                defaultEdgeOptions={{
                    type: 'smoothstep',
                    animated: false,
                    style: { stroke: '#999' },
                }}
            >
                <Background gap={20} color="#f1f1f1" />
                <Controls />
                <MiniMap
                    nodeColor={(node) => {
                        return (node.data as { color: string }).color;
                    }}
                    maskColor="rgba(255, 255, 255, 0.8)"
                />
                {renderFilterControls()}
                {renderNodeDetails()}
            </ReactFlow>
        </div>
    );
};

export default ReactFlowVisualization; 