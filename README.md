# Workflow Builder

A powerful graph visualization application built with Next.js, demonstrating two different approaches to graph visualization using React Flow and Sigma.js.

## Table of Contents
- [Overview](#overview)
- [Features](#features)
- [Implementation Details](#implementation-details)
  - [React Flow Implementation](#react-flow-implementation)
  - [Sigma.js Implementation](#sigmajs-implementation)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)

## Overview

This application provides two different graph visualization implementations:
1. **React Flow**: A highly customizable React-based solution for building node-based editors and interactive diagrams
2. **Sigma.js**: A powerful library specifically designed for graph drawing, with support for large-scale graph rendering

## Features

Common features across both implementations:
- Interactive node-based graph visualization
- Node filtering by type
- Node details panel
- Hover effects for connected nodes
- Node selection and highlighting
- Responsive design

### React Flow Specific Features
- Smooth edge animations
- Built-in minimap
- Zoom and pan controls
- Custom node styling
- Automatic layout using Dagre

### Sigma.js Specific Features
- Multiple layout options (circular, force, random, circlepack)
- High-performance rendering for large graphs
- Advanced node labeling system
- Custom edge rendering

## Implementation Details

### React Flow Implementation

The React Flow implementation (`ReactFlowVisualization.tsx`) uses a component-based approach with the following key features:

#### 1. State Management
```typescript
const [nodes, setNodes, onNodesChange] = useNodesState([]);
const [edges, setEdges, onEdgesChange] = useEdgesState([]);
const [selectedTypes] = useState<Set<NodeType>>(new Set());
```

#### 2. Graph Layout
- Uses Dagre for automatic graph layout
- Configurable layout settings (node spacing, direction, etc.)
```typescript
const layoutElements = useMemo(() => {
    const graphNodes = viewModel.getVisibleNodes().map((node) => ({
        id: node.id,
        type: 'custom',
        position: { x: 0, y: 0 },
        data: { ... }
    }));
    return getLayoutedElements(graphNodes, graphEdges);
}, [viewModel]);
```

#### 3. Interaction Handlers
- Node click for selection
- Mouse enter/leave for hover effects
- Edge interactions
```typescript
const onNodeClick = useCallback((_: React.MouseEvent, node: Node) => {
    viewModel.setSelectedNode(node.id);
    forceUpdate();
}, [viewModel, forceUpdate]);
```

#### 4. Custom Components
- `CustomNode`: Styled node component
- `FilterPanel`: Type-based filtering
- `NodeDetailsPanel`: Detailed node information

### Sigma.js Implementation

The Sigma.js implementation (`GraphVisualization.tsx`) provides a more specialized graph visualization approach:

#### 1. Graph Initialization
```typescript
const initializeGraph = async () => {
    const graph = new Graph();
    // Add nodes and edges
    await applyLayout(graph, selectedLayout);
    const sigma = new Sigma(graph, containerRef.current, {
        // Rendering settings
    });
};
```

#### 2. Multiple Layout Options
```typescript
const applyLayout = async (graph: Graph, layout: LayoutType) => {
    switch (layout) {
        case 'circular':
            graphologyLayout.circular.assign(graph);
            break;
        case 'force':
            const { default: forceAtlas2 } = await import('graphology-layout-forceatlas2');
            forceAtlas2.assign(graph, { ... });
            break;
        // Other layouts...
    }
};
```

#### 3. Interactive Features
- Node hover effects
- Connected nodes highlighting
- Edge visibility control
```typescript
sigma.on('enterNode', ({ node }) => {
    const connectedNodeIds = new Set([node, ...graph.neighbors(node)]);
    // Update node and edge styling
});
```

#### 4. Filtering System
```typescript
const handleFilterChange = (type: NodeType) => {
    viewModel.toggleNodeTypeFilter(type);
    const newSelectedTypes = new Set(selectedTypes);
    // Update filter state and reinitialize graph
};
```

## Project Structure

```
src/
├── components/
│   ├── flow/              # React Flow components
│   │   ├── CustomNode.tsx
│   │   ├── FilterPanel.tsx
│   │   └── NodeDetailsPanel.tsx
│   ├── ReactFlowVisualization.tsx
│   └── GraphVisualization.tsx
├── types/
│   ├── Graph.ts          # Common graph type definitions
│   ├── GraphUI.ts        # UI-related types
│   └── ReactFlowTypes.ts # React Flow specific types
├── utils/
│   └── flowLayout.ts     # Layout utilities
├── viewModels/
│   └── GraphViewModel.ts # Shared view model
└── models/
    └── GraphModel.ts     # Core graph model
```

## Getting Started

1. Install dependencies:
```bash
npm install
```

2. Run the development server:
```bash
npm run dev
```

3. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Technical Comparison

### React Flow Advantages
- Easier integration with React applications
- Built-in features like minimap and controls
- More straightforward customization through React components
- Better TypeScript support

### Sigma.js Advantages
- Better performance with large graphs
- More layout options out of the box
- Advanced graph-specific features
- Lower-level control over rendering

## Contributing

Feel free to submit issues and enhancement requests!
