import React from 'react';
import { Panel } from 'reactflow';
import { GraphViewModel } from '../../viewModels/GraphViewModel';
import { NODE_COLORS } from '../../types/GraphUI';

interface NodeDetailsPanelProps {
    viewModel: GraphViewModel;
    onClose: () => void;
}

const NodeDetailsPanel: React.FC<NodeDetailsPanelProps> = ({ viewModel, onClose }) => {
    const details = viewModel.getSelectedNodeDetails();
    if (!details) return null;

    return (
        <Panel position="top-right" className="bg-white p-4 rounded-lg shadow-lg w-80">
            <div className="flex justify-between items-start mb-4">
                <h3 className="text-xl font-semibold text-gray-800">
                    {details.node.label}
                </h3>
                <button
                    onClick={onClose}
                    className="p-1 hover:bg-gray-100 rounded-full transition-colors"
                    aria-label="Close details"
                >
                    <svg
                        className="w-5 h-5 text-gray-500"
                        fill="none"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                    >
                        <path d="M6 18L18 6M6 6l12 12"></path>
                    </svg>
                </button>
            </div>
            <div
                className="inline-block px-2 py-1 rounded-full text-sm font-medium text-white mb-4"
                style={{ backgroundColor: NODE_COLORS[details.node.type] }}
            >
                {details.node.type}
            </div>
            <div className="space-y-4">
                <div>
                    <h4 className="text-lg font-medium text-gray-700 mb-2">
                        Connections
                    </h4>
                    <ul className="space-y-2 max-h-48 overflow-y-auto">
                        {details.connections.map((node) => (
                            <li
                                key={node.id}
                                className="flex items-center space-x-2 p-2 bg-gray-50 rounded-md"
                            >
                                <div
                                    className="w-3 h-3 rounded-full"
                                    style={{
                                        backgroundColor: NODE_COLORS[node.type],
                                    }}
                                />
                                <span className="text-sm text-gray-800">
                                    {node.label}
                                </span>
                                <span className="text-xs text-gray-500 ml-auto">
                                    {node.type}
                                </span>
                            </li>
                        ))}
                    </ul>
                </div>
                <div>
                    <h4 className="text-lg font-medium text-gray-700 mb-2">
                        Relationships
                    </h4>
                    <ul className="space-y-2 max-h-48 overflow-y-auto">
                        {details.relationships.map((edge) => (
                            <li
                                key={`${edge.source}-${edge.target}`}
                                className="p-2 bg-gray-50 rounded-md text-sm text-gray-700"
                            >
                                {edge.relationship} with{' '}
                                {edge.source === details.node.id
                                    ? viewModel.getNodeById(edge.target)?.label
                                    : viewModel.getNodeById(edge.source)?.label}
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </Panel>
    );
};

export default NodeDetailsPanel; 