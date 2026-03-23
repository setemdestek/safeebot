'use client';

import { useCVFormContext } from '@/components/cv-builder/CVBuilderContext';
import { getCVLabels } from '@/lib/cv-builder/cv-labels';

export default function EmeraldTimeline() {
  const { state } = useCVFormContext();
  const labels = getCVLabels(state.cvLanguage);
  const { personalInfo, workExperience, education, skills, languages, courses, certificates, interests, references } = state;
  const photoUrl = state.photo ? URL.createObjectURL(state.photo) : null;

  const sectionTitle = (text: string) => (
    <h2 style={{ fontSize: '13px', fontWeight: 700, color: '#065f46', textTransform: 'uppercase' as const, letterSpacing: '1px', marginBottom: '10px', display: 'flex', alignItems: 'center', gap: '8px' }}>
      <span style={{ display: 'inline-block', width: '12px', height: '12px', borderRadius: '50%', background: '#065f46', flexShrink: 0 }} />
      {text}
    </h2>
  );

  const TimelineItem = ({ children }: { children: React.ReactNode }) => (
    <div style={{ paddingLeft: '28px', borderLeft: '2px solid #6ee7b7', position: 'relative', marginBottom: '14px', paddingBottom: '4px' }}>
      <span style={{ position: 'absolute', left: '-5px', top: '4px', width: '8px', height: '8px', borderRadius: '50%', background: '#059669', display: 'block' }} />
      {children}
    </div>
  );

  return (
    <div className="bg-white" style={{ fontFamily: 'Arial, sans-serif', fontSize: '13px', color: '#1f2937' }}>
      {/* Header */}
      <div style={{ background: 'linear-gradient(135deg, #065f46 0%, #059669 100%)', padding: '24px 32px', color: 'white' }}>
        <div className="flex items-center gap-5">
          {photoUrl && (
            <img src={photoUrl} alt="photo" className="rounded-full object-cover flex-shrink-0"
              style={{ width: 72, height: 72, border: '3px solid #6ee7b7' }} />
          )}
          <div>
            <div style={{ fontSize: '22px', fontWeight: 700, letterSpacing: '0.5px' }}>{personalInfo.firstName} {personalInfo.lastName}</div>
            <div style={{ height: '2px', background: '#6ee7b7', width: '60px', margin: '6px 0' }} />
            <div className="flex flex-wrap gap-4" style={{ fontSize: '11px', color: '#a7f3d0' }}>
              {personalInfo.email && <span>{personalInfo.email}</span>}
              {personalInfo.phone && <span>{personalInfo.phone}</span>}
              {personalInfo.city && <span>{personalInfo.city}</span>}
              {personalInfo.linkedinUrl && <span>{personalInfo.linkedinUrl}</span>}
            </div>
          </div>
        </div>
      </div>

      <div style={{ padding: '20px 32px' }}>
        {personalInfo.aboutMe && (
          <section className="mb-5" style={{ background: '#ecfdf5', borderLeft: '4px solid #059669', padding: '12px 14px', borderRadius: '0 6px 6px 0' }}>
            <div style={{ fontSize: '11px', fontWeight: 700, color: '#065f46', textTransform: 'uppercase' as const, letterSpacing: '1px', marginBottom: '5px' }}>{labels.aboutMe}</div>
            <p style={{ lineHeight: '1.6', color: '#374151' }}>{personalInfo.aboutMe}</p>
          </section>
        )}

        {workExperience.length > 0 && (
          <section className="mb-5">
            {sectionTitle(labels.workExperience)}
            {workExperience.map((job) => (
              <TimelineItem key={job.id}>
                <div className="flex justify-between items-start">
                  <span style={{ fontWeight: 700, color: '#065f46' }}>{job.position}</span>
                  <span style={{ color: '#6b7280', fontSize: '11px', whiteSpace: 'nowrap' }}>{job.startDate} – {job.currentlyWorking ? labels.present : job.endDate}</span>
                </div>
                <div style={{ color: '#059669', fontSize: '11px', marginBottom: '3px' }}>{job.company}</div>
                {job.description && <p style={{ color: '#4b5563', lineHeight: '1.5', fontSize: '11px' }}>{job.description}</p>}
              </TimelineItem>
            ))}
          </section>
        )}

        {education.length > 0 && (
          <section className="mb-5">
            {sectionTitle(labels.education)}
            {education.map((edu) => (
              <TimelineItem key={edu.id}>
                <div className="flex justify-between items-start">
                  <span style={{ fontWeight: 700, color: '#065f46' }}>{edu.major}</span>
                  <span style={{ color: '#6b7280', fontSize: '11px' }}>{edu.startDate} – {edu.currentlyStudying ? labels.present : edu.endDate}</span>
                </div>
                <div style={{ color: '#059669', fontSize: '11px' }}>{edu.institution}{edu.city ? ` · ${edu.city}` : ''}</div>
              </TimelineItem>
            ))}
          </section>
        )}

        <div className="grid grid-cols-2 gap-6 mb-5">
          {skills.length > 0 && (
            <section>
              {sectionTitle(labels.skills)}
              {skills.map((skill) => (
                <div key={skill.id} style={{ paddingLeft: '20px', marginBottom: '4px' }}>
                  <div className="flex justify-between">
                    <span>{skill.name}</span>
                    <span style={{ color: '#059669', fontSize: '11px' }}>{skill.level}</span>
                  </div>
                  <div style={{ background: '#d1fae5', borderRadius: '3px', height: '4px', marginTop: '2px' }}>
                    <div style={{ width: `${({ beginner: 20, intermediate: 40, good: 60, excellent: 80, expert: 100 }[skill.level] ?? 50)}%`, background: '#059669', borderRadius: '3px', height: '100%' }} />
                  </div>
                </div>
              ))}
            </section>
          )}

          {languages.length > 0 && (
            <section>
              {sectionTitle(labels.languages)}
              {languages.map((lang) => (
                <div key={lang.id} className="flex justify-between mb-2" style={{ paddingLeft: '20px' }}>
                  <span>{lang.name}</span>
                  <span style={{ background: '#d1fae5', color: '#065f46', padding: '1px 8px', borderRadius: '10px', fontSize: '11px' }}>{lang.level}</span>
                </div>
              ))}
            </section>
          )}
        </div>

        {courses.length > 0 && (
          <section className="mb-4">
            {sectionTitle(labels.courses)}
            {courses.map((c) => (
              <TimelineItem key={c.id}>
                <div className="flex justify-between">
                  <span style={{ fontWeight: 500 }}>{c.name} <span style={{ color: '#6b7280', fontWeight: 400 }}>— {c.organization}</span></span>
                  <span style={{ color: '#6b7280', fontSize: '11px' }}>{c.date}</span>
                </div>
              </TimelineItem>
            ))}
          </section>
        )}

        {certificates.length > 0 && (
          <section className="mb-4">
            {sectionTitle(labels.certificates)}
            {certificates.map((cert) => (
              <TimelineItem key={cert.id}>
                <div className="flex justify-between">
                  <span style={{ fontWeight: 500 }}>{cert.name} <span style={{ color: '#6b7280', fontWeight: 400 }}>— {cert.issuer}</span></span>
                  <span style={{ color: '#6b7280', fontSize: '11px' }}>{cert.date}</span>
                </div>
              </TimelineItem>
            ))}
          </section>
        )}

        {interests.length > 0 && (
          <section className="mb-4">
            {sectionTitle(labels.interests)}
            <div className="flex flex-wrap gap-2" style={{ paddingLeft: '20px' }}>
              {interests.map((item, i) => (
                <span key={i} style={{ background: '#ecfdf5', border: '1px solid #6ee7b7', color: '#065f46', padding: '2px 10px', borderRadius: '12px', fontSize: '12px' }}>{item}</span>
              ))}
            </div>
          </section>
        )}

        {references.length > 0 && (
          <section>
            {sectionTitle(labels.references)}
            <div className="grid grid-cols-2 gap-3" style={{ paddingLeft: '20px' }}>
              {references.map((ref) => (
                <div key={ref.id} style={{ border: '1px solid #a7f3d0', borderRadius: '6px', padding: '8px' }}>
                  <div style={{ fontWeight: 700, color: '#065f46' }}>{ref.fullName}</div>
                  <div style={{ color: '#059669', fontSize: '11px' }}>{ref.position}, {ref.company}</div>
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
