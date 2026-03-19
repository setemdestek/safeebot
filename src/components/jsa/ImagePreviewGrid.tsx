import { PreviewFile } from '@/types/jsa';

interface ImagePreviewGridProps {
    files: PreviewFile[];
    onRemove: (id: string) => void;
}

export default function ImagePreviewGrid({ files, onRemove }: ImagePreviewGridProps) {
    if (files.length === 0) return null;

    const formatSize = (bytes: number) => {
        if (bytes < 1024 * 1024) {
            return `${(bytes / 1024).toFixed(1)} KB`;
        }
        return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
    };

    return (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 mt-4">
            {files.map((file) => (
                <div key={file.id} className="relative rounded-xl overflow-hidden border border-gray-200 group">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                        src={file.previewUrl}
                        alt={file.file.name}
                        className="w-full aspect-square object-cover"
                    />
                    <div className="absolute bottom-0 left-0 right-0 bg-black/60 text-white text-xs p-2 truncate">
                        {file.file.name} ({formatSize(file.file.size)})
                    </div>
                    <button
                        onClick={() => onRemove(file.id)}
                        className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity bg-black/60 text-white rounded-full w-6 h-6 flex items-center justify-center hover:bg-black/80"
                        aria-label="Remove image"
                        type="button"
                    >
                        &times;
                    </button>
                </div>
            ))}
        </div>
    );
}
