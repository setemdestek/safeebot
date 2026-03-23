// src/lib/cv-builder/docx-templates/ocean-sidebar.ts
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

function sidebarSection(text: string): Paragraph {
  return new Paragraph({
    spacing: { before: 220, after: 60 },
    children: [
      new TextRun({
        text: text.toUpperCase(),
        bold: true,
        size: 21,
        color: 'E0F2FE',
        font: 'Calibri',
      }),
    ],
  });
}

function mainSection(text: string): Paragraph {
  return new Paragraph({
    spacing: { before: 300, after: 100 },
    children: [
      new TextRun({
        text: text.toUpperCase(),
        bold: true,
        size: 26,
        color: hexToDocxColor('#0c4a6e'),
        font: 'Calibri',
      }),
    ],
  });
}

export function buildOceanSidebarDocx(
  data: CVFormData,
  photoBuffer: Buffer | null,
  labels: CVLabels,
): Document {
  const sidebarBg = hexToDocxColor('#0c4a6e');
  const mainColor = hexToDocxColor('#0c4a6e');
  const muted = hexToDocxColor('#64748b');

  // --- Sidebar content ---
  const sidebarChildren: Paragraph[] = [];

  // Photo in sidebar
  if (photoBuffer) {
    sidebarChildren.push(
      new Paragraph({
        alignment: AlignmentType.CENTER,
        spacing: { after: 80 },
        children: [embedPhoto(photoBuffer, 95, 95)],
      }),
    );
  }

  // Name in sidebar
  sidebarChildren.push(
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { after: 60 },
      children: [
        new TextRun({
          text: data.personalInfo.firstName,
          bold: true,
          size: 26,
          color: 'FFFFFF',
          font: 'Calibri',
        }),
        new TextRun({ text: ' ', size: 26 }),
        new TextRun({
          text: data.personalInfo.lastName,
          bold: true,
          size: 26,
          color: 'E0F2FE',
          font: 'Calibri',
        }),
      ],
    }),
  );

  // Contact
  sidebarChildren.push(sidebarSection(labels.personalInfo));
  const contactItems = [
    `${labels.email}: ${data.personalInfo.email}`,
    `${labels.phone}: ${data.personalInfo.phone}`,
    `${labels.city}: ${data.personalInfo.city}`,
  ];
  if (data.personalInfo.address) contactItems.push(`${labels.address}: ${data.personalInfo.address}`);
  if (data.personalInfo.linkedinUrl) contactItems.push(data.personalInfo.linkedinUrl);
  if (data.personalInfo.dateOfBirth) contactItems.push(`${labels.dateOfBirth}: ${data.personalInfo.dateOfBirth}`);
  if (data.personalInfo.driversLicense) contactItems.push(`${labels.driversLicense}: ${data.personalInfo.driversLicense}`);
  contactItems.push(
    `${labels.maritalStatus}: ${data.personalInfo.maritalStatus === 'married' ? labels.married : labels.single}`,
  );

  contactItems.forEach((item) => {
    sidebarChildren.push(
      new Paragraph({
        spacing: { before: 12, after: 12 },
        children: [new TextRun({ text: item, size: 17, color: 'BAE6FD', font: 'Calibri' })],
      }),
    );
  });

  // Skills in sidebar
  if (data.skills.length > 0) {
    sidebarChildren.push(sidebarSection(labels.skills));
    data.skills.forEach((skill) => {
      const filled = { beginner: 1, intermediate: 2, good: 3, excellent: 4, expert: 5 }[skill.level] || 3;
      const bar = '\u2588'.repeat(filled) + '\u2591'.repeat(5 - filled);
      sidebarChildren.push(
        new Paragraph({
          spacing: { before: 15, after: 15 },
          children: [
            new TextRun({ text: `${skill.name}  `, size: 18, color: 'FFFFFF', font: 'Calibri' }),
            new TextRun({ text: bar, size: 16, color: 'BAE6FD', font: 'Calibri' }),
          ],
        }),
      );
    });
  }

  // Languages in sidebar
  if (data.languages.length > 0) {
    sidebarChildren.push(sidebarSection(labels.languages));
    data.languages.forEach((lang) => {
      sidebarChildren.push(
        new Paragraph({
          spacing: { before: 12, after: 12 },
          children: [
            new TextRun({ text: `${lang.name}: `, bold: true, size: 18, color: 'FFFFFF', font: 'Calibri' }),
            new TextRun({ text: lang.level, size: 18, color: 'BAE6FD', font: 'Calibri' }),
          ],
        }),
      );
    });
  }

  // Interests in sidebar
  if (data.interests.length > 0) {
    sidebarChildren.push(sidebarSection(labels.interests));
    data.interests.forEach((interest) => {
      sidebarChildren.push(
        new Paragraph({
          spacing: { before: 8, after: 8 },
          children: [new TextRun({ text: `• ${interest}`, size: 17, color: 'BAE6FD', font: 'Calibri' })],
        }),
      );
    });
  }

  // --- Main content ---
  const mainChildren: (Paragraph | Table)[] = [];

  // About Me
  if (data.personalInfo.aboutMe) {
    mainChildren.push(mainSection(labels.aboutMe));
    mainChildren.push(
      new Paragraph({
        spacing: { after: 80 },
        children: [new TextRun({ text: data.personalInfo.aboutMe, size: 22, font: 'Calibri' })],
      }),
    );
  }

  // Work Experience
  if (data.workExperience.length > 0) {
    mainChildren.push(mainSection(labels.workExperience));
    data.workExperience.forEach((work) => {
      mainChildren.push(
        new Paragraph({
          spacing: { before: 80 },
          children: [
            new TextRun({ text: work.position, bold: true, size: 24, font: 'Calibri', color: mainColor }),
          ],
        }),
      );
      mainChildren.push(
        new Paragraph({
          children: [
            new TextRun({ text: `${work.company}  |  `, size: 20, font: 'Calibri', color: muted }),
            new TextRun({
              text: createDateRange(work.startDate, work.endDate, work.currentlyWorking, labels),
              size: 19,
              color: muted,
              font: 'Calibri',
              italics: true,
            }),
          ],
        }),
      );
      mainChildren.push(
        new Paragraph({
          spacing: { after: 60 },
          children: [new TextRun({ text: work.description, size: 21, font: 'Calibri' })],
        }),
      );
    });
  }

  // Education
  if (data.education.length > 0) {
    mainChildren.push(mainSection(labels.education));
    data.education.forEach((edu) => {
      mainChildren.push(
        new Paragraph({
          spacing: { before: 60 },
          children: [
            new TextRun({ text: edu.institution, bold: true, size: 23, font: 'Calibri', color: mainColor }),
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
              color: muted,
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
    mainChildren.push(mainSection(labels.courses));
    data.courses.forEach((course) => {
      mainChildren.push(
        new Paragraph({
          children: [
            new TextRun({ text: course.name, bold: true, size: 21, font: 'Calibri' }),
            new TextRun({ text: ` — ${course.organization} (${course.date})`, size: 19, font: 'Calibri', color: muted }),
          ],
        }),
      );
    });
  }

  // Certificates
  if (data.certificates.length > 0) {
    mainChildren.push(mainSection(labels.certificates));
    data.certificates.forEach((cert) => {
      mainChildren.push(
        new Paragraph({
          children: [
            new TextRun({ text: cert.name, bold: true, size: 21, font: 'Calibri' }),
            new TextRun({ text: ` — ${cert.issuer} (${cert.date})`, size: 19, font: 'Calibri', color: muted }),
          ],
        }),
      );
    });
  }

  // References
  if (data.references.length > 0) {
    mainChildren.push(mainSection(labels.references));
    data.references.forEach((ref) => {
      mainChildren.push(
        new Paragraph({
          spacing: { before: 50 },
          children: [
            new TextRun({ text: ref.fullName, bold: true, size: 21, font: 'Calibri' }),
            new TextRun({ text: ` — ${ref.position}, ${ref.company}`, size: 19, font: 'Calibri', color: muted }),
          ],
        }),
      );
      mainChildren.push(
        new Paragraph({
          children: [
            new TextRun({ text: `${ref.phone} | ${ref.email}`, size: 19, color: muted, font: 'Calibri' }),
          ],
        }),
      );
    });
  }

  // Layout table: sidebar | main
  const layoutTable = new Table({
    width: { size: 100, type: WidthType.PERCENTAGE },
    rows: [
      new TableRow({
        children: [
          new TableCell({
            width: { size: 33, type: WidthType.PERCENTAGE },
            borders: noBorder,
            shading: { fill: sidebarBg },
            children: sidebarChildren,
          }),
          new TableCell({
            width: { size: 67, type: WidthType.PERCENTAGE },
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
