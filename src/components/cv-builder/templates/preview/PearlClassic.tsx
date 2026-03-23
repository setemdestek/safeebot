'use client';

import { useCVFormContext } from '@/components/cv-builder/CVBuilderContext';
import { getCVLabels } from '@/lib/cv-builder/cv-labels';

export default function PearlClassic() {
  const { state } = useCVFormContext();
  const labels = getCVLabels(state.cvLanguage);
  const { personalInfo, workExperience, education, skills, languages, courses, certificates, interests, references } = state;
  const photoUrl = state.photo ? URL.createObjectURL(state.photo) : null;

  const sectionTitle = (text: string) => (
    <h2 style={{
      fontFamily: 'Georgia, serif',
      fontSize: '14px',
      fontWeight: 700,
      color: '#44403c',
      letterSpacing: '0.5px',
      borderBottom: '1px solid #d6cfc9',
      paddingBottom: '4px',
      marginBottom: '10px',
    }}>{text}</h2>
  );

  return (
    <div style={{ background: '#faf5f0', fontFamily: 'Arial, sans-serif', fontSize: '12px', color: '#44403c' }}>
      {/* Header */}
      <div style={{ background: '#fdf8f4', borderBottom: '2px solid #d6cfc9', padding: '24px 32px' }}>
        <div className="flex items-center gap-5">
          {photoUrl && (
            <img src={photoUrl} alt="photo" className="rounded-full object-cover flex-shrink-0"
              style={{ width: 74, height: 74, border: '2px solid #d6cfc9' }} />
          )}
          <div>
            <div style={{ fontFamily: 'Georgia, serif', fontSize: '24px', fontWeight: 700, color: '#292524', letterSpacing: '0.5px' }}>
              {personalInfo.firstName} {personalInfo.lastName}
            </div>
            <div style={{ height: '1px', background: '#d6cfc9', margin: '8px 0' }} />
            <div className="flex flex-wrap gap-5" style={{ fontSize: '11px', color: '#78716c' }}>
              {personalInfo.email && <span>{personalInfo.email}</span>}
              {personalInfo.phone && <span>{personalInfo.phone}</span>}
              {personalInfo.city && <span>{personalInfo.city}</span>}
              {personalInfo.dateOfBirth && <span>{personalInfo.dateOfBirth}</span>}
              {personalInfo.linkedinUrl && <span style={{ color: '#44403c' }}>{personalInfo.linkedinUrl}</span>}
            </div>
          </div>
        </div>
      </div>

      <div style={{ padding: '20px 32px' }}>
        {personalInfo.aboutMe && (
          <section className="mb-5">
            {sectionTitle(labels.aboutMe)}
            <p style={{ lineHeight: '1.7', color: '#57534e', fontFamily: 'Georgia, serif', fontStyle: 'italic', fontSize: '12px' }}>{personalInfo.aboutMe}</p>
          </section>
        )}

        {workExperience.length > 0 && (
          <section className="mb-5">
            {sectionTitle(labels.workExperience)}
            {workExperience.map((job) => (
              <div key={job.id} className="mb-4">
                <div className="flex justify-between items-start">
                  <div>
                    <span style={{ fontFamily: 'Georgia, serif', fontWeight: 700, color: '#292524', fontSize: '13px' }}>{job.position}</span>
                    <span style={{ color: '#78716c' }}> — {job.company}</span>
                  </div>
                  <span style={{ color: '#a8a29e', fontSize: '11px', fontStyle: 'italic', fontFamily: 'Georgia, serif' }}>
                    {job.startDate} – {job.currentlyWorking ? labels.present : job.endDate}
                  </span>
                </div>
                {job.description && <p style={{ color: '#57534e', marginTop: '4px', lineHeight: '1.6', fontSize: '11px' }}>{job.description}</p>}
              </div>
            ))}
          </section>
        )}

        {education.length > 0 && (
          <section className="mb-5">
            {sectionTitle(labels.education)}
            {education.map((edu) => (
              <div key={edu.id} className="mb-3">
                <div className="flex justify-between items-start">
                  <div>
                    <span style={{ fontFamily: 'Georgia, serif', fontWeight: 700, color: '#292524', fontSize: '13px' }}>{edu.major}</span>
                    <span style={{ color: '#78716c' }}> — {edu.institution}</span>
                  </div>
                  <span style={{ color: '#a8a29e', fontSize: '11px', fontStyle: 'italic', fontFamily: 'Georgia, serif' }}>
                    {edu.startDate} – {edu.currentlyStudying ? labels.present : edu.endDate}
                  </span>
                </div>
                {edu.city && <span style={{ color: '#a8a29e', fontSize: '11px' }}>{edu.city}</span>}
              </div>
            ))}
          </section>
        )}

        <div className="grid grid-cols-2 gap-8 mb-5">
          {skills.length > 0 && (
            <section>
              {sectionTitle(labels.skills)}
              {skills.map((skill) => (
                <div key={skill.id} className="flex justify-between mb-1" style={{ borderBottom: '1px dotted #e7e0d8', paddingBottom: '3px' }}>
                  <span style={{ color: '#44403c' }}>{skill.name}</span>
                  <span style={{ color: '#78716c', fontStyle: 'italic', fontFamily: 'Georgia, serif', fontSize: '11px' }}>{skill.level}</span>
                </div>
              ))}
            </section>
          )}

          {languages.length > 0 && (
            <section>
              {sectionTitle(labels.languages)}
              {languages.map((lang) => (
                <div key={lang.id} className="flex justify-between mb-1" style={{ borderBottom: '1px dotted #e7e0d8', paddingBottom: '3px' }}>
                  <span style={{ color: '#44403c' }}>{lang.name}</span>
                  <span style={{ color: '#78716c', fontStyle: 'italic', fontFamily: 'Georgia, serif', fontSize: '11px' }}>{lang.level}</span>
                </div>
              ))}
            </section>
          )}
        </div>

        {courses.length > 0 && (
          <section className="mb-4">
            {sectionTitle(labels.courses)}
            {courses.map((c) => (
              <div key={c.id} className="flex justify-between mb-1">
                <span style={{ fontFamily: 'Georgia, serif', fontSize: '12px' }}>{c.name}
                  <span style={{ fontFamily: 'Arial, sans-serif', color: '#78716c', fontSize: '11px' }}> — {c.organization}</span>
                </span>
                <span style={{ color: '#a8a29e', fontSize: '11px', fontStyle: 'italic', fontFamily: 'Georgia, serif' }}>{c.date}</span>
              </div>
            ))}
          </section>
        )}

        {certificates.length > 0 && (
          <section className="mb-4">
            {sectionTitle(labels.certificates)}
            {certificates.map((cert) => (
              <div key={cert.id} className="flex justify-between mb-1">
                <span style={{ fontFamily: 'Georgia, serif', fontSize: '12px' }}>{cert.name}
                  <span style={{ fontFamily: 'Arial, sans-serif', color: '#78716c', fontSize: '11px' }}> — {cert.issuer}</span>
                </span>
                <span style={{ color: '#a8a29e', fontSize: '11px', fontStyle: 'italic', fontFamily: 'Georgia, serif' }}>{cert.date}</span>
              </div>
            ))}
          </section>
        )}

        {interests.length > 0 && (
          <section className="mb-4">
            {sectionTitle(labels.interests)}
            <p style={{ color: '#57534e', fontFamily: 'Georgia, serif', fontStyle: 'italic', fontSize: '12px', lineHeight: '1.7' }}>{interests.join(' · ')}</p>
          </section>
        )}

        {references.length > 0 && (
          <section>
            {sectionTitle(labels.references)}
            <div className="grid grid-cols-2 gap-4">
              {references.map((ref) => (
                <div key={ref.id} style={{ background: '#fdf8f4', border: '1px solid #e7e0d8', borderRadius: '4px', padding: '8px 10px' }}>
                  <div style={{ fontFamily: 'Georgia, serif', fontWeight: 700, color: '#292524', fontSize: '13px' }}>{ref.fullName}</div>
                  <div style={{ color: '#78716c', fontSize: '11px' }}>{ref.position}, {ref.company}</div>
                  <div style={{ color: '#a8a29e', fontSize: '11px' }}>{ref.phone} | {ref.email}</div>
                </div>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
