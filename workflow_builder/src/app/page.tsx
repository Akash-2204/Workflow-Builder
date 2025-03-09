'use client';

import React from 'react';
import dynamic from 'next/dynamic';
import { graphData } from '../data/graphData';

// Dynamically import ReactFlowVisualization with no SSR
const ReactFlowVisualization = dynamic(
    () => import('../components/ReactFlowVisualization'),
    { ssr: false }
);

export default function Home() {
    return (
        <main className="min-h-screen">
            <ReactFlowVisualization data={graphData} />
        </main>
    );
}
