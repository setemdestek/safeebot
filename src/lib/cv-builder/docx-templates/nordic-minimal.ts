// src/lib/cv-builder/docx-templates/nordic-minimal.ts
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

function nordicHeading(text: string): Paragraph {
  return new Paragraph({
    spacing: { before: 400, after: 120 },
    children: [
      new TextRun({
        text: text.toUpperCase(),
        bold: true,
        size: 22,
        color: hexToDocxColor('#374151'),
        font: 'Calibri',
        characterSpacing: 120,
      }),
    ],
  });
}

function nordicLine(): Paragraph {
  return new Paragraph({
    spacing: { before: 20, after: 80 },
    border: {
      bottom: { style: BorderStyle.SINGLE, size: 1, color: hexToDocxColor('#d1d5db') },
    },
    children: [],
  });
}

export function buildNordicMinimalDocx(
  data: CVFormData,
  photoBuffer: Buffer | null,
  labels: CVLabels,
): Document {
  const gray = hexToDocxColor('#374151');
  const light = hexToDocxColor('#9ca3af');
  const sections: (Paragraph | import('docx').Table)[] = [];

  // Generous top spacing + name
  sections.push(
    new Paragraph({
      alignment: AlignmentType.LEFT,
      spacing: { before: 200, after: 40 },
      children: [
        new TextRun({
          text: data.personalInfo.firstName,
          size: 36,
          color: gray,
          font: 'Calibri',
        }),
        new TextRun({
          text: ` ${data.personalInfo.lastName}`,
          bold: true,
          size: 36,
          color: gray,
          font: 'Calibri',
        }),
      ],
    }),
  );

  // Photo
  if (photoBuffer) {
    sections.push(
      new Paragraph({
        spacing: { after: 80 },
        children: [embedPhoto(photoBuffer, 80, 80)],
      }),
    );
  }

  // Thin line under name
  sections.push(nordicLine());

  // Contact info — compact inline style
  const contactParts = [data.personalInfo.email, data.personalInfo.phone, data.personalInfo.city];
  if (data.personalInfo.linkedinUrl) contactParts.push(data.personalInfo.linkedinUrl);
  sections.push(
    new Paragraph({
      spacing: { before: 40, after: 60 },
      children: [
        new TextRun({ text: contactParts.join('   |   '), size: 19, color: light, font: 'Calibri' }),
      ],
    }),
  );

  // Additional personal details
  const extraParts: string[] = [];
  if (data.personalInfo.dateOfBirth) extraParts.push(`${labels.dateOfBirth}: ${data.personalInfo.dateOfBirth}`);
  if (data.personalInfo.driversLicense) extraParts.push(`${labels.driversLicense}: ${data.personalInfo.driversLicense}`);
  extraParts.push(`${labels.maritalStatus}: ${data.personalInfo.maritalStatus === 'married' ? labels.married : labels.single}`);
  if (extraParts.length > 0) {
    sections.push(
      new Paragraph({
        spacing: { after: 40 },
        children: [new TextRun({ text: extraParts.join('   |   '), size: 18, color: light, font: 'Calibri' })],
      }),
    );
  }

  // About Me
  if (data.personalInfo.aboutMe) {
    sections.push(nordicHeading(labels.aboutMe));
    sections.push(nordicLine());
    sections.push(
      new Paragraph({
        spacing: { before: 40, after: 120 },
        children: [new TextRun({ text: data.personalInfo.aboutMe, size: 22, font: 'Calibri', color: gray })],
      }),
    );
  }

  // Work Experience
  if (data.workExperience.length > 0) {
    sections.push(nordicHeading(labels.workExperience));
    sections.push(nordicLine());
    data.workExperience.forEach((work) => {
      sections.push(
        new Paragraph({
          spacing: { before: 100 },
          children: [
            new TextRun({ text: work.position, bold: true, size: 23, font: 'Calibri', color: gray }),
          ],
        }),
      );
      sections.push(
        new Paragraph({
          children: [
            new TextRun({ text: work.company, size: 20, font: 'Calibri', color: light }),
            new TextRun({
              text: `   |   ${createDateRange(work.startDate, work.endDate, work.currentlyWorking, labels)}`,
              size: 19,
              color: light,
              font: 'Calibri',
            }),
          ],
        }),
      );
      sections.push(
        new Paragraph({
          spacing: { before: 40, after: 80 },
          children: [new TextRun({ text: work.description, size: 21, font: 'Calibri', color: gray })],
        }),
      );
    });
  }

  // Education
  if (data.education.length > 0) {
    sections.push(nordicHeading(labels.education));
    sections.push(nordicLine());
    data.education.forEach((edu) => {
      sections.push(
        new Paragraph({
          spacing: { before: 80 },
          children: [
            new TextRun({ text: edu.institution, bold: true, size: 22, font: 'Calibri', color: gray }),
            new TextRun({ text: `  —  ${edu.major}`, size: 21, font: 'Calibri', color: light }),
          ],
        }),
      );
      sections.push(
        new Paragraph({
          children: [
            new TextRun({
              text: `${edu.city}   |   ${createDateRange(edu.startDate, edu.endDate, edu.currentlyStudying, labels)}`,
              size: 19,
              color: light,
              font: 'Calibri',
            }),
          ],
        }),
      );
    });
  }

  // Skills
  if (data.skills.length > 0) {
    sections.push(nordicHeading(labels.skills));
    sections.push(nordicLine());
    data.skills.forEach((skill) => {
      sections.push(createSkillBar(skill.name, skill.level, '#374151'));
    });
  }

  // Languages
  if (data.languages.length > 0) {
    sections.push(nordicHeading(labels.languages));
    sections.push(nordicLine());
    data.languages.forEach((lang) => {
      sections.push(
        new Paragraph({
          spacing: { before: 20, after: 20 },
          children: [
            new TextRun({ text: lang.name, size: 21, font: 'Calibri', color: gray }),
            new TextRun({ text: `   ${lang.level}`, size: 19, font: 'Calibri', color: light }),
          ],
        }),
      );
    });
  }

  // Courses
  if (data.courses.length > 0) {
    sections.push(nordicHeading(labels.courses));
    sections.push(nordicLine());
    data.courses.forEach((course) => {
      sections.push(
        new Paragraph({
          children: [
            new TextRun({ text: course.name, bold: true, size: 21, font: 'Calibri', color: gray }),
            new TextRun({ text: `  —  ${course.organization} (${course.date})`, size: 19, font: 'Calibri', color: light }),
          ],
        }),
      );
    });
  }

  // Certificates
  if (data.certificates.length > 0) {
    sections.push(nordicHeading(labels.certificates));
    sections.push(nordicLine());
    data.certificates.forEach((cert) => {
      sections.push(
        new Paragraph({
          children: [
            new TextRun({ text: cert.name, bold: true, size: 21, font: 'Calibri', color: gray }),
            new TextRun({ text: `  —  ${cert.issuer} (${cert.date})`, size: 19, font: 'Calibri', color: light }),
          ],
        }),
      );
    });
  }

  // Interests
  if (data.interests.length > 0) {
    sections.push(nordicHeading(labels.interests));
    sections.push(nordicLine());
    sections.push(
      new Paragraph({
        children: [new TextRun({ text: data.interests.join('   /   '), size: 21, font: 'Calibri', color: light })],
      }),
    );
  }

  // References
  if (data.references.length > 0) {
    sections.push(nordicHeading(labels.references));
    sections.push(nordicLine());
    data.references.forEach((ref) => {
      sections.push(
        new Paragraph({
          spacing: { before: 50 },
          children: [
            new TextRun({ text: ref.fullName, bold: true, size: 21, font: 'Calibri', color: gray }),
            new TextRun({ text: `  —  ${ref.position}, ${ref.company}`, size: 19, font: 'Calibri', color: light }),
          ],
        }),
      );
      sections.push(
        new Paragraph({
          children: [
            new TextRun({ text: `${ref.phone}   |   ${ref.email}`, size: 19, color: light, font: 'Calibri' }),
          ],
        }),
      );
    });
  }

  return new Document({
    sections: [{ children: sections }],
  });
}
