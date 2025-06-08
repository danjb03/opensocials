
import React, { useState, memo } from 'react';
import { cn } from '@/lib/utils';

interface OptimizedImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  src: string;
  alt: string;
  fallbackSrc?: string;
  className?: string;
  loadingClassName?: string;
  errorClassName?: string;
}

const OptimizedImage = memo(({
  src,
  alt,
  fallbackSrc,
  className,
  loadingClassName,
  errorClassName,
  ...props
}: OptimizedImageProps) => {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [currentSrc, setCurrentSrc] = useState(src);

  const handleLoad = () => {
    setIsLoading(false);
    setHasError(false);
  };

  const handleError = () => {
    setIsLoading(false);
    setHasError(true);
    if (fallbackSrc && currentSrc !== fallbackSrc) {
      setCurrentSrc(fallbackSrc);
      setIsLoading(true);
      setHasError(false);
    }
  };

  return (
    <div className={cn("relative overflow-hidden", className)}>
      {isLoading && (
        <div className={cn(
          "absolute inset-0 bg-muted animate-pulse",
          loadingClassName
        )} />
      )}
      <img
        {...props}
        src={currentSrc}
        alt={alt}
        onLoad={handleLoad}
        onError={handleError}
        className={cn(
          "transition-opacity duration-300",
          isLoading ? "opacity-0" : "opacity-100",
          hasError && errorClassName,
          className
        )}
        loading="lazy"
      />
      {hasError && !fallbackSrc && (
        <div className={cn(
          "absolute inset-0 flex items-center justify-center bg-muted text-muted-foreground text-sm",
          errorClassName
        )}>
          Failed to load image
        </div>
      )}
    </div>
  );
});

OptimizedImage.displayName = 'OptimizedImage';

export { OptimizedImage };
