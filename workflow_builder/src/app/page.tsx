'use client';

import React from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import dynamic from 'next/dynamic';
import { graphData } from '../data/graphData';
import ClientRouter from '../components/ClientRouter';

// Dynamically import visualizations with no SSR
const ReactFlowVisualization = dynamic(
    () => import('../components/ReactFlowVisualization'),
    { ssr: false }
);

const GraphVisualization = dynamic(
    () => import('../components/GraphVisualization'),
    { ssr: false }
);

function HomePage() {
    return (
        <main className="w-full h-screen flex items-center justify-center bg-gray-50">
            <div className="space-y-8 text-center">
                <h1 className="text-4xl font-bold text-gray-800 mb-8">Graph Visualization Demo</h1>
                <div className="space-y-4">
                    <Link 
                        to="/flow" 
                        className="block px-8 py-4 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors text-lg font-semibold"
                    >
                        React Flow Visualization
                    </Link>
                    <Link 
                        to="/graph" 
                        className="block px-8 py-4 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors text-lg font-semibold"
                    >
                        Sigma.js Graph Visualization
                    </Link>
                </div>
            </div>
        </main>
    );
}

function FlowPage() {
    return (
        <main className="w-full h-screen relative">
            <div className="absolute top-4 left-1/2 transform -translate-x-1/2 z-40 bg-white/80 backdrop-blur-sm px-4 py-2 rounded-md">
                <h2 className="text-lg font-semibold text-gray-700">React Flow View</h2>
            </div>
            <Link 
                to="/"
                className="absolute top-4 left-4 z-50 px-4 py-2 bg-gray-800 text-white rounded-md hover:bg-gray-700 transition-colors"
            >
                ← Back
            </Link>
            <div className="w-full h-full">
                <ReactFlowVisualization data={graphData} />
            </div>
        </main>
    );
}

function GraphPage() {
    return (
        <main className="w-full h-screen relative">
            <div className="absolute top-4 left-1/2 transform -translate-x-1/2 z-40 bg-white/80 backdrop-blur-sm px-4 py-2 rounded-md">
                <h2 className="text-lg font-semibold text-gray-700">Sigma.js Graph View</h2>
            </div>
            <Link 
                to="/"
                className="absolute top-4 left-4 z-50 px-4 py-2 bg-gray-800 text-white rounded-md hover:bg-gray-700 transition-colors"
            >
                ← Back
            </Link>
            <div className="w-full h-full">
                <GraphVisualization data={graphData} />
            </div>
        </main>
    );
}

function AppRoutes() {
    return (
        <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/flow" element={<FlowPage />} />
            <Route path="/graph" element={<GraphPage />} />
        </Routes>
    );
}

export default function App() {
    return (
        <ClientRouter>
            <AppRoutes />
        </ClientRouter>
    );
}
