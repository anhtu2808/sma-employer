import React, { useState, useCallback, useMemo, useEffect } from 'react';
import { message } from 'antd';
import { useCreateCareerPageMutation, useGetCareerPageManageQuery } from '@/apis/careerPageApi';
import CareerBuilderToolbar from './CareerBuilderToolbar';
import ThemeConfigPanel from './ThemeConfigPanel';
import SectionsPanel from './SectionsPanel';
import CanvasPreview from './CanvasPreview';
import Loading from '@/components/Loading';
import './CareerBuilder.css';

// ── Sample data matching BE schema ──────────────────────────────────────────

const SAMPLE_DATA = {
  slug: 'huhtech-career',
  status: 'DRAFT',

  metaConfig: {
    seoTitle: 'HUHTECH Solutions - Kiến tạo tương lai công nghệ',
    seoDescription: 'Khám phá cơ hội nghề nghiệp và môi trường làm việc sáng tạo tại HUHTECH Solutions.',
    ogImage: '',
    faviconUrl: '',
  },

  headerConfig: {
    logoUrl: '',
    logoHeight: 40,
    sticky: true,
    navLinks: [
      { label: 'Về chúng tôi', targetSectionId: 'about-section', isExternal: false },
      { label: 'Phúc lợi', targetSectionId: 'evp-section', isExternal: false },
      { label: 'Công việc', targetSectionId: 'jobs-section', isExternal: false },
      { label: 'Blog', targetSectionId: 'life-section', isExternal: false },
    ],
    ctaButton: {
      text: 'Xem vị trí trống',
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
        headline: 'Xây dựng sự nghiệp rực rỡ tại HUHTECH',
        subline: 'Nơi những ý tưởng điên rồ trở thành giải pháp toàn cầu.',
        backgroundUrl: '',
        mediaType: 'IMAGE',
        ctaText: 'Khám phá ngay',
        ctaLink: '#jobs-section',
      },
      settings: { paddingTop: 80, paddingBottom: 80, textAlign: 'center' },
    },
    {
      id: 'about-section', type: 'ABOUT', order: 2, isVisible: true,
      props: {
        headline: 'Chúng tôi là ai?',
        description: '<p>HUHTECH là tập đoàn công nghệ dẫn đầu trong lĩnh vực AI và Cloud Computing. Với hơn 10 năm hình thành và phát triển...</p>',
        imageUrl: '',
      },
      settings: { backgroundColorOverride: '#F8F9FA' },
    },
    {
      id: 'evp-section', type: 'EVP', order: 3, isVisible: true,
      props: {
        headline: 'Tại sao bạn nên gia nhập HUHTECH?',
        items: [
          { title: 'Lương thưởng cạnh tranh', desc: 'Lương tháng 13 + thưởng hiệu quả dự án định kỳ.', icon: 'dollar-sign' },
          { title: 'Môi trường Hybrid', desc: 'Làm việc linh hoạt 2 ngày tại nhà mỗi tuần.', icon: 'home' },
          { title: 'Lộ trình thăng tiến', desc: 'Review lương 2 lần/năm với lộ trình rõ ràng.', icon: 'trending-up' },
        ],
      },
    },
    {
      id: 'awards-004', type: 'AWARDS', order: 4, isVisible: true,
      props: {
        headline: 'Giải thưởng danh giá',
        items: [
          { name: 'Best IT Company 2025', imgUrl: '', year: '2025' },
          { name: 'Top 10 AI Startups', imgUrl: '', year: '2024' },
        ],
      },
    },
    {
      id: 'jobs-section', type: 'JOBS', order: 5, isVisible: true,
      props: { headline: 'Các vị trí đang tuyển dụng', limit: 6, showFilter: true },
    },
    {
      id: 'life-section', type: 'LIFE_AT_CO', order: 6, isVisible: true,
      props: {
        headline: 'Đời sống tại HUHTECH',
        news: [
          { title: 'Team Building 2025 tại Phú Quốc', thumbnailUrl: '', date: '15/03/2026' },
          { title: 'Workshop: Tương lai của Generative AI', thumbnailUrl: '', date: '10/03/2026' },
        ],
      },
    },
    {
      id: 'gallery-007', type: 'GALLERY', order: 7, isVisible: true,
      props: {
        headline: 'Hình ảnh văn phòng',
        images: [],
      },
    },
    {
      id: 'process-008', type: 'PROCESS', order: 8, isVisible: true,
      props: {
        headline: 'Quy trình ứng tuyển',
        steps: [
          { title: 'Nộp đơn', desc: 'Gửi CV qua nút ứng tuyển trên trang.' },
          { title: 'Phỏng vấn', desc: 'Trò chuyện cùng HR và Team kỹ thuật.' },
          { title: 'Nhận Offer', desc: 'Chào mừng bạn về với đội của chúng tôi!' },
        ],
      },
    },
    {
      id: 'faq-009', type: 'FAQ', order: 9, isVisible: true,
      props: {
        headline: 'Câu hỏi thường gặp',
        items: [
          { question: 'Công ty có hỗ trợ thực tập sinh không?', answer: 'Có, chúng tôi luôn chào đón các bạn sinh viên tài năng.' },
          { question: 'Thời gian làm việc như thế nào?', answer: 'Từ thứ 2 đến thứ 6, 8:30 - 17:30.' },
        ],
      },
    },
    {
      id: 'cta-footer-010', type: 'CTA_FOOTER', order: 10, isVisible: true,
      props: {
        headline: 'Sẵn sàng bứt phá sự nghiệp?',
        ctaText: 'Ứng tuyển ngay',
        ctaLink: '#jobs-section',
      },
    },
  ],

  footerConfig: {
    companyName: 'Công ty Cổ phần Công nghệ HUHTECH Solutions',
    address: 'Tòa nhà HUHTECH, 123 Đường Số 1, Quận 1, TP. HCM',
    contact: { email: 'careers@huhtech.com', phone: '028 1234 5678', addresses: [] },
    socialLinks: [
      { platform: 'LinkedIn', url: '#' },
      { platform: 'Facebook', url: '#' },
    ],
    copyrightText: '© 2026 HUHTECH Solutions. All rights reserved.',
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

  const [createCareerPage, { isLoading: isSaving }] = useCreateCareerPageMutation();

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
      message.success('Career page saved as draft!');
    } catch (err) {
      console.error('Save draft failed:', err);
      message.error(err?.message || 'Failed to save draft. Please try again.');
    }
  }, [buildPayload, createCareerPage]);

  /** Publish */
  const handlePublish = useCallback(async () => {
    try {
      const payload = buildPayload('PUBLISHED');
      await createCareerPage(payload).unwrap();
      setStatus('published');
      message.success('Career page published successfully!');
    } catch (err) {
      console.error('Publish failed:', err);
      message.error(err?.message || 'Failed to publish. Please try again.');
    }
  }, [buildPayload, createCareerPage]);

  /** Archive */
  const handleArchive = useCallback(async () => {
    try {
      const payload = buildPayload('ARCHIVED');
      await createCareerPage(payload).unwrap();
      setStatus('archived');
      message.success('Career page archived.');
    } catch (err) {
      console.error('Archive failed:', err);
      message.error(err?.message || 'Failed to archive. Please try again.');
    }
  }, [buildPayload, createCareerPage]);

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
        onArchive={handleArchive}
        isSaving={isSaving}
      />

      <div className="cb-body">
        <ThemeConfigPanel
          theme={theme}
          onThemeChange={setTheme}
        />

        <CanvasPreview
          theme={theme}
          layoutConfig={layoutConfig}
          headerConfig={headerConfig}
          footerConfig={footerConfig}
          activeSection={activeSection}
          onSelectSection={handleSelectSection}
        />

        <SectionsPanel
          sections={allSections}
          onSectionsChange={handleSectionsChange}
          onUpdateSection={handleUpdateSection}
          activeSection={activeSection}
          onSelectSection={handleSelectSection}
        />
      </div>
    </div>
  );
};

export default CareerPageBuilder;
