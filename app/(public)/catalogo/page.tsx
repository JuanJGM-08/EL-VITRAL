'use client';
import { Suspense } from "react";
import NavBar from '@/components/NavBar';
import CatalogoContent from '@/components/CatalogoContent';

export default function CatalogoPage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#101828'}}>
                <NavBar />
                <div className="text-white text-xl">Cargando productos...</div>
            </div>
        }>
            <CatalogoContent />
        </Suspense>
    );
}