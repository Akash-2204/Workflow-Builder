'use client';

import React from 'react';
import { useRouter } from 'next/navigation';

export default function HomePage() {
    const router = useRouter();

    return (
        <main className="w-full h-screen flex items-center justify-center bg-gray-50">
            <div className="space-y-8 text-center">
                <h1 className="text-4xl font-bold text-gray-800 mb-8">Graph Visualization Demo</h1>
                <div className="space-y-4">
                    <button 
                        onClick={() => router.push('/flow')}
                        className="block w-full px-8 py-4 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors text-lg font-semibold"
                    >
                        React Flow Visualization
                    </button>
                    <button 
                        onClick={() => router.push('/graph')}
                        className="block w-full px-8 py-4 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors text-lg font-semibold"
                    >
                        Sigma.js Graph Visualization
                    </button>
                </div>
            </div>
        </main>
    );
}
