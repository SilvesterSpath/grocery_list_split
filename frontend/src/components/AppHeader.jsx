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
    </header>
  );
}
