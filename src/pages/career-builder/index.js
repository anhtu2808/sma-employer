import React, { useState, useCallback, useMemo, useEffect } from 'react';
import toastMessage from '@/utils/toastMessage';
import { useCreateCareerPageMutation, useGetCareerPageManageQuery, useArchiveCareerPageMutation } from '@/apis/careerPageApi';
import CareerBuilderToolbar from './CareerBuilderToolbar';
import ThemeConfigPanel from './ThemeConfigPanel';
import SectionsPanel from './SectionsPanel';
import CanvasPreview from './CanvasPreview';
import Loading from '@/components/Loading';
import './CareerBuilder.css';

// ── Sample data matching BE schema ──────────────────────────────────────────

const SAMPLE_DATA = {
  slug: 'smartrecruit-career',
  status: 'DRAFT',

  metaConfig: {
    seoTitle: 'SmartRecruit Solutions - Building the Future of Technology',
    seoDescription: 'Discover career opportunities and a creative work environment at SmartRecruit Solutions.',
    ogImage: '',
    faviconUrl: '',
  },

  headerConfig: {
    logoUrl: '',
    logoHeight: 40,
    sticky: true,
    navLinks: [
      { label: 'About Us', targetSectionId: 'about-section', isExternal: false },
      { label: 'Benefits', targetSectionId: 'evp-section', isExternal: false },
      { label: 'Careers', targetSectionId: 'jobs-section', isExternal: false },
      { label: 'Blog', targetSectionId: 'life-section', isExternal: false },
    ],
    ctaButton: {
      text: 'View Open Positions',
      link: '#jobs-section',
      isVisible: true,
    },
  },

  themeConfig: {
    colors: { primary: '#FF6B35', secondary: '#E6F0FF', background: '#FFFFFF', text: '#1D1D1F' },
    typography: { fontFamily: 'Inter', baseFontSize: 16 },
    styling: { borderRadius: 12, buttonStyle: 'shadow' },
  },

  layoutConfig: [
    {
      id: 'hero-001', type: 'HERO', order: 1, isVisible: true,
      props: {
        headline: 'Build a Brilliant Career at SmartRecruit',
        subline: 'Where bold ideas become global solutions.',
        backgroundUrl: '',
        mediaType: 'IMAGE',
        ctaText: 'Explore Now',
        ctaLink: '#jobs-section',
      },
      settings: { paddingTop: 80, paddingBottom: 80, textAlign: 'center' },
    },
    {
      id: 'about-section', type: 'ABOUT', order: 2, isVisible: true,
      props: {
        headline: 'Who We Are',
        description: 'SmartRecruit is a leading technology company specializing in AI and Cloud Computing. With over 10 years of growth and innovation...',
        imageUrl: '',
      },
      settings: { backgroundColorOverride: '#F8F9FA' },
    },
    {
      id: 'evp-section', type: 'EVP', order: 3, isVisible: true,
      props: {
        headline: 'Why Join SmartRecruit?',
        items: [
          { title: 'Competitive Compensation', desc: '13th-month salary plus periodic project performance bonuses.', icon: 'dollar-sign' },
          { title: 'Hybrid Work Environment', desc: 'Flexible work-from-home 2 days per week.', icon: 'home' },
          { title: 'Career Growth Path', desc: 'Salary reviews twice a year with a clear progression roadmap.', icon: 'trending-up' },
        ],
      },
    },
    {
      id: 'awards-004', type: 'AWARDS', order: 4, isVisible: true,
      props: {
        headline: 'Prestigious Awards',
        items: [
          { name: 'Best IT Company 2025', imgUrl: '', year: '2025' },
          { name: 'Top 10 AI Startups', imgUrl: '', year: '2024' },
        ],
      },
    },
    {
      id: 'jobs-section', type: 'JOBS', order: 5, isVisible: true,
      props: { headline: 'Open Positions', limit: 6, showFilter: true },
    },
    {
      id: 'life-section', type: 'LIFE_AT_CO', order: 6, isVisible: true,
      props: {
        headline: 'Life at SmartRecruit',
        news: [
          { title: 'Team Building 2025 in Phu Quoc', thumbnailUrl: '', date: '03/15/2026' },
          { title: 'Workshop: The Future of Generative AI', thumbnailUrl: '', date: '03/10/2026' },
        ],
        navLink: { text: 'Explore more', url: '#', isVisible: true },
      },
    },
    {
      id: 'gallery-007', type: 'GALLERY', order: 7, isVisible: true,
      props: {
        headline: 'Office Gallery',
        images: [],
      },
    },
    {
      id: 'process-008', type: 'PROCESS', order: 8, isVisible: true,
      props: {
        headline: 'Hiring Process',
        steps: [
          { title: 'Apply', desc: 'Submit your CV via the apply button on the page.' },
          { title: 'Interview', desc: 'Chat with our HR team and technical leads.' },
          { title: 'Get Offer', desc: 'Welcome aboard — join our team!' },
        ],
      },
    },
    {
      id: 'faq-009', type: 'FAQ', order: 9, isVisible: true,
      props: {
        headline: 'Frequently Asked Questions',
        items: [
          { question: 'Do you offer internship programs?', answer: 'Yes, we always welcome talented students to join our team.' },
          { question: 'What are the working hours?', answer: 'Monday to Friday, 8:30 AM - 5:30 PM.' },
        ],
      },
    },
    {
      id: 'cta-footer-010', type: 'CTA_FOOTER', order: 10, isVisible: true,
      props: {
        headline: 'Ready to Accelerate Your Career?',
        ctaText: 'Apply Now',
        ctaLink: '#jobs-section',
      },
    },
  ],

  footerConfig: {
    companyName: 'SmartRecruit Solutions Inc.',
    address: 'SmartRecruit Tower, 123 Main Street, District 1, HCMC',
    contact: { email: 'careers@smartrecruit.com', phone: '028 1234 5678', addresses: [] },
    socialLinks: [
      { icon: 'linkedin', url: '#' },
      { icon: 'facebook', url: '#' },
    ],
    copyrightText: '© 2026 SmartRecruit Solutions. All rights reserved.',
  },
};

