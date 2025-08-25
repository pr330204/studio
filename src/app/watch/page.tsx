
'use client';
import { Suspense } from 'react';
import WatchPageContent from './WatchPageContent';

export default function WatchPage() {
    return (
        <Suspense fallback={<div className="w-full h-screen bg-background flex items-center justify-center"><p>Loading...</p></div>}>
            <WatchPageContent />
        </Suspense>
    );
}
