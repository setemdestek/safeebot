// src/lib/cv-builder/docx-templates/pearl-classic.ts
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

function pearlSectionHeader(text: string, color: string): Paragraph {
  return new Paragraph({
    spacing: { before: 280, after: 80 },
    border: {
      bottom: { style: BorderStyle.SINGLE, size: 1, color: hexToDocxColor('#d6d3d1') },
    },
    children: [
      new TextRun({
        text,
        bold: true,
        size: 24,
        color,
        font: 'Cambria',
      }),
    ],
  });
}

export function buildPearlClassicDocx(
  data: CVFormData,
  photoBuffer: Buffer | null,
  labels: CVLabels,
): Document {
  const primary = hexToDocxColor('#44403c');
  const secondary = hexToDocxColor('#78716c');
  const sections: (Paragraph | import('docx').Table)[] = [];

  // Header — name in Cambria, centered, with beige background
  sections.push(
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { after: 60 },
      shading: { fill: hexToDocxColor('#faf5f0') },
      children: [
        new TextRun({
          text: `${data.personalInfo.firstName} ${data.personalInfo.lastName}`,
          bold: true,
          size: 36,
          color: primary,
          font: 'Cambria',
        }),
      ],
    }),
  );

  // Photo (if exists)
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
    sections.push(pearlSectionHeader(labels.aboutMe, primary));
    sections.push(
      new Paragraph({
        spacing: { before: 40, after: 100 },
        children: [
          new TextRun({
            text: data.personalInfo.aboutMe,
            size: 22,
            font: 'Calibri',
            color: secondary,
          }),
        ],
      }),
    );
  }

  // Work Experience
  if (data.workExperience.length > 0) {
    sections.push(pearlSectionHeader(labels.workExperience, primary));
    data.workExperience.forEach((work) => {
      sections.push(
        new Paragraph({
          spacing: { before: 80 },
          children: [
            new TextRun({
              text: work.position,
              bold: true,
              size: 22,
              font: 'Cambria',
              color: primary,
            }),
            new TextRun({
              text: `  |  ${work.company}`,
              size: 21,
              font: 'Calibri',
              color: secondary,
            }),
          ],
        }),
      );
      sections.push(
        new Paragraph({
          children: [
            new TextRun({
              text: createDateRange(work.startDate, work.endDate, work.currentlyWorking, labels),
              size: 19,
              color: secondary,
              font: 'Calibri',
              italics: true,
            }),
          ],
        }),
      );
      sections.push(
        new Paragraph({
          spacing: { after: 60 },
          children: [
            new TextRun({
              text: work.description,
              size: 21,
              font: 'Calibri',
              color: primary,
            }),
          ],
        }),
      );
    });
  }

  // Education
  if (data.education.length > 0) {
    sections.push(pearlSectionHeader(labels.education, primary));
    data.education.forEach((edu) => {
      sections.push(
        new Paragraph({
          spacing: { before: 60 },
          children: [
            new TextRun({
              text: edu.institution,
              bold: true,
              size: 22,
              font: 'Cambria',
              color: primary,
            }),
            new TextRun({
              text: `  |  ${edu.major}`,
              size: 21,
              font: 'Calibri',
              color: secondary,
            }),
          ],
        }),
      );
      sections.push(
        new Paragraph({
          children: [
            new TextRun({
              text: `${edu.city} — ${createDateRange(edu.startDate, edu.endDate, edu.currentlyStudying, labels)}`,
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
    sections.push(pearlSectionHeader(labels.skills, primary));
    data.skills.forEach((skill) => {
      sections.push(createSkillBar(skill.name, skill.level, '#78716c'));
    });
  }

  // Languages
  if (data.languages.length > 0) {
    sections.push(pearlSectionHeader(labels.languages, primary));
    data.languages.forEach((lang) => {
      sections.push(
        new Paragraph({
          spacing: { before: 30, after: 30 },
          children: [
            new TextRun({
              text: `${lang.name}`,
              bold: true,
              size: 21,
              font: 'Cambria',
              color: primary,
            }),
            new TextRun({
              text: ` — ${lang.level}`,
              size: 21,
              font: 'Calibri',
              color: secondary,
            }),
          ],
        }),
      );
    });
  }

  // Courses
  if (data.courses.length > 0) {
    sections.push(pearlSectionHeader(labels.courses, primary));
    data.courses.forEach((course) => {
      sections.push(
        new Paragraph({
          spacing: { before: 30, after: 30 },
          children: [
            new TextRun({
              text: course.name,
              bold: true,
              size: 21,
              font: 'Cambria',
              color: primary,
            }),
            new TextRun({
              text: ` — ${course.organization} (${course.date})`,
              size: 19,
              font: 'Calibri',
              color: secondary,
            }),
          ],
        }),
      );
    });
  }

  // Certificates
  if (data.certificates.length > 0) {
    sections.push(pearlSectionHeader(labels.certificates, primary));
    data.certificates.forEach((cert) => {
      sections.push(
        new Paragraph({
          spacing: { before: 30, after: 30 },
          children: [
            new TextRun({
              text: cert.name,
              bold: true,
              size: 21,
              font: 'Cambria',
              color: primary,
            }),
            new TextRun({
              text: ` — ${cert.issuer} (${cert.date})`,
              size: 19,
              font: 'Calibri',
              color: secondary,
            }),
          ],
        }),
      );
    });
  }

  // Interests
  if (data.interests.length > 0) {
    sections.push(pearlSectionHeader(labels.interests, primary));
    sections.push(
      new Paragraph({
        children: [
          new TextRun({
            text: data.interests.join('  •  '),
            size: 21,
            font: 'Calibri',
            color: secondary,
          }),
        ],
      }),
    );
  }

  // References
  if (data.references.length > 0) {
    sections.push(pearlSectionHeader(labels.references, primary));
    data.references.forEach((ref) => {
      sections.push(
        new Paragraph({
          spacing: { before: 50 },
          children: [
            new TextRun({
              text: ref.fullName,
              bold: true,
              size: 21,
              font: 'Cambria',
              color: primary,
            }),
            new TextRun({
              text: ` — ${ref.position}, ${ref.company}`,
              size: 19,
              font: 'Calibri',
              color: secondary,
            }),
          ],
        }),
      );
      sections.push(
        new Paragraph({
          children: [
            new TextRun({
              text: `${ref.phone}  |  ${ref.email}`,
              size: 19,
              color: secondary,
              font: 'Calibri',
            }),
          ],
        }),
      );
    });
  }

  return new Document({
    sections: [{ children: sections }],
  });
}
