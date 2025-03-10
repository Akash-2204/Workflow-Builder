# Workflow Builder

A Next.js application for visualizing and managing workflow graphs using Sigma.js, following the MVVM (Model-View-ViewModel) architecture pattern.

## Architecture Overview

The project follows MVVM architecture:

### Model Layer (`/src/models`)
- `GraphModel.ts`: Core data model that handles the graph data structure and basic operations
- Responsible for data structure and business logic
- No UI or state management logic

### View Layer (`/src/components`)
- `GraphVisualization.tsx`: Main visualization component
- Handles rendering and user interactions
- Uses Sigma.js for graph visualization
- Communicates with ViewModel through hooks and callbacks

### ViewModel Layer (`/src/viewModels`)
- `GraphViewModel.ts`: Manages the application state and business logic
- Provides data transformation between Model and View
- Handles user actions and updates model accordingly
- Maintains UI state like selections and filters

### Types and Interfaces (`/src/types`)
- `Graph.ts`: Core data type definitions
- `GraphUI.ts`: UI-specific type definitions and constants

## Project Structure

```
src/
├── components/          # View layer components
│   └── GraphVisualization.tsx
├── models/             # Data models
│   └── GraphModel.ts
├── viewModels/         # View models for state management
│   └── GraphViewModel.ts
├── types/              # TypeScript type definitions
│   ├── Graph.ts        # Core data types
│   └── GraphUI.ts      # UI-specific types
├── data/              # Sample data and constants
│   └── graphData.ts
└── app/               # Next.js app router
    └── page.tsx
```

## Features

- Interactive graph visualization using Sigma.js
- Multiple layout options (circular, force, random, circlepack)
- Node filtering by type
- Node hover effects with connected nodes highlight
- Detailed node information sidebar
- Type-safe implementation with TypeScript

## Setup and Installation

1. Clone the repository
```bash
git clone <repository-url>
cd workflow-builder
```

2. Install dependencies
```bash
npm install
```

3. Run the development server
```bash
npm run dev
```

## Key Components

### GraphModel
- Handles core graph data structure
- Provides methods for data access and manipulation
- Pure business logic without UI concerns

### GraphViewModel
- Manages application state
- Handles user interactions
- Provides data transformation for the view
- Maintains filter states and selections

### GraphVisualization
- Renders the graph using Sigma.js
- Handles user interactions (hover, click, filter)
- Updates view based on ViewModel state
- Manages layout and visual properties

## Type System

### Core Types (`Graph.ts`)
- `Node`: Graph node structure
- `Edge`: Graph edge structure
- `NodeType`: Available node types
- `GraphData`: Complete graph data structure

### UI Types (`GraphUI.ts`)
- `NodeAttributes`: Sigma.js node rendering attributes
- `LayoutType`: Available layout options
- `GraphVisualizationProps`: Component props
- `NODE_COLORS`: UI color constants

## Usage

```typescript
// Example usage in a Next.js page
import GraphVisualization from '../components/GraphVisualization';
import { graphData } from '../data/graphData';

export default function Page() {
  return <GraphVisualization data={graphData} />;
}
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details
