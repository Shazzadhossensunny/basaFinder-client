// ImageUpload.tsx
"use client";

import { useState } from "react";
import { X, Upload, Image as ImageIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Image from "next/image";

interface ImageUploadProps {
  value: string[];
  onChange: (urls: string[]) => void;
  maxFiles?: number;
}

const ImageUpload = ({
  value = [],
  onChange,
  maxFiles = 5,
}: ImageUploadProps) => {
  const [newImageUrl, setNewImageUrl] = useState("");

  const addImage = () => {
    if (!newImageUrl.trim()) return;

    if (value.length >= maxFiles) {
      alert(`Maximum of ${maxFiles} images allowed.`);
      return;
    }

    if (value.includes(newImageUrl)) {
      alert("This image URL is already added.");
      return;
    }

    onChange([...value, newImageUrl]);
    setNewImageUrl("");
  };

  const removeImage = (index: number) => {
    const newImages = [...value];
    newImages.splice(index, 1);
    onChange(newImages);
  };

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <Input
          placeholder="Enter image URL"
          value={newImageUrl}
          onChange={(e) => setNewImageUrl(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && e.preventDefault()}
        />
        <Button type="button" onClick={addImage} disabled={!newImageUrl.trim()}>
          <Upload className="h-4 w-4 mr-2" />
          Add
        </Button>
      </div>

      {value.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-4">
          {value.map((url, index) => (
            <div key={index} className="relative group">
              <div className="aspect-video relative rounded-md overflow-hidden border border-gray-200 bg-gray-50">
                {url ? (
                  <div className="relative w-full h-full">
                    <Image
                      src={url}
                      alt={`Property image ${index + 1}`}
                      fill
                      unoptimized
                      className="object-cover"
                      onError={(e) => {
                        const imgElement = e.target as HTMLImageElement;
                        imgElement.src =
                          "https://psediting.websites.co.in/obaju-turquoise/img/product-placeholder.png";
                        imgElement.onerror = null;
                      }}
                    />
                  </div>
                ) : (
                  <div className="flex items-center justify-center h-full">
                    <ImageIcon className="h-10 w-10 text-gray-400" />
                  </div>
                )}
                <button
                  type="button"
                  onClick={() => removeImage(index)}
                  className="absolute top-2 right-2 bg-white rounded-full p-1 shadow-md opacity-70 group-hover:opacity-100"
                >
                  <X className="h-4 w-4 text-red-500" />
                </button>
              </div>
              {index === 0 && (
                <span className="absolute top-2 left-2 bg-primary text-white text-xs px-2 py-1 rounded">
                  Main
                </span>
              )}
            </div>
          ))}
        </div>
      )}

      <p className="text-sm text-gray-500">
        {value.length} of {maxFiles} images added
      </p>
    </div>
  );
};

export default ImageUpload;
