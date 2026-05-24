import React from 'react';

export const Skeleton = ({ className = "" }: { className?: string }) => {
  return (
    <div className={`skeleton rounded-xl ${className}`}></div>
  );
};

export const ImageSkeleton = ({ className = "" }: { className?: string }) => {
  return (
    <div className={`skeleton w-full h-full object-cover rounded-2xl ${className}`}></div>
  );
};
