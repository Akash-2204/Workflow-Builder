# Architecture Documentation

## MVVM Architecture Overview

The Workflow Builder follows the Model-View-ViewModel (MVVM) pattern, providing a clean separation of concerns between data, business logic, and UI.

### Model Layer

The Model layer represents the data and business logic of the application.

#### GraphModel (`/src/models/GraphModel.ts`)
```typescript
class GraphModel {
    // Core data structure
    private data: GraphData;

    // Data access methods
    getAllNodes(): Node[]
    getAllEdges(): Edge[]
    getNodesByType(type: NodeType): Node[]
    getNodeById(id: string): Node | undefined
    getConnectedNodes(nodeId: string): Node[]
    getRelationships(nodeId: string): Edge[]
    getUniqueNodeTypes(): NodeType[]
    getNodeNeighbors(nodeId: string): Set<string>
}
```

### ViewModel Layer

The ViewModel acts as a data transformation layer between Model and View.

#### GraphViewModel (`/src/viewModels/GraphViewModel.ts`)
```typescript
class GraphViewModel {
    private model: GraphModel;
    private state: GraphState;

    // State Management
    onStateChange(callback: () => void): () => void
    
    // Node Operations
    getVisibleNodes(): Node[]
    getVisibleEdges(): Edge[]
    setSelectedNode(nodeId: string | null): void
    getSelectedNodeDetails(): NodeDetails | null
    
    // Filtering
    toggleNodeTypeFilter(type: NodeType): void
    clearFilters(): void
}
```

### View Layer

The View layer handles all UI rendering and user interactions.

#### GraphVisualization (`/src/components/GraphVisualization.tsx`)
```typescript
const GraphVisualization: React.FC<GraphVisualizationProps> = ({ data }) => {
    // State and refs
    const containerRef = useRef<HTMLDivElement>(null);
    const { viewModel, forceUpdate } = useGraphViewModel(data);
    
    // Layout management
    const applyLayout = async (graph: Graph, layout: LayoutType) => {...}
    
    // Graph initialization
    const initializeGraph = async () => {...}
    
    // Event handlers
    const handleFilterChange = (type: NodeType) => {...}
    const handleLayoutChange = (layout: LayoutType) => {...}
}
```

## Data Flow

1. **Model → ViewModel**
   - Model provides raw data and basic operations
   - ViewModel transforms data for UI consumption
   - ViewModel maintains UI state (selections, filters)

2. **ViewModel → View**
   - View subscribes to ViewModel state changes
   - ViewModel provides filtered and transformed data
   - View updates UI based on ViewModel state

3. **View → ViewModel**
   - User interactions captured in View
   - Actions delegated to ViewModel
   - ViewModel updates Model if needed

## State Management

### GraphState Interface
```typescript
interface GraphState {
    selectedNode: string | null;      // Currently selected node
    filteredTypes: Set<NodeType>;     // Active type filters
    hoveredNode: string | null;       // Currently hovered node
}
```

### State Flow
1. User interaction triggers state change
2. ViewModel updates internal state
3. State change notifications sent to View
4. View re-renders with updated state

## Type System

The type system ensures type safety across the application:

### Core Types
```typescript
type NodeType = 'Person' | 'Company' | 'Technology' | 'Project' | 'Community' | 'Event' | 'Investor';

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
```

### UI Types
```typescript
interface NodeAttributes {
    label: string;
    size: number;
    color: string;
    type: NodeType;
    hidden: boolean;
    x: number;
    y: number;
}

interface EdgeAttributes {
    label: string;
    size: number;
    color: string;
    hidden?: boolean;
}
``` 