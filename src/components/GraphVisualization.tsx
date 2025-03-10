'use client';

import React, { useEffect, useRef, useState } from 'react';
import type Graph from 'graphology';
import type Sigma from 'sigma';
import type { Attributes } from 'graphology-types';
import { useGraphViewModel } from '../viewModels/GraphViewModel';
import { graphData as defaultGraphData } from '../data/graphData';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import type { Node, Edge, NodeType, GraphData } from '../types/Graph';

type LayoutType = 'circular' | 'force' | 'random' | 'circlepack';

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

interface GraphVisualizationProps {
    data?: GraphData;
}

const GraphVisualization: React.FC<GraphVisualizationProps> = ({ data = defaultGraphData }) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const { viewModel, forceUpdate } = useGraphViewModel(data);
    const sigmaRef = useRef<Sigma | null>(null);
    const graphRef = useRef<Graph | null>(null);
    const hoveredNodeRef = useRef<string | null>(null);
    const [selectedTypes, setSelectedTypes] = useState<Set<NodeType>>(new Set());
    const [selectedLayout, setSelectedLayout] = useState<LayoutType>('circular');

    const applyLayout = async (graph: Graph, layout: LayoutType) => {
        const graphologyLayout = await import('graphology-layout');
        
        switch (layout) {
            case 'circular': {
                graphologyLayout.circular.assign(graph);
                break;
            }
            case 'force': {
                const { default: forceAtlas2 } = await import('graphology-layout-forceatlas2');
                forceAtlas2.assign(graph, {
                    iterations: 100,
                    settings: {
                        gravity: 1,
                        scalingRatio: 2
                    }
                });
                break;
            }
            case 'random': {
                graphologyLayout.random.assign(graph);
                break;
            }
            case 'circlepack': {
                graphologyLayout.circlepack.assign(graph);
                break;
            }
        }
    };

    const initializeGraph = async () => {
        if (!containerRef.current) return;

        // Cleanup previous instance
        if (sigmaRef.current) {
            sigmaRef.current.kill();
            sigmaRef.current = null;
        }

        if (graphRef.current) {
            graphRef.current.clear();
            graphRef.current = null;
        }

        const { default: Graph } = await import('graphology');
        const { default: Sigma } = await import('sigma');

        // Create a new graph instance
        const graph = new Graph();
        graphRef.current = graph;

        // Add nodes to the graph
        const nodes = viewModel.getVisibleNodes();
        nodes.forEach(node => {
            graph.addNode(node.id, {
                label: node.label,
                size: 15,
                color: NODE_COLORS[node.type],
                x: Math.random() * 100,
                y: Math.random() * 100,
                labelSize: 14,
                labelColor: '#000000',
                labelWeight: 'bold'
            });
        });

        // Add edges to the graph
        const edges = viewModel.getVisibleEdges();
        edges.forEach(edge => {
            if (graph.hasNode(edge.source) && graph.hasNode(edge.target)) {
                graph.addEdge(edge.source, edge.target, {
                    label: edge.relationship,
                    size: 1,
                    color: '#999'
                });
            }
        });

        // Apply selected layout
        await applyLayout(graph, selectedLayout);

        if (!containerRef.current) return;

        // Initialize Sigma
        const sigma = new Sigma(graph, containerRef.current, {
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
        });

        // Handle interactions
        sigma.on('enterNode', ({ node }) => {
            if (!graph) return;
            hoveredNodeRef.current = node;
            const connectedNodeIds = new Set([node, ...graph.neighbors(node)]);
            
            // Update all nodes
            graph.forEachNode((nodeId, attrs) => {
                const nodeAttrs = attrs as NodeAttributes;
                const isConnected = connectedNodeIds.has(nodeId);
                
                if (isConnected) {
                    nodeAttrs.size = nodeId === node ? 20 : 15;
                    nodeAttrs.color = nodeId === node ? '#ff0000' : NODE_COLORS[nodeAttrs.type];
                    nodeAttrs.labelSize = nodeId === node ? 16 : 14;
                    nodeAttrs.hidden = false;
                } else {
                    nodeAttrs.hidden = true;
                }
            });

            // Update edges
            graph.forEachEdge((edgeId, attrs, source, target) => {
                attrs.hidden = !(connectedNodeIds.has(source) && connectedNodeIds.has(target));
            });

            sigma.refresh();
        });

        sigma.on('leaveNode', () => {
            if (!graph) return;
            hoveredNodeRef.current = null;
            
            // Restore all nodes
            graph.forEachNode((nodeId, attrs) => {
                const nodeAttrs = attrs as NodeAttributes;
                nodeAttrs.size = 15;
                nodeAttrs.color = NODE_COLORS[nodeAttrs.type];
                nodeAttrs.labelSize = 14;
                nodeAttrs.hidden = false;
            });

            // Restore all edges
            graph.forEachEdge((edgeId, attrs) => {
                attrs.hidden = false;
            });

            sigma.refresh();
        });

        sigma.on('clickNode', ({ node }) => {
            viewModel.setSelectedNode(node);
            forceUpdate();
        });

        sigmaRef.current = sigma;
    };

    // Initialize graph on mount
    useEffect(() => {
        initializeGraph();

        return () => {
            if (sigmaRef.current) {
                sigmaRef.current.kill();
                sigmaRef.current = null;
            }
            if (graphRef.current) {
                graphRef.current.clear();
                graphRef.current = null;
            }
        };
    }, []);

    // Reinitialize graph when filters or layout changes
    useEffect(() => {
        initializeGraph();
    }, [selectedTypes, selectedLayout, viewModel]);

    const handleFilterChange = (type: NodeType) => {
        const newSelectedTypes = new Set(selectedTypes);
        if (newSelectedTypes.has(type)) {
            newSelectedTypes.delete(type);
        } else {
            newSelectedTypes.add(type);
        }
        setSelectedTypes(newSelectedTypes);
        viewModel.toggleNodeTypeFilter(type);
        forceUpdate();
    };

    const handleClearFilters = () => {
        setSelectedTypes(new Set());
        viewModel.clearFilters();
        forceUpdate();
    };

    const handleLayoutChange = (layout: LayoutType) => {
        setSelectedLayout(layout);
    };

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

                {/* Layout Selection */}
                <div className="mt-8 pt-6 border-t border-gray-200">
                    <h4 className="text-lg font-medium text-gray-700 mb-4">Layout Type</h4>
                    <div className="space-y-2">
                        {(['circular', 'force', 'random', 'circlepack'] as LayoutType[]).map(layout => (
                            <label key={layout} 
                                   className={`flex items-center p-2 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer ${
                                       selectedLayout === layout ? 'bg-blue-50' : ''
                                   }`}>
                                <input
                                    type="radio"
                                    name="layout"
                                    checked={selectedLayout === layout}
                                    onChange={() => handleLayoutChange(layout)}
                                    className="w-4 h-4 text-blue-600 rounded-full border-gray-300 focus:ring-blue-500"
                                />
                                <span className="ml-3 text-gray-700 capitalize">{layout}</span>
                            </label>
                        ))}
                    </div>
                </div>

                {/* Node type filters */}
                <div className="mt-8 pt-6 border-t border-gray-200">
                    <h4 className="text-lg font-medium text-gray-700 mb-4">Filter by Type</h4>
                    <div className="space-y-2">
                        {viewModel.getNodeTypes().map(type => {
                            const isSelected = selectedTypes.has(type);
                            return (
                                <label key={type} 
                                       className={`flex items-center p-2 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer ${
                                           isSelected ? 'bg-blue-50' : ''
                                       }`}>
                                    <input
                                        type="checkbox"
                                        checked={isSelected}
                                        onChange={() => handleFilterChange(type)}
                                        className="w-4 h-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                                    />
                                    <span className="ml-3 text-gray-700">{type}</span>
                                </label>
                            );
                        })}
                    </div>
                    <button
                        onClick={handleClearFilters}
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