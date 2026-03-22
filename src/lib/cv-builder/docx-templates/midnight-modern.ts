// src/lib/cv-builder/docx-templates/midnight-modern.ts
import {
  Document,
  Paragraph,
  TextRun,
  Table,
  TableRow,
  TableCell,
  AlignmentType,
  WidthType,
} from 'docx';
import type { CVFormData } from '@/types/cv';
import type { CVLabels } from '../cv-labels';
import {
  createDateRange,
  createSkillBar,
  embedPhoto,
  hexToDocxColor,
  noBorder,
} from '../docx-utils';

function sidebarHeading(text: string): Paragraph {
  return new Paragraph({
    spacing: { before: 200, after: 60 },
    children: [
      new TextRun({
        text: text.toUpperCase(),
        bold: true,
        size: 22,
        color: '38bdf8',
        font: 'Calibri',
      }),
    ],
  });
}

function mainHeading(text: string): Paragraph {
  return new Paragraph({
    spacing: { before: 300, after: 80 },
    children: [
      new TextRun({
        text: text.toUpperCase(),
        bold: true,
        size: 26,
        color: hexToDocxColor('#0f172a'),
        font: 'Calibri',
      }),
    ],
  });
}

export function buildMidnightModernDocx(
  data: CVFormData,
  photoBuffer: Buffer | null,
  labels: CVLabels,
): Document {
  const darkBg = hexToDocxColor('#0f172a');

  // Build sidebar content
  const sidebarChildren: Paragraph[] = [];

  // Photo
  if (photoBuffer) {
    sidebarChildren.push(
      new Paragraph({
        alignment: AlignmentType.CENTER,
        spacing: { after: 100 },
        children: [embedPhoto(photoBuffer, 90, 90)],
      }),
    );
  }

  // Name in sidebar
  sidebarChildren.push(
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { after: 80 },
      children: [
        new TextRun({
          text: `${data.personalInfo.firstName}\n${data.personalInfo.lastName}`,
          bold: true,
          size: 28,
          color: 'FFFFFF',
          font: 'Calibri',
        }),
      ],
    }),
  );

  // Contact in sidebar
  sidebarChildren.push(sidebarHeading(labels.personalInfo));
  const contactLines = [
    data.personalInfo.email,
    data.personalInfo.phone,
    data.personalInfo.city,
  ];
  if (data.personalInfo.address) contactLines.push(data.personalInfo.address);
  if (data.personalInfo.linkedinUrl) contactLines.push(data.personalInfo.linkedinUrl);
  contactLines.forEach((line) => {
    sidebarChildren.push(
      new Paragraph({
        spacing: { before: 15, after: 15 },
        children: [
          new TextRun({ text: line, size: 18, color: 'CBD5E1', font: 'Calibri' }),
        ],
      }),
    );
  });

  // Skills in sidebar
  if (data.skills.length > 0) {
    sidebarChildren.push(sidebarHeading(labels.skills));
    data.skills.forEach((skill) => {
      const levelDots: Record<string, string> = {
        beginner: '\u25CF\u25CB\u25CB\u25CB\u25CB',
        intermediate: '\u25CF\u25CF\u25CB\u25CB\u25CB',
        good: '\u25CF\u25CF\u25CF\u25CB\u25CB',
        excellent: '\u25CF\u25CF\u25CF\u25CF\u25CB',
        expert: '\u25CF\u25CF\u25CF\u25CF\u25CF',
      };
      sidebarChildren.push(
        new Paragraph({
          spacing: { before: 20, after: 20 },
          children: [
            new TextRun({ text: skill.name, size: 19, color: 'FFFFFF', font: 'Calibri' }),
            new TextRun({ text: `  ${levelDots[skill.level] || levelDots.good}`, size: 16, color: '38bdf8', font: 'Calibri' }),
          ],
        }),
      );
    });
  }

  // Languages in sidebar
  if (data.languages.length > 0) {
    sidebarChildren.push(sidebarHeading(labels.languages));
    data.languages.forEach((lang) => {
      sidebarChildren.push(
        new Paragraph({
          spacing: { before: 15, after: 15 },
          children: [
            new TextRun({ text: `${lang.name}: `, bold: true, size: 19, color: 'FFFFFF', font: 'Calibri' }),
            new TextRun({ text: lang.level, size: 19, color: 'CBD5E1', font: 'Calibri' }),
          ],
        }),
      );
    });
  }

  // Interests in sidebar
  if (data.interests.length > 0) {
    sidebarChildren.push(sidebarHeading(labels.interests));
    data.interests.forEach((interest) => {
      sidebarChildren.push(
        new Paragraph({
          spacing: { before: 10, after: 10 },
          children: [
            new TextRun({ text: `• ${interest}`, size: 18, color: 'CBD5E1', font: 'Calibri' }),
          ],
        }),
      );
    });
  }

  // Build main content
  const mainChildren: (Paragraph | Table)[] = [];

  // About Me
  if (data.personalInfo.aboutMe) {
    mainChildren.push(mainHeading(labels.aboutMe));
    mainChildren.push(
      new Paragraph({
        spacing: { after: 80 },
        children: [
          new TextRun({ text: data.personalInfo.aboutMe, size: 22, font: 'Calibri' }),
        ],
      }),
    );
  }

  // Work Experience
  if (data.workExperience.length > 0) {
    mainChildren.push(mainHeading(labels.workExperience));
    data.workExperience.forEach((work) => {
      mainChildren.push(
        new Paragraph({
          spacing: { before: 80 },
          children: [
            new TextRun({ text: work.position, bold: true, size: 24, font: 'Calibri' }),
          ],
        }),
      );
      mainChildren.push(
        new Paragraph({
          children: [
            new TextRun({ text: `${work.company}  |  `, bold: true, size: 20, color: '64748b', font: 'Calibri' }),
            new TextRun({
              text: createDateRange(work.startDate, work.endDate, work.currentlyWorking, labels),
              size: 20,
              color: '64748b',
              font: 'Calibri',
              italics: true,
            }),
          ],
        }),
      );
      mainChildren.push(
        new Paragraph({
          spacing: { after: 60 },
          children: [
            new TextRun({ text: work.description, size: 21, font: 'Calibri' }),
          ],
        }),
      );
    });
  }

  // Education
  if (data.education.length > 0) {
    mainChildren.push(mainHeading(labels.education));
    data.education.forEach((edu) => {
      mainChildren.push(
        new Paragraph({
          spacing: { before: 60 },
          children: [
            new TextRun({ text: edu.institution, bold: true, size: 23, font: 'Calibri' }),
            new TextRun({ text: ` — ${edu.major}`, size: 21, font: 'Calibri' }),
          ],
        }),
      );
      mainChildren.push(
        new Paragraph({
          children: [
            new TextRun({
              text: `${edu.city} | ${createDateRange(edu.startDate, edu.endDate, edu.currentlyStudying, labels)}`,
              size: 19,
              color: '64748b',
              font: 'Calibri',
              italics: true,
            }),
          ],
        }),
      );
    });
  }

  // Courses
  if (data.courses.length > 0) {
    mainChildren.push(mainHeading(labels.courses));
    data.courses.forEach((course) => {
      mainChildren.push(
        new Paragraph({
          children: [
            new TextRun({ text: course.name, bold: true, size: 21, font: 'Calibri' }),
            new TextRun({ text: ` — ${course.organization} (${course.date})`, size: 19, font: 'Calibri' }),
          ],
        }),
      );
    });
  }

  // Certificates
  if (data.certificates.length > 0) {
    mainChildren.push(mainHeading(labels.certificates));
    data.certificates.forEach((cert) => {
      mainChildren.push(
        new Paragraph({
          children: [
            new TextRun({ text: cert.name, bold: true, size: 21, font: 'Calibri' }),
            new TextRun({ text: ` — ${cert.issuer} (${cert.date})`, size: 19, font: 'Calibri' }),
          ],
        }),
      );
    });
  }

  // References
  if (data.references.length > 0) {
    mainChildren.push(mainHeading(labels.references));
    data.references.forEach((ref) => {
      mainChildren.push(
        new Paragraph({
          spacing: { before: 50 },
          children: [
            new TextRun({ text: ref.fullName, bold: true, size: 21, font: 'Calibri' }),
            new TextRun({ text: ` — ${ref.position}, ${ref.company}`, size: 19, font: 'Calibri' }),
          ],
        }),
      );
      mainChildren.push(
        new Paragraph({
          children: [
            new TextRun({ text: `${ref.phone} | ${ref.email}`, size: 19, color: '64748b', font: 'Calibri' }),
          ],
        }),
      );
    });
  }

  // Two-column layout: sidebar (left) + main (right)
  const layoutTable = new Table({
    width: { size: 100, type: WidthType.PERCENTAGE },
    rows: [
      new TableRow({
        children: [
          new TableCell({
            width: { size: 32, type: WidthType.PERCENTAGE },
            borders: noBorder,
            shading: { fill: darkBg },
            children: sidebarChildren,
          }),
          new TableCell({
            width: { size: 68, type: WidthType.PERCENTAGE },
            borders: noBorder,
            children: mainChildren.length > 0
              ? mainChildren
              : [new Paragraph({ children: [] })],
          }),
        ],
      }),
    ],
  });

  return new Document({
    sections: [{ children: [layoutTable] }],
  });
}
