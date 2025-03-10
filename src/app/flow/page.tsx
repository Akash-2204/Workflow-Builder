'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import dynamic from 'next/dynamic';
import { graphData } from '../../data/graphData';

const ReactFlowVisualization = dynamic(
    () => import('../../components/ReactFlowVisualization'),
    { ssr: false }
);

export default function FlowPage() {
    const router = useRouter();

    return (
        <main className="w-full h-screen relative">
            <div className="absolute top-4 left-1/2 transform -translate-x-1/2 z-40 bg-white/80 backdrop-blur-sm px-4 py-2 rounded-md">
                <h2 className="text-lg font-semibold text-gray-700">React Flow View</h2>
            </div>
            <button 
                onClick={() => router.push('/')}
                className="absolute top-4 right-4 z-50 px-4 py-2 bg-gray-800 text-white rounded-md hover:bg-gray-700 transition-colors"
            >
                ← Back
            </button>
            <div className="w-full h-full">
                <ReactFlowVisualization data={graphData} />
            </div>
        </main>
    );
} 