"use client";

import React, { useState } from "react";
import Image from "next/image";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ArrowRight, X } from "lucide-react";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";

interface ImageGalleryProps {
  images: string[];
}

const ImageGallery: React.FC<ImageGalleryProps> = ({ images }) => {
  const [selectedImage, setSelectedImage] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handlePrevious = () => {
    setSelectedImage((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setSelectedImage((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  const fallbackImage = "/placeholder-property.jpg";

  // Display placeholder if no images are available
  const displayImages = images.length > 0 ? images : [fallbackImage];

  return (
    <div className="mb-8">
      <div
        className="relative aspect-video rounded-lg overflow-hidden border border-gray-200 cursor-pointer"
        onClick={() => setIsModalOpen(true)}
      >
        <Image
          src={displayImages[0] || fallbackImage}
          alt="Property main image"
          fill
          className="object-cover hover:scale-105 transition-transform duration-300"
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            target.src = fallbackImage;
          }}
        />

        {displayImages.length > 1 && (
          <div className="absolute bottom-4 right-4 bg-black/60 text-white text-sm px-3 py-1 rounded-full">
            View all {displayImages.length} photos
          </div>
        )}
      </div>

      {displayImages.length > 1 && (
        <div className="grid grid-cols-4 gap-2 mt-2">
          {displayImages.slice(0, 4).map((image, index) => (
            <div
              key={index}
              className={`relative aspect-video rounded overflow-hidden border cursor-pointer
                ${selectedImage === index ? "ring-2 ring-primary" : ""}`}
              onClick={() => {
                setSelectedImage(index);
                setIsModalOpen(true);
              }}
            >
              <Image
                src={image}
                alt={`Property image ${index + 1}`}
                fill
                className="object-cover"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.src = fallbackImage;
                }}
              />

              {displayImages.length > 4 && index === 3 && (
                <div className="absolute inset-0 bg-black/60 flex items-center justify-center text-white">
                  +{displayImages.length - 4} more
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="max-w-4xl p-0 bg-black">
          <VisuallyHidden>
            <DialogTitle>Hidden Title</DialogTitle>
          </VisuallyHidden>
          <Button
            variant="ghost"
            className="absolute right-2 top-2 text-white z-10 p-2"
            onClick={() => setIsModalOpen(false)}
          >
            <X size={24} />
          </Button>

          <div className="relative h-[80vh] w-full">
            <Image
              src={displayImages[selectedImage]}
              alt={`Property image ${selectedImage + 1}`}
              fill
              className="object-contain"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.src = fallbackImage;
              }}
            />

            {displayImages.length > 1 && (
              <>
                <Button
                  variant="ghost"
                  className="absolute left-2 top-1/2 -translate-y-1/2 text-white p-2"
                  onClick={(e) => {
                    e.stopPropagation();
                    handlePrevious();
                  }}
                >
                  <ArrowLeft size={24} />
                </Button>

                <Button
                  variant="ghost"
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-white p-2"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleNext();
                  }}
                >
                  <ArrowRight size={24} />
                </Button>

                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-white text-sm">
                  {selectedImage + 1} / {displayImages.length}
                </div>
              </>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ImageGallery;
