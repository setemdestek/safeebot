// src/lib/cv-builder/docx-templates/carbon-executive.ts
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

function executiveHeading(text: string): Paragraph {
  return new Paragraph({
    spacing: { before: 320, after: 80 },
    border: {
      bottom: { style: BorderStyle.SINGLE, size: 2, color: hexToDocxColor('#d97706') },
    },
    children: [
      new TextRun({
        text: text.toUpperCase(),
        bold: true,
        size: 24,
        color: hexToDocxColor('#1c1917'),
        font: 'Georgia',
      }),
    ],
  });
}

export function buildCarbonExecutiveDocx(
  data: CVFormData,
  photoBuffer: Buffer | null,
  labels: CVLabels,
): Document {
  const primary = hexToDocxColor('#1c1917');
  const secondary = hexToDocxColor('#44403c');
  const accent = hexToDocxColor('#d97706');
  const sections: (Paragraph | import('docx').Table)[] = [];

  // Bold charcoal header band
  sections.push(
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { after: 20 },
      shading: { fill: primary },
      children: [
        new TextRun({
          text: `${data.personalInfo.firstName} ${data.personalInfo.lastName}`.toUpperCase(),
          bold: true,
          size: 44,
          color: 'FFFFFF',
          font: 'Georgia',
        }),
      ],
    }),
  );

  // Gold accent line
  sections.push(
    new Paragraph({
      spacing: { after: 60 },
      shading: { fill: accent },
      children: [new TextRun({ text: ' ', size: 6 })],
    }),
  );

  // Photo
  if (photoBuffer) {
    sections.push(
      new Paragraph({
        alignment: AlignmentType.CENTER,
        spacing: { after: 80 },
        children: [embedPhoto(photoBuffer, 110, 110)],
      }),
    );
  }

  // Contact info
  sections.push(...createContactInfo(data.personalInfo, labels));

  // About Me
  if (data.personalInfo.aboutMe) {
    sections.push(executiveHeading(labels.aboutMe));
    sections.push(
      new Paragraph({
        spacing: { before: 50, after: 100 },
        children: [
          new TextRun({ text: data.personalInfo.aboutMe, size: 22, font: 'Calibri', color: secondary }),
        ],
      }),
    );
  }

  // Work Experience
  if (data.workExperience.length > 0) {
    sections.push(executiveHeading(labels.workExperience));
    data.workExperience.forEach((work) => {
      sections.push(
        new Paragraph({
          spacing: { before: 100 },
          children: [
            new TextRun({ text: work.position, bold: true, size: 24, font: 'Georgia', color: primary }),
          ],
        }),
      );
      sections.push(
        new Paragraph({
          children: [
            new TextRun({ text: work.company, bold: true, size: 21, font: 'Calibri', color: accent }),
            new TextRun({
              text: `  |  ${createDateRange(work.startDate, work.endDate, work.currentlyWorking, labels)}`,
              size: 20,
              color: secondary,
              font: 'Calibri',
              italics: true,
            }),
          ],
        }),
      );
      sections.push(
        new Paragraph({
          spacing: { after: 80 },
          children: [new TextRun({ text: work.description, size: 22, font: 'Calibri', color: secondary })],
        }),
      );
    });
  }

  // Education
  if (data.education.length > 0) {
    sections.push(executiveHeading(labels.education));
    data.education.forEach((edu) => {
      sections.push(
        new Paragraph({
          spacing: { before: 80 },
          children: [
            new TextRun({ text: edu.institution, bold: true, size: 23, font: 'Georgia', color: primary }),
            new TextRun({ text: ` — ${edu.major}`, size: 21, font: 'Calibri', color: secondary }),
          ],
        }),
      );
      sections.push(
        new Paragraph({
          children: [
            new TextRun({
              text: `${edu.city} | ${createDateRange(edu.startDate, edu.endDate, edu.currentlyStudying, labels)}`,
              size: 19,
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
    sections.push(executiveHeading(labels.skills));
    data.skills.forEach((skill) => {
      sections.push(createSkillBar(skill.name, skill.level, '#d97706'));
    });
  }

  // Languages
  if (data.languages.length > 0) {
    sections.push(executiveHeading(labels.languages));
    data.languages.forEach((lang) => {
      sections.push(
        new Paragraph({
          spacing: { before: 20, after: 20 },
          children: [
            new TextRun({ text: `${lang.name}: `, bold: true, size: 21, font: 'Georgia', color: primary }),
            new TextRun({ text: lang.level, size: 21, font: 'Calibri', color: secondary }),
          ],
        }),
      );
    });
  }

  // Courses
  if (data.courses.length > 0) {
    sections.push(executiveHeading(labels.courses));
    data.courses.forEach((course) => {
      sections.push(
        new Paragraph({
          children: [
            new TextRun({ text: course.name, bold: true, size: 21, font: 'Calibri', color: primary }),
            new TextRun({ text: ` — ${course.organization} (${course.date})`, size: 19, font: 'Calibri', color: secondary }),
          ],
        }),
      );
    });
  }

  // Certificates
  if (data.certificates.length > 0) {
    sections.push(executiveHeading(labels.certificates));
    data.certificates.forEach((cert) => {
      sections.push(
        new Paragraph({
          children: [
            new TextRun({ text: cert.name, bold: true, size: 21, font: 'Calibri', color: primary }),
            new TextRun({ text: ` — ${cert.issuer} (${cert.date})`, size: 19, font: 'Calibri', color: secondary }),
          ],
        }),
      );
    });
  }

  // Interests
  if (data.interests.length > 0) {
    sections.push(executiveHeading(labels.interests));
    sections.push(
      new Paragraph({
        children: [new TextRun({ text: data.interests.join(', '), size: 21, font: 'Calibri', color: secondary })],
      }),
    );
  }

  // References
  if (data.references.length > 0) {
    sections.push(executiveHeading(labels.references));
    data.references.forEach((ref) => {
      sections.push(
        new Paragraph({
          spacing: { before: 60 },
          children: [
            new TextRun({ text: ref.fullName, bold: true, size: 21, font: 'Georgia', color: primary }),
            new TextRun({ text: ` — ${ref.position}, ${ref.company}`, size: 19, font: 'Calibri', color: secondary }),
          ],
        }),
      );
      sections.push(
        new Paragraph({
          children: [
            new TextRun({ text: `${ref.phone} | ${ref.email}`, size: 19, color: secondary, font: 'Calibri' }),
          ],
        }),
      );
    });
  }

  return new Document({
    sections: [{ children: sections }],
  });
}
