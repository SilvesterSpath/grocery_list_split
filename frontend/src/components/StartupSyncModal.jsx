import { styles } from '../styles/groceryAppStyles.js';

export function StartupSyncModal() {
  return (
    <div
      style={styles.startupSyncOverlay}
      role='dialog'
      aria-modal='true'
      aria-labelledby='kamra-startup-sync-title'
      aria-busy='true'
    >
      <div style={styles.startupSyncModal}>
        <div style={styles.startupSyncFallback} aria-hidden='true'>
          🥕🥕🥕
        </div>
        <div
          id='kamra-startup-sync-title'
          style={styles.startupSyncText}
          aria-live='polite'
        >
          Listák szinkronizálása…
        </div>
      </div>
    </div>
  );
}
