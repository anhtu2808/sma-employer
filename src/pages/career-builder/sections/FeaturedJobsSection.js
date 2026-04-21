import React, { useState, useMemo } from 'react';
import { Select, ConfigProvider } from 'antd';

import { useGetJobsQuery } from '@/apis/jobApi';
import { useGetSkillsQuery } from '@/apis/skillApi';
import { useGetExpertiseQuery, useGetDomainQuery } from '@/apis/masterDataApi';

const ITEMS_PER_PAGE = 5;

const FeaturedJobsSection = ({ theme, sectionProps = {}, settings = {} }) => {
  const { primaryColor, secondaryColor, backgroundColor, textColor, borderRadius, buttonStyle, shadow } = theme;
  const { headline = 'Open Positions' } = sectionProps;

  // Filter state
  const [searchName, setSearchName] = useState('');
  const [searchLocation, setSearchLocation] = useState('');
  const [salaryRange, setSalaryRange] = useState([0, 100]);
  const [expRange, setExpRange] = useState([0, 10]);
  const [selectedLevel, setSelectedLevel] = useState('');
  const [selectedModel, setSelectedModel] = useState('');
  const [selectedSkill, setSelectedSkill] = useState([]);
  const [selectedExpertise, setSelectedExpertise] = useState([]);
  const [selectedDomain, setSelectedDomain] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);

  const { data: jobsData, isLoading } = useGetJobsQuery({ page: 0, size: 100, status: 'PUBLISHED' });
  const fetchedJobs = jobsData?.data?.content || [];

  const { data: skillsOptions = [] } = useGetSkillsQuery({ size: 100 });
  const { data: expertiseOptions = [] } = useGetExpertiseQuery({ size: 100 });
  const { data: domainOptions = [] } = useGetDomainQuery({ size: 100 });

  // Filter logic
  const filteredJobs = useMemo(() => {
    let jobs = fetchedJobs.map((j, i) => ({
      id: j.id,
      title: j.name || j.title || 'Untitled Job',
      companyName: j.company?.name || j.companyName || '',
      isHot: j.isHighlight === true || j.highlightJob === true || j.isHot === true,
      location: j.locations?.length > 0 ? j.locations.map(l => l.city).join(', ') : (j.company?.country || j.workingModel || ''),
      experience: j.experienceTime != null ? `${j.experienceTime} years` : '',
      level: j.jobLevel || '',
      model: j.workingModel || '',
      tags: Array.isArray(j.skills) ? j.skills.map(s => s.name || s) : [],
      salary: j.salaryStart && j.salaryEnd ? `${j.salaryStart.toLocaleString('vi-VN')} - ${j.salaryEnd.toLocaleString('vi-VN')} VND` : (j.salaryStart ? `From ${j.salaryStart.toLocaleString('vi-VN')} VND` : 'Negotiable'),
      postedDate: (j.uploadTime || j.createdAt) ? new Date(j.uploadTime || j.createdAt).toLocaleDateString() : '',
      rawSalaryStart: j.salaryStart,
      rawSalaryEnd: j.salaryEnd,
      rawExp: j.experienceTime,
      rawExpertise: j.expertise?.name || j.expertise?.title || (typeof j.expertise === 'string' ? j.expertise : ''),
      rawDomains: Array.isArray(j.domains) ? j.domains.map(d => d.name || d) : [],
    }));

    if (searchName) jobs = jobs.filter(j => j.title.toLowerCase().includes(searchName.toLowerCase()));
    if (searchLocation) jobs = jobs.filter(j => j.location.toLowerCase().includes(searchLocation.toLowerCase()));
    if (selectedLevel) jobs = jobs.filter(j => j.level?.toUpperCase() === selectedLevel.toUpperCase());
    if (selectedModel) jobs = jobs.filter(j => j.model?.toUpperCase() === selectedModel.toUpperCase());
    if (selectedSkill?.length > 0) jobs = jobs.filter(j => selectedSkill.every(ss => j.tags.some(t => t.toLowerCase() === ss.toLowerCase())));
    if (selectedExpertise?.length > 0) jobs = jobs.filter(j => selectedExpertise.some(se => j.rawExpertise.toLowerCase() === se.toLowerCase()));
    if (selectedDomain?.length > 0) jobs = jobs.filter(j => selectedDomain.some(sd => j.rawDomains.some(d => d.toLowerCase() === sd.toLowerCase())));

    if (salaryRange[0] > 0 || salaryRange[1] < 100) {
      jobs = jobs.filter(j => {
        if (j.rawSalaryStart == null && j.rawSalaryEnd == null) return false;
        const minM = (j.rawSalaryStart || 0) / 1000000;
        const maxM = (j.rawSalaryEnd || j.rawSalaryStart || 0) / 1000000;
        return Math.max(minM, salaryRange[0]) <= Math.min(maxM, salaryRange[1]);
      });
    }

    if (expRange[0] > 0 || expRange[1] < 10) {
      jobs = jobs.filter(j => {
        if (j.rawExp == null) return false;
        return j.rawExp >= expRange[0] && j.rawExp <= expRange[1];
      });
    }
    return jobs;
  }, [fetchedJobs, searchName, searchLocation, selectedLevel, selectedModel, selectedSkill, selectedExpertise, selectedDomain, salaryRange, expRange]);

  const totalPages = Math.max(1, Math.ceil(filteredJobs.length / ITEMS_PER_PAGE));
  const paginatedJobs = filteredJobs.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

  const handleReset = () => {
    setSearchName(''); setSearchLocation('');
    setSelectedLevel(''); setSelectedModel('');
    setSelectedSkill([]); setSalaryRange([0, 100]);
    setExpRange([0, 10]); setSelectedExpertise([]);
    setSelectedDomain([]); setCurrentPage(1);
  };

  const shadowMap = {
    none: 'none',
    subtle: '0 2px 8px rgba(0,0,0,0.06)',
    medium: '0 4px 20px rgba(0,0,0,0.1)',
  };

  const btnBase = {
    padding: '10px 24px', borderRadius: `${borderRadius}px`,
    fontSize: `${13 * ((theme.baseFontSize || 16) / 16)}px`, fontWeight: 600, cursor: 'pointer', transition: 'all 0.2s',
  };
  const btnStyles = {
    flat: { ...btnBase, background: primaryColor, color: '#fff', border: 'none' },
    outline: { ...btnBase, background: 'transparent', color: primaryColor, border: `2px solid ${primaryColor}` },
    shadow: { ...btnBase, background: primaryColor, color: '#fff', border: 'none', boxShadow: '0 8px 24px rgba(0,0,0,0.2)' },
    ghost: { ...btnBase, background: secondaryColor, color: primaryColor, border: 'none' },
  };

  const inputStyle = {
    width: '100%', padding: '10px 14px', borderRadius: `${borderRadius}px`,
    border: '1px solid #e5e7eb', fontSize: `${13 * ((theme.baseFontSize || 16) / 16)}px`, outline: 'none',
    color: textColor, background: '#fff', boxSizing: 'border-box',
  };
  const selectStyle = {
    ...inputStyle, appearance: 'none', WebkitAppearance: 'none',
    backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%239CA3AF' d='M6 8L1 3h10z'/%3E%3C/svg%3E")`,
    backgroundRepeat: 'no-repeat', backgroundPosition: 'right 12px center',
  };
  const labelStyle = { fontSize: `${13 * ((theme.baseFontSize || 16) / 16)}px`, fontWeight: 700, color: textColor, marginBottom: '6px', display: 'block' };
  const fieldGap = { marginBottom: '18px' };

  const rangeTrackStyle = (value, max) => ({
    width: '100%', height: '4px', appearance: 'none', WebkitAppearance: 'none',
    background: `linear-gradient(to right, ${primaryColor} ${(value / max) * 100}%, #e5e7eb ${(value / max) * 100}%)`,
    borderRadius: '4px', outline: 'none', cursor: 'pointer',
  });

  const sectionBg = settings.backgroundColorOverride || backgroundColor;

  return (
    <div style={{
      background: sectionBg,
      padding: `${settings.paddingTop || 64}px 40px ${settings.paddingBottom || 64}px`,
      position: 'relative',
      overflow: 'hidden',
    }}>
      {/* Scattered IT background icons */}
      <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 0 }}>
        {/* Code brackets */}
        <svg style={{ position: 'absolute', top: '5%', left: '5%', opacity: 0.15, transform: 'rotate(-12deg)' }} width="90" height="90" viewBox="0 0 24 24" fill="none" stroke={primaryColor} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/>
        </svg>
        {/* Monitor */}
        <svg style={{ position: 'absolute', top: '3%', left: '30%', opacity: 0.12, transform: 'rotate(8deg)' }} width="85" height="85" viewBox="0 0 24 24" fill="none" stroke={primaryColor} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <rect x="2" y="3" width="20" height="14" rx="2" ry="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/>
        </svg>
        {/* Cloud */}
        <svg style={{ position: 'absolute', top: '6%', left: '58%', opacity: 0.15, transform: 'rotate(-5deg)' }} width="80" height="80" viewBox="0 0 24 24" fill="none" stroke={primaryColor} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M18 10h-1.26A8 8 0 1 0 9 20h9a5 5 0 0 0 0-10z"/>
        </svg>
        {/* Briefcase */}
        <svg style={{ position: 'absolute', top: '4%', right: '8%', opacity: 0.15, transform: 'rotate(15deg)' }} width="80" height="80" viewBox="0 0 24 24" fill="none" stroke={primaryColor} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <rect x="2" y="7" width="20" height="14" rx="2" ry="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/>
        </svg>
        {/* CPU */}
        <svg style={{ position: 'absolute', top: '28%', left: '3%', opacity: 0.12, transform: 'rotate(20deg)' }} width="95" height="95" viewBox="0 0 24 24" fill="none" stroke={primaryColor} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <rect x="4" y="4" width="16" height="16" rx="2"/><rect x="9" y="9" width="6" height="6"/><line x1="9" y1="1" x2="9" y2="4"/><line x1="15" y1="1" x2="15" y2="4"/><line x1="9" y1="20" x2="9" y2="23"/><line x1="15" y1="20" x2="15" y2="23"/><line x1="20" y1="9" x2="23" y2="9"/><line x1="20" y1="14" x2="23" y2="14"/><line x1="1" y1="9" x2="4" y2="9"/><line x1="1" y1="14" x2="4" y2="14"/>
        </svg>
        {/* Database */}
        <svg style={{ position: 'absolute', top: '25%', right: '5%', opacity: 0.15, transform: 'rotate(-10deg)' }} width="80" height="80" viewBox="0 0 24 24" fill="none" stroke={primaryColor} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <ellipse cx="12" cy="5" rx="9" ry="3"/><path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3"/><path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5"/>
        </svg>
        {/* Wifi */}
        <svg style={{ position: 'absolute', top: '50%', left: '8%', opacity: 0.12, transform: 'rotate(5deg)' }} width="75" height="75" viewBox="0 0 24 24" fill="none" stroke={primaryColor} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M5 12.55a11 11 0 0 1 14.08 0"/><path d="M1.42 9a16 16 0 0 1 21.16 0"/><path d="M8.53 16.11a6 6 0 0 1 6.95 0"/><line x1="12" y1="20" x2="12.01" y2="20"/>
        </svg>
        {/* Terminal */}
        <svg style={{ position: 'absolute', top: '48%', right: '12%', opacity: 0.12, transform: 'rotate(6deg)' }} width="85" height="85" viewBox="0 0 24 24" fill="none" stroke={primaryColor} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="4 17 10 11 4 5"/><line x1="12" y1="19" x2="20" y2="19"/>
        </svg>
        {/* Laptop */}
        <svg style={{ position: 'absolute', bottom: '12%', left: '6%', opacity: 0.15, transform: 'rotate(-7deg)' }} width="90" height="90" viewBox="0 0 24 24" fill="none" stroke={primaryColor} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <rect x="3" y="4" width="18" height="12" rx="2"/><line x1="2" y1="20" x2="22" y2="20"/>
        </svg>
        {/* Git Branch */}
        <svg style={{ position: 'absolute', bottom: '8%', left: '28%', opacity: 0.12, transform: 'rotate(12deg)' }} width="75" height="75" viewBox="0 0 24 24" fill="none" stroke={primaryColor} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <line x1="6" y1="3" x2="6" y2="15"/><circle cx="18" cy="6" r="3"/><circle cx="6" cy="18" r="3"/><path d="M18 9a9 9 0 0 1-9 9"/>
        </svg>
        {/* Shield */}
        <svg style={{ position: 'absolute', bottom: '10%', right: '8%', opacity: 0.15, transform: 'rotate(8deg)' }} width="85" height="85" viewBox="0 0 24 24" fill="none" stroke={primaryColor} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
        </svg>
        {/* Settings */}
        <svg style={{ position: 'absolute', bottom: '30%', right: '3%', opacity: 0.12, transform: 'rotate(-15deg)' }} width="80" height="80" viewBox="0 0 24 24" fill="none" stroke={primaryColor} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/>
        </svg>
      </div>

      <div style={{ position: 'relative', zIndex: 1 }}>
      <div style={{ textAlign: 'center', marginBottom: '36px' }}>
        <h2 style={{ fontSize: `${40 * ((theme.baseFontSize || 16) / 16)}px`, fontWeight: 800, color: settings.textColorOverride || textColor, marginBottom: '8px' }}>{headline}</h2>
      </div>

      <div style={{ display: 'flex', gap: '28px', maxWidth: '1280px', margin: '0 auto', alignItems: 'flex-start' }}>
        {/* ─── Filter Sidebar ──────────────────────────────────────── */}
        <div style={{
          width: '280px', flexShrink: 0,
          background: '#FFFFFF', // Fix sidebar background to white
          borderRadius: `${borderRadius}px`,
          border: '1px solid #f0f0f0', boxShadow: shadowMap[shadow],
          padding: '24px 20px',
        }}>
          {/* Header */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ fontSize: `${18 * ((theme.baseFontSize || 16) / 16)}px`, fontWeight: 800, color: textColor }}>Filters</span>
            </div>
            <button onClick={handleReset} style={{
              background: 'none', border: 'none', color: primaryColor,
              fontSize: `${13 * ((theme.baseFontSize || 16) / 16)}px`, fontWeight: 600, cursor: 'pointer',
            }}>Reset</button>
          </div>

          {/* Location */}
          <div style={fieldGap}>
            <label style={labelStyle}>Location</label>
            <input style={inputStyle} placeholder="Enter Location" value={searchLocation}
              onChange={(e) => { setSearchLocation(e.target.value); setCurrentPage(1); }} />
          </div>

          {/* Job Level */}
          <div style={fieldGap}>
            <label style={labelStyle}>Job Level</label>
            <ConfigProvider theme={useMemo(() => ({ 
              components: { 
                Select: { 
                  borderRadius: borderRadius, 
                  activeBorderColor: primaryColor, 
                  hoverBorderColor: primaryColor 
                } 
              } 
            }), [borderRadius, primaryColor])}>
              <Select
                showSearch
                allowClear
                style={{ width: '100%' }}
                placeholder="Select Job Level"
                getPopupContainer={(trigger) => trigger.parentNode}
                value={selectedLevel || undefined}
                onChange={(value) => { setSelectedLevel(value || ''); setCurrentPage(1); }}
                options={[
                  { label: "Intern", value: "INTERN" },
                  { label: "Fresher", value: "FRESHER" },
                  { label: "Junior", value: "JUNIOR" },
                  { label: "Middle", value: "MIDDLE" },
                  { label: "Senior", value: "SENIOR" },
                  { label: "Lead", value: "LEAD" },
                  { label: "Manager", value: "MANAGER" },
                ]}
                filterOption={(input, option) => (option?.label ?? '').toLowerCase().includes(input.toLowerCase())}
              />
            </ConfigProvider>
          </div>

          {/* Working Model */}
          <div style={fieldGap}>
            <label style={labelStyle}>Working Model</label>
            <ConfigProvider theme={useMemo(() => ({ components: { Select: { borderRadius: borderRadius, activeBorderColor: primaryColor, hoverBorderColor: primaryColor } } }), [borderRadius, primaryColor])}>
              <Select
                showSearch
                allowClear
                style={{ width: '100%' }}
                placeholder="Select Working Model"
                getPopupContainer={(trigger) => trigger.parentNode}
                value={selectedModel || undefined}
                onChange={(value) => { setSelectedModel(value || ''); setCurrentPage(1); }}
                options={[
                  { label: "Remote", value: "REMOTE" },
                  { label: "On-site", value: "ONSITE" },
                  { label: "Hybrid", value: "HYBRID" },
                ]}
                filterOption={(input, option) => (option?.label ?? '').toLowerCase().includes(input.toLowerCase())}
              />
            </ConfigProvider>
          </div>

          {/* Skills */}
          <div style={fieldGap}>
            <label style={labelStyle}>Skills</label>
            <ConfigProvider theme={useMemo(() => ({ components: { Select: { borderRadius: borderRadius, activeBorderColor: primaryColor, hoverBorderColor: primaryColor } } }), [borderRadius, primaryColor])}>
              <Select
                mode="multiple"
                showSearch
                allowClear
                style={{ width: '100%' }}
                placeholder="Select skills..."
                getPopupContainer={(trigger) => trigger.parentNode}
                value={selectedSkill}
                onChange={(value) => { setSelectedSkill(value || []); setCurrentPage(1); }}
                options={skillsOptions.map(s => ({ label: s.name, value: s.name }))}
                filterOption={(input, option) => (option?.label ?? '').toLowerCase().includes(input.toLowerCase())}
              />
            </ConfigProvider>
          </div>

          {/* Salary Range */}
          <div style={fieldGap}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
              <label style={labelStyle}>Salary Range (VND)</label>
              <span style={{ fontSize: `${11 * ((theme.baseFontSize || 16) / 16)}px`, color: textColor, opacity: 0.5 }}>{salaryRange[0]} - {salaryRange[1]}M+</span>
            </div>
            <input type="range" min="0" max="100" value={salaryRange[1]}
              onChange={(e) => setSalaryRange([salaryRange[0], Number(e.target.value)])}
              style={rangeTrackStyle(salaryRange[1], 100)}
              className="cb-range" />
          </div>

          {/* Experience */}
          <div style={fieldGap}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
              <label style={labelStyle}>Experience (Years)</label>
              <span style={{ fontSize: `${11 * ((theme.baseFontSize || 16) / 16)}px`, color: textColor, opacity: 0.5 }}>{expRange[0]} - {expRange[1]}+ years</span>
            </div>
            <input type="range" min="0" max="10" value={expRange[1]}
              onChange={(e) => setExpRange([expRange[0], Number(e.target.value)])}
              style={rangeTrackStyle(expRange[1], 10)}
              className="cb-range" />
          </div>

          {/* Expertise */}
          <div style={fieldGap}>
            <label style={labelStyle}>Expertise</label>
            <ConfigProvider theme={useMemo(() => ({ components: { Select: { borderRadius: borderRadius, activeBorderColor: primaryColor, hoverBorderColor: primaryColor } } }), [borderRadius, primaryColor])}>
              <Select
                mode="multiple"
                showSearch
                allowClear
                style={{ width: '100%' }}
                placeholder="Select expertises..."
                getPopupContainer={(trigger) => trigger.parentNode}
                value={selectedExpertise}
                onChange={(value) => { setSelectedExpertise(value || []); setCurrentPage(1); }}
                options={expertiseOptions.map(e => ({ label: e.name, value: e.name }))}
                filterOption={(input, option) => (option?.label ?? '').toLowerCase().includes(input.toLowerCase())}
              />
            </ConfigProvider>
          </div>

          {/* Domain */}
          <div style={{ marginBottom: 0 }}>
            <label style={labelStyle}>Domain</label>
            <ConfigProvider theme={useMemo(() => ({ components: { Select: { borderRadius: borderRadius, activeBorderColor: primaryColor, hoverBorderColor: primaryColor } } }), [borderRadius, primaryColor])}>
              <Select
                mode="multiple"
                showSearch
                allowClear
                style={{ width: '100%' }}
                placeholder="Select domains..."
                getPopupContainer={(trigger) => trigger.parentNode}
                value={selectedDomain}
                onChange={(value) => { setSelectedDomain(value || []); setCurrentPage(1); }}
                options={domainOptions.map(d => ({ label: d.name, value: d.name }))}
                filterOption={(input, option) => (option?.label ?? '').toLowerCase().includes(input.toLowerCase())}
              />
            </ConfigProvider>
          </div>
        </div>

        {/* ─── Job Listings ────────────────────────────────────────── */}
        <div style={{ flex: 1, minWidth: 0, minHeight: '800px' }}>
          {/* Search bar */}
          <div style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
            <input
              style={{ ...inputStyle, flex: 1, border: '1px solid #e5e7eb' }}
              placeholder="Search by job title..."
              value={searchName}
              onChange={(e) => { setSearchName(e.target.value); setCurrentPage(1); }}
            />
          </div>

          {/* Results count */}
          <div style={{ fontSize: `${13 * ((theme.baseFontSize || 16) / 16)}px`, color: textColor, opacity: 0.5, marginBottom: '14px' }}>
            Showing {paginatedJobs.length} / {filteredJobs.length} positions
          </div>

          {/* Job cards */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {isLoading ? (
              <div style={{ textAlign: 'center', padding: '48px 20px', color: textColor, opacity: 0.4, fontSize: `${14 * ((theme.baseFontSize || 16) / 16)}px` }}>
                Loading job listings...
              </div>
            ) : paginatedJobs.length > 0 ? paginatedJobs.map((job, i) => (
              <div key={job.id || i} style={{
                background: '#FFFFFF',
                borderRadius: `${borderRadius}px`,
                padding: '24px 28px', display: 'flex', alignItems: 'stretch',
                justifyContent: 'space-between', boxShadow: shadowMap[shadow],
                border: '1px solid rgba(0,0,0,0.06)', textAlign: 'left',
                transition: 'box-shadow 0.2s', gap: '20px'
              }}>
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                  {/* Title & Hot Tag */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
                    <div style={{ fontSize: `${16 * ((theme.baseFontSize || 16) / 16)}px`, fontWeight: 700, color: textColor }}>
                      {job.title}
                    </div>
                    {job.isHot && (
                      <span style={{
                        padding: '2px 8px', borderRadius: '4px', fontSize: `${10 * ((theme.baseFontSize || 16) / 16)}px`,
                        fontWeight: 700, background: '#fee2e2', color: '#ef4444', border: '1px solid #fecaca', display: 'inline-flex', alignItems: 'center', gap: '4px'
                      }}>🔥 HOT</span>
                    )}
                  </div>

                  {/* Company Name */}
                  {job.companyName && (
                    <div style={{ fontSize: `${14 * ((theme.baseFontSize || 16) / 16)}px`, color: textColor, opacity: 0.6, marginBottom: '12px', fontWeight: 500 }}>
                      {job.companyName}
                    </div>
                  )}

                  {/* Meta Info */}
                  <div style={{ fontSize: `${13 * ((theme.baseFontSize || 16) / 16)}px`, color: textColor, opacity: 0.5, marginBottom: '16px', display: 'flex', gap: '12px' }}>
                    {job.location && <span>{job.location}</span>}
                    {job.experience && <span>{job.experience}</span>}
                    {job.model && <span>{job.model}</span>}
                    {job.level && <span>{job.level}</span>}
                  </div>

                  {/* Tags */}
                  <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '20px' }}>
                    {job.tags.map(tag => (
                      <span key={tag} style={{
                        padding: '4px 10px', borderRadius: '4px', fontSize: `${12 * ((theme.baseFontSize || 16) / 16)}px`,
                        fontWeight: 500, background: '#fff', color: primaryColor, border: '1px solid #e5e7eb'
                      }}>{tag}</span>
                    ))}
                  </div>

                  {/* Date Posted */}
                  {job.postedDate && (
                    <div style={{ fontSize: `${12 * ((theme.baseFontSize || 16) / 16)}px`, color: textColor, opacity: 0.4, marginTop: 'auto' }}>
                      Posted {job.postedDate}
                    </div>
                  )}
                </div>

                {/* Right Column: Salary & Actions */}
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', justifyContent: 'flex-start', flexShrink: 0, gap: '16px' }}>
                  <div style={{ fontSize: `${14 * ((theme.baseFontSize || 16) / 16)}px`, fontWeight: 700, color: primaryColor, textAlign: 'right' }}>
                    {job.salary}
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', width: '160px' }}>
                    <button style={{
                      ...btnBase, background: '#fff', color: primaryColor, border: `1px solid ${primaryColor}`, width: '100%', padding: '10px 0'
                    }}>View Detail</button>
                    <button style={{
                      ...btnBase, background: primaryColor, color: '#fff', border: 'none', width: '100%', padding: '10px 0', boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                    }}>Apply Now</button>
                  </div>
                </div>
              </div>
            )) : (
              <div style={{
                textAlign: 'center', padding: '48px 20px',
                color: textColor, opacity: 0.4, fontSize: `${14 * ((theme.baseFontSize || 16) / 16)}px`,
              }}>
                No matching positions found.
              </div>
            )}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div style={{
              display: 'flex', justifyContent: 'center', alignItems: 'center',
              gap: '6px', marginTop: '24px',
            }}>
              <button
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                style={{
                  width: 32, height: 32, borderRadius: `${borderRadius}px`,
                  border: '1px solid #e5e7eb', background: '#fff',
                  cursor: currentPage === 1 ? 'default' : 'pointer',
                  opacity: currentPage === 1 ? 0.3 : 1,
                  fontSize: `${14 * ((theme.baseFontSize || 16) / 16)}px`, color: textColor, display: 'flex',
                  alignItems: 'center', justifyContent: 'center',
                }}
              >‹</button>

              {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                <button key={page} onClick={() => setCurrentPage(page)} style={{
                  width: 32, height: 32, borderRadius: `${borderRadius}px`,
                  border: page === currentPage ? 'none' : '1px solid #e5e7eb',
                  background: page === currentPage ? primaryColor : '#fff',
                  color: page === currentPage ? '#fff' : textColor,
                  fontSize: `${13 * ((theme.baseFontSize || 16) / 16)}px`, fontWeight: 600, cursor: 'pointer',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>{page}</button>
              ))}

              <button
                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                style={{
                  width: 32, height: 32, borderRadius: `${borderRadius}px`,
                  border: '1px solid #e5e7eb', background: '#fff',
                  cursor: currentPage === totalPages ? 'default' : 'pointer',
                  opacity: currentPage === totalPages ? 0.3 : 1,
                  fontSize: `${14 * ((theme.baseFontSize || 16) / 16)}px`, color: textColor, display: 'flex',
                  alignItems: 'center', justifyContent: 'center',
                }}
              >›</button>
            </div>
          )}
        </div>
      </div>
      </div>
    </div>
  );
};

export default FeaturedJobsSection;