// ── Helpers ──────────────────────────────────────────────────────────────────

/** Flatten themeConfig from BE structure into a single flat object for easy binding */
const flattenTheme = (tc) => ({
  primaryColor: tc?.colors?.primary || '#FF6B35',
  secondaryColor: tc?.colors?.secondary || '#E6F0FF',
  backgroundColor: tc?.colors?.background || '#FFFFFF',
  textColor: tc?.colors?.text || '#1D1D1F',
  fontFamily: tc?.typography?.fontFamily || 'Inter',
  baseFontSize: tc?.typography?.baseFontSize || 16,
  borderRadius: tc?.styling?.borderRadius || 12,
  buttonStyle: tc?.styling?.buttonStyle || 'shadow',
  shadow: 'subtle',
  spacing: 'normal',
});

/** Unflatten theme back to BE structure for saving */
const unflattenTheme = (flat) => ({
  colors: {
    primary: flat.primaryColor,
    secondary: flat.secondaryColor,
    background: flat.backgroundColor,
    text: flat.textColor,
  },
  typography: {
    fontFamily: flat.fontFamily,
    baseFontSize: flat.baseFontSize,
  },
  styling: {
    borderRadius: flat.borderRadius,
    buttonStyle: flat.buttonStyle,
  },
});

// ── Component ────────────────────────────────────────────────────────────────

