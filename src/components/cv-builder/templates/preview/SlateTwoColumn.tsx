'use client';

import { useCVFormContext } from '@/components/cv-builder/CVBuilderContext';
import { getCVLabels } from '@/lib/cv-builder/cv-labels';

export default function SlateTwoColumn() {
  const { state } = useCVFormContext();
  const labels = getCVLabels(state.cvLanguage);
  const { personalInfo, workExperience, education, skills, languages, courses, certificates, interests, references } = state;
  const photoUrl = state.photo ? URL.createObjectURL(state.photo) : null;

  const leftTitle = (text: string) => (
    <h2 style={{ fontSize: '11px', fontWeight: 700, color: '#334155', textTransform: 'uppercase' as const, letterSpacing: '1.5px', borderBottom: '2px solid #334155', paddingBottom: '3px', marginBottom: '8px' }}>{text}</h2>
  );

  const rightTitle = (text: string) => (
    <h2 style={{ fontSize: '11px', fontWeight: 700, color: '#475569', textTransform: 'uppercase' as const, letterSpacing: '1.5px', borderBottom: '1px solid #cbd5e1', paddingBottom: '3px', marginBottom: '8px' }}>{text}</h2>
  );

  return (
    <div className="bg-white" style={{ fontFamily: 'Arial, sans-serif', fontSize: '12px', color: '#334155' }}>
      {/* Full-width header */}
      <div style={{ background: '#334155', padding: '20px 28px', color: 'white' }}>
        <div className="flex items-center gap-5">
          {photoUrl && (
            <img src={photoUrl} alt="photo" className="rounded-full object-cover flex-shrink-0"
              style={{ width: 68, height: 68, border: '2px solid #94a3b8' }} />
          )}
          <div className="flex-1">
            <div style={{ fontSize: '20px', fontWeight: 700, color: '#f8fafc' }}>{personalInfo.firstName} {personalInfo.lastName}</div>
            <div className="flex flex-wrap gap-5 mt-2" style={{ fontSize: '11px', color: '#94a3b8' }}>
              {personalInfo.email && <span>{personalInfo.email}</span>}
              {personalInfo.phone && <span>{personalInfo.phone}</span>}
              {personalInfo.city && <span>{personalInfo.city}</span>}
              {personalInfo.linkedinUrl && <span>{personalInfo.linkedinUrl}</span>}
            </div>
          </div>
        </div>
      </div>

      {/* About Me full-width */}
      {personalInfo.aboutMe && (
        <div style={{ background: '#f1f5f9', padding: '12px 28px', borderBottom: '1px solid #e2e8f0' }}>
          <p style={{ lineHeight: '1.6', color: '#475569' }}>{personalInfo.aboutMe}</p>
        </div>
      )}

      {/* Two columns */}
      <div className="flex" style={{ minHeight: '300px' }}>
        {/* Left column */}
        <div style={{ flex: 1, padding: '18px 20px 18px 28px', borderRight: '1px solid #e2e8f0' }}>
          {workExperience.length > 0 && (
            <section className="mb-5">
              {leftTitle(labels.workExperience)}
              {workExperience.map((job) => (
                <div key={job.id} className="mb-3">
                  <div style={{ fontWeight: 700, color: '#1e293b' }}>{job.position}</div>
                  <div className="flex justify-between items-center">
                    <span style={{ color: '#64748b', fontSize: '11px' }}>{job.company}</span>
                    <span style={{ color: '#94a3b8', fontSize: '10px' }}>{job.startDate} – {job.currentlyWorking ? labels.present : job.endDate}</span>
                  </div>
                  {job.description && <p style={{ color: '#475569', lineHeight: '1.5', marginTop: '3px', fontSize: '11px' }}>{job.description}</p>}
                </div>
              ))}
            </section>
          )}

          {education.length > 0 && (
            <section>
              {leftTitle(labels.education)}
              {education.map((edu) => (
                <div key={edu.id} className="mb-3">
                  <div style={{ fontWeight: 700, color: '#1e293b' }}>{edu.major}</div>
                  <div className="flex justify-between items-center">
                    <span style={{ color: '#64748b', fontSize: '11px' }}>{edu.institution}</span>
                    <span style={{ color: '#94a3b8', fontSize: '10px' }}>{edu.startDate} – {edu.currentlyStudying ? labels.present : edu.endDate}</span>
                  </div>
                  {edu.city && <span style={{ color: '#94a3b8', fontSize: '11px' }}>{edu.city}</span>}
                </div>
              ))}
            </section>
          )}
        </div>

        {/* Right column */}
        <div style={{ flex: 1, padding: '18px 28px 18px 20px' }}>
          {skills.length > 0 && (
            <section className="mb-4">
              {rightTitle(labels.skills)}
              <div className="flex flex-wrap gap-2">
                {skills.map((skill) => (
                  <span key={skill.id} style={{ background: '#f1f5f9', border: '1px solid #cbd5e1', color: '#334155', padding: '2px 9px', borderRadius: '4px', fontSize: '11px' }}>
                    {skill.name}
                  </span>
                ))}
              </div>
            </section>
          )}

          {languages.length > 0 && (
            <section className="mb-4">
              {rightTitle(labels.languages)}
              {languages.map((lang) => (
                <div key={lang.id} className="flex justify-between mb-1">
                  <span>{lang.name}</span>
                  <span style={{ background: '#334155', color: 'white', padding: '1px 7px', borderRadius: '10px', fontSize: '10px' }}>{lang.level}</span>
                </div>
              ))}
            </section>
          )}

          {courses.length > 0 && (
            <section className="mb-4">
              {rightTitle(labels.courses)}
              {courses.map((c) => (
                <div key={c.id} className="mb-1" style={{ fontSize: '11px' }}>
                  <span style={{ fontWeight: 500 }}>{c.name}</span>
                  <span style={{ color: '#64748b' }}> — {c.organization}</span>
                  <span style={{ color: '#94a3b8', fontSize: '10px' }}> {c.date}</span>
                </div>
              ))}
            </section>
          )}

          {certificates.length > 0 && (
            <section className="mb-4">
              {rightTitle(labels.certificates)}
              {certificates.map((cert) => (
                <div key={cert.id} className="mb-1" style={{ fontSize: '11px' }}>
                  <span style={{ fontWeight: 500 }}>{cert.name}</span>
                  <span style={{ color: '#64748b' }}> — {cert.issuer}</span>
                  <span style={{ color: '#94a3b8', fontSize: '10px' }}> {cert.date}</span>
                </div>
              ))}
            </section>
          )}

          {interests.length > 0 && (
            <section className="mb-4">
              {rightTitle(labels.interests)}
              <div className="flex flex-wrap gap-2">
                {interests.map((item, i) => (
                  <span key={i} style={{ background: '#e2e8f0', color: '#334155', padding: '2px 8px', borderRadius: '10px', fontSize: '11px' }}>{item}</span>
                ))}
              </div>
            </section>
          )}

          {references.length > 0 && (
            <section>
              {rightTitle(labels.references)}
              {references.map((ref) => (
                <div key={ref.id} className="mb-2" style={{ background: '#f8fafc', padding: '6px 8px', borderRadius: '4px', borderLeft: '2px solid #334155' }}>
                  <div style={{ fontWeight: 700, fontSize: '12px' }}>{ref.fullName}</div>
                  <div style={{ color: '#64748b', fontSize: '11px' }}>{ref.position}, {ref.company}</div>
                  <div style={{ color: '#94a3b8', fontSize: '10px' }}>{ref.email}</div>
                </div>
              ))}
            </section>
          )}
        </div>
      </div>
    </div>
  );
}
