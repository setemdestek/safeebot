// src/lib/cv-builder/docx-templates/rose-elegant.ts
import {
  Document,
  Paragraph,
  TextRun,
  AlignmentType,
  BorderStyle,
} from 'docx';
import type { CVFormData } from '@/types/cv';
import type { CVLabels } from '../cv-labels';
import {
  createContactInfo,
  createDateRange,
  createSkillBar,
  embedPhoto,
  hexToDocxColor,
} from '../docx-utils';

function roseSectionHeader(text: string): Paragraph {
  return new Paragraph({
    spacing: { before: 300, after: 60 },
    border: {
      bottom: { style: BorderStyle.SINGLE, size: 1, color: hexToDocxColor('#fecdd3') },
    },
    children: [
      new TextRun({
        text,
        bold: true,
        size: 25,
        color: hexToDocxColor('#9f1239'),
        font: 'Cambria',
      }),
    ],
  });
}

export function buildRoseElegantDocx(
  data: CVFormData,
  photoBuffer: Buffer | null,
  labels: CVLabels,
): Document {
  const primary = hexToDocxColor('#9f1239');
  const muted = hexToDocxColor('#6b7280');
  const sections: (Paragraph | import('docx').Table)[] = [];

  // Soft rose accent bar at top
  sections.push(
    new Paragraph({
      spacing: { after: 40 },
      shading: { fill: hexToDocxColor('#fff1f2') },
      children: [new TextRun({ text: ' ', size: 8 })],
    }),
  );

  // Name centered in Cambria
  sections.push(
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { before: 100, after: 40 },
      children: [
        new TextRun({
          text: `${data.personalInfo.firstName} ${data.personalInfo.lastName}`,
          bold: true,
          size: 38,
          color: primary,
          font: 'Cambria',
        }),
      ],
    }),
  );

  // Photo
  if (photoBuffer) {
    sections.push(
      new Paragraph({
        alignment: AlignmentType.CENTER,
        spacing: { after: 80 },
        children: [embedPhoto(photoBuffer, 100, 100)],
      }),
    );
  }

  // Contact info centered
  const contactLines = [
    `${data.personalInfo.email}  •  ${data.personalInfo.phone}  •  ${data.personalInfo.city}`,
  ];
  if (data.personalInfo.linkedinUrl) contactLines.push(data.personalInfo.linkedinUrl);
  contactLines.forEach((line) => {
    sections.push(
      new Paragraph({
        alignment: AlignmentType.CENTER,
        spacing: { before: 15, after: 15 },
        children: [new TextRun({ text: line, size: 20, color: muted, font: 'Calibri' })],
      }),
    );
  });

  // About Me
  if (data.personalInfo.aboutMe) {
    sections.push(roseSectionHeader(labels.aboutMe));
    sections.push(
      new Paragraph({
        spacing: { before: 40, after: 100 },
        children: [
          new TextRun({
            text: data.personalInfo.aboutMe,
            size: 22,
            font: 'Calibri',
            italics: true,
            color: muted,
          }),
        ],
      }),
    );
  }

  // Work Experience
  if (data.workExperience.length > 0) {
    sections.push(roseSectionHeader(labels.workExperience));
    data.workExperience.forEach((work) => {
      sections.push(
        new Paragraph({
          spacing: { before: 80 },
          children: [
            new TextRun({ text: work.position, bold: true, size: 23, font: 'Cambria', color: primary }),
          ],
        }),
      );
      sections.push(
        new Paragraph({
          children: [
            new TextRun({ text: work.company, size: 21, font: 'Calibri', color: muted }),
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
      sections.push(
        new Paragraph({
          spacing: { after: 60 },
          children: [new TextRun({ text: work.description, size: 21, font: 'Calibri' })],
        }),
      );
    });
  }

  // Education
  if (data.education.length > 0) {
    sections.push(roseSectionHeader(labels.education));
    data.education.forEach((edu) => {
      sections.push(
        new Paragraph({
          spacing: { before: 60 },
          children: [
            new TextRun({ text: edu.institution, bold: true, size: 22, font: 'Cambria', color: primary }),
            new TextRun({ text: ` — ${edu.major}`, size: 21, font: 'Calibri' }),
          ],
        }),
      );
      sections.push(
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

  // Skills
  if (data.skills.length > 0) {
    sections.push(roseSectionHeader(labels.skills));
    data.skills.forEach((skill) => {
      sections.push(createSkillBar(skill.name, skill.level, '#9f1239'));
    });
  }

  // Languages
  if (data.languages.length > 0) {
    sections.push(roseSectionHeader(labels.languages));
    data.languages.forEach((lang) => {
      sections.push(
        new Paragraph({
          spacing: { before: 20, after: 20 },
          children: [
            new TextRun({ text: `${lang.name}: `, bold: true, size: 21, font: 'Cambria', color: primary }),
            new TextRun({ text: lang.level, size: 21, font: 'Calibri', color: muted }),
          ],
        }),
      );
    });
  }

  // Courses
  if (data.courses.length > 0) {
    sections.push(roseSectionHeader(labels.courses));
    data.courses.forEach((course) => {
      sections.push(
        new Paragraph({
          children: [
            new TextRun({ text: course.name, bold: true, size: 21, font: 'Cambria', color: primary }),
            new TextRun({ text: ` — ${course.organization} (${course.date})`, size: 19, font: 'Calibri', color: muted }),
          ],
        }),
      );
    });
  }

  // Certificates
  if (data.certificates.length > 0) {
    sections.push(roseSectionHeader(labels.certificates));
    data.certificates.forEach((cert) => {
      sections.push(
        new Paragraph({
          children: [
            new TextRun({ text: cert.name, bold: true, size: 21, font: 'Cambria', color: primary }),
            new TextRun({ text: ` — ${cert.issuer} (${cert.date})`, size: 19, font: 'Calibri', color: muted }),
          ],
        }),
      );
    });
  }

  // Interests
  if (data.interests.length > 0) {
    sections.push(roseSectionHeader(labels.interests));
    sections.push(
      new Paragraph({
        children: [
          new TextRun({ text: data.interests.join('  •  '), size: 21, font: 'Calibri', color: muted }),
        ],
      }),
    );
  }

  // References
  if (data.references.length > 0) {
    sections.push(roseSectionHeader(labels.references));
    data.references.forEach((ref) => {
      sections.push(
        new Paragraph({
          spacing: { before: 50 },
          children: [
            new TextRun({ text: ref.fullName, bold: true, size: 21, font: 'Cambria', color: primary }),
            new TextRun({ text: ` — ${ref.position}, ${ref.company}`, size: 19, font: 'Calibri', color: muted }),
          ],
        }),
      );
      sections.push(
        new Paragraph({
          children: [
            new TextRun({ text: `${ref.phone}  |  ${ref.email}`, size: 19, color: muted, font: 'Calibri' }),
          ],
        }),
      );
    });
  }

  return new Document({
    sections: [{ children: sections }],
  });
}
