import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, Expand } from 'lucide-react';

interface ListingGalleryProps {
  images: string[] | null;
}

const ListingGallery = ({ images }: ListingGalleryProps) => {
  const [currentImage, setCurrentImage] = useState(0);
  const safeImages = images ?? ['/placeholder.svg'];

  const nextImage = () => {
    setCurrentImage(prev => (prev + 1) % safeImages.length);
  };

  const prevImage = () => {
    setCurrentImage(prev => (prev - 1 + safeImages.length) % safeImages.length);
  };

  return (
    <div className="mb-8">
      <div className="relative mb-4 aspect-video overflow-hidden rounded-lg bg-muted">
        <img
          src={safeImages[currentImage]}
          alt={`Image ${currentImage + 1}`}
          className="h-full w-full object-cover"
        />

        {safeImages.length > 1 && (
          <>
            <Button
              variant="secondary"
              size="sm"
              className="absolute left-4 top-1/2 -translate-y-1/2 transform"
              onClick={prevImage}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="secondary"
              size="sm"
              className="absolute right-4 top-1/2 -translate-y-1/2 transform"
              onClick={nextImage}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </>
        )}

        <Button
          variant="secondary"
          size="sm"
          className="absolute bottom-4 right-4"
        >
          <Expand className="mr-2 h-4 w-4" />
          View Gallery
        </Button>

        {safeImages.length > 1 && (
          <div className="absolute bottom-4 left-4 rounded-full bg-black/50 px-3 py-1 text-sm text-white">
            {currentImage + 1} / {safeImages.length}
          </div>
        )}
      </div>

      {safeImages.length > 1 && (
        <div className="grid grid-cols-4 gap-2 md:grid-cols-6">
          {safeImages.map((image, index) => (
            <button
              key={index}
              onClick={() => setCurrentImage(index)}
              className={`aspect-video overflow-hidden rounded-md border-2 transition-all ${
                index === currentImage
                  ? 'border-primary ring-2 ring-primary/20'
                  : 'border-transparent hover:border-muted-foreground'
              }`}
            >
              <img
                src={image}
                alt={`Thumbnail ${index + 1}`}
                className="h-full w-full object-cover"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default ListingGallery;
