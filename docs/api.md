# API Documentation

## GraphModel API

### Constructor
```typescript
constructor(data: GraphData)
```
Creates a new GraphModel instance with the provided graph data.

### Methods

#### Data Access
```typescript
getAllNodes(): Node[]
```
Returns all nodes in the graph.

```typescript
getAllEdges(): Edge[]
```
Returns all edges in the graph.

```typescript
getNodesByType(type: NodeType): Node[]
```
Returns all nodes of a specific type.

```typescript
getNodeById(id: string): Node | undefined
```
Returns a node by its ID.

```typescript
getConnectedNodes(nodeId: string): Node[]
```
Returns all nodes connected to the specified node.

```typescript
getRelationships(nodeId: string): Edge[]
```
Returns all edges connected to the specified node.

```typescript
getUniqueNodeTypes(): NodeType[]
```
Returns an array of all unique node types in the graph.

```typescript
getNodeNeighbors(nodeId: string): Set<string>
```
Returns a set of IDs of nodes connected to the specified node.

## GraphViewModel API

### Constructor
```typescript
constructor(data: GraphData)
```
Creates a new GraphViewModel instance with the provided graph data.

### Methods

#### State Management
```typescript
onStateChange(callback: () => void): () => void
```
Subscribes to state changes. Returns an unsubscribe function.

#### Node Operations
```typescript
getVisibleNodes(): Node[]
```
Returns nodes that should be visible based on current filters.

```typescript
getVisibleEdges(): Edge[]
```
Returns edges that should be visible based on current filters.

```typescript
setSelectedNode(nodeId: string | null): void
```
Sets the currently selected node.

```typescript
getSelectedNodeDetails(): NodeDetails | null
```
Returns details of the currently selected node.

#### Filtering
```typescript
toggleNodeTypeFilter(type: NodeType): void
```
Toggles visibility of nodes of the specified type.

```typescript
clearFilters(): void
```
Clears all active filters.

## GraphVisualization Component API

### Props
```typescript
interface GraphVisualizationProps {
    data?: GraphData;  // Optional graph data
}
```

### Hook: useGraphViewModel
```typescript
function useGraphViewModel(data: GraphData) {
    return {
        viewModel: GraphViewModel;
        forceUpdate: () => void;
    }
}
```

## Type Definitions

### Node Types
```typescript
type NodeType = 'Person' | 'Company' | 'Technology' | 'Project' | 'Community' | 'Event' | 'Investor';

interface Node {
    id: string;
    label: string;
    type: NodeType;
}
```

### Edge Types
```typescript
interface Edge {
    source: string;
    target: string;
    relationship: string;
}
```

### Graph Data
```typescript
interface GraphData {
    nodes: Node[];
    edges: Edge[];
}
```

### UI Types
```typescript
interface NodeAttributes {
    label: string;
    size: number;
    color: string;
    nodeType: NodeType;
    hidden: boolean;
    x: number;
    y: number;
    labelSize?: number;
    labelColor?: string;
    labelWeight?: string;
}

interface EdgeAttributes {
    label: string;
    size: number;
    color: string;
    hidden?: boolean;
}
```

### State Types
```typescript
interface GraphState {
    selectedNode: string | null;
    filteredTypes: Set<NodeType>;
    hoveredNode: string | null;
}

interface NodeDetails {
    node: Node;
    connections: Node[];
    relationships: Edge[];
}
```

## Constants

### Node Colors
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

### Layout Types
```typescript
type LayoutType = 'circular' | 'force' | 'random' | 'circlepack';
``` 