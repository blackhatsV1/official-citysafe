/**
 * CitySafe Chart.js Theme Configuration
 * Matches the Navy/Green "Outfit" Theme
 */

(function () {
    if (typeof Chart === 'undefined') return;

    // Theme Variables
    const THEME = {
        fontFamily: "'Outfit', sans-serif",
        color: '#94A3B4', // Muted Slate
        gridColor: 'rgba(255, 255, 255, 0.05)',
        primary: '#38CE3C', // Green
        primaryAlpha: 'rgba(56, 206, 60, 0.7)',
        danger: '#ef4444',
        warning: '#fbbf24',
        success: '#38CE3C'
    };

    // Global Defaults
    Chart.defaults.color = THEME.color;
    Chart.defaults.borderColor = THEME.gridColor;
    Chart.defaults.font.family = THEME.fontFamily;
    Chart.defaults.font.size = 13;

    // Tooltip Defaults
    Chart.defaults.plugins.tooltip.backgroundColor = 'rgba(31, 31, 46, 0.9)'; // Secondary background
    Chart.defaults.plugins.tooltip.titleColor = '#F8FAFC'; // White
    Chart.defaults.plugins.tooltip.bodyColor = '#94A3B4';
    Chart.defaults.plugins.tooltip.borderColor = 'rgba(255, 255, 255, 0.05)';
    Chart.defaults.plugins.tooltip.borderWidth = 1;
    Chart.defaults.plugins.tooltip.padding = 10;
    Chart.defaults.plugins.tooltip.cornerRadius = 8;
    Chart.defaults.plugins.tooltip.titleFont = { family: THEME.fontFamily, size: 14, weight: 'bold' };

    // Legend Defaults
    Chart.defaults.plugins.legend.labels.font = { family: THEME.fontFamily, size: 12 };
    Chart.defaults.plugins.legend.labels.color = '#F8FAFC'; // White for better visibility

    // Scale Defaults (Grid lines)
    Chart.defaults.scale.grid.color = THEME.gridColor;
    Chart.defaults.scale.grid.borderColor = 'transparent';

    console.log("CitySafe Chart Theme Applied");
})();
