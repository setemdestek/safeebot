'use client';

import { useState, useEffect } from 'react';
import { JSAMetadata, AnalysisState, PreviewFile } from '@/types/jsa';
import { analyzeImages, downloadBlob } from '@/lib/jsa-api';
import DropZone from './DropZone';
import ImagePreviewGrid from './ImagePreviewGrid';
import MetadataForm from './MetadataForm';
import ProgressTracker from './ProgressTracker';
import ResultPanel from './ResultPanel';

export default function JSAAnalyzer() {
    const [files, setFiles] = useState<PreviewFile[]>([]);
    const [metadata, setMetadata] = useState<JSAMetadata>({
        inspector_name: '',
        work_location: '',
        date: new Date().toISOString().split('T')[0],
        company_name: '',
        notes: ''
    });

    const [analysisState, setAnalysisState] = useState<AnalysisState>({
        step: 'idle',
        error: null,
        blob: null,
        fileName: null
    });

    // Cleanup object URLs to avoid memory leaks
    useEffect(() => {
        return () => {
            files.forEach(f => URL.revokeObjectURL(f.previewUrl));
        };
    }, [files]);

    const handleFilesAdded = (newFiles: File[]) => {
        const newPreviewFiles = newFiles.map(file => ({
            id: crypto.randomUUID(),
            file,
            previewUrl: URL.createObjectURL(file)
        }));

        // Limits applied: Maximum 1 file total. Replace existing if any.
        files.forEach(f => URL.revokeObjectURL(f.previewUrl));
        setFiles(newPreviewFiles);
    };

    const handleRemoveFile = (id: string) => {
        const fileToRemove = files.find(f => f.id === id);
        if (fileToRemove) {
            URL.revokeObjectURL(fileToRemove.previewUrl);
        }
        setFiles(files.filter(f => f.id !== id));
    };

    const delay = (ms: number) => new Promise(res => setTimeout(res, ms));

    const handleAnalyze = async () => {
        try {
            setAnalysisState({ step: 'uploading', error: null, blob: null, fileName: null });
            await delay(800);

            setAnalysisState(prev => ({ ...prev, step: 'analyzing' }));
            await delay(800 + files.length * 500);

            setAnalysisState(prev => ({ ...prev, step: 'risk_assessment' }));
            await delay(1000);

            setAnalysisState(prev => ({ ...prev, step: 'generating' }));

            const fileObjects = files.map(f => f.file);
            const { blob, fileName } = await analyzeImages(fileObjects, metadata);

            setAnalysisState({ step: 'done', error: null, blob, fileName });
            downloadBlob(blob, fileName);

            // Clear files after successful generation as requested
            files.forEach(f => URL.revokeObjectURL(f.previewUrl));
            setFiles([]);

        } catch (error: any) {
            setAnalysisState({
                step: 'error',
                error: error.message || "Bilinməyən xəta baş verdi",
                blob: null,
                fileName: null
            });
        }
    };

    const handleReset = () => {
        files.forEach(f => URL.revokeObjectURL(f.previewUrl));
        setFiles([]);
        setAnalysisState({ step: 'idle', error: null, blob: null, fileName: null });
    };

    const handleDownloadAgain = () => {
        if (analysisState.blob && analysisState.fileName) {
            downloadBlob(analysisState.blob, analysisState.fileName);
        }
    };

    const isFormValid =
        files.length > 0 &&
        metadata.inspector_name.trim() !== '' &&
        metadata.work_location.trim() !== '' &&
        analysisState.step === 'idle';

    return (
        <div className="max-w-5xl mx-auto">
            <div className="text-center mb-10">
                <h1 className="text-3xl font-bold text-[#1F3864] mb-3">İş Təhlükəsizliyi Analizi</h1>
                <p className="text-gray-500 text-lg">Şəkilləri yükləyin, AI hesabatı hazırlar</p>
            </div>

            <ProgressTracker step={analysisState.step} />

            {analysisState.step === 'idle' || analysisState.step === 'error' ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-4">
                        <h2 className="text-xl font-semibold text-gray-800">Şəkil Yükləmə</h2>
                        <DropZone onFilesAdded={handleFilesAdded} disabled={analysisState.step !== 'idle' && analysisState.step !== 'error'} />
                        <ImagePreviewGrid files={files} onRemove={handleRemoveFile} />
                    </div>

                    <div className="space-y-4">
                        <MetadataForm value={metadata} onChange={setMetadata} disabled={analysisState.step !== 'idle' && analysisState.step !== 'error'} />

                        <button
                            onClick={handleAnalyze}
                            disabled={!isFormValid}
                            className={`w-full py-3.5 rounded-xl font-semibold text-lg transition-all flex justify-center items-center shadow-sm
                ${isFormValid
                                    ? 'bg-[#1F3864] text-white hover:bg-[#152745] hover:shadow-md'
                                    : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                                }
              `}
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 002-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                            </svg>
                            JSA Hesabatı Hazırla
                        </button>
                    </div>
                </div>
            ) : null}

            <ResultPanel
                state={analysisState}
                onReset={handleReset}
                onDownloadAgain={handleDownloadAgain}
            />
        </div>
    );
}
