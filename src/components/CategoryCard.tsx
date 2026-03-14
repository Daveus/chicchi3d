'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';

interface CategoryCardProps {
    title: string;
    colorClass: string;
    slug: string;
    icon: React.ReactNode;
}

export default function CategoryCard({ title, colorClass, slug, icon }: CategoryCardProps) {
    return (
        <Link href={`/${slug}`}>
            <motion.div
                className={`relative overflow-hidden rounded-3xl ${colorClass} p-8 h-64 flex flex-col items-center justify-center text-center shadow-soft cursor-pointer transition-shadow`}
                whileHover={{
                    y: -10,
                    rotateX: 10,
                    rotateY: -5,
                    scale: 1.02,
                    boxShadow: "0 20px 50px -10px rgba(0,0,0,0.15)"
                }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
            >
                <div className="bg-white/30 backdrop-blur-sm w-20 h-20 rounded-full flex items-center justify-center mb-4 text-foreground shadow-sm">
                    {icon}
                </div>
                <h3 className="text-xl font-black text-foreground">{title}</h3>

                {/* Decorative elements */}
                <div className="absolute top-0 right-0 -mt-4 -mr-4 w-24 h-24 bg-white/20 rounded-full blur-xl pointer-events-none"></div>
                <div className="absolute bottom-0 left-0 -mb-4 -ml-4 w-32 h-32 bg-white/10 rounded-full blur-2xl pointer-events-none"></div>
            </motion.div>
        </Link>
    );
}
