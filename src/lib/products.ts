export interface Product {
    id: string
    name: string
    description: string
    price: number
    dimensions: string
    type: 'poster' | 'canvas' | 'sticker'
    imageRatio: number // aspect ratio needed (0.75 for 3:4)
}

export const products: Product[] = [
    {
        id: "poster-standard",
        name: "Standard Poster",
        description: "High-quality matte finish poster paper. Perfect for framing.",
        price: 19.99,
        dimensions: "12 x 16 inches",
        type: "poster",
        imageRatio: 0.75
    },
    {
        id: "poster-large",
        name: "Premium Art Print",
        description: "Museum-quality archival paper with rich color reproduction.",
        price: 34.99,
        dimensions: "18 x 24 inches",
        type: "poster",
        imageRatio: 0.75
    },
    {
        id: "canvas-framed",
        name: "Framed Canvas",
        description: "Gallery-wrapped canvas in a sleek black floating frame.",
        price: 89.99,
        dimensions: "16 x 20 inches",
        type: "canvas",
        imageRatio: 0.8 // slightly different crop
    },
    {
        id: "sticker-pack",
        name: "Die-Cut Sticker Pack",
        description: "5x vinyl sticker sheet with glossy UV coating.",
        price: 12.99,
        dimensions: "5 x 7 inches",
        type: "sticker",
        imageRatio: 0.71
    }
]

