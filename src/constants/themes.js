export const THEMES = {
  LIGHT: 'light',
  DARK: 'dark',
  PASTEL: 'pastel'
};

export const THEME_CONFIG = {
  [THEMES.LIGHT]: {
    name: 'Professional Light',
    colors: {
      // Primary brand colors (teal/cyan from screenshot)
      primary: '#0891B2',
      primaryHover: '#0E7490',
      primaryRgb: '8, 145, 178',
      accent: '#06B6D4',
      accentRgb: '6, 182, 212',

      // Background colors (clean whites and very light grays)
      background: 'linear-gradient(135deg, #FFFFFF 0%, #F8FAFC 100%)',
      backgroundSecondary: '#F1F5F9',
      surface: '#FFFFFF',
      surfaceElevated: '#FFFFFF',

      // Text colors (modern gray hierarchy)
      textPrimary: '#0F172A',
      textSecondary: '#475569',
      textMuted: '#94A3B8',

      // Border and interactive (subtle and clean)
      border: '#E2E8F0',
      borderHover: '#CBD5E1',

      // Status colors (modern and accessible)
      success: '#059669',
      warning: '#D97706',
      error: '#DC2626',
      info: '#0891B2',

      // Clean shadows (very subtle)
      shadowSm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
      shadowMd: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
      shadowLg: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
      shadowXl: '0 20px 25px -5px rgba(0, 0, 0, 0.1)',
      shadow2xl: '0 25px 50px -12px rgba(0, 0, 0, 0.25)'
    }
  },

  [THEMES.DARK]: {
    name: 'Formal Dark',
    colors: {
      // Primary brand colors - Subtle orange with gradients
      primary: '#ff6b35',
      primaryHover: '#e55a2b',
      primaryRgb: '255, 107, 53',
      accent: '#9b59b6',
      accentRgb: '155, 89, 182',

      // Background colors - Black and dark grays
      background: '#000000',
      backgroundSecondary: '#0d0d0d',
      surface: 'rgba(26, 26, 26, 0.95)',
      surfaceElevated: 'rgba(45, 45, 45, 0.95)',

      // Text colors - Clean whites and grays
      textPrimary: '#f8fafc',
      textSecondary: '#cbd5e1',
      textMuted: '#94a3b8',

      // Border and interactive
      border: 'rgba(71, 85, 105, 0.4)',
      borderHover: 'rgba(255, 107, 53, 0.3)',

      // Status colors
      success: '#10b981',
      warning: '#f59e0b',
      error: '#ef4444',
      info: '#60a5fa',

      // Shadows
      shadowSm: '0 1px 2px 0 rgba(0, 0, 0, 0.3)',
      shadowMd: '0 4px 6px -1px rgba(0, 0, 0, 0.4)',
      shadowLg: '0 10px 15px -3px rgba(0, 0, 0, 0.5)',
      shadowXl: '0 20px 25px -5px rgba(0, 0, 0, 0.6)',
      shadow2xl: '0 25px 50px -12px rgba(0, 0, 0, 0.7)'
    }
  },

  [THEMES.PASTEL]: {
    name: 'Fun Pastel',
    colors: {
      // Primary brand colors (soft purple/violet palette)
      primary: '#8B5FBF',
      primaryHover: '#7A4FB8',
      primaryRgb: '139, 95, 191',
      accent: '#A855F7',
      accentRgb: '168, 85, 247',

      // Background colors (soft purple gradient like screenshot)
      background: 'radial-gradient(ellipse at top, #E5D4FF 0%, #F3E8FF 20%, #DDD6FE 40%, #C4B5FD 80%, #A78BFA 100%)',
      backgroundSecondary: 'linear-gradient(135deg, #F3E8FF 0%, #E5D4FF 50%, #DDD6FE 100%)',
      surface: 'rgba(255, 255, 255, 0.85)',
      surfaceElevated: 'rgba(255, 255, 255, 0.95)',

      // Text colors (darker for better contrast on light backgrounds)
      textPrimary: '#374151',
      textSecondary: '#6B7280',
      textMuted: '#9CA3AF',

      // Border and interactive (soft purple tones)
      border: 'rgba(139, 95, 191, 0.2)',
      borderHover: 'rgba(139, 95, 191, 0.3)',

      // Status colors (soft but visible)
      success: '#10B981',
      warning: '#F59E0B',
      error: '#EF4444',
      info: '#3B82F6',

      // Glassmorphism shadows (soft purple tints)
      shadowSm: '0 2px 8px 0 rgba(139, 95, 191, 0.1)',
      shadowMd: '0 4px 12px -2px rgba(139, 95, 191, 0.15)',
      shadowLg: '0 10px 20px -4px rgba(139, 95, 191, 0.2)',
      shadowXl: '0 20px 30px -8px rgba(139, 95, 191, 0.25)',
      shadow2xl: '0 25px 40px -12px rgba(139, 95, 191, 0.3)'
    }
  }
};

export const DEFAULT_THEME = THEMES.DARK; 