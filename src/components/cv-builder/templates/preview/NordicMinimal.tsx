'use client';

import { useCVFormContext } from '@/components/cv-builder/CVBuilderContext';
import { getCVLabels } from '@/lib/cv-builder/cv-labels';

export default function NordicMinimal() {
  const { state } = useCVFormContext();
  const labels = getCVLabels(state.cvLanguage);
  const { personalInfo, workExperience, education, skills, languages, courses, certificates, interests, references } = state;
  const photoUrl = state.photo ? URL.createObjectURL(state.photo) : null;

  const sectionTitle = (text: string) => (
    <h2 style={{
      fontSize: '10px',
      fontWeight: 700,
      color: '#374151',
      textTransform: 'uppercase' as const,
      letterSpacing: '2px',
      fontVariant: 'small-caps',
      borderBottom: '1px solid #d1d5db',
      paddingBottom: '4px',
      marginBottom: '10px',
    }}>{text}</h2>
  );

  return (
    <div className="bg-white text-gray-700" style={{ fontFamily: '"Helvetica Neue", Helvetica, Arial, sans-serif', fontSize: '12px' }}>
      {/* Top accent line */}
      <div style={{ height: '3px', background: '#374151' }} />

      {/* Header */}
      <div style={{ padding: '28px 36px 20px' }}>
        <div className="flex items-start gap-5 mb-4">
          {photoUrl && (
            <img src={photoUrl} alt="photo" className="rounded-full object-cover flex-shrink-0"
              style={{ width: 64, height: 64, filter: 'grayscale(20%)' }} />
          )}
          <div>
            <div style={{ fontSize: '24px', fontWeight: 300, color: '#111827', letterSpacing: '-0.5px' }}>
              {personalInfo.firstName} <strong style={{ fontWeight: 700 }}>{personalInfo.lastName}</strong>
            </div>
            <div className="flex flex-wrap gap-5 mt-2" style={{ fontSize: '11px', color: '#6b7280' }}>
              {personalInfo.email && <span>{personalInfo.email}</span>}
              {personalInfo.phone && <span>{personalInfo.phone}</span>}
              {personalInfo.city && <span>{personalInfo.city}</span>}
              {personalInfo.linkedinUrl && <span>{personalInfo.linkedinUrl}</span>}
            </div>
          </div>
        </div>
      </div>

      <div style={{ padding: '0 36px 28px' }}>
        {personalInfo.aboutMe && (
          <section className="mb-6">
            {sectionTitle(labels.aboutMe)}
            <p style={{ lineHeight: '1.8', color: '#4b5563', fontWeight: 300 }}>{personalInfo.aboutMe}</p>
          </section>
        )}

        {workExperience.length > 0 && (
          <section className="mb-6">
            {sectionTitle(labels.workExperience)}
            {workExperience.map((job) => (
              <div key={job.id} className="mb-4">
                <div className="flex justify-between items-baseline">
                  <span style={{ fontWeight: 600, color: '#111827', fontSize: '13px' }}>{job.position}</span>
                  <span style={{ color: '#9ca3af', fontSize: '11px' }}>{job.startDate} – {job.currentlyWorking ? labels.present : job.endDate}</span>
                </div>
                <div style={{ color: '#6b7280', fontSize: '12px', marginBottom: '3px' }}>{job.company}</div>
                {job.description && <p style={{ color: '#4b5563', lineHeight: '1.6', fontWeight: 300 }}>{job.description}</p>}
              </div>
            ))}
          </section>
        )}

        {education.length > 0 && (
          <section className="mb-6">
            {sectionTitle(labels.education)}
            {education.map((edu) => (
              <div key={edu.id} className="mb-3">
                <div className="flex justify-between items-baseline">
                  <span style={{ fontWeight: 600, color: '#111827', fontSize: '13px' }}>{edu.major}</span>
                  <span style={{ color: '#9ca3af', fontSize: '11px' }}>{edu.startDate} – {edu.currentlyStudying ? labels.present : edu.endDate}</span>
                </div>
                <div style={{ color: '#6b7280', fontSize: '12px' }}>{edu.institution}{edu.city ? ` · ${edu.city}` : ''}</div>
              </div>
            ))}
          </section>
        )}

        <div className="grid grid-cols-2 gap-8 mb-6">
          {skills.length > 0 && (
            <section>
              {sectionTitle(labels.skills)}
              {skills.map((skill) => (
                <div key={skill.id} className="flex justify-between mb-1">
                  <span style={{ color: '#374151' }}>{skill.name}</span>
                  <span style={{ color: '#9ca3af', fontWeight: 300 }}>{skill.level}</span>
                </div>
              ))}
            </section>
          )}

          {languages.length > 0 && (
            <section>
              {sectionTitle(labels.languages)}
              {languages.map((lang) => (
                <div key={lang.id} className="flex justify-between mb-1">
                  <span style={{ color: '#374151' }}>{lang.name}</span>
                  <span style={{ color: '#9ca3af', fontWeight: 300 }}>{lang.level}</span>
                </div>
              ))}
            </section>
          )}
        </div>

        {courses.length > 0 && (
          <section className="mb-5">
            {sectionTitle(labels.courses)}
            {courses.map((c) => (
              <div key={c.id} className="flex justify-between mb-1">
                <span>{c.name} <span style={{ color: '#9ca3af' }}>— {c.organization}</span></span>
                <span style={{ color: '#9ca3af', fontSize: '11px' }}>{c.date}</span>
              </div>
            ))}
          </section>
        )}

        {certificates.length > 0 && (
          <section className="mb-5">
            {sectionTitle(labels.certificates)}
            {certificates.map((cert) => (
              <div key={cert.id} className="flex justify-between mb-1">
                <span>{cert.name} <span style={{ color: '#9ca3af' }}>— {cert.issuer}</span></span>
                <span style={{ color: '#9ca3af', fontSize: '11px' }}>{cert.date}</span>
              </div>
            ))}
          </section>
        )}

        {interests.length > 0 && (
          <section className="mb-5">
            {sectionTitle(labels.interests)}
            <p style={{ color: '#6b7280', fontWeight: 300 }}>{interests.join('  ·  ')}</p>
          </section>
        )}

        {references.length > 0 && (
          <section>
            {sectionTitle(labels.references)}
            <div className="grid grid-cols-2 gap-4">
              {references.map((ref) => (
                <div key={ref.id}>
                  <div style={{ fontWeight: 600, color: '#111827' }}>{ref.fullName}</div>
                  <div style={{ color: '#6b7280', fontSize: '11px' }}>{ref.position}, {ref.company}</div>
                  <div style={{ color: '#9ca3af', fontSize: '11px' }}>{ref.email}</div>
                </div>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
