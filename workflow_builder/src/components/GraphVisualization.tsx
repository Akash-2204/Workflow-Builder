'use client';

import React, { useEffect, useRef } from 'react';
import type Graph from 'graphology';
import type Sigma from 'sigma';
import type { Attributes } from 'graphology-types';
import { useGraphViewModel } from '../viewModels/GraphViewModel';
import { graphData } from '../data/graphData';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import type { Node, Edge, NodeType } from '../types/Graph';

interface NodeAttributes extends Attributes {
    label: string;
    size: number;
    color: string;
    type: NodeType;
    hidden: boolean;
    x: number;
    y: number;
}

// Define node colors based on type
const NODE_COLORS: Record<NodeType, string> = {
    Person: '#4CAF50',
    Company: '#2196F3',
    Technology: '#FF9800',
    Project: '#9C27B0',
    Community: '#F44336',
    Event: '#795548',
    Investor: '#607D8B'
};

const GraphVisualization: React.FC = () => {
    const containerRef = useRef<HTMLDivElement>(null);
    const { viewModel, forceUpdate } = useGraphViewModel(graphData);
    const sigmaRef = useRef<Sigma | null>(null);
    const hoveredNodeRef = useRef<string | null>(null);

    useEffect(() => {
        let graph: Graph;
        let sigma: Sigma;

        const initializeGraph = async () => {
            if (!containerRef.current) return;

            const { default: Graph } = await import('graphology');
            const { default: Sigma } = await import('sigma');
            const { circular } = await import('graphology-layout');
            const { default: forceAtlas2 } = await import('graphology-layout-forceatlas2');

            // Create a new graph instance
            graph = new Graph();

            // Add nodes to the graph
            const nodes = viewModel.getVisibleNodes();
            nodes.forEach(node => {
                graph.addNode(node.id, {
                    label: node.label,
                    size: 10,
                    color: NODE_COLORS[node.type],
                    hidden: false,
                    x: Math.random() * 100,
                    y: Math.random() * 100
                });
            });

            // Add edges to the graph
            const edges = viewModel.getVisibleEdges();
            edges.forEach(edge => {
                graph.addEdge(edge.source, edge.target, {
                    label: edge.relationship,
                    size: 1,
                    color: '#999',
                    hidden: false
                });
            });

            // Apply layouts
            circular.assign(graph);
            forceAtlas2.assign(graph, {
                iterations: 100,
                settings: {
                    gravity: 1,
                    scalingRatio: 2
                }
            });

            const updateNodeVisibility = () => {
                const hoveredNode = hoveredNodeRef.current;
                const selectedTypes = viewModel.getSelectedTypes();
                const hasFilters = selectedTypes.size > 0;

                graph.forEachNode((nodeId, attributes) => {
                    const nodeAttrs = attributes as unknown as NodeAttributes;
                    if (hoveredNode) {
                        // When a node is hovered, show it and its connections
                        const isHovered = nodeId === hoveredNode;
                        const isConnected = graph.neighbors(hoveredNode).includes(nodeId);
                        nodeAttrs.hidden = !(isHovered || isConnected);
                        nodeAttrs.size = isHovered ? 15 : 10;
                        nodeAttrs.color = isHovered ? '#ff0000' : NODE_COLORS[nodeAttrs.type];
                    } else if (hasFilters) {
                        // When filters are active, show only nodes of selected types
                        nodeAttrs.hidden = !selectedTypes.has(nodeAttrs.type);
                        nodeAttrs.size = 10;
                        nodeAttrs.color = NODE_COLORS[nodeAttrs.type];
                    } else {
                        // Show all nodes when no filters are active
                        nodeAttrs.hidden = false;
                        nodeAttrs.size = 10;
                        nodeAttrs.color = NODE_COLORS[nodeAttrs.type];
                    }
                });

                graph.forEachEdge((edgeId, attributes, source, target) => {
                    if (hoveredNode) {
                        // Show edges connected to hovered node
                        attributes.hidden = !(source === hoveredNode || target === hoveredNode);
                    } else if (hasFilters) {
                        // Show edges between visible nodes
                        const sourceAttr = graph.getNodeAttributes(source);
                        const targetAttr = graph.getNodeAttributes(target);
                        attributes.hidden = sourceAttr.hidden || targetAttr.hidden;
                    } else {
                        attributes.hidden = false;
                    }
                });

                sigma.refresh();
            };

            // Initialize Sigma
            sigma = new Sigma(graph, containerRef.current, {
                minCameraRatio: 0.1,
                maxCameraRatio: 10
            });

            // Handle interactions
            sigma.on('enterNode', ({ node }) => {
                hoveredNodeRef.current = node;
                updateNodeVisibility();
            });

            sigma.on('leaveNode', () => {
                hoveredNodeRef.current = null;
                updateNodeVisibility();
            });

            sigma.on('clickNode', ({ node }) => {
                viewModel.setSelectedNode(node);
                forceUpdate();
            });

            sigmaRef.current = sigma;

            // Update visibility when filters change
            viewModel.onFiltersChange(() => {
                updateNodeVisibility();
            });
        };

        initializeGraph();

        return () => {
            if (sigmaRef.current) {
                sigmaRef.current.kill();
            }
        };
    }, [viewModel, forceUpdate]);

    // Get selected node details
    const selectedDetails = viewModel.getSelectedNodeDetails();

    return (
        <div className="flex h-screen bg-gray-50">
            {/* Graph visualization */}
            <div
                ref={containerRef}
                className="flex-1 h-full border-r border-gray-200 bg-white shadow-inner"
            />

            {/* Node details sidebar */}
            <div className="w-80 p-6 bg-white shadow-lg overflow-y-auto">
                <h2 className="text-2xl font-semibold text-gray-800 mb-6">Node Details</h2>
                {selectedDetails ? (
                    <div className="space-y-6">
                        <div>
                            <h3 className="text-xl font-medium text-gray-700">{selectedDetails.node.label}</h3>
                            <span className="inline-block px-3 py-1 mt-2 text-sm font-medium rounded-full"
                                  style={{ 
                                      backgroundColor: NODE_COLORS[selectedDetails.node.type],
                                      color: 'white'
                                  }}>
                                {selectedDetails.node.type}
                            </span>
                        </div>
                        
                        <div>
                            <h4 className="text-lg font-medium text-gray-700 mb-2">Connections</h4>
                            <ul className="space-y-2">
                                {selectedDetails.connections.map(node => (
                                    <li key={node.id} 
                                        className="flex items-center p-2 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors">
                                        <span className="w-3 h-3 rounded-full mr-2" 
                                              style={{ backgroundColor: NODE_COLORS[node.type] }} />
                                        <span className="text-gray-800">{node.label}</span>
                                        <span className="text-sm text-gray-500 ml-auto">{node.type}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        <div>
                            <h4 className="text-lg font-medium text-gray-700 mb-2">Relationships</h4>
                            <ul className="space-y-2">
                                {selectedDetails.relationships.map(edge => (
                                    <li key={`${edge.source}-${edge.target}`}
                                        className="p-2 rounded-lg bg-gray-50 text-gray-700">
                                        <span className="font-medium">{edge.relationship}</span> with{' '}
                                        {edge.source === selectedDetails.node.id
                                            ? viewModel.getNodeById(edge.target)?.label
                                            : viewModel.getNodeById(edge.source)?.label}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                ) : (
                    <p className="text-gray-500 italic">Select a node to see details</p>
                )}

                {/* Node type filters */}
                <div className="mt-8 pt-6 border-t border-gray-200">
                    <h4 className="text-lg font-medium text-gray-700 mb-4">Filter by Type</h4>
                    <div className="space-y-2">
                        {viewModel.getNodeTypes().map(type => (
                            <label key={type} 
                                   className="flex items-center p-2 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer">
                                <input
                                    type="checkbox"
                                    onChange={() => {
                                        viewModel.toggleNodeTypeFilter(type);
                                        forceUpdate();
                                    }}
                                    className="w-4 h-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                                />
                                <span className="ml-3 text-gray-700">{type}</span>
                            </label>
                        ))}
                    </div>
                    <button
                        onClick={() => {
                            viewModel.clearFilters();
                            forceUpdate();
                        }}
                        className="mt-4 w-full px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors font-medium"
                    >
                        Clear Filters
                    </button>
                </div>
            </div>
        </div>
    );
};

export default GraphVisualization; 