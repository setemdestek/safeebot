'use client';

import { useCVFormContext } from '@/components/cv-builder/CVBuilderContext';
import { getCVLabels } from '@/lib/cv-builder/cv-labels';

export default function RoseElegant() {
  const { state } = useCVFormContext();
  const labels = getCVLabels(state.cvLanguage);
  const { personalInfo, workExperience, education, skills, languages, courses, certificates, interests, references } = state;
  const photoUrl = state.photo ? URL.createObjectURL(state.photo) : null;

  const sectionTitle = (text: string) => (
    <h2 style={{
      color: '#9f1239',
      fontSize: '13px',
      fontWeight: 700,
      fontStyle: 'italic',
      letterSpacing: '0.5px',
      borderBottom: '1px solid #fecdd3',
      paddingBottom: '4px',
      marginBottom: '8px',
    }}>{text}</h2>
  );

  return (
    <div className="bg-white text-gray-900" style={{ fontFamily: 'Georgia, serif', fontSize: '13px' }}>
      {/* Header */}
      <div style={{ background: '#fecdd3', padding: '24px 32px', display: 'flex', alignItems: 'center', gap: '20px' }}>
        {photoUrl && (
          <img src={photoUrl} alt="photo" className="rounded-full object-cover flex-shrink-0"
            style={{ width: 74, height: 74, border: '3px solid #9f1239' }} />
        )}
        <div>
          <div style={{ fontSize: '22px', fontWeight: 700, color: '#9f1239', letterSpacing: '1px' }}>
            {personalInfo.firstName} {personalInfo.lastName}
          </div>
          <div style={{ marginTop: '6px', display: 'flex', flexWrap: 'wrap', gap: '14px', fontSize: '11px', color: '#6b2737' }}>
            {personalInfo.email && <span>{personalInfo.email}</span>}
            {personalInfo.phone && <span>{personalInfo.phone}</span>}
            {personalInfo.city && <span>{personalInfo.city}</span>}
          </div>
        </div>
      </div>

      <div style={{ padding: '20px 32px' }}>
        {personalInfo.aboutMe && (
          <section className="mb-5">
            {sectionTitle(labels.aboutMe)}
            <p style={{ lineHeight: '1.7', color: '#4b5563', fontStyle: 'italic' }}>{personalInfo.aboutMe}</p>
          </section>
        )}

        {workExperience.length > 0 && (
          <section className="mb-5">
            {sectionTitle(labels.workExperience)}
            {workExperience.map((job) => (
              <div key={job.id} className="mb-4">
                <div className="flex justify-between">
                  <span style={{ fontWeight: 700, color: '#1f2937' }}>{job.position}</span>
                  <span style={{ color: '#9f1239', fontSize: '11px' }}>{job.startDate} – {job.currentlyWorking ? labels.present : job.endDate}</span>
                </div>
                <div style={{ color: '#9f1239', fontSize: '11px', fontStyle: 'italic', marginBottom: '3px' }}>{job.company}</div>
                {job.description && <p style={{ color: '#4b5563', lineHeight: '1.6', fontFamily: 'Arial, sans-serif', fontSize: '12px' }}>{job.description}</p>}
              </div>
            ))}
          </section>
        )}

        {education.length > 0 && (
          <section className="mb-5">
            {sectionTitle(labels.education)}
            {education.map((edu) => (
              <div key={edu.id} className="mb-3">
                <div className="flex justify-between">
                  <span style={{ fontWeight: 700, color: '#1f2937' }}>{edu.major}</span>
                  <span style={{ color: '#9f1239', fontSize: '11px' }}>{edu.startDate} – {edu.currentlyStudying ? labels.present : edu.endDate}</span>
                </div>
                <div style={{ color: '#9f1239', fontSize: '11px', fontStyle: 'italic' }}>{edu.institution}{edu.city ? `, ${edu.city}` : ''}</div>
              </div>
            ))}
          </section>
        )}

        <div className="grid grid-cols-2 gap-6">
          {skills.length > 0 && (
            <section>
              {sectionTitle(labels.skills)}
              {skills.map((skill) => (
                <div key={skill.id} className="flex justify-between mb-1" style={{ fontSize: '12px' }}>
                  <span>{skill.name}</span>
                  <span style={{ color: '#9f1239', fontStyle: 'italic' }}>{skill.level}</span>
                </div>
              ))}
            </section>
          )}

          {languages.length > 0 && (
            <section>
              {sectionTitle(labels.languages)}
              {languages.map((lang) => (
                <div key={lang.id} className="flex justify-between mb-1" style={{ fontSize: '12px' }}>
                  <span>{lang.name}</span>
                  <span style={{ color: '#9f1239', fontStyle: 'italic' }}>{lang.level}</span>
                </div>
              ))}
            </section>
          )}
        </div>

        {courses.length > 0 && (
          <section className="mt-4 mb-4">
            {sectionTitle(labels.courses)}
            {courses.map((c) => (
              <div key={c.id} className="flex justify-between mb-1" style={{ fontSize: '12px' }}>
                <span>{c.name} <span style={{ color: '#9f1239', fontStyle: 'italic' }}>— {c.organization}</span></span>
                <span style={{ color: '#6b7280', fontSize: '11px' }}>{c.date}</span>
              </div>
            ))}
          </section>
        )}

        {certificates.length > 0 && (
          <section className="mb-4">
            {sectionTitle(labels.certificates)}
            {certificates.map((cert) => (
              <div key={cert.id} className="flex justify-between mb-1" style={{ fontSize: '12px' }}>
                <span>{cert.name} <span style={{ color: '#9f1239', fontStyle: 'italic' }}>— {cert.issuer}</span></span>
                <span style={{ color: '#6b7280', fontSize: '11px' }}>{cert.date}</span>
              </div>
            ))}
          </section>
        )}

        {interests.length > 0 && (
          <section className="mb-4">
            {sectionTitle(labels.interests)}
            <p style={{ color: '#4b5563', fontStyle: 'italic', fontSize: '12px' }}>{interests.join(' · ')}</p>
          </section>
        )}

        {references.length > 0 && (
          <section>
            {sectionTitle(labels.references)}
            <div className="grid grid-cols-2 gap-3">
              {references.map((ref) => (
                <div key={ref.id} style={{ borderLeft: '2px solid #fecdd3', paddingLeft: '8px' }}>
                  <div style={{ fontWeight: 700, color: '#1f2937', fontSize: '12px' }}>{ref.fullName}</div>
                  <div style={{ color: '#9f1239', fontSize: '11px', fontStyle: 'italic' }}>{ref.position}, {ref.company}</div>
                  <div style={{ color: '#6b7280', fontSize: '11px' }}>{ref.phone}</div>
                </div>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
