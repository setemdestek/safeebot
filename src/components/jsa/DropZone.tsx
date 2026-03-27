'use client';

import { useState, useRef, ChangeEvent, DragEvent } from 'react';
import { useTranslations } from 'next-intl';

interface DropZoneProps {
    onFilesAdded: (files: File[]) => void;
    disabled?: boolean;
}

export default function DropZone({ onFilesAdded, disabled = false }: DropZoneProps) {
    const t = useTranslations('jsa.dropzone');
    const [isDragActive, setIsDragActive] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    const validateAndAddFiles = (fileList: FileList | null) => {
        setError(null);
        if (!fileList || fileList.length === 0) return;

        if (fileList.length > 1) {
            setError(t('maxOneFile'));
            return;
        }

        const file = fileList[0];
        const validTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/heic'];
        if (!validTypes.includes(file.type)) {
            setError(t('onlyImages'));
            return;
        }

        if (file.size > 10 * 1024 * 1024) {
            setError(t('fileTooLarge'));
            return;
        }

        onFilesAdded([file]);
    };

    const onDragEnter = (e: DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();
        if (!disabled) setIsDragActive(true);
    };

    const onDragLeave = (e: DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragActive(false);
    };

    const onDragOver = (e: DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();
        if (!disabled) setIsDragActive(true);
    };

    const onDrop = (e: DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragActive(false);
        if (!disabled) {
            validateAndAddFiles(e.dataTransfer.files);
        }
    };

    const onFileChange = (e: ChangeEvent<HTMLInputElement>) => {
        validateAndAddFiles(e.target.files);
        // Reset input value so same file can be selected again
        if (e.target) {
            e.target.value = '';
        }
    };

    const handleContainerClick = () => {
        if (!disabled && inputRef.current) {
            inputRef.current.click();
        }
    };

    return (
        <div className="w-full">
            <div
                onClick={handleContainerClick}
                onDragEnter={onDragEnter}
                onDragLeave={onDragLeave}
                onDragOver={onDragOver}
                onDrop={onDrop}
                className={`relative rounded-2xl p-10 text-center transition-all duration-200 cursor-pointer
          ${isDragActive
                        ? 'border-[#1F3864] bg-blue-50 border-solid border-2'
                        : 'border-gray-300 bg-gray-50 border-dashed border-2'
                    }
          ${disabled ? 'opacity-50 cursor-not-allowed pointer-events-none' : 'hover:bg-gray-100'}
        `}
            >
                <input
                    type="file"
                    ref={inputRef}
                    onChange={onFileChange}
                    accept="image/jpeg, image/png, image/webp, image/heic"
                    className="hidden"
                    disabled={disabled}
                />

                <svg xmlns="http://www.w3.org/2000/svg" className="mx-auto h-12 w-12 text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                </svg>

                <p className="text-gray-700 font-medium text-lg">{t('dragHere')}</p>
                <p className="text-gray-500 mt-1">{t('orClick')}</p>
                <p className="text-sm text-gray-400 mt-2">{t('formatInfo')}</p>

                {error && (
                    <p className="text-red-500 text-sm mt-3">{error}</p>
                )}
            </div>

            <div className="mt-3 md:hidden">
                <label className={`w-full flex items-center justify-center p-3 rounded-xl border border-gray-300 bg-white text-gray-700 font-medium ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer hover:bg-gray-50'}`}>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    {t('takePhoto')}
                    <input
                        type="file"
                        accept="image/jpeg, image/png, image/webp, image/heic"
                        capture="environment"
                        className="hidden"
                        onChange={onFileChange}
                        disabled={disabled}
                    />
                </label>
            </div>
        </div>
    );
}
