export interface JSAMetadata {
    inspector_name: string
    work_location: string
    date: string
    company_name: string
    notes: string
}

export type AnalysisStep = 'idle' | 'uploading' | 'analyzing' | 'risk_assessment' | 'generating' | 'done' | 'error'

export interface AnalysisState {
    step: AnalysisStep
    error: string | null
    blob: Blob | null
    fileName: string | null
}

export interface PreviewFile {
    id: string
    file: File
    previewUrl: string
}
