// src/lib/cv-builder/docx-utils.ts
import {
  Paragraph,
  TextRun,
  Table,
  TableRow,
  TableCell,
  ImageRun,
  AlignmentType,
  BorderStyle,
  WidthType,
} from 'docx';
import type { ITableCellBorders } from 'docx';
import type { PersonalInfo } from '@/types/cv';
import type { CVLabels } from './cv-labels';

const noBorder: ITableCellBorders = {
  top: { style: BorderStyle.NONE, size: 0, color: 'FFFFFF' },
  bottom: { style: BorderStyle.NONE, size: 0, color: 'FFFFFF' },
  left: { style: BorderStyle.NONE, size: 0, color: 'FFFFFF' },
  right: { style: BorderStyle.NONE, size: 0, color: 'FFFFFF' },
};

export function createSectionHeader(
  text: string,
  color: string,
  fontSize: number = 26,
): Paragraph {
  return new Paragraph({
    spacing: { before: 300, after: 100 },
    children: [
      new TextRun({
        text: text.toUpperCase(),
        bold: true,
        size: fontSize,
        color,
        font: 'Calibri',
      }),
    ],
  });
}

export function createSeparator(color: string): Paragraph {
  return new Paragraph({
    spacing: { before: 50, after: 50 },
    border: {
      bottom: { style: BorderStyle.SINGLE, size: 1, color },
    },
    children: [],
  });
}

export function createBulletPoint(
  text: string,
  fontSize: number = 22,
): Paragraph {
  return new Paragraph({
    bullet: { level: 0 },
    spacing: { before: 40, after: 40 },
    children: [new TextRun({ text, size: fontSize, font: 'Calibri' })],
  });
}

export function createDateRange(
  start: string,
  end: string | undefined,
  isCurrent: boolean,
  labels: CVLabels,
): string {
  const endText = isCurrent ? labels.present : (end || '');
  return `${start} — ${endText}`;
}

export function createContactInfo(
  personalInfo: PersonalInfo,
  labels: CVLabels,
): Paragraph[] {
  const lines: string[] = [];
  lines.push(`${labels.email}: ${personalInfo.email}`);
  lines.push(`${labels.phone}: ${personalInfo.phone}`);
  lines.push(`${labels.city}: ${personalInfo.city}`);
  if (personalInfo.address)
    lines.push(`${labels.address}: ${personalInfo.address}`);
  if (personalInfo.linkedinUrl)
    lines.push(`${labels.linkedin}: ${personalInfo.linkedinUrl}`);
  if (personalInfo.dateOfBirth)
    lines.push(`${labels.dateOfBirth}: ${personalInfo.dateOfBirth}`);
  if (personalInfo.driversLicense)
    lines.push(`${labels.driversLicense}: ${personalInfo.driversLicense}`);
  lines.push(
    `${labels.maritalStatus}: ${personalInfo.maritalStatus === 'married' ? labels.married : labels.single}`,
  );

  return lines.map(
    (line) =>
      new Paragraph({
        spacing: { before: 20, after: 20 },
        children: [new TextRun({ text: line, size: 20, font: 'Calibri' })],
      }),
  );
}

export function embedPhoto(
  photoBuffer: Buffer,
  width: number = 120,
  height: number = 120,
): ImageRun {
  return new ImageRun({
    data: photoBuffer,
    transformation: { width, height },
    type: 'jpg',
  });
}

export function createSkillBar(
  name: string,
  level: string,
  primaryColor: string,
): Table {
  const levelMap: Record<string, number> = {
    beginner: 1,
    intermediate: 2,
    good: 3,
    excellent: 4,
    expert: 5,
  };
  const filled = levelMap[level] || 3;

  return new Table({
    width: { size: 100, type: WidthType.PERCENTAGE },
    rows: [
      new TableRow({
        children: [
          new TableCell({
            width: { size: 40, type: WidthType.PERCENTAGE },
            borders: noBorder,
            children: [
              new Paragraph({
                children: [
                  new TextRun({ text: name, size: 20, font: 'Calibri' }),
                ],
              }),
            ],
          }),
          ...Array.from({ length: 5 }, (_, i) =>
            new TableCell({
              width: { size: 12, type: WidthType.PERCENTAGE },
              borders: noBorder,
              shading: {
                fill: i < filled
                  ? primaryColor.replace('#', '')
                  : 'E5E7EB',
              },
              children: [
                new Paragraph({
                  children: [new TextRun({ text: ' ', size: 16 })],
                }),
              ],
            }),
          ),
        ],
      }),
    ],
  });
}

export function hexToDocxColor(hex: string): string {
  return hex.replace('#', '');
}

export { noBorder };
