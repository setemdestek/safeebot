'use client';

import { useTranslations } from 'next-intl';
import { AnalysisStep } from '@/types/jsa';

interface ProgressTrackerProps {
    step: AnalysisStep;
}

export default function ProgressTracker({ step }: ProgressTrackerProps) {
    const t = useTranslations('jsa.progress');

    if (step === 'idle' || step === 'error') return null;

    const steps = [
        { id: 'uploading', label: t('uploading') },
        { id: 'analyzing', label: t('analyzing') },
        { id: 'risk_assessment', label: t('riskAssessment') },
        { id: 'generating', label: t('generating') },
        { id: 'done', label: t('done') }
    ];

    const currentStepIndex = steps.findIndex(s => s.id === step);

    return (
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 mb-6">
            <h3 className="font-semibold text-gray-800 text-lg mb-4">{t('heading')}</h3>
            <div className="flex flex-col space-y-0 relative">
                {steps.map((s, index) => {
                    const isCompleted = currentStepIndex > index || step === 'done';
                    const isActive = currentStepIndex === index && step !== 'done';
                    let isPending = currentStepIndex < index && step !== 'done';
                    const isLast = index === steps.length - 1;

                    return (
                        <div key={s.id} className="relative flex items-start min-h-[48px] group">
                            {/* Connector Line */}
                            {!isLast && (
                                <div
                                    className={`absolute left-4 top-8 bottom-0 w-0.5 transition-colors duration-300 ${isCompleted ? 'bg-[#00B050]' : 'bg-gray-200'}`}
                                    style={{ transform: 'translateX(-50%)' }}
                                />
                            )}

                            {/* Icon Container */}
                            <div className="relative z-10 flex items-center justify-center shrink-0 w-8 h-8 rounded-full bg-white">
                                {isCompleted ? (
                                    <div className="w-8 h-8 rounded-full bg-[#00B050] flex items-center justify-center transition-all duration-300">
                                        <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                                        </svg>
                                    </div>
                                ) : isActive ? (
                                    <div className="w-8 h-8 rounded-full bg-[#1F3864] flex items-center justify-center transition-all duration-300">
                                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                    </div>
                                ) : (
                                    <div className="w-8 h-8 rounded-full border-2 border-gray-300 bg-white flex items-center justify-center transition-all duration-300" />
                                )}
                            </div>

                            {/* Label */}
                            <div className="ml-4 pt-1 pb-6 w-full">
                                <p className={`text-sm transition-colors duration-300 ${isCompleted ? 'text-[#00B050] font-medium' : isActive ? 'text-[#1F3864] font-semibold' : 'text-gray-400'}`}>
                                    {s.label}
                                </p>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
