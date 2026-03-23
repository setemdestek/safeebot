'use client';

import { useCVFormContext } from '@/components/cv-builder/CVBuilderContext';
import { getCVLabels } from '@/lib/cv-builder/cv-labels';

export default function OceanSidebar() {
  const { state } = useCVFormContext();
  const labels = getCVLabels(state.cvLanguage);
  const { personalInfo, workExperience, education, skills, languages, courses, certificates, interests, references } = state;
  const photoUrl = state.photo ? URL.createObjectURL(state.photo) : null;

  const sidebarHeading = (text: string) => (
    <h3 style={{ color: '#e0f2fe', fontSize: '10px', fontWeight: 700, textTransform: 'uppercase' as const, letterSpacing: '1.5px', marginBottom: '7px', borderBottom: '1px solid rgba(255,255,255,0.2)', paddingBottom: '3px' }}>{text}</h3>
  );

  const mainHeading = (text: string) => (
    <h2 style={{ color: '#0c4a6e', fontSize: '12px', fontWeight: 700, textTransform: 'uppercase' as const, letterSpacing: '1px', borderBottom: '2px solid #0369a1', paddingBottom: '3px', marginBottom: '8px' }}>{text}</h2>
  );

  return (
    <div className="flex bg-white" style={{ fontFamily: 'Arial, sans-serif', fontSize: '12px', minHeight: '400px' }}>
      {/* Left Sidebar */}
      <div style={{ width: '35%', background: '#0c4a6e', color: '#bae6fd', padding: '24px 16px', flexShrink: 0 }}>
        {photoUrl && (
          <div className="flex justify-center mb-4">
            <img src={photoUrl} alt="photo" className="rounded-full object-cover"
              style={{ width: 80, height: 80, border: '3px solid #0369a1' }} />
          </div>
        )}
        <div className="text-center mb-5">
          <div style={{ color: '#f0f9ff', fontSize: '15px', fontWeight: 700, lineHeight: '1.2' }}>
            {personalInfo.firstName}<br />{personalInfo.lastName}
          </div>
        </div>

        {/* Contact */}
        <div className="mb-5">
          {sidebarHeading('Contact')}
          <div style={{ fontSize: '11px', lineHeight: '1.7' }}>
            {personalInfo.phone && <div className="truncate">{personalInfo.phone}</div>}
            {personalInfo.email && <div className="truncate">{personalInfo.email}</div>}
            {personalInfo.city && <div>{personalInfo.city}</div>}
            {personalInfo.address && <div>{personalInfo.address}</div>}
          </div>
        </div>

        {skills.length > 0 && (
          <div className="mb-5">
            {sidebarHeading(labels.skills)}
            {skills.map((skill) => (
              <div key={skill.id} className="mb-1" style={{ fontSize: '11px' }}>
                <div className="flex justify-between mb-1">
                  <span>{skill.name}</span>
                  <span style={{ color: '#7dd3fc', fontSize: '10px' }}>{skill.level}</span>
                </div>
              </div>
            ))}
          </div>
        )}

        {languages.length > 0 && (
          <div className="mb-5">
            {sidebarHeading(labels.languages)}
            {languages.map((lang) => (
              <div key={lang.id} className="flex justify-between mb-1" style={{ fontSize: '11px' }}>
                <span>{lang.name}</span>
                <span style={{ color: '#7dd3fc' }}>{lang.level}</span>
              </div>
            ))}
          </div>
        )}

        {interests.length > 0 && (
          <div>
            {sidebarHeading(labels.interests)}
            <div className="flex flex-wrap gap-1">
              {interests.map((item, i) => (
                <span key={i} style={{ background: 'rgba(255,255,255,0.1)', padding: '2px 7px', borderRadius: '10px', fontSize: '10px' }}>{item}</span>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Right Main */}
      <div style={{ flex: 1, padding: '24px 20px' }}>
        <div style={{ borderBottom: '3px solid #0c4a6e', paddingBottom: '12px', marginBottom: '16px' }}>
          <div style={{ fontSize: '20px', fontWeight: 700, color: '#0c4a6e' }}>{personalInfo.firstName} {personalInfo.lastName}</div>
          <div className="flex flex-wrap gap-4 mt-1" style={{ fontSize: '11px', color: '#6b7280' }}>
            {personalInfo.dateOfBirth && <span>{personalInfo.dateOfBirth}</span>}
            {personalInfo.linkedinUrl && <span style={{ color: '#0369a1' }}>{personalInfo.linkedinUrl}</span>}
          </div>
        </div>

        {personalInfo.aboutMe && (
          <section className="mb-5">
            {mainHeading(labels.aboutMe)}
            <p style={{ lineHeight: '1.6', color: '#374151' }}>{personalInfo.aboutMe}</p>
          </section>
        )}

        {workExperience.length > 0 && (
          <section className="mb-5">
            {mainHeading(labels.workExperience)}
            {workExperience.map((job) => (
              <div key={job.id} className="mb-3">
                <div className="flex justify-between">
                  <span style={{ fontWeight: 700, color: '#0c4a6e' }}>{job.position}</span>
                  <span style={{ color: '#6b7280', fontSize: '11px' }}>{job.startDate} – {job.currentlyWorking ? labels.present : job.endDate}</span>
                </div>
                <div style={{ color: '#0369a1', fontSize: '11px', marginBottom: '3px' }}>{job.company}</div>
                {job.description && <p style={{ color: '#4b5563', lineHeight: '1.5', fontSize: '11px' }}>{job.description}</p>}
              </div>
            ))}
          </section>
        )}

        {education.length > 0 && (
          <section className="mb-5">
            {mainHeading(labels.education)}
            {education.map((edu) => (
              <div key={edu.id} className="mb-2">
                <div className="flex justify-between">
                  <span style={{ fontWeight: 700, color: '#0c4a6e' }}>{edu.major}</span>
                  <span style={{ color: '#6b7280', fontSize: '11px' }}>{edu.startDate} – {edu.currentlyStudying ? labels.present : edu.endDate}</span>
                </div>
                <div style={{ color: '#0369a1', fontSize: '11px' }}>{edu.institution}{edu.city ? ` · ${edu.city}` : ''}</div>
              </div>
            ))}
          </section>
        )}

        {courses.length > 0 && (
          <section className="mb-4">
            {mainHeading(labels.courses)}
            {courses.map((c) => (
              <div key={c.id} className="flex justify-between mb-1">
                <span>{c.name} <span style={{ color: '#6b7280' }}>— {c.organization}</span></span>
                <span style={{ color: '#6b7280', fontSize: '11px' }}>{c.date}</span>
              </div>
            ))}
          </section>
        )}

        {certificates.length > 0 && (
          <section className="mb-4">
            {mainHeading(labels.certificates)}
            {certificates.map((cert) => (
              <div key={cert.id} className="flex justify-between mb-1">
                <span>{cert.name} <span style={{ color: '#6b7280' }}>— {cert.issuer}</span></span>
                <span style={{ color: '#6b7280', fontSize: '11px' }}>{cert.date}</span>
              </div>
            ))}
          </section>
        )}

        {references.length > 0 && (
          <section>
            {mainHeading(labels.references)}
            <div className="grid grid-cols-2 gap-3">
              {references.map((ref) => (
                <div key={ref.id} style={{ background: '#f0f9ff', padding: '7px', borderRadius: '5px' }}>
                  <div style={{ fontWeight: 700, color: '#0c4a6e', fontSize: '12px' }}>{ref.fullName}</div>
                  <div style={{ color: '#0369a1', fontSize: '11px' }}>{ref.position}</div>
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
