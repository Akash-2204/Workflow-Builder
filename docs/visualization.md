# Graph Visualization Documentation

## Overview

The graph visualization system uses Sigma.js to render interactive network graphs. It supports multiple layouts, node filtering, and interactive features like hovering and selection.

## Features

### 1. Layout Options

The visualization supports multiple layout algorithms:

```typescript
type LayoutType = 'circular' | 'force' | 'random' | 'circlepack';
```

- **Circular**: Arranges nodes in a circle
- **Force**: Uses force-directed layout for natural clustering
- **Random**: Random node placement
- **Circlepack**: Nested circular arrangement

### 2. Node Types and Colors

Each node type has a distinct color for easy identification:

```typescript
const NODE_COLORS: Record<NodeType, string> = {
    Person: '#4CAF50',     // Green
    Company: '#2196F3',    // Blue
    Technology: '#FF9800', // Orange
    Project: '#9C27B0',    // Purple
    Community: '#F44336',  // Red
    Event: '#795548',      // Brown
    Investor: '#607D8B'    // Blue Grey
};
```

### 3. Interactive Features

#### Hover Effects
- Hovered node turns red
- Connected nodes turn orange
- Unconnected nodes are hidden
- Connected edges are highlighted
- Edge thickness increases

#### Selection
- Clicking a node shows its details in the sidebar
- Details include:
  - Node information
  - Connected nodes
  - Relationships

#### Filtering
- Filter nodes by type
- Multiple filters can be active
- Clear all filters option
- Real-time graph updates

## Implementation Details

### 1. Node Rendering

```typescript
interface NodeAttributes {
    label: string;      // Node label
    size: number;       // Node size (pixels)
    color: string;      // Node color (hex)
    nodeType: NodeType; // Node type
    hidden: boolean;    // Visibility
    x: number;         // X position
    y: number;         // Y position
    labelSize?: number;    // Label size
    labelColor?: string;   // Label color
    labelWeight?: string;  // Label weight
}
```

### 2. Edge Rendering

```typescript
interface EdgeAttributes {
    label: string;     // Edge label
    size: number;      // Line thickness
    color: string;     // Line color
    hidden?: boolean;  // Visibility
}
```

### 3. Sigma.js Configuration

```typescript
const sigmaConfig = {
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
    labelRenderedSizeThreshold: 6,
    defaultNodeType: 'circle',
    defaultEdgeType: 'line'
};
```

## Usage Examples

### 1. Basic Implementation

```typescript
import GraphVisualization from '../components/GraphVisualization';
import { graphData } from '../data/graphData';

function App() {
    return <GraphVisualization data={graphData} />;
}
```

### 2. Custom Data Structure

```typescript
const customData: GraphData = {
    nodes: [
        { id: '1', label: 'John', type: 'Person' },
        { id: '2', label: 'Tech Corp', type: 'Company' }
    ],
    edges: [
        { 
            source: '1', 
            target: '2', 
            relationship: 'Works At' 
        }
    ]
};
```

## Best Practices

1. **Performance**
   - Limit number of visible nodes
   - Use appropriate layout for data size
   - Implement pagination for large datasets

2. **User Experience**
   - Provide clear visual feedback
   - Maintain consistent color coding
   - Include hover tooltips
   - Support zoom and pan

3. **Accessibility**
   - Use contrasting colors
   - Provide text alternatives
   - Support keyboard navigation

## Troubleshooting

Common issues and solutions:

1. **Graph Not Rendering**
   - Check container size
   - Verify data structure
   - Check for console errors

2. **Layout Issues**
   - Adjust layout parameters
   - Check node positions
   - Verify container dimensions

3. **Performance Problems**
   - Reduce number of nodes
   - Simplify edge rendering
   - Use appropriate layout 