import React from 'react';
import { Handle, Position } from 'reactflow';
import { CustomNodeProps, DEFAULT_LAYOUT_CONFIG } from '../../types/ReactFlowTypes';

const CustomNode: React.FC<CustomNodeProps> = ({ data, selected }) => {
    return (
        <div
            className={`px-4 py-2 shadow-md rounded-lg border ${
                selected ? 'border-blue-500 ring-2 ring-blue-300' : 'border-gray-300'
            }`}
            style={{
                background: data.color,
                width: DEFAULT_LAYOUT_CONFIG.nodeWidth - 10,
                height: DEFAULT_LAYOUT_CONFIG.nodeHeight - 10,
            }}
        >
            <Handle 
                type="target" 
                position={Position.Top} 
                className="!bg-gray-400 !w-2 !h-2"
            />
            <div className="flex flex-col justify-center h-full">
                <div className="text-sm font-bold text-white text-center">{data.label}</div>
                <div className="text-xs text-white opacity-80 text-center">{data.type}</div>
            </div>
            <Handle 
                type="source" 
                position={Position.Bottom} 
                className="!bg-gray-400 !w-2 !h-2"
            />
        </div>
    );
};

export default CustomNode; 