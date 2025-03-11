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
  const [mainImgSrc, setMainImgSrc] = useState(images[0] || "");

  const fallbackImage =
    "https://psediting.websites.co.in/obaju-turquoise/img/product-placeholder.png"; // Move to public folder
  const displayImages = images.length > 0 ? images : [fallbackImage];

  const handlePrevious = () => {
    setSelectedImage((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setSelectedImage((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  return (
    <div className="mb-8">
      {/* Main Image */}
      <div
        className="relative aspect-video rounded-lg overflow-hidden border border-gray-200 cursor-pointer bg-gray-50"
        onClick={() => setIsModalOpen(true)}
        role="button"
        tabIndex={0}
        aria-label="Open image gallery"
      >
        <Image
          src={mainImgSrc || fallbackImage}
          alt="Main property view"
          fill
          priority
          className="object-cover hover:scale-105 transition-transform duration-300"
          onError={() => setMainImgSrc(fallbackImage)}
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />

        {displayImages.length > 1 && (
          <div className="absolute bottom-4 right-4 bg-black/60 text-white text-sm px-3 py-1 rounded-full backdrop-blur-sm">
            View all {displayImages.length} photos
          </div>
        )}
      </div>

      {/* Thumbnails */}
      {displayImages.length > 1 && (
        <div className="grid grid-cols-4 gap-2 mt-2">
          {displayImages.slice(0, 4).map((image, index) => (
            <Thumbnail
              key={index}
              image={image}
              index={index}
              selected={selectedImage === index}
              totalImages={displayImages.length}
              onSelect={() => {
                setSelectedImage(index);
                setIsModalOpen(true);
              }}
            />
          ))}
        </div>
      )}

      {/* Modal */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="max-w-4xl p-0 bg-black/90 backdrop-blur-sm">
          <VisuallyHidden>
            <DialogTitle>Property Image Gallery</DialogTitle>
          </VisuallyHidden>

          <Button
            variant="ghost"
            className="absolute right-2 top-2 text-white/80 hover:text-white z-10 p-2"
            onClick={() => setIsModalOpen(false)}
            aria-label="Close gallery"
          >
            <X size={24} />
          </Button>

          <div className="relative h-[80vh] w-full bg-gray-900/50">
            <GalleryImage
              src={displayImages[selectedImage]}
              index={selectedImage}
              total={displayImages.length}
            />

            {displayImages.length > 1 && (
              <>
                <NavButton
                  direction="previous"
                  onClick={handlePrevious}
                  aria-label="Previous image"
                />
                <NavButton
                  direction="next"
                  onClick={handleNext}
                  aria-label="Next image"
                />
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-white/80 text-sm backdrop-blur-sm px-3 py-1 rounded-full">
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

// Thumbnail Sub-component
const Thumbnail = ({
  image,
  index,
  selected,
  totalImages,
  onSelect,
}: {
  image: string;
  index: number;
  selected: boolean;
  totalImages: number;
  onSelect: () => void;
}) => {
  const [src, setSrc] = useState(image);

  return (
    <div
      className={`relative aspect-video rounded overflow-hidden border cursor-pointer transition-all
        ${selected ? "ring-2 ring-primary" : "hover:ring-1 ring-gray-300"}`}
      onClick={onSelect}
      role="button"
      tabIndex={0}
      aria-label={`View image ${index + 1}`}
    >
      <Image
        src={src}
        alt={`Property thumbnail ${index + 1}`}
        fill
        className="object-cover"
        onError={() =>
          setSrc(
            "https://psediting.websites.co.in/obaju-turquoise/img/product-placeholder.png"
          )
        }
        sizes="(max-width: 768px) 25vw, 100px"
      />

      {totalImages > 4 && index === 3 && (
        <div className="absolute inset-0 bg-black/60 flex items-center justify-center text-white backdrop-blur-sm">
          +{totalImages - 4} more
        </div>
      )}
    </div>
  );
};

// Gallery Image Sub-component
const GalleryImage = ({
  src,
  index,
  total,
}: {
  src: string;
  index: number;
  total: number;
}) => {
  const [imgSrc, setImgSrc] = useState(src);

  return (
    <Image
      src={imgSrc}
      alt={`Property image ${index + 1} of ${total}`}
      fill
      className="object-contain"
      priority={index < 3}
      onError={() =>
        setImgSrc(
          "https://psediting.websites.co.in/obaju-turquoise/img/product-placeholder.png"
        )
      }
    />
  );
};

// Navigation Button Sub-component
const NavButton = ({
  direction,
  onClick,
  ...props
}: {
  direction: "previous" | "next";
  onClick: () => void;
  [key: string]: any;
}) => (
  <Button
    variant="ghost"
    className={`absolute ${
      direction === "previous" ? "left-2" : "right-2"
    } top-1/2 -translate-y-1/2 text-white/80 hover:text-white p-2`}
    onClick={(e) => {
      e.stopPropagation();
      onClick();
    }}
    {...props}
  >
    {direction === "previous" ? (
      <ArrowLeft size={24} />
    ) : (
      <ArrowRight size={24} />
    )}
  </Button>
);

export default ImageGallery;
