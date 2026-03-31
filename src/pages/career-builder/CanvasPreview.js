import React, { useRef, useEffect } from 'react';
import HeaderSection from './sections/HeaderSection';
import HeroSection from './sections/HeroSection';
import AboutSection from './sections/AboutSection';
import EVPSection from './sections/EVPSection';
import FeaturedJobsSection from './sections/FeaturedJobsSection';
import AwardsSection from './sections/AwardsSection';
import LifeAtCompanySection from './sections/LifeAtCompanySection';
import GallerySection from './sections/GallerySection';
import ProcessSection from './sections/ProcessSection';
import FAQSection from './sections/FAQSection';
import CTAFooterSection from './sections/CTASection';
import FooterSection from './sections/FooterSection';

const SECTION_COMPONENTS = {
  HERO: HeroSection,
  ABOUT: AboutSection,
  EVP: EVPSection,
  JOBS: FeaturedJobsSection,
  AWARDS: AwardsSection,
  LIFE_AT_CO: LifeAtCompanySection,
  GALLERY: GallerySection,
  PROCESS: ProcessSection,
  FAQ: FAQSection,
  CTA_FOOTER: CTAFooterSection,
};


const CanvasPreview = ({
  theme,
  layoutConfig,
  headerConfig,
  footerConfig,
  activeSection,
  onSelectSection,
}) => {
  const sectionRefs = useRef({});

  useEffect(() => {
    if (activeSection && sectionRefs.current[activeSection]) {
      sectionRefs.current[activeSection].scrollIntoView({
        behavior: 'smooth',
        block: 'center',
      });
    }
  }, [activeSection]);

  const visibleSections = layoutConfig.filter((s) => s.isVisible);

  // Check if header/footer are toggled on — they're not in layoutConfig, handle separately
  const showHeader = headerConfig._visible !== false;
  const showFooter = footerConfig._visible !== false;

  // Calculate global padding from spacing theme
  const getSpacingValue = (spacing) => {
    switch(spacing) {
      case 'compact': return 40;
      case 'spacious': return 96;
      case 'normal':
      default: return 64;
    }
  };
  const spacingPad = getSpacingValue(theme.spacing);

  return (
    <div className="cb-canvas-container">
      <div
        className="cb-canvas"
        style={{
          width: '100%',
          maxWidth: '100%',
          fontFamily: `'${theme.bodyFont || theme.fontFamily || 'Inter'}', sans-serif`,
          fontSize: `${theme.baseFontSize}px`,
          transition: 'width 0.3s ease',
        }}
      >
        {/* Header */}
        {showHeader && (
          <div
            ref={(el) => (sectionRefs.current['header'] = el)}
            className={`cb-canvas-section${activeSection === 'header' ? ' active' : ''}`}
            onClick={() => onSelectSection('header')}
          >
            <HeaderSection theme={theme} headerConfig={headerConfig} />
            {activeSection === 'header' && <div className="cb-canvas-section-label">Header</div>}
          </div>
        )}

        {/* Layout sections */}
        {visibleSections.map((section) => {
          const Component = SECTION_COMPONENTS[section.type];
          if (!Component) return null;

          const isActive = activeSection === section.id;

          // Let theme.spacing control the padding, unless explicit layout settings exist 
          // (we override specific padding with theme spacing so it has a visible effect)
          const effectiveSettings = {
            ...section.settings,
            paddingTop: spacingPad,
            paddingBottom: spacingPad,
          };

          return (
            <div
              key={section.id}
              ref={(el) => (sectionRefs.current[section.id] = el)}
              className={`cb-canvas-section${isActive ? ' active' : ''}`}
              onClick={() => onSelectSection(section.id)}
            >
              <Component
                theme={theme}
                sectionProps={section.props || {}}
                settings={effectiveSettings}
              />
              {isActive && (
                <div className="cb-canvas-section-label">
                  {section.type}
                </div>
              )}
            </div>
          );
        })}

        {/* Footer */}
        {showFooter && (
          <div
            ref={(el) => (sectionRefs.current['footer'] = el)}
            className={`cb-canvas-section${activeSection === 'footer' ? ' active' : ''}`}
            onClick={() => onSelectSection('footer')}
          >
            <FooterSection theme={theme} footerConfig={footerConfig} />
            {activeSection === 'footer' && <div className="cb-canvas-section-label">Footer</div>}
          </div>
        )}

        {visibleSections.length === 0 && !showHeader && !showFooter && (
          <div className="cb-canvas-empty">
            <span style={{ fontSize: '48px', marginBottom: '16px' }}>📄</span>
            <p>No sections visible. Toggle sections on from the right panel.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default CanvasPreview;
