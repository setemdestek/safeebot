// src/lib/cv-builder/docx-templates/emerald-timeline.ts
import {
  Document,
  Paragraph,
  TextRun,
  Table,
  TableRow,
  TableCell,
  AlignmentType,
  BorderStyle,
  WidthType,
} from 'docx';
import type { CVFormData } from '@/types/cv';
import type { CVLabels } from '../cv-labels';
import {
  createContactInfo,
  createDateRange,
  createSkillBar,
  embedPhoto,
  hexToDocxColor,
  noBorder,
} from '../docx-utils';

const timelineBorder = {
  top: { style: BorderStyle.NONE, size: 0, color: 'FFFFFF' },
  bottom: { style: BorderStyle.NONE, size: 0, color: 'FFFFFF' },
  left: { style: BorderStyle.SINGLE, size: 2, color: hexToDocxColor('#059669') },
  right: { style: BorderStyle.NONE, size: 0, color: 'FFFFFF' },
} as const;

function emeraldHeading(text: string): Paragraph {
  return new Paragraph({
    spacing: { before: 320, after: 80 },
    children: [
      new TextRun({
        text: text.toUpperCase(),
        bold: true,
        size: 26,
        color: hexToDocxColor('#065f46'),
        font: 'Calibri',
      }),
    ],
    border: {
      bottom: { style: BorderStyle.SINGLE, size: 1, color: hexToDocxColor('#d1fae5') },
    },
  });
}

function timelineEntry(
  dateText: string,
  contentParagraphs: Paragraph[],
): Table {
  return new Table({
    width: { size: 100, type: WidthType.PERCENTAGE },
    rows: [
      new TableRow({
        children: [
          new TableCell({
            width: { size: 22, type: WidthType.PERCENTAGE },
            borders: noBorder,
            children: [
              new Paragraph({
                alignment: AlignmentType.RIGHT,
                spacing: { before: 20 },
                children: [
                  new TextRun({
                    text: dateText,
                    size: 18,
                    color: hexToDocxColor('#059669'),
                    font: 'Calibri',
                    italics: true,
                  }),
                ],
              }),
            ],
          }),
          new TableCell({
            width: { size: 3, type: WidthType.PERCENTAGE },
            borders: timelineBorder,
            shading: { fill: hexToDocxColor('#d1fae5') },
            children: [new Paragraph({ children: [new TextRun({ text: ' ', size: 10 })] })],
          }),
          new TableCell({
            width: { size: 75, type: WidthType.PERCENTAGE },
            borders: noBorder,
            children: contentParagraphs,
          }),
        ],
      }),
    ],
  });
}

