'use client';

import CategoryCard from './CategoryCard';
import { PackageOpen, Smile, Lightbulb, Gift } from 'lucide-react';

const CATEGORIES = [
    {
        title: 'Contenitori',
        slug: 'categoria/contenitori',
        colorClass: 'bg-primary/20 hover:bg-primary/30',
        icon: <PackageOpen className="w-10 h-10 text-primary-dark" />
    },
    {
        title: 'Vignette',
        slug: 'categoria/vignette',
        colorClass: 'bg-secondary/20 hover:bg-secondary/30',
        icon: <Smile className="w-10 h-10 text-secondary-dark" />
    },
    {
        title: 'Lampade',
        slug: 'categoria/lampade',
        colorClass: 'bg-accent/30 hover:bg-accent/40',
        icon: <Lightbulb className="w-10 h-10 text-yellow-600" />
    },
    {
        title: 'Biglietti 3D',
        slug: 'categoria/biglietti-3d',
        colorClass: 'bg-pink-100 hover:bg-pink-200',
        icon: <Gift className="w-10 h-10 text-pink-500" />
    }
];

export default function CategoryGrid() {
    return (
        <section className="py-24 bg-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-16">
                    <h2 className="text-4xl font-black text-foreground mb-4 tracking-tight">Cosa stai cercando?</h2>
                    <p className="text-lg text-stone-600 max-w-2xl mx-auto">Sfoglia le nostre creazioni stampate in 3D. Ogni pezzo è unico, proprio come te!</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {CATEGORIES.map((cat, index) => (
                        <CategoryCard
                            key={index}
                            title={cat.title}
                            slug={cat.slug}
                            colorClass={cat.colorClass}
                            icon={cat.icon}
                        />
                    ))}
                </div>
            </div>
        </section>
    );
}
