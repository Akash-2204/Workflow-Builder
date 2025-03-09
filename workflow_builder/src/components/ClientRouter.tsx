'use client';

import React, { useEffect, useState } from 'react';
import { BrowserRouter } from 'react-router-dom';

export default function ClientRouter({ children }: { children: React.ReactNode }) {
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) {
        return null;
    }

    return <BrowserRouter>{children}</BrowserRouter>;
} 