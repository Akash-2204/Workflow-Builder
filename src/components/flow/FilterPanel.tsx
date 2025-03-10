import React from 'react';
import { Panel } from 'reactflow';
import { NodeType } from '../../types/Graph';
import { GraphViewModel } from '../../viewModels/GraphViewModel';

interface FilterPanelProps {
    viewModel: GraphViewModel;
    selectedTypes: Set<NodeType>;
    onFilterChange: () => void;
}

const FilterPanel: React.FC<FilterPanelProps> = ({ viewModel, selectedTypes, onFilterChange }) => {
    const nodeTypes = viewModel.getNodeTypes();

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
                                onFilterChange();
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
                    onFilterChange();
                }}
                className="mt-4 w-full px-3 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-md text-sm font-medium transition-colors"
            >
                Clear Filters
            </button>
        </Panel>
    );
};

export default FilterPanel; 