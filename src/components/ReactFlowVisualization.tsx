'use client';

import React, { useCallback, useEffect, useMemo, useState } from 'react';
import ReactFlow, {
    Background,
    Controls,
    MiniMap,
    useNodesState,
    useEdgesState,
    Node,
} from 'reactflow';
import 'reactflow/dist/style.css';

import { useGraphViewModel } from '../viewModels/GraphViewModel';
import { GraphData, NodeType } from '../types/Graph';
import { NODE_COLORS } from '../types/GraphUI';
import { ZOOM_CONFIG } from '../types/ReactFlowTypes';
import { getLayoutedElements } from '../utils/flowLayout';
import CustomNode from './flow/CustomNode';
import FilterPanel from './flow/FilterPanel';
import NodeDetailsPanel from './flow/NodeDetailsPanel';

const nodeTypes = {
    custom: CustomNode,
};

const ReactFlowVisualization: React.FC<{ data: GraphData }> = ({ data }) => {
    const { viewModel, forceUpdate } = useGraphViewModel(data);
    const [nodes, setNodes, onNodesChange] = useNodesState([]);
    const [edges, setEdges, onEdgesChange] = useEdgesState([]);
    const [selectedTypes] = useState<Set<NodeType>>(new Set());

    // Convert graph data to React Flow format and apply layout
    const layoutElements = useMemo(() => {
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

        return getLayoutedElements(graphNodes, graphEdges);
    }, [viewModel]);

    // Initialize nodes and edges
    useEffect(() => {
        setNodes(layoutElements.nodes);
        setEdges(layoutElements.edges);
    }, [layoutElements, setNodes, setEdges]);

    // Handle node selection
    const onNodeClick = useCallback(
        (_: React.MouseEvent, node: Node) => {
            viewModel.setSelectedNode(node.id);
            forceUpdate();
        },
        [viewModel, forceUpdate]
    );

    // Handle node hover
    const onNodeMouseEnter = useCallback(
        (_: React.MouseEvent, node: Node) => {
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

    const handleFilterChange = useCallback(() => {
        const { nodes: layoutedNodes, edges: layoutedEdges } = getLayoutedElements(
            viewModel.getVisibleNodes().map((node) => ({
                id: node.id,
                type: 'custom',
                position: { x: 0, y: 0 },
                data: {
                    label: node.label,
                    type: node.type,
                    color: NODE_COLORS[node.type],
                },
            })),
            viewModel.getVisibleEdges().map((edge) => ({
                id: `${edge.source}-${edge.target}`,
                source: edge.source,
                target: edge.target,
                label: edge.relationship,
                type: 'smoothstep',
                animated: false,
                style: { stroke: '#999' },
                labelStyle: { fill: '#666', fontSize: 12 },
            }))
        );

        setNodes(layoutedNodes);
        setEdges(layoutedEdges);
    }, [viewModel, setNodes, setEdges]);

    const handleCloseDetails = useCallback(() => {
        viewModel.setSelectedNode(null);
        forceUpdate();
    }, [viewModel, forceUpdate]);

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
                minZoom={ZOOM_CONFIG.minZoom}
                maxZoom={ZOOM_CONFIG.maxZoom}
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
                <FilterPanel
                    viewModel={viewModel}
                    selectedTypes={selectedTypes}
                    onFilterChange={handleFilterChange}
                />
                <NodeDetailsPanel
                    viewModel={viewModel}
                    onClose={handleCloseDetails}
                />
            </ReactFlow>
        </div>
    );
};

export default ReactFlowVisualization; 