const CareerPageBuilder = () => {
  const { data: careerPageResponse, isLoading: isLoadingPage } = useGetCareerPageManageQuery();

  const [slug, setSlug] = useState(SAMPLE_DATA.slug || '');
  const [theme, setTheme] = useState(() => flattenTheme(SAMPLE_DATA.themeConfig));
  const [headerConfig, setHeaderConfig] = useState(SAMPLE_DATA.headerConfig);
  const [footerConfig, setFooterConfig] = useState(SAMPLE_DATA.footerConfig);
  const [layoutConfig, setLayoutConfig] = useState(SAMPLE_DATA.layoutConfig);
  const [metaConfig, setMetaConfig] = useState(SAMPLE_DATA.metaConfig);
  const [activeSection, setActiveSection] = useState(null);
  const [status, setStatus] = useState(SAMPLE_DATA.status.toLowerCase());
  const [dataLoaded, setDataLoaded] = useState(false);
  const [isPreviewMode, setIsPreviewMode] = useState(false);

  const [createCareerPage, { isLoading: isSaving }] = useCreateCareerPageMutation();
  const [archiveCareerPageApi, { isLoading: isArchiving }] = useArchiveCareerPageMutation();

  // Populate state from API response when data arrives
  useEffect(() => {
    const pageData = careerPageResponse?.data;
    if (pageData && !dataLoaded) {
      if (pageData.slug) setSlug(pageData.slug);
      if (pageData.status) setStatus(pageData.status.toLowerCase());
      if (pageData.metaConfig) setMetaConfig(pageData.metaConfig);
      if (pageData.headerConfig) setHeaderConfig(pageData.headerConfig);
      if (pageData.footerConfig) setFooterConfig(pageData.footerConfig);
      if (pageData.themeConfig) setTheme(flattenTheme(pageData.themeConfig));
      if (pageData.layoutConfig && Array.isArray(pageData.layoutConfig) && pageData.layoutConfig.length > 0) {
        setLayoutConfig(pageData.layoutConfig);
      }
      setDataLoaded(true);
    }
  }, [careerPageResponse, dataLoaded]);

  const handleSelectSection = useCallback((id) => {
    setActiveSection((prev) => (prev === id ? null : id));
  }, []);

  // Build a unified section list for the right panel (header + layout + footer)
  const allSections = useMemo(() => [
    { id: 'header', type: 'header', isVisible: headerConfig._visible !== false, config: headerConfig },
    ...layoutConfig.map((s) => ({ id: s.id, type: s.type, isVisible: s.isVisible, props: s.props, settings: s.settings })),
    { id: 'footer', type: 'footer', isVisible: footerConfig._visible !== false, config: footerConfig },
  ], [headerConfig, layoutConfig, footerConfig]);

  const handleSectionsChange = useCallback((updated) => {
    // Extract header/footer visibility and update layoutConfig order
    const headerEntry = updated.find((s) => s.id === 'header');
    const footerEntry = updated.find((s) => s.id === 'footer');
    const layoutEntries = updated.filter((s) => s.id !== 'header' && s.id !== 'footer');

    if (headerEntry) {
      setHeaderConfig((prev) => ({ ...prev, _visible: headerEntry.isVisible }));
    }
    if (footerEntry) {
      setFooterConfig((prev) => ({ ...prev, _visible: footerEntry.isVisible }));
    }

    setLayoutConfig((prev) =>
      layoutEntries.map((entry, i) => {
        const original = prev.find((s) => s.id === entry.id);
        return { ...original, isVisible: entry.isVisible, order: i + 1 };
      })
    );
  }, []);

  const handleUpdateSection = useCallback((id, key, value) => {
    if (id === 'header') {
      setHeaderConfig((prev) => ({ ...prev, [key]: value }));
    } else if (id === 'footer') {
      setFooterConfig((prev) => ({ ...prev, [key]: value }));
    } else {
      setLayoutConfig((prev) =>
        prev.map((s) => {
          if (s.id === id) {
            return { ...s, [key]: value };
          }
          return s;
        })
      );
    }
  }, []);

  /** Build the request body matching the BE schema */
  const buildPayload = useCallback((targetStatus) => {
    // Strip internal _visible flag from header/footer before sending
    const { _visible: _hv, ...cleanHeader } = headerConfig;
    const { _visible: _fv, ...cleanFooter } = footerConfig;

    return {
      slug: slug,
      status: targetStatus,
      metaConfig: metaConfig,
      headerConfig: cleanHeader,
      themeConfig: unflattenTheme(theme),
      layoutConfig: layoutConfig.map((section) => ({
        id: section.id,
        type: section.type,
        order: section.order,
        isVisible: section.isVisible,
        props: section.props,
        ...(section.settings ? { settings: section.settings } : {}),
      })),
      footerConfig: cleanFooter,
    };
  }, [slug, metaConfig, headerConfig, footerConfig, theme, layoutConfig]);

  /** Save as Draft */
  const handleSaveDraft = useCallback(async () => {
    try {
      const payload = buildPayload('DRAFT');
      await createCareerPage(payload).unwrap();
      setStatus('draft');
      toastMessage.success('Career page saved as draft!');
    } catch (err) {
      console.error('Save draft failed:', err);
      toastMessage.error(err?.message || 'Failed to save draft. Please try again.');
    }
  }, [buildPayload, createCareerPage]);

  /** Publish */
  const handlePublish = useCallback(async () => {
    try {
      const payload = buildPayload('PUBLISHED');
      await createCareerPage(payload).unwrap();
      setStatus('published');
      toastMessage.success(status === 'archived' ? 'Career page unarchived successfully!' : 'Career page published successfully!');
    } catch (err) {
      console.error('Publish (Unarchive) failed:', err);
      toastMessage.error(err?.message || 'Failed to publish/unarchive. Please try again.');
    }
  }, [buildPayload, createCareerPage, status]);

  /** Archive */
  const handleArchive = useCallback(async () => {
    // Only confirm if not already archived
    if (status === 'archived') return;
    
    if (!window.confirm('Are you sure you want to archive this career page? It will no longer be visible to candidates.')) {
      return;
    }
    
    try {
      await archiveCareerPageApi().unwrap();
      setStatus('archived');
      toastMessage.success('Career page archived successfully!');
    } catch (err) {
      console.error('Archive failed:', err);
      toastMessage.error(err?.message || 'Failed to archive. Please try again.');
    }
  }, [archiveCareerPageApi, status]);

  if (isLoadingPage && !dataLoaded) {
    return (
      <div className="cb-root" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh' }}>
        <Loading className="py-20" />
      </div>
    );
  }

  return (
    <div className="cb-root">
      <CareerBuilderToolbar
        slug={slug}
        onSlugChange={setSlug}
        status={status}
        onSaveDraft={handleSaveDraft}
        onPublish={handlePublish}
        isSaving={isSaving}
        isArchiving={isArchiving}
        isPreviewMode={isPreviewMode}
        onPreviewToggle={() => setIsPreviewMode(!isPreviewMode)}
        onArchive={handleArchive}
      />

      <div className="cb-body">
        {!isPreviewMode && (
          <ThemeConfigPanel
            theme={theme}
            onThemeChange={setTheme}
          />
        )}

        <CanvasPreview
          theme={theme}
          layoutConfig={layoutConfig}
          headerConfig={headerConfig}
          footerConfig={footerConfig}
          activeSection={activeSection}
          onSelectSection={handleSelectSection}
        />

        {!isPreviewMode && (
          <SectionsPanel
            sections={allSections}
            onSectionsChange={handleSectionsChange}
            onUpdateSection={handleUpdateSection}
            activeSection={activeSection}
            onSelectSection={handleSelectSection}
          />
        )}
      </div>
    </div>
  );
};

export default CareerPageBuilder;
