import { getProductById } from "@/lib/adminActions";
import { notFound } from "next/navigation";
import ProductDetailClient from "./ProductDetailClient";

interface PageProps {
    params: Promise<{ id: string }>;
}

export default async function ProductPage({ params }: PageProps) {
    const { id } = await params;

    const product = await getProductById(id);

    if (!product) {
        notFound();
    }

    return (
        <main className="min-h-screen pt-20">
            <ProductDetailClient product={product} />
        </main>
    );
}
