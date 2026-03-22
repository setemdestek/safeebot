'use client';

import { useCVFormContext } from '@/components/cv-builder/CVBuilderContext';
import { getCVLabels } from '@/lib/cv-builder/cv-labels';

const SKILL_LEVEL_MAP: Record<string, number> = {
  beginner: 20,
  intermediate: 40,
  good: 60,
  excellent: 80,
  expert: 100,
};

export default function MidnightModern() {
  const { state } = useCVFormContext();
  const labels = getCVLabels(state.cvLanguage);
  const { personalInfo, workExperience, education, skills, languages, courses, certificates, interests, references } = state;
  const photoUrl = state.photo ? URL.createObjectURL(state.photo) : null;

  const sidebarHeading = (text: string) => (
    <h3 style={{ color: '#38bdf8', fontSize: '10px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1.5px', marginBottom: '8px', borderBottom: '1px solid #1e293b', paddingBottom: '3px' }}>{text}</h3>
  );

  return (
    <div className="flex bg-white text-gray-900" style={{ fontFamily: 'Arial, sans-serif', fontSize: '12px', minHeight: '400px' }}>
      {/* Sidebar */}
      <div className="flex-shrink-0 px-4 py-6" style={{ width: '38%', background: '#0f172a', color: '#cbd5e1' }}>
        {photoUrl && (
          <div className="flex justify-center mb-4">
            <img src={photoUrl} alt="photo" className="rounded-full object-cover" style={{ width: 75, height: 75, border: '2px solid #38bdf8' }} />
          </div>
        )}
        <div className="text-center mb-5">
          <div style={{ color: '#f1f5f9', fontSize: '14px', fontWeight: 700 }}>{personalInfo.firstName}</div>
          <div style={{ color: '#38bdf8', fontSize: '14px', fontWeight: 700 }}>{personalInfo.lastName}</div>
        </div>

        {/* Contact */}
        <div className="mb-5">
          {sidebarHeading('Contact')}
          {personalInfo.phone && <div className="mb-1 truncate" style={{ fontSize: '11px' }}>{personalInfo.phone}</div>}
          {personalInfo.email && <div className="mb-1 truncate" style={{ fontSize: '11px' }}>{personalInfo.email}</div>}
          {personalInfo.city && <div className="mb-1" style={{ fontSize: '11px' }}>{personalInfo.city}</div>}
          {personalInfo.linkedinUrl && <div className="truncate" style={{ fontSize: '11px', color: '#38bdf8' }}>{personalInfo.linkedinUrl}</div>}
        </div>

        {/* Skills */}
        {skills.length > 0 && (
          <div className="mb-5">
            {sidebarHeading(labels.skills)}
            {skills.map((skill) => (
              <div key={skill.id} className="mb-2">
                <div style={{ fontSize: '11px', marginBottom: '3px' }}>{skill.name}</div>
                <div style={{ background: '#1e293b', borderRadius: '3px', height: '4px' }}>
                  <div style={{ width: `${SKILL_LEVEL_MAP[skill.level] ?? 50}%`, background: '#38bdf8', borderRadius: '3px', height: '100%' }} />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Languages */}
        {languages.length > 0 && (
          <div className="mb-5">
            {sidebarHeading(labels.languages)}
            {languages.map((lang) => (
              <div key={lang.id} className="flex justify-between mb-1" style={{ fontSize: '11px' }}>
                <span>{lang.name}</span>
                <span style={{ color: '#38bdf8' }}>{lang.level}</span>
              </div>
            ))}
          </div>
        )}

        {/* Interests */}
        {interests.length > 0 && (
          <div>
            {sidebarHeading(labels.interests)}
            <div className="flex flex-wrap gap-1">
              {interests.map((item, i) => (
                <span key={i} style={{ background: '#1e293b', color: '#94a3b8', padding: '2px 7px', borderRadius: '10px', fontSize: '10px' }}>{item}</span>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Main Content */}
      <div className="flex-1 px-5 py-6">
        <div className="mb-5">
          <div style={{ fontSize: '20px', fontWeight: 700, color: '#0f172a' }}>
            {personalInfo.firstName} {personalInfo.lastName}
          </div>
          <div style={{ height: '2px', background: 'linear-gradient(90deg, #38bdf8, transparent)', marginTop: '6px' }} />
        </div>

        {personalInfo.aboutMe && (
          <section className="mb-4">
            <h2 style={{ color: '#0f172a', fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '5px' }}>{labels.aboutMe}</h2>
            <p style={{ color: '#4b5563', lineHeight: '1.6' }}>{personalInfo.aboutMe}</p>
          </section>
        )}

        {workExperience.length > 0 && (
          <section className="mb-4">
            <h2 style={{ color: '#0f172a', fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '6px' }}>{labels.workExperience}</h2>
            {workExperience.map((job) => (
              <div key={job.id} className="mb-3" style={{ borderLeft: '2px solid #38bdf8', paddingLeft: '8px' }}>
                <div style={{ fontWeight: 700, color: '#0f172a' }}>{job.position}</div>
                <div style={{ color: '#38bdf8', fontSize: '11px' }}>{job.company} · {job.startDate} – {job.currentlyWorking ? labels.present : job.endDate}</div>
                {job.description && <p style={{ color: '#4b5563', marginTop: '3px', lineHeight: '1.5', fontSize: '11px' }}>{job.description}</p>}
              </div>
            ))}
          </section>
        )}

        {education.length > 0 && (
          <section className="mb-4">
            <h2 style={{ color: '#0f172a', fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '6px' }}>{labels.education}</h2>
            {education.map((edu) => (
              <div key={edu.id} className="mb-2" style={{ borderLeft: '2px solid #38bdf8', paddingLeft: '8px' }}>
                <div style={{ fontWeight: 700, color: '#0f172a' }}>{edu.major}</div>
                <div style={{ color: '#38bdf8', fontSize: '11px' }}>{edu.institution} · {edu.startDate} – {edu.currentlyStudying ? labels.present : edu.endDate}</div>
              </div>
            ))}
          </section>
        )}

        {courses.length > 0 && (
          <section className="mb-4">
            <h2 style={{ color: '#0f172a', fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '6px' }}>{labels.courses}</h2>
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
            <h2 style={{ color: '#0f172a', fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '6px' }}>{labels.certificates}</h2>
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
            <h2 style={{ color: '#0f172a', fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '6px' }}>{labels.references}</h2>
            {references.map((ref) => (
              <div key={ref.id} className="mb-2">
                <span style={{ fontWeight: 700 }}>{ref.fullName}</span> <span style={{ color: '#6b7280' }}>· {ref.position}, {ref.company}</span>
                <div style={{ color: '#6b7280', fontSize: '11px' }}>{ref.phone} | {ref.email}</div>
              </div>
            ))}
          </section>
        )}
      </div>
    </div>
  );
}
