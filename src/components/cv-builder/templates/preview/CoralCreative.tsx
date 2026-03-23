'use client';

import { useCVFormContext } from '@/components/cv-builder/CVBuilderContext';
import { getCVLabels } from '@/lib/cv-builder/cv-labels';

export default function CoralCreative() {
  const { state } = useCVFormContext();
  const labels = getCVLabels(state.cvLanguage);
  const { personalInfo, workExperience, education, skills, languages, courses, certificates, interests, references } = state;
  const photoUrl = state.photo ? URL.createObjectURL(state.photo) : null;

  const cardTitle = (text: string) => (
    <h2 style={{ fontSize: '11px', fontWeight: 700, color: '#c2410c', textTransform: 'uppercase' as const, letterSpacing: '1.5px', marginBottom: '8px', paddingBottom: '3px', borderBottom: '2px solid #fed7aa' }}>{text}</h2>
  );

  return (
    <div className="bg-white" style={{ fontFamily: 'Arial, sans-serif', fontSize: '12px', color: '#292524' }}>
      {/* Creative Header with diagonal accent */}
      <div style={{ position: 'relative', overflow: 'hidden', background: '#fff7ed', paddingBottom: '0' }}>
        <div style={{ position: 'absolute', top: 0, right: 0, width: '160px', height: '100%', background: '#c2410c', clipPath: 'polygon(40% 0, 100% 0, 100% 100%, 0% 100%)' }} />
        <div style={{ padding: '24px 28px', position: 'relative', zIndex: 1, display: 'flex', gap: '16px', alignItems: 'flex-start' }}>
          {photoUrl && (
            <img src={photoUrl} alt="photo" className="rounded-full object-cover flex-shrink-0"
              style={{ width: 76, height: 76, border: '3px solid #c2410c', zIndex: 2 }} />
          )}
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: '22px', fontWeight: 700, color: '#7c2d12', letterSpacing: '0.5px' }}>
              {personalInfo.firstName}
            </div>
            <div style={{ fontSize: '22px', fontWeight: 300, color: '#c2410c' }}>
              {personalInfo.lastName}
            </div>
            <div className="flex flex-wrap gap-3 mt-2" style={{ fontSize: '11px', color: '#92400e' }}>
              {personalInfo.email && <span>{personalInfo.email}</span>}
              {personalInfo.phone && <span>{personalInfo.phone}</span>}
              {personalInfo.city && <span>{personalInfo.city}</span>}
            </div>
          </div>
        </div>
        {/* Bottom wave */}
        <div style={{ height: '8px', background: 'linear-gradient(90deg, #c2410c 0%, #f97316 50%, #fed7aa 100%)' }} />
      </div>

      <div className="flex" style={{ minHeight: '300px' }}>
        {/* Left column */}
        <div style={{ width: '40%', padding: '16px 16px 16px 20px', background: '#fffbf7', borderRight: '1px solid #fed7aa', flexShrink: 0 }}>
          {personalInfo.aboutMe && (
            <section className="mb-4">
              {cardTitle(labels.aboutMe)}
              <p style={{ lineHeight: '1.6', color: '#44403c', fontSize: '11px' }}>{personalInfo.aboutMe}</p>
            </section>
          )}

          {skills.length > 0 && (
            <section className="mb-4">
              {cardTitle(labels.skills)}
              {skills.map((skill) => (
                <div key={skill.id} className="mb-2">
                  <div className="flex justify-between mb-1" style={{ fontSize: '11px' }}>
                    <span>{skill.name}</span>
                    <span style={{ color: '#c2410c' }}>{skill.level}</span>
                  </div>
                  <div style={{ background: '#fed7aa', borderRadius: '3px', height: '4px' }}>
                    <div style={{ width: `${({ beginner: 20, intermediate: 40, good: 60, excellent: 80, expert: 100 }[skill.level] ?? 50)}%`, background: '#c2410c', borderRadius: '3px', height: '100%' }} />
                  </div>
                </div>
              ))}
            </section>
          )}

          {languages.length > 0 && (
            <section className="mb-4">
              {cardTitle(labels.languages)}
              {languages.map((lang) => (
                <div key={lang.id} className="flex justify-between mb-1" style={{ fontSize: '11px' }}>
                  <span>{lang.name}</span>
                  <span style={{ background: '#c2410c', color: 'white', padding: '1px 7px', borderRadius: '10px', fontSize: '10px' }}>{lang.level}</span>
                </div>
              ))}
            </section>
          )}

          {interests.length > 0 && (
            <section>
              {cardTitle(labels.interests)}
              <div className="flex flex-wrap gap-1">
                {interests.map((item, i) => (
                  <span key={i} style={{ background: '#fff7ed', border: '1px solid #fed7aa', color: '#c2410c', padding: '2px 8px', borderRadius: '10px', fontSize: '10px' }}>{item}</span>
                ))}
              </div>
            </section>
          )}
        </div>

        {/* Right column */}
        <div style={{ flex: 1, padding: '16px 20px 16px 16px' }}>
          {workExperience.length > 0 && (
            <section className="mb-4">
              {cardTitle(labels.workExperience)}
              {workExperience.map((job) => (
                <div key={job.id} className="mb-3" style={{ borderLeft: '3px solid #fed7aa', paddingLeft: '10px' }}>
                  <div style={{ fontWeight: 700, color: '#7c2d12' }}>{job.position}</div>
                  <div className="flex justify-between">
                    <span style={{ color: '#c2410c', fontSize: '11px' }}>{job.company}</span>
                    <span style={{ color: '#9ca3af', fontSize: '10px' }}>{job.startDate} – {job.currentlyWorking ? labels.present : job.endDate}</span>
                  </div>
                  {job.description && <p style={{ color: '#57534e', lineHeight: '1.5', marginTop: '3px', fontSize: '11px' }}>{job.description}</p>}
                </div>
              ))}
            </section>
          )}

          {education.length > 0 && (
            <section className="mb-4">
              {cardTitle(labels.education)}
              {education.map((edu) => (
                <div key={edu.id} className="mb-2" style={{ borderLeft: '3px solid #fed7aa', paddingLeft: '10px' }}>
                  <div style={{ fontWeight: 700, color: '#7c2d12' }}>{edu.major}</div>
                  <div className="flex justify-between">
                    <span style={{ color: '#c2410c', fontSize: '11px' }}>{edu.institution}</span>
                    <span style={{ color: '#9ca3af', fontSize: '10px' }}>{edu.startDate} – {edu.currentlyStudying ? labels.present : edu.endDate}</span>
                  </div>
                </div>
              ))}
            </section>
          )}

          {courses.length > 0 && (
            <section className="mb-3">
              {cardTitle(labels.courses)}
              {courses.map((c) => (
                <div key={c.id} className="flex justify-between mb-1" style={{ fontSize: '11px' }}>
                  <span style={{ fontWeight: 500 }}>{c.name} <span style={{ color: '#6b7280', fontWeight: 400 }}>· {c.organization}</span></span>
                  <span style={{ color: '#9ca3af', fontSize: '10px' }}>{c.date}</span>
                </div>
              ))}
            </section>
          )}

          {certificates.length > 0 && (
            <section className="mb-3">
              {cardTitle(labels.certificates)}
              {certificates.map((cert) => (
                <div key={cert.id} className="flex justify-between mb-1" style={{ fontSize: '11px' }}>
                  <span style={{ fontWeight: 500 }}>{cert.name} <span style={{ color: '#6b7280', fontWeight: 400 }}>· {cert.issuer}</span></span>
                  <span style={{ color: '#9ca3af', fontSize: '10px' }}>{cert.date}</span>
                </div>
              ))}
            </section>
          )}

          {references.length > 0 && (
            <section>
              {cardTitle(labels.references)}
              <div className="grid grid-cols-2 gap-2">
                {references.map((ref) => (
                  <div key={ref.id} style={{ background: '#fff7ed', border: '1px solid #fed7aa', borderRadius: '6px', padding: '7px' }}>
                    <div style={{ fontWeight: 700, fontSize: '12px', color: '#7c2d12' }}>{ref.fullName}</div>
                    <div style={{ color: '#c2410c', fontSize: '11px' }}>{ref.position}</div>
                    <div style={{ color: '#6b7280', fontSize: '10px' }}>{ref.phone}</div>
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>
      </div>
    </div>
  );
}
