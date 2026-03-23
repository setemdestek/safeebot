// src/lib/cv-builder/docx-templates/slate-two-column.ts
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
  createDateRange,
  createSkillBar,
  embedPhoto,
  hexToDocxColor,
  noBorder,
} from '../docx-utils';

function slateHeading(text: string): Paragraph {
  return new Paragraph({
    spacing: { before: 260, after: 80 },
    border: {
      bottom: { style: BorderStyle.THICK, size: 2, color: hexToDocxColor('#64748b') },
    },
    children: [
      new TextRun({
        text: text.toUpperCase(),
        bold: true,
        size: 22,
        color: hexToDocxColor('#334155'),
        font: 'Calibri',
      }),
    ],
  });
}

export function buildSlateTwoColumnDocx(
  data: CVFormData,
  photoBuffer: Buffer | null,
  labels: CVLabels,
): Document {
  const primary = hexToDocxColor('#334155');
  const secondary = hexToDocxColor('#64748b');
  const accentBg = hexToDocxColor('#f1f5f9');

  // --- Header row spanning both columns ---
  const headerChildren: Paragraph[] = [];

  headerChildren.push(
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { after: 40 },
      shading: { fill: primary },
      children: [
        new TextRun({
          text: `${data.personalInfo.firstName} ${data.personalInfo.lastName}`,
          bold: true,
          size: 36,
          color: 'FFFFFF',
          font: 'Calibri',
        }),
      ],
    }),
  );

  // Photo
  if (photoBuffer) {
    headerChildren.push(
      new Paragraph({
        alignment: AlignmentType.CENTER,
        spacing: { after: 60 },
        children: [embedPhoto(photoBuffer, 90, 90)],
      }),
    );
  }

  // Contact inline
  const contactStr = [data.personalInfo.email, data.personalInfo.phone, data.personalInfo.city].join('  |  ');
  headerChildren.push(
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { after: 40 },
      children: [new TextRun({ text: contactStr, size: 19, color: secondary, font: 'Calibri' })],
    }),
  );

  // Extra contact details
  const extras: string[] = [];
  if (data.personalInfo.address) extras.push(`${labels.address}: ${data.personalInfo.address}`);
  if (data.personalInfo.linkedinUrl) extras.push(data.personalInfo.linkedinUrl);
  if (data.personalInfo.dateOfBirth) extras.push(`${labels.dateOfBirth}: ${data.personalInfo.dateOfBirth}`);
  if (data.personalInfo.driversLicense) extras.push(`${labels.driversLicense}: ${data.personalInfo.driversLicense}`);
  extras.push(`${labels.maritalStatus}: ${data.personalInfo.maritalStatus === 'married' ? labels.married : labels.single}`);

  if (extras.length > 0) {
    headerChildren.push(
      new Paragraph({
        alignment: AlignmentType.CENTER,
        spacing: { after: 60 },
        children: [new TextRun({ text: extras.join('  |  '), size: 18, color: secondary, font: 'Calibri' })],
      }),
    );
  }

  // --- Left column content ---
  const leftChildren: (Paragraph | Table)[] = [];

  // About Me in left column
  if (data.personalInfo.aboutMe) {
    leftChildren.push(slateHeading(labels.aboutMe));
    leftChildren.push(
      new Paragraph({
        spacing: { after: 80 },
        children: [new TextRun({ text: data.personalInfo.aboutMe, size: 21, font: 'Calibri' })],
      }),
    );
  }

  // Work Experience
  if (data.workExperience.length > 0) {
    leftChildren.push(slateHeading(labels.workExperience));
    data.workExperience.forEach((work) => {
      leftChildren.push(
        new Paragraph({
          spacing: { before: 80 },
          children: [
            new TextRun({ text: work.position, bold: true, size: 22, font: 'Calibri', color: primary }),
          ],
        }),
      );
      leftChildren.push(
        new Paragraph({
          children: [
            new TextRun({ text: work.company, size: 19, font: 'Calibri', color: secondary }),
            new TextRun({
              text: `  |  ${createDateRange(work.startDate, work.endDate, work.currentlyWorking, labels)}`,
              size: 18,
              color: secondary,
              font: 'Calibri',
              italics: true,
            }),
          ],
        }),
      );
      leftChildren.push(
        new Paragraph({
          spacing: { after: 60 },
          children: [new TextRun({ text: work.description, size: 20, font: 'Calibri' })],
        }),
      );
    });
  }

  // References in left
  if (data.references.length > 0) {
    leftChildren.push(slateHeading(labels.references));
    data.references.forEach((ref) => {
      leftChildren.push(
        new Paragraph({
          spacing: { before: 40 },
          children: [
            new TextRun({ text: ref.fullName, bold: true, size: 20, font: 'Calibri', color: primary }),
            new TextRun({ text: ` — ${ref.position}, ${ref.company}`, size: 18, font: 'Calibri', color: secondary }),
          ],
        }),
      );
      leftChildren.push(
        new Paragraph({
          children: [new TextRun({ text: `${ref.phone} | ${ref.email}`, size: 18, color: secondary, font: 'Calibri' })],
        }),
      );
    });
  }

  // Ensure left has at least one child
  if (leftChildren.length === 0) {
    leftChildren.push(new Paragraph({ children: [] }));
  }

  // --- Right column content ---
  const rightChildren: (Paragraph | Table)[] = [];

  // Education
  if (data.education.length > 0) {
    rightChildren.push(slateHeading(labels.education));
    data.education.forEach((edu) => {
      rightChildren.push(
        new Paragraph({
          spacing: { before: 60 },
          children: [
            new TextRun({ text: edu.institution, bold: true, size: 21, font: 'Calibri', color: primary }),
          ],
        }),
      );
      rightChildren.push(
        new Paragraph({
          children: [
            new TextRun({ text: `${edu.major} — ${edu.city}`, size: 19, font: 'Calibri', color: secondary }),
          ],
        }),
      );
      rightChildren.push(
        new Paragraph({
          children: [
            new TextRun({
              text: createDateRange(edu.startDate, edu.endDate, edu.currentlyStudying, labels),
              size: 18,
              color: secondary,
              font: 'Calibri',
              italics: true,
            }),
          ],
        }),
      );
    });
  }

  // Skills
  if (data.skills.length > 0) {
    rightChildren.push(slateHeading(labels.skills));
    data.skills.forEach((skill) => {
      rightChildren.push(createSkillBar(skill.name, skill.level, '#334155'));
    });
  }

  // Languages
  if (data.languages.length > 0) {
    rightChildren.push(slateHeading(labels.languages));
    data.languages.forEach((lang) => {
      rightChildren.push(
        new Paragraph({
          spacing: { before: 15, after: 15 },
          children: [
            new TextRun({ text: `${lang.name}: `, bold: true, size: 20, font: 'Calibri', color: primary }),
            new TextRun({ text: lang.level, size: 20, font: 'Calibri', color: secondary }),
          ],
        }),
      );
    });
  }

  // Courses
  if (data.courses.length > 0) {
    rightChildren.push(slateHeading(labels.courses));
    data.courses.forEach((course) => {
      rightChildren.push(
        new Paragraph({
          children: [
            new TextRun({ text: course.name, bold: true, size: 20, font: 'Calibri', color: primary }),
            new TextRun({ text: ` (${course.date})`, size: 18, font: 'Calibri', color: secondary }),
          ],
        }),
      );
    });
  }

  // Certificates
  if (data.certificates.length > 0) {
    rightChildren.push(slateHeading(labels.certificates));
    data.certificates.forEach((cert) => {
      rightChildren.push(
        new Paragraph({
          children: [
            new TextRun({ text: cert.name, bold: true, size: 20, font: 'Calibri', color: primary }),
            new TextRun({ text: ` (${cert.date})`, size: 18, font: 'Calibri', color: secondary }),
          ],
        }),
      );
    });
  }

  // Interests
  if (data.interests.length > 0) {
    rightChildren.push(slateHeading(labels.interests));
    rightChildren.push(
      new Paragraph({
        children: [new TextRun({ text: data.interests.join(', '), size: 20, font: 'Calibri', color: secondary })],
      }),
    );
  }

  // Ensure right has at least one child
  if (rightChildren.length === 0) {
    rightChildren.push(new Paragraph({ children: [] }));
  }

  // Two equal columns layout
  const columnsTable = new Table({
    width: { size: 100, type: WidthType.PERCENTAGE },
    rows: [
      new TableRow({
        children: [
          new TableCell({
            width: { size: 50, type: WidthType.PERCENTAGE },
            borders: noBorder,
            children: leftChildren,
          }),
          new TableCell({
            width: { size: 50, type: WidthType.PERCENTAGE },
            borders: noBorder,
            shading: { fill: accentBg },
            children: rightChildren,
          }),
        ],
      }),
    ],
  });

  return new Document({
    sections: [{ children: [...headerChildren, columnsTable] }],
  });
}
