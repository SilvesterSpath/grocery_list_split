import { styles } from '../styles/groceryAppStyles.js';

export function AppHeader({
  theme,
  onToggleTheme,
  boughtCount,
  itemCount,
}) {
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
          {boughtCount > 0 && (
            <span
              style={{
                ...styles.badge,
                ...(itemCount > 0 ? styles.badgeActiveList : {}),
              }}
            >
              {boughtCount} a kosárban
            </span>
          )}
          {itemCount > 0 && (
            <span style={styles.totalBadge}>{itemCount} tétel</span>
          )}
          <button
            className='kamra-theme-btn'
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
        </div>
      </div>
    </header>
  );
}
