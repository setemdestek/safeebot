// src/lib/cv-builder/generate-cv.ts
import { Packer, Document, Paragraph, TextRun } from 'docx';
import sharp from 'sharp';
import { getDocxBuilder } from './docx-templates';
import { getCVLabels } from './cv-labels';
import type { CVFormData, CVLanguage } from '@/types/cv';

export async function generateCV(
  data: CVFormData,
  photoBuffer: Buffer | null,
): Promise<Buffer> {
  const labels = getCVLabels(data.cvLanguage);

  let processedPhoto: Buffer | null = null;
  if (photoBuffer) {
    const metadata = await sharp(photoBuffer).metadata();
    const maxDim = 600;
    if ((metadata.width ?? 0) > maxDim || (metadata.height ?? 0) > maxDim) {
      processedPhoto = await sharp(photoBuffer)
        .resize(maxDim, maxDim, { fit: 'inside', withoutEnlargement: true })
        .jpeg({ quality: 85 })
        .toBuffer();
    } else {
      processedPhoto = photoBuffer;
    }
  }

  const builder = getDocxBuilder(data.templateId);
  const doc = builder(data, processedPhoto, labels);
  return Buffer.from(await Packer.toBuffer(doc));
}

export async function generateCoverLetterDocx(
  coverLetterText: string,
  cvLanguage: CVLanguage,
): Promise<Buffer> {
  const paragraphs = coverLetterText.split('\n\n').map(
    (para) =>
      new Paragraph({
        spacing: { after: 200 },
        children: [new TextRun({ text: para, size: 24, font: 'Calibri' })],
      }),
  );
  const doc = new Document({ sections: [{ children: paragraphs }] });
  return Buffer.from(await Packer.toBuffer(doc));
}
