import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import jsPDF from 'jspdf';

const ResumeBuilder = () => {
  const [resumeData, setResumeData] = useState({
    personalInfo: {
      name: '',
      email: '',
      phone: '',
      address: ''
    },
    education: [
      {
        institution: '',
        degree: '',
        year: '',
        grade: ''
      }
    ],
    experience: [
      {
        company: '',
        position: '',
        duration: '',
        description: ''
      }
    ],
    skills: []
  });
  const [currentSkill, setCurrentSkill] = useState('');

  const handlePersonalInfoChange = (field, value) => {
    setResumeData(prev => ({
      ...prev,
      personalInfo: {
        ...prev.personalInfo,
        [field]: value
      }
    }));
  };

  const handleEducationChange = (index, field, value) => {
    const updatedEducation = [...resumeData.education];
    updatedEducation[index][field] = value;
    setResumeData(prev => ({
      ...prev,
      education: updatedEducation
    }));
  };

  const addEducation = () => {
    setResumeData(prev => ({
      ...prev,
      education: [
        ...prev.education,
        {
          institution: '',
          degree: '',
          year: '',
          grade: ''
        }
      ]
    }));
  };

  const removeEducation = (index) => {
    if (resumeData.education.length > 1) {
      const updatedEducation = resumeData.education.filter((_, i) => i !== index);
      setResumeData(prev => ({
        ...prev,
        education: updatedEducation
      }));
    }
  };

  const handleExperienceChange = (index, field, value) => {
    const updatedExperience = [...resumeData.experience];
    updatedExperience[index][field] = value;
    setResumeData(prev => ({
      ...prev,
      experience: updatedExperience
    }));
  };

  const addExperience = () => {
    setResumeData(prev => ({
      ...prev,
      experience: [
        ...prev.experience,
        {
          company: '',
          position: '',
          duration: '',
          description: ''
        }
      ]
    }));
  };

  const removeExperience = (index) => {
    if (resumeData.experience.length > 1) {
      const updatedExperience = resumeData.experience.filter((_, i) => i !== index);
      setResumeData(prev => ({
        ...prev,
        experience: updatedExperience
      }));
    }
  };

  const addSkill = () => {
    if (currentSkill.trim()) {
      setResumeData(prev => ({
        ...prev,
        skills: [...prev.skills, currentSkill.trim()]
      }));
      setCurrentSkill('');
    }
  };

  const removeSkill = (index) => {
    const updatedSkills = resumeData.skills.filter((_, i) => i !== index);
    setResumeData(prev => ({
      ...prev,
      skills: updatedSkills
    }));
  };

  const generatePDF = () => {
    const doc = new jsPDF();
    
    // Title
    doc.setFontSize(20);
    doc.setTextColor(139, 92, 246);
    doc.text(resumeData.personalInfo.name || 'Your Name', 20, 30);
    
    // Personal Info
    doc.setFontSize(10);
    doc.setTextColor(100, 100, 100);
    doc.text(`Email: ${resumeData.personalInfo.email} | Phone: ${resumeData.personalInfo.phone} | Address: ${resumeData.personalInfo.address}`, 20, 40);
    
    let yPosition = 60;
    
    // Education
    if (resumeData.education.some(edu => edu.institution)) {
      doc.setFontSize(14);
      doc.setTextColor(139, 92, 246);
      doc.text('EDUCATION', 20, yPosition);
      yPosition += 10;
      
      doc.setFontSize(10);
      doc.setTextColor(0, 0, 0);
      
      resumeData.education.forEach(edu => {
        if (edu.institution) {
          doc.text(`${edu.degree} - ${edu.institution} (${edu.year}) - ${edu.grade}`, 20, yPosition);
          yPosition += 7;
        }
      });
      yPosition += 10;
    }
    
    // Experience
    if (resumeData.experience.some(exp => exp.company)) {
      doc.setFontSize(14);
      doc.setTextColor(139, 92, 246);
      doc.text('EXPERIENCE', 20, yPosition);
      yPosition += 10;
      
      doc.setFontSize(10);
      doc.setTextColor(0, 0, 0);
      
      resumeData.experience.forEach(exp => {
        if (exp.company) {
          doc.text(`${exp.position} at ${exp.company} (${exp.duration})`, 20, yPosition);
          yPosition += 7;
          doc.text(exp.description, 20, yPosition, { maxWidth: 170 });
          yPosition += 15;
        }
      });
    }
    
    // Skills
    if (resumeData.skills.length > 0) {
      doc.setFontSize(14);
      doc.setTextColor(139, 92, 246);
      doc.text('SKILLS', 20, yPosition);
      yPosition += 10;
      
      doc.setFontSize(10);
      doc.setTextColor(0, 0, 0);
      
      const skillsText = resumeData.skills.join(', ');
      doc.text(skillsText, 20, yPosition, { maxWidth: 170 });
    }
    
    // Save the PDF
    doc.save(`${resumeData.personalInfo.name || 'resume'}.pdf`);
  };

  return (
    <div className="container">
      <div className="dashboard-header">
        <h1>Resume Builder</h1>
        <p>Create a professional resume in minutes</p>
      </div>

      <div className="grid grid-2">
        {/* Resume Form */}
        <div className="card">
          <h3>Build Your Resume</h3>

          {/* Personal Information */}
          <div className="form-group">
            <h4>Personal Information</h4>
            <div className="grid grid-2">
              <input
                type="text"
                className="form-control"
                placeholder="Full Name"
                value={resumeData.personalInfo.name}
                onChange={(e) => handlePersonalInfoChange('name', e.target.value)}
              />
              <input
                type="email"
                className="form-control"
                placeholder="Email"
                value={resumeData.personalInfo.email}
                onChange={(e) => handlePersonalInfoChange('email', e.target.value)}
              />
            </div>
            <div className="grid grid-2 mt-1">
              <input
                type="tel"
                className="form-control"
                placeholder="Phone"
                value={resumeData.personalInfo.phone}
                onChange={(e) => handlePersonalInfoChange('phone', e.target.value)}
              />
              <input
                type="text"
                className="form-control"
                placeholder="Address"
                value={resumeData.personalInfo.address}
                onChange={(e) => handlePersonalInfoChange('address', e.target.value)}
              />
            </div>
          </div>

          {/* Education */}
          <div className="form-group">
            <div className="flex-between">
              <h4>Education</h4>
              <button type="button" className="btn btn-secondary" onClick={addEducation}>
                Add Education
              </button>
            </div>
            {resumeData.education.map((edu, index) => (
              <div key={index} className="education-item mb-1 p-1" style={{ border: '1px solid #e5e7eb', borderRadius: '8px' }}>
                <div className="grid grid-2">
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Institution"
                    value={edu.institution}
                    onChange={(e) => handleEducationChange(index, 'institution', e.target.value)}
                  />
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Degree"
                    value={edu.degree}
                    onChange={(e) => handleEducationChange(index, 'degree', e.target.value)}
                  />
                </div>
                <div className="grid grid-2 mt-1">
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Year"
                    value={edu.year}
                    onChange={(e) => handleEducationChange(index, 'year', e.target.value)}
                  />
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Grade/GPA"
                    value={edu.grade}
                    onChange={(e) => handleEducationChange(index, 'grade', e.target.value)}
                  />
                </div>
                {resumeData.education.length > 1 && (
                  <button
                    type="button"
                    className="btn btn-danger mt-1"
                    onClick={() => removeEducation(index)}
                  >
                    Remove
                  </button>
                )}
              </div>
            ))}
          </div>

          {/* Experience */}
          <div className="form-group">
            <div className="flex-between">
              <h4>Experience</h4>
              <button type="button" className="btn btn-secondary" onClick={addExperience}>
                Add Experience
              </button>
            </div>
            {resumeData.experience.map((exp, index) => (
              <div key={index} className="experience-item mb-1 p-1" style={{ border: '1px solid #e5e7eb', borderRadius: '8px' }}>
                <div className="grid grid-2">
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Company"
                    value={exp.company}
                    onChange={(e) => handleExperienceChange(index, 'company', e.target.value)}
                  />
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Position"
                    value={exp.position}
                    onChange={(e) => handleExperienceChange(index, 'position', e.target.value)}
                  />
                </div>
                <input
                  type="text"
                  className="form-control mt-1"
                  placeholder="Duration (e.g., Jan 2020 - Dec 2022)"
                  value={exp.duration}
                  onChange={(e) => handleExperienceChange(index, 'duration', e.target.value)}
                />
                <textarea
                  className="form-control mt-1"
                  placeholder="Job description and responsibilities"
                  value={exp.description}
                  onChange={(e) => handleExperienceChange(index, 'description', e.target.value)}
                  rows="3"
                />
                {resumeData.experience.length > 1 && (
                  <button
                    type="button"
                    className="btn btn-danger mt-1"
                    onClick={() => removeExperience(index)}
                  >
                    Remove
                  </button>
                )}
              </div>
            ))}
          </div>

          {/* Skills */}
          <div className="form-group">
            <h4>Skills</h4>
            <div className="flex">
              <input
                type="text"
                className="form-control"
                placeholder="Add a skill"
                value={currentSkill}
                onChange={(e) => setCurrentSkill(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addSkill())}
              />
              <button type="button" className="btn btn-secondary" onClick={addSkill}>
                Add
              </button>
            </div>
            <div className="skills-container mt-1">
              {resumeData.skills.map((skill, index) => (
                <span key={index} className="skill-tag">
                  {skill}
                  <button
                    type="button"
                    onClick={() => removeSkill(index)}
                    style={{ marginLeft: '5px', background: 'none', border: 'none', cursor: 'pointer' }}
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
          </div>

          <button className="btn btn-primary w-100 mt-2" onClick={generatePDF}>
            Download PDF Resume
          </button>
        </div>

        {/* Resume Preview */}
        <div className="card">
          <h3>Resume Preview</h3>
          <div className="resume-preview">
            <div className="resume-section">
              <h2 style={{ color: '#8b5cf6', borderBottom: '2px solid #8b5cf6', paddingBottom: '0.5rem' }}>
                {resumeData.personalInfo.name || 'Your Name'}
              </h2>
              <p>
                {resumeData.personalInfo.email && `${resumeData.personalInfo.email} | `}
                {resumeData.personalInfo.phone && `${resumeData.personalInfo.phone} | `}
                {resumeData.personalInfo.address}
              </p>
            </div>

            {resumeData.education.some(edu => edu.institution) && (
              <div className="resume-section">
                <h3>Education</h3>
                {resumeData.education.map((edu, index) => (
                  edu.institution && (
                    <div key={index} className="mb-1">
                      <strong>{edu.degree}</strong> - {edu.institution} ({edu.year}) {edu.grade && `- ${edu.grade}`}
                    </div>
                  )
                ))}
              </div>
            )}

            {resumeData.experience.some(exp => exp.company) && (
              <div className="resume-section">
                <h3>Experience</h3>
                {resumeData.experience.map((exp, index) => (
                  exp.company && (
                    <div key={index} className="mb-1">
                      <strong>{exp.position}</strong> at {exp.company} ({exp.duration})
                      <p>{exp.description}</p>
                    </div>
                  )
                ))}
              </div>
            )}

            {resumeData.skills.length > 0 && (
              <div className="resume-section">
                <h3>Skills</h3>
                <div>
                  {resumeData.skills.map((skill, index) => (
                    <span key={index} className="skill-tag">{skill}</span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResumeBuilder;