'use client'
import { cn } from '@/lib/utils'
import { useState } from 'react'
import Image from 'next/image'

const ProductImages = ({ images }: { images: string[] }) => {
    const [currentImage, setCurrentImage] = useState(0)
    return (
        <div className="space-y-4">
            <Image
                src={images[currentImage]}
                alt="product image"
                width={1000}
                height={1000}
                className="min-h-[300px] object-cover object-center"
            />
            <div className="flex">
                {images.map((img, idx) => (
                    <div
                        key={idx}
                        className={cn(
                            ' cursor-pointer border mr-2 hover:border-orange-600',
                            idx === currentImage && 'border-orange-500'
                        )}
                        onClick={() => setCurrentImage(idx)}
                    >
                        <Image
                            src={img}
                            alt="product image"
                            width={100}
                            height={100}
                            className="object-cover object-center"
                        />
                    </div>
                ))}
            </div>
        </div>
    )
}

export default ProductImages
