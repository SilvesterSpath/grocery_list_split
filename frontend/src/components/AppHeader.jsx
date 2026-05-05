import { useRef } from 'react';
import { styles } from '../styles/groceryAppStyles.js';

export function AppHeader({
  theme,
  onToggleTheme,
  boughtCount,
  itemCount,
  activeTab,
  onTabChange,
}) {
  const listTabRef = useRef(null);
  const presetsTabRef = useRef(null);

  const focusTab = (tab) => {
    queueMicrotask(() => {
      (tab === 'list' ? listTabRef : presetsTabRef).current?.focus();
    });
  };

  const handleTabListKeyDown = (e) => {
    if (e.key === 'ArrowRight' && activeTab === 'list') {
      e.preventDefault();
      onTabChange('presets');
      focusTab('presets');
    } else if (e.key === 'ArrowLeft' && activeTab === 'presets') {
      e.preventDefault();
      onTabChange('list');
      focusTab('list');
    } else if (e.key === 'Home') {
      e.preventDefault();
      onTabChange('list');
      focusTab('list');
    } else if (e.key === 'End') {
      e.preventDefault();
      onTabChange('presets');
      focusTab('presets');
    }
  };

  return (
    <header style={styles.header}>
      <div style={styles.headerInner}>
        <div style={styles.logo}>
          <span style={styles.logoIcon} aria-hidden='true'>
            🛒
          </span>
          <span style={styles.logoText}>Kamra</span>
        </div>
        <div style={styles.headerStats}>
          <button
            type='button'
            style={styles.themeBtn}
            onClick={onToggleTheme}
            aria-label={`Váltás ${theme === 'dark' ? 'világos' : 'sötét'} módra`}
            title={`Váltás ${theme === 'dark' ? 'világos' : 'sötét'} módra`}
          >
            <span aria-hidden='true' style={styles.themeIcon}>
              {theme === 'dark' ? '☀︎' : '☾'}
            </span>
          </button>
          {boughtCount > 0 && (
            <span style={styles.badge}>{boughtCount} a kosárban</span>
          )}
          <span style={styles.totalBadge}>{itemCount} tétel</span>
        </div>
      </div>

      <div
        role='tablist'
        aria-label='Nézet váltása'
        style={styles.tabs}
        onKeyDown={handleTabListKeyDown}
      >
        <button
          ref={listTabRef}
          type='button'
          role='tab'
          id='kamra-tab-list'
          aria-selected={activeTab === 'list'}
          tabIndex={activeTab === 'list' ? 0 : -1}
          style={{
            ...styles.tab,
            ...(activeTab === 'list' ? styles.tabActive : {}),
          }}
          onClick={() => onTabChange('list')}
        >
          Listám
        </button>
        <button
          ref={presetsTabRef}
          type='button'
          role='tab'
          id='kamra-tab-presets'
          aria-selected={activeTab === 'presets'}
          tabIndex={activeTab === 'presets' ? 0 : -1}
          style={{
            ...styles.tab,
            ...(activeTab === 'presets' ? styles.tabActive : {}),
          }}
          onClick={() => onTabChange('presets')}
        >
          Mentett listák
        </button>
      </div>
    </header>
  );
}