export function buildEmeraldTimelineDocx(
  data: CVFormData,
  photoBuffer: Buffer | null,
  labels: CVLabels,
): Document {
  const primary = hexToDocxColor('#065f46');
  const secondary = hexToDocxColor('#059669');
  const muted = hexToDocxColor('#6b7280');
  const sections: (Paragraph | Table)[] = [];

  // Name header with green accent
  sections.push(
    new Paragraph({
      spacing: { after: 40 },
      children: [
        new TextRun({
          text: `${data.personalInfo.firstName} ${data.personalInfo.lastName}`,
          bold: true,
          size: 38,
          color: primary,
          font: 'Calibri',
        }),
      ],
    }),
  );

  // Green accent bar
  sections.push(
    new Paragraph({
      spacing: { after: 60 },
      shading: { fill: secondary },
      children: [new TextRun({ text: ' ', size: 4 })],
    }),
  );

  // Photo
  if (photoBuffer) {
    sections.push(
      new Paragraph({
        spacing: { after: 80 },
        children: [embedPhoto(photoBuffer, 100, 100)],
      }),
    );
  }

  // Contact info
  sections.push(...createContactInfo(data.personalInfo, labels));

  // About Me
  if (data.personalInfo.aboutMe) {
    sections.push(emeraldHeading(labels.aboutMe));
    sections.push(
      new Paragraph({
        spacing: { before: 40, after: 100 },
        children: [new TextRun({ text: data.personalInfo.aboutMe, size: 22, font: 'Calibri' })],
      }),
    );
  }

  // Work Experience — timeline style
  if (data.workExperience.length > 0) {
    sections.push(emeraldHeading(labels.workExperience));
    data.workExperience.forEach((work) => {
      const dateStr = createDateRange(work.startDate, work.endDate, work.currentlyWorking, labels);
      sections.push(
        timelineEntry(dateStr, [
          new Paragraph({
            spacing: { before: 20 },
            children: [
              new TextRun({ text: work.position, bold: true, size: 23, font: 'Calibri', color: primary }),
            ],
          }),
          new Paragraph({
            children: [
              new TextRun({ text: work.company, size: 20, font: 'Calibri', color: secondary }),
            ],
          }),
          new Paragraph({
            spacing: { after: 40 },
            children: [
              new TextRun({ text: work.description, size: 21, font: 'Calibri' }),
            ],
          }),
        ]),
      );
    });
  }

  // Education — timeline style
  if (data.education.length > 0) {
    sections.push(emeraldHeading(labels.education));
    data.education.forEach((edu) => {
      const dateStr = createDateRange(edu.startDate, edu.endDate, edu.currentlyStudying, labels);
      sections.push(
        timelineEntry(dateStr, [
          new Paragraph({
            spacing: { before: 20 },
            children: [
              new TextRun({ text: edu.institution, bold: true, size: 22, font: 'Calibri', color: primary }),
            ],
          }),
          new Paragraph({
            children: [
              new TextRun({ text: `${edu.major} — ${edu.city}`, size: 20, font: 'Calibri', color: muted }),
            ],
          }),
        ]),
      );
    });
  }

  // Skills
  if (data.skills.length > 0) {
    sections.push(emeraldHeading(labels.skills));
    data.skills.forEach((skill) => {
      sections.push(createSkillBar(skill.name, skill.level, '#059669'));
    });
  }

  // Languages
  if (data.languages.length > 0) {
    sections.push(emeraldHeading(labels.languages));
    data.languages.forEach((lang) => {
      sections.push(
        new Paragraph({
          spacing: { before: 20, after: 20 },
          children: [
            new TextRun({ text: `${lang.name}: `, bold: true, size: 21, font: 'Calibri', color: primary }),
            new TextRun({ text: lang.level, size: 21, font: 'Calibri', color: muted }),
          ],
        }),
      );
    });
  }

  // Courses — timeline style
  if (data.courses.length > 0) {
    sections.push(emeraldHeading(labels.courses));
    data.courses.forEach((course) => {
      sections.push(
        timelineEntry(course.date, [
          new Paragraph({
            spacing: { before: 20 },
            children: [
              new TextRun({ text: course.name, bold: true, size: 21, font: 'Calibri', color: primary }),
              new TextRun({ text: ` — ${course.organization}`, size: 19, font: 'Calibri', color: muted }),
            ],
          }),
        ]),
      );
    });
  }

  // Certificates — timeline style
  if (data.certificates.length > 0) {
    sections.push(emeraldHeading(labels.certificates));
    data.certificates.forEach((cert) => {
      sections.push(
        timelineEntry(cert.date, [
          new Paragraph({
            spacing: { before: 20 },
            children: [
              new TextRun({ text: cert.name, bold: true, size: 21, font: 'Calibri', color: primary }),
              new TextRun({ text: ` — ${cert.issuer}`, size: 19, font: 'Calibri', color: muted }),
            ],
          }),
        ]),
      );
    });
  }

  // Interests
  if (data.interests.length > 0) {
    sections.push(emeraldHeading(labels.interests));
    sections.push(
      new Paragraph({
        children: [new TextRun({ text: data.interests.join(' • '), size: 21, font: 'Calibri', color: muted })],
      }),
    );
  }

  // References
  if (data.references.length > 0) {
    sections.push(emeraldHeading(labels.references));
    data.references.forEach((ref) => {
      sections.push(
        new Paragraph({
          spacing: { before: 50 },
          children: [
            new TextRun({ text: ref.fullName, bold: true, size: 21, font: 'Calibri', color: primary }),
            new TextRun({ text: ` — ${ref.position}, ${ref.company}`, size: 19, font: 'Calibri', color: muted }),
          ],
        }),
      );
      sections.push(
        new Paragraph({
          children: [
            new TextRun({ text: `${ref.phone} | ${ref.email}`, size: 19, color: muted, font: 'Calibri' }),
          ],
        }),
      );
    });
  }

  return new Document({
    sections: [{ children: sections }],
  });
}
