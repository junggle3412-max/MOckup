import React, { useRef } from 'react';
import { Upload, X, Image as ImageIcon } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface ImageUploaderProps {
  label: string;
  image: string | null;
  onImageUpload: (base64: string) => void;
  onClear: () => void;
  id?: string;
}

export default function ImageUploader({ label, image, onImageUpload, onClear, id }: ImageUploaderProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        onImageUpload(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const onDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        onImageUpload(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="flex flex-col gap-2" id={id}>
      <label className="text-xs font-semibold uppercase tracking-wider text-neutral-500">{label}</label>
      <div
        onDragOver={onDragOver}
        onDrop={onDrop}
        className={`relative group h-48 w-full border-2 border-dashed rounded-xl transition-all duration-300 flex flex-col items-center justify-center overflow-hidden
          ${image ? 'border-neutral-200 bg-white' : 'border-neutral-300 bg-neutral-50 hover:bg-neutral-100 hover:border-neutral-400'}`}
      >
        <AnimatePresence mode="wait">
          {image ? (
            <motion.div
              key="preview"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="absolute inset-0 p-2"
            >
              <img src={image} className="w-full h-full object-contain rounded-lg" alt="Upload Preview" />
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onClear();
                }}
                className="absolute top-4 right-4 p-1.5 bg-background/80 backdrop-blur-sm shadow-sm rounded-full hover:bg-red-50 hover:text-red-600 transition-colors"
                id={`${id}-clear-btn`}
              >
                <X size={16} />
              </button>
            </motion.div>
          ) : (
            <motion.div
              key="placeholder"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => fileInputRef.current?.click()}
              className="flex flex-col items-center gap-3 cursor-pointer p-6 text-center"
            >
              <div className="p-3 bg-neutral-200 rounded-full group-hover:scale-110 transition-transform">
                <Upload size={20} className="text-neutral-600" />
              </div>
              <div className="space-y-1">
                <p className="text-sm font-medium text-neutral-700">Click or drag image</p>
                <p className="text-xs text-neutral-400">PNG, JPG up to 10MB</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleFileChange}
        />
      </div>
    </div>
  );
}
