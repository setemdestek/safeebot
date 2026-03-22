'use client';

import { useCVFormContext } from '@/components/cv-builder/CVBuilderContext';
import { getCVLabels } from '@/lib/cv-builder/cv-labels';

export default function CarbonExecutive() {
  const { state } = useCVFormContext();
  const labels = getCVLabels(state.cvLanguage);
  const { personalInfo, workExperience, education, skills, languages, courses, certificates, interests, references } = state;
  const photoUrl = state.photo ? URL.createObjectURL(state.photo) : null;

  const sectionTitle = (text: string) => (
    <h2 style={{
      fontSize: '11px',
      fontWeight: 700,
      color: '#1c1917',
      textTransform: 'uppercase' as const,
      letterSpacing: '2px',
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
      marginBottom: '10px',
    }}>
      <span style={{ display: 'inline-block', width: '20px', height: '2px', background: '#d97706' }} />
      {text}
    </h2>
  );

  return (
    <div className="bg-white" style={{ fontFamily: '"Times New Roman", Times, serif', fontSize: '13px', color: '#1c1917' }}>
      {/* Charcoal Header */}
      <div style={{ background: '#1c1917', padding: '28px 36px' }}>
        <div className="flex items-center gap-5">
          {photoUrl && (
            <img src={photoUrl} alt="photo" className="rounded-full object-cover flex-shrink-0"
              style={{ width: 72, height: 72, border: '2px solid #d97706' }} />
          )}
          <div>
            <div style={{ fontSize: '26px', fontWeight: 700, color: '#f5f5f4', letterSpacing: '1px' }}>
              {personalInfo.firstName} {personalInfo.lastName}
            </div>
            {/* Gold accent line */}
            <div style={{ height: '2px', background: 'linear-gradient(90deg, #d97706, transparent)', width: '200px', margin: '6px 0' }} />
            <div className="flex flex-wrap gap-4" style={{ fontSize: '11px', color: '#a8a29e' }}>
              {personalInfo.email && <span>{personalInfo.email}</span>}
              {personalInfo.phone && <span>{personalInfo.phone}</span>}
              {personalInfo.city && <span>{personalInfo.city}</span>}
            </div>
          </div>
        </div>
      </div>

      <div style={{ padding: '24px 36px' }}>
        {personalInfo.aboutMe && (
          <section className="mb-6">
            {sectionTitle(labels.aboutMe)}
            <p style={{ lineHeight: '1.7', color: '#44403c', paddingLeft: '28px' }}>{personalInfo.aboutMe}</p>
          </section>
        )}

        {workExperience.length > 0 && (
          <section className="mb-6">
            {sectionTitle(labels.workExperience)}
            {workExperience.map((job) => (
              <div key={job.id} className="mb-4" style={{ paddingLeft: '28px' }}>
                <div className="flex justify-between items-start">
                  <div>
                    <span style={{ fontWeight: 700, fontSize: '14px', color: '#1c1917' }}>{job.position}</span>
                    <span style={{ color: '#d97706', fontSize: '12px' }}> · {job.company}</span>
                  </div>
                  <span style={{ color: '#78716c', fontSize: '11px', fontStyle: 'italic', whiteSpace: 'nowrap' }}>
                    {job.startDate} – {job.currentlyWorking ? labels.present : job.endDate}
                  </span>
                </div>
                {job.description && <p style={{ color: '#57534e', marginTop: '4px', lineHeight: '1.6', fontFamily: 'Arial, sans-serif', fontSize: '12px' }}>{job.description}</p>}
              </div>
            ))}
          </section>
        )}

        {education.length > 0 && (
          <section className="mb-6">
            {sectionTitle(labels.education)}
            {education.map((edu) => (
              <div key={edu.id} className="mb-3" style={{ paddingLeft: '28px' }}>
                <div className="flex justify-between items-start">
                  <div>
                    <span style={{ fontWeight: 700, color: '#1c1917' }}>{edu.major}</span>
                    <span style={{ color: '#d97706', fontSize: '12px' }}> · {edu.institution}</span>
                  </div>
                  <span style={{ color: '#78716c', fontSize: '11px', fontStyle: 'italic' }}>
                    {edu.startDate} – {edu.currentlyStudying ? labels.present : edu.endDate}
                  </span>
                </div>
                {edu.city && <span style={{ color: '#78716c', fontSize: '11px' }}>{edu.city}</span>}
              </div>
            ))}
          </section>
        )}

        <div className="grid grid-cols-2 gap-8 mb-6">
          {skills.length > 0 && (
            <section>
              {sectionTitle(labels.skills)}
              <div style={{ paddingLeft: '28px' }}>
                {skills.map((skill) => (
                  <div key={skill.id} className="flex justify-between mb-1">
                    <span style={{ color: '#1c1917' }}>{skill.name}</span>
                    <span style={{ color: '#d97706', fontSize: '11px' }}>{skill.level}</span>
                  </div>
                ))}
              </div>
            </section>
          )}

          {languages.length > 0 && (
            <section>
              {sectionTitle(labels.languages)}
              <div style={{ paddingLeft: '28px' }}>
                {languages.map((lang) => (
                  <div key={lang.id} className="flex justify-between mb-1">
                    <span style={{ color: '#1c1917' }}>{lang.name}</span>
                    <span style={{ color: '#d97706', fontSize: '11px' }}>{lang.level}</span>
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>

        {courses.length > 0 && (
          <section className="mb-5">
            {sectionTitle(labels.courses)}
            <div style={{ paddingLeft: '28px' }}>
              {courses.map((c) => (
                <div key={c.id} className="flex justify-between mb-1" style={{ fontFamily: 'Arial, sans-serif', fontSize: '12px' }}>
                  <span style={{ color: '#1c1917' }}>{c.name} <span style={{ color: '#78716c' }}>— {c.organization}</span></span>
                  <span style={{ color: '#78716c', fontSize: '11px' }}>{c.date}</span>
                </div>
              ))}
            </div>
          </section>
        )}

        {certificates.length > 0 && (
          <section className="mb-5">
            {sectionTitle(labels.certificates)}
            <div style={{ paddingLeft: '28px' }}>
              {certificates.map((cert) => (
                <div key={cert.id} className="flex justify-between mb-1" style={{ fontFamily: 'Arial, sans-serif', fontSize: '12px' }}>
                  <span style={{ color: '#1c1917' }}>{cert.name} <span style={{ color: '#78716c' }}>— {cert.issuer}</span></span>
                  <span style={{ color: '#78716c', fontSize: '11px' }}>{cert.date}</span>
                </div>
              ))}
            </div>
          </section>
        )}

        {interests.length > 0 && (
          <section className="mb-5">
            {sectionTitle(labels.interests)}
            <p style={{ paddingLeft: '28px', color: '#57534e', fontStyle: 'italic' }}>{interests.join(' · ')}</p>
          </section>
        )}

        {references.length > 0 && (
          <section>
            {sectionTitle(labels.references)}
            <div className="grid grid-cols-2 gap-4" style={{ paddingLeft: '28px' }}>
              {references.map((ref) => (
                <div key={ref.id} style={{ borderLeft: '2px solid #d97706', paddingLeft: '8px' }}>
                  <div style={{ fontWeight: 700, fontSize: '12px' }}>{ref.fullName}</div>
                  <div style={{ color: '#78716c', fontSize: '11px', fontFamily: 'Arial, sans-serif' }}>{ref.position}, {ref.company}</div>
                  <div style={{ color: '#a8a29e', fontSize: '11px', fontFamily: 'Arial, sans-serif' }}>{ref.phone}</div>
                </div>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
