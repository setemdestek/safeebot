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

export default function AzureProfessional() {
  const { state } = useCVFormContext();
  const labels = getCVLabels(state.cvLanguage);
  const { personalInfo, workExperience, education, skills, languages, courses, certificates, interests, references } = state;
  const photoUrl = state.photo ? URL.createObjectURL(state.photo) : null;

  return (
    <div className="bg-white text-gray-900" style={{ fontFamily: 'Arial, sans-serif', fontSize: '13px' }}>
      {/* Header */}
      <div
        className="px-8 py-6 text-white flex items-center gap-5"
        style={{ background: 'linear-gradient(135deg, #1e40af 0%, #3b82f6 100%)' }}
      >
        {photoUrl && (
          <img
            src={photoUrl}
            alt="photo"
            className="rounded-full object-cover flex-shrink-0"
            style={{ width: 80, height: 80, border: '3px solid rgba(255,255,255,0.6)' }}
          />
        )}
        <div>
          <div style={{ fontSize: '22px', fontWeight: 700, letterSpacing: '0.5px' }}>
            {personalInfo.firstName} {personalInfo.lastName}
          </div>
          <div className="flex flex-wrap gap-4 mt-1 text-blue-100" style={{ fontSize: '11px' }}>
            {personalInfo.email && <span>{personalInfo.email}</span>}
            {personalInfo.phone && <span>{personalInfo.phone}</span>}
            {personalInfo.city && <span>{personalInfo.city}</span>}
            {personalInfo.linkedinUrl && <span>{personalInfo.linkedinUrl}</span>}
          </div>
        </div>
      </div>

      <div className="px-8 py-5">
        {/* About Me */}
        {personalInfo.aboutMe && (
          <section className="mb-5">
            <h2 style={{ color: '#1e40af', fontSize: '13px', fontWeight: 700, borderBottom: '2px solid #3b82f6', paddingBottom: '3px', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              {labels.aboutMe}
            </h2>
            <p style={{ lineHeight: '1.6', color: '#374151' }}>{personalInfo.aboutMe}</p>
          </section>
        )}

        {/* Work Experience */}
        {workExperience.length > 0 && (
          <section className="mb-5">
            <h2 style={{ color: '#1e40af', fontSize: '13px', fontWeight: 700, borderBottom: '2px solid #3b82f6', paddingBottom: '3px', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              {labels.workExperience}
            </h2>
            {workExperience.map((job) => (
              <div key={job.id} className="mb-4">
                <div className="flex justify-between items-start">
                  <div>
                    <span style={{ fontWeight: 700, color: '#1e293b' }}>{job.position}</span>
                    <span style={{ color: '#3b82f6' }}> — {job.company}</span>
                  </div>
                  <span style={{ color: '#6b7280', fontSize: '11px', whiteSpace: 'nowrap' }}>
                    {job.startDate} – {job.currentlyWorking ? labels.present : job.endDate}
                  </span>
                </div>
                {job.description && <p style={{ color: '#4b5563', marginTop: '3px', lineHeight: '1.5' }}>{job.description}</p>}
              </div>
            ))}
          </section>
        )}

        {/* Education */}
        {education.length > 0 && (
          <section className="mb-5">
            <h2 style={{ color: '#1e40af', fontSize: '13px', fontWeight: 700, borderBottom: '2px solid #3b82f6', paddingBottom: '3px', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              {labels.education}
            </h2>
            {education.map((edu) => (
              <div key={edu.id} className="mb-3">
                <div className="flex justify-between items-start">
                  <div>
                    <span style={{ fontWeight: 700, color: '#1e293b' }}>{edu.major}</span>
                    <span style={{ color: '#3b82f6' }}> — {edu.institution}</span>
                  </div>
                  <span style={{ color: '#6b7280', fontSize: '11px' }}>
                    {edu.startDate} – {edu.currentlyStudying ? labels.present : edu.endDate}
                  </span>
                </div>
                {edu.city && <span style={{ color: '#6b7280', fontSize: '11px' }}>{edu.city}</span>}
              </div>
            ))}
          </section>
        )}

        {/* Skills */}
        {skills.length > 0 && (
          <section className="mb-5">
            <h2 style={{ color: '#1e40af', fontSize: '13px', fontWeight: 700, borderBottom: '2px solid #3b82f6', paddingBottom: '3px', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              {labels.skills}
            </h2>
            <div className="grid grid-cols-2 gap-x-6 gap-y-2">
              {skills.map((skill) => (
                <div key={skill.id}>
                  <div className="flex justify-between mb-1">
                    <span style={{ color: '#374151', fontWeight: 500 }}>{skill.name}</span>
                    <span style={{ color: '#6b7280', fontSize: '11px' }}>{skill.level}</span>
                  </div>
                  <div style={{ background: '#dbeafe', borderRadius: '3px', height: '5px' }}>
                    <div style={{ width: `${SKILL_LEVEL_MAP[skill.level] ?? 50}%`, background: '#3b82f6', borderRadius: '3px', height: '100%' }} />
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Languages */}
        {languages.length > 0 && (
          <section className="mb-5">
            <h2 style={{ color: '#1e40af', fontSize: '13px', fontWeight: 700, borderBottom: '2px solid #3b82f6', paddingBottom: '3px', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              {labels.languages}
            </h2>
            <div className="flex flex-wrap gap-3">
              {languages.map((lang) => (
                <span key={lang.id} style={{ background: '#dbeafe', color: '#1e40af', padding: '2px 10px', borderRadius: '12px', fontSize: '12px' }}>
                  {lang.name} — {lang.level}
                </span>
              ))}
            </div>
          </section>
        )}

        {/* Courses */}
        {courses.length > 0 && (
          <section className="mb-5">
            <h2 style={{ color: '#1e40af', fontSize: '13px', fontWeight: 700, borderBottom: '2px solid #3b82f6', paddingBottom: '3px', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              {labels.courses}
            </h2>
            {courses.map((c) => (
              <div key={c.id} className="flex justify-between mb-1">
                <span style={{ fontWeight: 500 }}>{c.name} <span style={{ color: '#6b7280', fontWeight: 400 }}>— {c.organization}</span></span>
                <span style={{ color: '#6b7280', fontSize: '11px' }}>{c.date}</span>
              </div>
            ))}
          </section>
        )}

        {/* Certificates */}
        {certificates.length > 0 && (
          <section className="mb-5">
            <h2 style={{ color: '#1e40af', fontSize: '13px', fontWeight: 700, borderBottom: '2px solid #3b82f6', paddingBottom: '3px', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              {labels.certificates}
            </h2>
            {certificates.map((cert) => (
              <div key={cert.id} className="flex justify-between mb-1">
                <span style={{ fontWeight: 500 }}>{cert.name} <span style={{ color: '#6b7280', fontWeight: 400 }}>— {cert.issuer}</span></span>
                <span style={{ color: '#6b7280', fontSize: '11px' }}>{cert.date}</span>
              </div>
            ))}
          </section>
        )}

        {/* Interests */}
        {interests.length > 0 && (
          <section className="mb-5">
            <h2 style={{ color: '#1e40af', fontSize: '13px', fontWeight: 700, borderBottom: '2px solid #3b82f6', paddingBottom: '3px', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              {labels.interests}
            </h2>
            <div className="flex flex-wrap gap-2">
              {interests.map((item, i) => (
                <span key={i} style={{ background: '#eff6ff', border: '1px solid #bfdbfe', color: '#1e40af', padding: '2px 10px', borderRadius: '12px', fontSize: '12px' }}>{item}</span>
              ))}
            </div>
          </section>
        )}

        {/* References */}
        {references.length > 0 && (
          <section>
            <h2 style={{ color: '#1e40af', fontSize: '13px', fontWeight: 700, borderBottom: '2px solid #3b82f6', paddingBottom: '3px', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              {labels.references}
            </h2>
            <div className="grid grid-cols-2 gap-4">
              {references.map((ref) => (
                <div key={ref.id} style={{ background: '#eff6ff', padding: '8px', borderRadius: '6px' }}>
                  <div style={{ fontWeight: 700, color: '#1e293b' }}>{ref.fullName}</div>
                  <div style={{ color: '#3b82f6', fontSize: '11px' }}>{ref.position} — {ref.company}</div>
                  <div style={{ color: '#6b7280', fontSize: '11px' }}>{ref.phone} | {ref.email}</div>
                </div>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
