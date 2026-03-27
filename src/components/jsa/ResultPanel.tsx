'use client';

import { useTranslations } from 'next-intl';
import { AnalysisState } from '@/types/jsa';

interface ResultPanelProps {
    state: AnalysisState;
    onReset: () => void;
    onDownloadAgain: () => void;
}

export default function ResultPanel({ state, onReset, onDownloadAgain }: ResultPanelProps) {
    const t = useTranslations('jsa.result');
    const tJsa = useTranslations('jsa');

    if (state.step === 'done') {
        return (
            <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 flex flex-col items-center justify-center text-center mt-6">
                <svg xmlns="http://www.w3.org/2000/svg" className="w-16 h-16 text-[#00B050] animate-bounce mb-4" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <h3 className="text-xl font-bold text-gray-800 mb-2">{t('reportReady')}</h3>
                <p className="text-gray-500 text-sm mb-6">{t('autoDownloaded')}</p>

                <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
                    <button
                        onClick={onDownloadAgain}
                        className="flex items-center justify-center px-6 py-2.5 bg-[#00B050] hover:bg-[#009641] text-white rounded-lg font-medium transition-colors"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                        </svg>
                        {t('downloadAgain')}
                    </button>

                    <button
                        onClick={onReset}
                        className="flex items-center justify-center px-6 py-2.5 bg-white border-2 border-[#1F3864] text-[#1F3864] hover:bg-[#1F3864] hover:text-white rounded-lg font-medium transition-colors"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                        </svg>
                        {t('newAnalysis')}
                    </button>
                </div>
            </div>
        );
    }

    if (state.step === 'error') {
        return (
            <div className="bg-red-50 rounded-2xl p-8 border border-red-200 flex flex-col items-center justify-center text-center mt-6">
                <svg xmlns="http://www.w3.org/2000/svg" className="w-16 h-16 text-red-500 mb-4" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
                <h3 className="text-xl font-bold text-red-800 mb-2">{t('errorTitle')}</h3>
                <p className="text-red-700 text-sm mb-6 max-w-md">{state.error || tJsa('unknownError')}</p>

                <button
                    onClick={onReset}
                    className="flex items-center justify-center px-6 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium transition-colors"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                    {t('retry')}
                </button>
            </div>
        );
    }

    return null;
}
