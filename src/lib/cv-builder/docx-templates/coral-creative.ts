// src/lib/cv-builder/docx-templates/coral-creative.ts
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

function coralHeading(text: string): Paragraph {
  return new Paragraph({
    spacing: { before: 280, after: 60 },
    children: [
      new TextRun({
        text: '\u25CF  ',
        size: 20,
        color: hexToDocxColor('#f97316'),
        font: 'Calibri',
      }),
      new TextRun({
        text: text.toUpperCase(),
        bold: true,
        size: 24,
        color: hexToDocxColor('#c2410c'),
        font: 'Calibri',
      }),
    ],
  });
}

export function buildCoralCreativeDocx(
  data: CVFormData,
  photoBuffer: Buffer | null,
  labels: CVLabels,
): Document {
  const primary = hexToDocxColor('#c2410c');
  const orange = hexToDocxColor('#f97316');
  const muted = hexToDocxColor('#78716c');
  const warmBg = hexToDocxColor('#fff7ed');

  const children: (Paragraph | Table)[] = [];

  // --- Creative header: photo left + name right ---
  const nameBlock: Paragraph[] = [
    new Paragraph({
      spacing: { before: 60 },
      children: [
        new TextRun({
          text: data.personalInfo.firstName,
          size: 40,
          color: primary,
          font: 'Calibri',
        }),
      ],
    }),
    new Paragraph({
      children: [
        new TextRun({
          text: data.personalInfo.lastName,
          bold: true,
          size: 40,
          color: primary,
          font: 'Calibri',
        }),
      ],
    }),
  ];

  // Contact below name in header
  const contactStr = `${data.personalInfo.email}  •  ${data.personalInfo.phone}  •  ${data.personalInfo.city}`;
  nameBlock.push(
    new Paragraph({
      spacing: { before: 40, after: 20 },
      children: [new TextRun({ text: contactStr, size: 18, color: muted, font: 'Calibri' })],
    }),
  );

  if (data.personalInfo.linkedinUrl) {
    nameBlock.push(
      new Paragraph({
        children: [new TextRun({ text: data.personalInfo.linkedinUrl, size: 18, color: orange, font: 'Calibri' })],
      }),
    );
  }

  // Extra details
  const extras: string[] = [];
  if (data.personalInfo.dateOfBirth) extras.push(`${labels.dateOfBirth}: ${data.personalInfo.dateOfBirth}`);
  if (data.personalInfo.driversLicense) extras.push(`${labels.driversLicense}: ${data.personalInfo.driversLicense}`);
  extras.push(`${labels.maritalStatus}: ${data.personalInfo.maritalStatus === 'married' ? labels.married : labels.single}`);
  nameBlock.push(
    new Paragraph({
      spacing: { after: 40 },
      children: [new TextRun({ text: extras.join('  •  '), size: 17, color: muted, font: 'Calibri' })],
    }),
  );

  if (photoBuffer) {
    const headerTable = new Table({
      width: { size: 100, type: WidthType.PERCENTAGE },
      rows: [
        new TableRow({
          children: [
            new TableCell({
              width: { size: 25, type: WidthType.PERCENTAGE },
              borders: noBorder,
              shading: { fill: warmBg },
              children: [
                new Paragraph({
                  alignment: AlignmentType.CENTER,
                  spacing: { before: 40 },
                  children: [embedPhoto(photoBuffer, 110, 110)],
                }),
              ],
            }),
            new TableCell({
              width: { size: 75, type: WidthType.PERCENTAGE },
              borders: noBorder,
              children: nameBlock,
            }),
          ],
        }),
      ],
    });
    children.push(headerTable);
  } else {
    children.push(...nameBlock);
  }

  // Coral accent bar
  children.push(
    new Paragraph({
      spacing: { before: 40, after: 40 },
      shading: { fill: orange },
      children: [new TextRun({ text: ' ', size: 6 })],
    }),
  );

  // About Me
  if (data.personalInfo.aboutMe) {
    children.push(coralHeading(labels.aboutMe));
    children.push(
      new Paragraph({
        spacing: { before: 30, after: 80 },
        shading: { fill: warmBg },
        children: [new TextRun({ text: data.personalInfo.aboutMe, size: 22, font: 'Calibri', italics: true })],
      }),
    );
  }

  // Two-column body: work+education left, skills+extras right
  const leftBody: (Paragraph | Table)[] = [];
  const rightBody: (Paragraph | Table)[] = [];

  // Work Experience — left
  if (data.workExperience.length > 0) {
    leftBody.push(coralHeading(labels.workExperience));
    data.workExperience.forEach((work) => {
      leftBody.push(
        new Paragraph({
          spacing: { before: 80 },
          children: [
            new TextRun({ text: work.position, bold: true, size: 23, font: 'Calibri', color: primary }),
          ],
        }),
      );
      leftBody.push(
        new Paragraph({
          children: [
            new TextRun({ text: work.company, size: 20, font: 'Calibri', color: orange }),
            new TextRun({
              text: `  |  ${createDateRange(work.startDate, work.endDate, work.currentlyWorking, labels)}`,
              size: 19,
              color: muted,
              font: 'Calibri',
              italics: true,
            }),
          ],
        }),
      );
      leftBody.push(
        new Paragraph({
          spacing: { after: 60 },
          children: [new TextRun({ text: work.description, size: 21, font: 'Calibri' })],
        }),
      );
    });
  }

  // Education — left
  if (data.education.length > 0) {
    leftBody.push(coralHeading(labels.education));
    data.education.forEach((edu) => {
      leftBody.push(
        new Paragraph({
          spacing: { before: 60 },
          children: [
            new TextRun({ text: edu.institution, bold: true, size: 22, font: 'Calibri', color: primary }),
          ],
        }),
      );
      leftBody.push(
        new Paragraph({
          children: [
            new TextRun({ text: `${edu.major} — ${edu.city}`, size: 20, font: 'Calibri', color: muted }),
          ],
        }),
      );
      leftBody.push(
        new Paragraph({
          children: [
            new TextRun({
              text: createDateRange(edu.startDate, edu.endDate, edu.currentlyStudying, labels),
              size: 18,
              color: muted,
              font: 'Calibri',
              italics: true,
            }),
          ],
        }),
      );
    });
  }

  // References — left
  if (data.references.length > 0) {
    leftBody.push(coralHeading(labels.references));
    data.references.forEach((ref) => {
      leftBody.push(
        new Paragraph({
          spacing: { before: 40 },
          children: [
            new TextRun({ text: ref.fullName, bold: true, size: 20, font: 'Calibri', color: primary }),
            new TextRun({ text: ` — ${ref.position}, ${ref.company}`, size: 18, font: 'Calibri', color: muted }),
          ],
        }),
      );
      leftBody.push(
        new Paragraph({
          children: [new TextRun({ text: `${ref.phone} | ${ref.email}`, size: 18, color: muted, font: 'Calibri' })],
        }),
      );
    });
  }

  // Skills — right
  if (data.skills.length > 0) {
    rightBody.push(coralHeading(labels.skills));
    data.skills.forEach((skill) => {
      rightBody.push(createSkillBar(skill.name, skill.level, '#f97316'));
    });
  }

  // Languages — right
  if (data.languages.length > 0) {
    rightBody.push(coralHeading(labels.languages));
    data.languages.forEach((lang) => {
      rightBody.push(
        new Paragraph({
          spacing: { before: 15, after: 15 },
          children: [
            new TextRun({ text: `${lang.name}: `, bold: true, size: 20, font: 'Calibri', color: primary }),
            new TextRun({ text: lang.level, size: 20, font: 'Calibri', color: muted }),
          ],
        }),
      );
    });
  }

  // Courses — right
  if (data.courses.length > 0) {
    rightBody.push(coralHeading(labels.courses));
    data.courses.forEach((course) => {
      rightBody.push(
        new Paragraph({
          children: [
            new TextRun({ text: course.name, bold: true, size: 20, font: 'Calibri', color: primary }),
            new TextRun({ text: ` (${course.date})`, size: 18, font: 'Calibri', color: muted }),
          ],
        }),
      );
    });
  }

  // Certificates — right
  if (data.certificates.length > 0) {
    rightBody.push(coralHeading(labels.certificates));
    data.certificates.forEach((cert) => {
      rightBody.push(
        new Paragraph({
          children: [
            new TextRun({ text: cert.name, bold: true, size: 20, font: 'Calibri', color: primary }),
            new TextRun({ text: ` (${cert.date})`, size: 18, font: 'Calibri', color: muted }),
          ],
        }),
      );
    });
  }

  // Interests — right
  if (data.interests.length > 0) {
    rightBody.push(coralHeading(labels.interests));
    data.interests.forEach((interest) => {
      rightBody.push(
        new Paragraph({
          spacing: { before: 10, after: 10 },
          children: [
            new TextRun({ text: '\u25CF ', size: 14, color: orange, font: 'Calibri' }),
            new TextRun({ text: interest, size: 20, font: 'Calibri', color: muted }),
          ],
        }),
      );
    });
  }

  // Ensure columns have content
  if (leftBody.length === 0) leftBody.push(new Paragraph({ children: [] }));
  if (rightBody.length === 0) rightBody.push(new Paragraph({ children: [] }));

  // Body two-column table
  const bodyTable = new Table({
    width: { size: 100, type: WidthType.PERCENTAGE },
    rows: [
      new TableRow({
        children: [
          new TableCell({
            width: { size: 58, type: WidthType.PERCENTAGE },
            borders: noBorder,
            children: leftBody,
          }),
          new TableCell({
            width: { size: 42, type: WidthType.PERCENTAGE },
            borders: noBorder,
            shading: { fill: warmBg },
            children: rightBody,
          }),
        ],
      }),
    ],
  });

  children.push(bodyTable);

  return new Document({
    sections: [{ children }],
  });
}
