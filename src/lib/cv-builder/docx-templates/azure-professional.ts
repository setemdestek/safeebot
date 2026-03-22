// src/lib/cv-builder/docx-templates/azure-professional.ts
import {
  Document,
  Paragraph,
  TextRun,
  AlignmentType,
} from 'docx';
import type { CVFormData } from '@/types/cv';
import type { CVLabels } from '../cv-labels';
import {
  createSectionHeader,
  createSeparator,
  createContactInfo,
  createDateRange,
  createSkillBar,
  embedPhoto,
  hexToDocxColor,
} from '../docx-utils';

export function buildAzureProfessionalDocx(
  data: CVFormData,
  photoBuffer: Buffer | null,
  labels: CVLabels,
): Document {
  const primary = hexToDocxColor('#1e40af');
  const sections: (Paragraph | import('docx').Table)[] = [];

  // Header with name
  sections.push(
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { after: 100 },
      shading: { fill: primary },
      children: [
        new TextRun({
          text: `${data.personalInfo.firstName} ${data.personalInfo.lastName}`,
          bold: true,
          size: 40,
          color: 'FFFFFF',
          font: 'Calibri',
        }),
      ],
    }),
  );

  // Photo (if exists)
  if (photoBuffer) {
    sections.push(
      new Paragraph({
        alignment: AlignmentType.CENTER,
        children: [embedPhoto(photoBuffer, 100, 100)],
      }),
    );
  }

  // Contact info
  sections.push(...createContactInfo(data.personalInfo, labels));

  // About Me
  if (data.personalInfo.aboutMe) {
    sections.push(createSectionHeader(labels.aboutMe, primary));
    sections.push(createSeparator(primary));
    sections.push(
      new Paragraph({
        spacing: { before: 50, after: 100 },
        children: [
          new TextRun({
            text: data.personalInfo.aboutMe,
            size: 22,
            font: 'Calibri',
          }),
        ],
      }),
    );
  }

  // Work Experience
  if (data.workExperience.length > 0) {
    sections.push(createSectionHeader(labels.workExperience, primary));
    sections.push(createSeparator(primary));
    data.workExperience.forEach((work) => {
      sections.push(
        new Paragraph({
          spacing: { before: 100 },
          children: [
            new TextRun({
              text: work.position,
              bold: true,
              size: 24,
              font: 'Calibri',
            }),
            new TextRun({
              text: ` — ${work.company}`,
              size: 22,
              font: 'Calibri',
            }),
          ],
        }),
      );
      sections.push(
        new Paragraph({
          children: [
            new TextRun({
              text: createDateRange(
                work.startDate,
                work.endDate,
                work.currentlyWorking,
                labels,
              ),
              size: 20,
              color: '666666',
              font: 'Calibri',
              italics: true,
            }),
          ],
        }),
      );
      sections.push(
        new Paragraph({
          spacing: { after: 80 },
          children: [
            new TextRun({
              text: work.description,
              size: 22,
              font: 'Calibri',
            }),
          ],
        }),
      );
    });
  }

  // Education
  if (data.education.length > 0) {
    sections.push(createSectionHeader(labels.education, primary));
    sections.push(createSeparator(primary));
    data.education.forEach((edu) => {
      sections.push(
        new Paragraph({
          spacing: { before: 80 },
          children: [
            new TextRun({
              text: edu.institution,
              bold: true,
              size: 24,
              font: 'Calibri',
            }),
            new TextRun({
              text: ` — ${edu.major}`,
              size: 22,
              font: 'Calibri',
            }),
          ],
        }),
      );
      sections.push(
        new Paragraph({
          children: [
            new TextRun({
              text: `${edu.city} | ${createDateRange(edu.startDate, edu.endDate, edu.currentlyStudying, labels)}`,
              size: 20,
              color: '666666',
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
    sections.push(createSectionHeader(labels.skills, primary));
    sections.push(createSeparator(primary));
    data.skills.forEach((skill) => {
      sections.push(createSkillBar(skill.name, skill.level, '#1e40af'));
    });
  }

  // Languages
  if (data.languages.length > 0) {
    sections.push(createSectionHeader(labels.languages, primary));
    sections.push(createSeparator(primary));
    data.languages.forEach((lang) => {
      sections.push(
        new Paragraph({
          children: [
            new TextRun({
              text: `${lang.name}: ${lang.level}`,
              size: 22,
              font: 'Calibri',
            }),
          ],
        }),
      );
    });
  }

  // Courses
  if (data.courses.length > 0) {
    sections.push(createSectionHeader(labels.courses, primary));
    sections.push(createSeparator(primary));
    data.courses.forEach((course) => {
      sections.push(
        new Paragraph({
          children: [
            new TextRun({
              text: course.name,
              bold: true,
              size: 22,
              font: 'Calibri',
            }),
            new TextRun({
              text: ` — ${course.organization} (${course.date})`,
              size: 20,
              font: 'Calibri',
            }),
          ],
        }),
      );
    });
  }

  // Certificates
  if (data.certificates.length > 0) {
    sections.push(createSectionHeader(labels.certificates, primary));
    sections.push(createSeparator(primary));
    data.certificates.forEach((cert) => {
      sections.push(
        new Paragraph({
          children: [
            new TextRun({
              text: cert.name,
              bold: true,
              size: 22,
              font: 'Calibri',
            }),
            new TextRun({
              text: ` — ${cert.issuer} (${cert.date})`,
              size: 20,
              font: 'Calibri',
            }),
          ],
        }),
      );
    });
  }

  // Interests
  if (data.interests.length > 0) {
    sections.push(createSectionHeader(labels.interests, primary));
    sections.push(createSeparator(primary));
    sections.push(
      new Paragraph({
        children: [
          new TextRun({
            text: data.interests.join(', '),
            size: 22,
            font: 'Calibri',
          }),
        ],
      }),
    );
  }

  // References
  if (data.references.length > 0) {
    sections.push(createSectionHeader(labels.references, primary));
    sections.push(createSeparator(primary));
    data.references.forEach((ref) => {
      sections.push(
        new Paragraph({
          spacing: { before: 60 },
          children: [
            new TextRun({
              text: ref.fullName,
              bold: true,
              size: 22,
              font: 'Calibri',
            }),
            new TextRun({
              text: ` — ${ref.position}, ${ref.company}`,
              size: 20,
              font: 'Calibri',
            }),
          ],
        }),
      );
      sections.push(
        new Paragraph({
          children: [
            new TextRun({
              text: `${ref.phone} | ${ref.email}`,
              size: 20,
              color: '666666',
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
