# React Flow Implementation Tutorial

## Table of Contents
1. [Project Setup](#project-setup)
2. [MVVM Architecture](#mvvm-architecture)
3. [Data Structure](#data-structure)
4. [Graph Layout](#graph-layout)
5. [State Management](#state-management)
6. [Interactions](#interactions)
7. [Filtering System](#filtering-system)
8. [Styling and UI](#styling-and-ui)

## Project Setup

### Dependencies
```json
{
  "dependencies": {
    "reactflow": "^11.10.4",
    "dagre": "^0.8.5",
    "@types/dagre": "^0.7.52"
  }
}
```

### Basic File Structure
```
src/
├── models/
│   └── GraphModel.ts       # Data operations
├── viewModels/
│   └── GraphViewModel.ts   # Business logic
├── components/
│   └── ReactFlowVisualization.tsx  # UI
├── types/
│   └── Graph.ts           # Type definitions
└── constants/
    └── graphConfig.ts     # Configuration
```

## MVVM Architecture

### 1. Model (GraphModel.ts)
```typescript
export class GraphModel {
    private data: GraphData;

    // Data access methods
    getAllNodes(): Node[] {
        return this.data.nodes;
    }

    getConnectedNodes(nodeId: string): Node[] {
        // Find and return connected nodes
        const connectedNodeIds = new Set<string>();
        this.data.edges.forEach(edge => {
            if (edge.source === nodeId) connectedNodeIds.add(edge.target);
            if (edge.target === nodeId) connectedNodeIds.add(edge.source);
        });
        return this.data.nodes.filter(node => connectedNodeIds.has(node.id));
    }
}
```

**Explanation:**
- `GraphModel` is responsible for raw data operations
- `data` property holds the graph structure
- `getAllNodes()` provides direct access to node data
- `getConnectedNodes(nodeId)`:
  1. Creates a Set to store unique connected node IDs
  2. Iterates through edges to find connections
  3. Checks both source and target of edges
  4. Returns filtered nodes that are connected

### 2. ViewModel (GraphViewModel.ts)
```typescript
export class GraphViewModel {
    private model: GraphModel;
    private state: GraphState;

    getVisibleNodes(): Node[] {
        const { filteredTypes } = this.state;
        if (filteredTypes.size === 0) return this.model.getAllNodes();
        return this.model.getAllNodes().filter(node => 
            filteredTypes.has(node.type)
        );
    }

    toggleNodeTypeFilter(type: NodeType) {
        const { filteredTypes } = this.state;
        if (filteredTypes.has(type)) {
            filteredTypes.delete(type);
        } else {
            filteredTypes.add(type);
        }
        this.notifyStateChange();
    }
}
```

**Explanation:**
- `GraphViewModel` manages business logic and state
- `getVisibleNodes()`:
  1. Checks if any filters are active
  2. Returns all nodes if no filters
  3. Filters nodes based on selected types
- `toggleNodeTypeFilter(type)`:
  1. Toggles type in filter set
  2. Notifies observers of state change
  3. Triggers UI update

### 3. View (ReactFlowVisualization.tsx)
```typescript
const ReactFlowVisualization: React.FC<{ data: GraphData }> = ({ data }) => {
    const { viewModel } = useGraphViewModel(data);
    const [nodes, setNodes] = useNodesState([]);
    const [edges, setEdges] = useEdgesState([]);

    // UI rendering and event handling
}
```

## Data Structure

### 1. Type Definitions
```typescript
interface Node {
    id: string;
    label: string;
    type: NodeType;
}

interface Edge {
    source: string;
    target: string;
    relationship: string;
}

interface GraphState {
    selectedNode: string | null;
    filteredTypes: Set<NodeType>;
    hoveredNode: string | null;
}
```

### 2. Data Flow
```typescript
// 1. Data enters through Model
const model = new GraphModel(graphData);

// 2. ViewModel transforms data
const visibleNodes = viewModel.getVisibleNodes();

// 3. View renders data
const nodes = visibleNodes.map(node => ({
    id: node.id,
    type: 'custom',
    data: { ...node }
}));
```

## Graph Layout

### 1. Dagre Layout Configuration
```typescript
const getLayoutedElements = (nodes, edges) => {
    const dagreGraph = new dagre.graphlib.Graph();
    dagreGraph.setGraph({ 
        rankdir: 'TB',     // Top to Bottom direction
        nodesep: 80,       // Horizontal spacing
        ranksep: 100       // Vertical spacing
    });

    // Add nodes with dimensions
    nodes.forEach((node) => {
        dagreGraph.setNode(node.id, { 
            width: nodeWidth, 
            height: nodeHeight 
        });
    });

    // Add edges
    edges.forEach((edge) => {
        dagreGraph.setEdge(edge.source, edge.target);
    });

    // Calculate layout
    dagre.layout(dagreGraph);

    // Apply calculated positions
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
```

## State Management

### 1. React Flow State
```typescript
// Node and edge state
const [nodes, setNodes, onNodesChange] = useNodesState([]);
const [edges, setEdges, onEdgesChange] = useEdgesState([]);

// Update layout
const updateLayout = useCallback(() => {
    const graphNodes = viewModel.getVisibleNodes().map(/* ... */);
    const graphEdges = viewModel.getVisibleEdges().map(/* ... */);
    const { nodes: layoutedNodes, edges: layoutedEdges } = 
        getLayoutedElements(graphNodes, graphEdges);
    
    setNodes(layoutedNodes);
    setEdges(layoutedEdges);
}, [viewModel]);
```

### 2. ViewModel State
```typescript
// State change notifications
private notifyStateChange() {
    this.stateChangeCallbacks.forEach(callback => callback());
}

// State subscription
onStateChange(callback: () => void) {
    this.stateChangeCallbacks.push(callback);
    return () => {
        this.stateChangeCallbacks = 
            this.stateChangeCallbacks.filter(cb => cb !== callback);
    };
}
```

## Interactions

### 1. Node Selection
```typescript
const onNodeClick = useCallback(
    (_: React.MouseEvent, node: ReactFlowNode) => {
        viewModel.setSelectedNode(node.id);
        forceUpdate();
    },
    [viewModel, forceUpdate]
);
```

### 2. Hover Effects
```typescript
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
    },
    [viewModel, setNodes]
);
```

## Filtering System

### 1. Filter Implementation
```typescript
// In ViewModel
getVisibleNodes(): Node[] {
    const { filteredTypes } = this.state;
    if (filteredTypes.size === 0) {
        return this.model.getAllNodes();
    }
    return this.model.getAllNodes().filter(node => 
        filteredTypes.has(node.type)
    );
}

getVisibleEdges(): Edge[] {
    const visibleNodes = new Set(this.getVisibleNodes().map(node => node.id));
    return this.model.getAllEdges().filter(edge => 
        visibleNodes.has(edge.source) && visibleNodes.has(edge.target)
    );
}
```

### 2. Filter UI
```typescript
const renderFilterControls = () => {
    const nodeTypes = viewModel.getNodeTypes();
    const selectedTypes = viewModel.getSelectedTypes();

    return (
        <Panel position="top-left">
            {nodeTypes.map((type: NodeType) => (
                <label key={type}>
                    <input
                        type="checkbox"
                        checked={selectedTypes.has(type)}
                        onChange={() => {
                            viewModel.toggleNodeTypeFilter(type);
                            updateLayout();
                        }}
                    />
                    {type}
                </label>
            ))}
        </Panel>
    );
};
```

## Styling and UI

### 1. Custom Node Component
```typescript
const CustomNode = ({ data, selected }: NodeProps) => {
    return (
        <div
            className={`node ${selected ? 'selected' : ''}`}
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
            <div className="content">
                <div className="label">{data.label}</div>
                <div className="type">{data.type}</div>
            </div>
            <Handle 
                type="source" 
                position={Position.Bottom} 
                className="!bg-gray-400 !w-2 !h-2"
            />
        </div>
    );
};
```

**Explanation:**
1. **Component Structure**
   - Receives node data and selection state
   - Renders container with dynamic classes
   - Applies color and size styles

2. **Connection Points**
   - Top handle for incoming connections
   - Bottom handle for outgoing connections
   - Styled with Tailwind CSS

3. **Content Layout**
   - Displays node label and type
   - Centers content vertically
   - Maintains consistent spacing

### 2. Node Colors and Styles
```typescript
const NODE_COLORS: Record<NodeType, string> = {
    Person: '#4CAF50',
    Company: '#2196F3',
    Technology: '#FF9800',
    Project: '#9C27B0',
    Community: '#F44336',
    Event: '#795548',
    Investor: '#607D8B'
};
```

## Best Practices and Tips

1. **Performance Optimization**
   - Use `useMemo` for expensive calculations
   - Implement proper cleanup in useEffect
   - Use callback functions for event handlers

2. **State Management**
   - Keep state updates atomic
   - Use immutable state updates
   - Implement proper state synchronization

3. **Component Organization**
   - Separate concerns (MVVM)
   - Keep components focused
   - Use TypeScript for type safety

4. **Error Handling**
   - Validate data
   - Handle edge cases
   - Provide fallback UI

## Common Issues and Solutions

1. **Layout Issues**
   ```typescript
   // Problem: Nodes overlapping
   // Solution: Adjust spacing
   dagreGraph.setGraph({ 
       nodesep: 80,  // Increase for more horizontal space
       ranksep: 100  // Increase for more vertical space
   });
   ```

2. **Performance Issues**
   ```typescript
   // Problem: Slow updates
   // Solution: Memoize expensive calculations
   const layoutedElements = useMemo(() => 
       getLayoutedElements(nodes, edges),
       [nodes, edges]
   );
   ```

3. **State Sync Issues**
   ```typescript
   // Problem: Inconsistent state
   // Solution: Centralize state updates
   private notifyStateChange() {
       this.stateChangeCallbacks.forEach(callback => callback());
   }
   ```

## Debugging Tips

1. **Visual Debugging**
   - Use React DevTools
   - Check node positions
   - Verify edge connections

2. **State Debugging**
   - Log state changes
   - Verify filter conditions
   - Check data transformations

3. **Layout Debugging**
   - Inspect dagre graph
   - Verify node dimensions
   - Check layout direction 