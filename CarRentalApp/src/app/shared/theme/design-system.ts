export const DESIGN_SYSTEM = {
  layout: {
    container: ['container', 'mx-auto', 'px-4', 'lg:px-8'],
    grid: ['grid', 'grid-nogutter'],
    flexCenter: ['flex', 'align-items-center', 'justify-content-center'],
    flexBetween: ['flex', 'justify-content-between', 'align-items-center'],
    section: ['py-8', 'px-4'],
  },
  typography: {
    heroTitle: ['text-5xl', 'md:text-7xl', 'font-black', 'mb-2'],
    heroSubtitle: ['text-xl', 'text-secondary', 'mb-6'],
    sectionHeading: ['text-4xl', 'font-black', 'mb-3'],
    sectionSubheading: ['text-secondary', 'text-xl', 'mb-8'],
    label: ['text-xs', 'font-bold', 'text-primary', 'tracking-widest', 'uppercase'],
    paragraph: ['text-secondary', 'line-height-3'],
  },
  ui: {
    glassPanel: ['glass-panel', 'border-round-xl', 'transition-all'],
    hoverGlow: ['hover-glow', 'cursor-pointer'],
    card: ['p-card', 'h-full', 'glass-panel', 'hover-glow', 'transition-all'],
    iconBox: [
      'icon-box',
      'mb-4',
      'flex',
      'align-items-center',
      'justify-content-center',
      'w-4rem',
      'h-4rem',
      'border-round-circle',
    ],
    gradientText: ['text-gradient', 'font-bold'],
  },
};
