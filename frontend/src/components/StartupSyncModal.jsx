import { useState } from 'react';
import { styles } from '../styles/groceryAppStyles.js';

const STARTUP_SYNC_GIF_SRC = '/jumping-carrots.gif';

export function StartupSyncModal() {
  const [gifLoadFailed, setGifLoadFailed] = useState(false);

  return (
    <div
      style={styles.startupSyncOverlay}
      role='dialog'
      aria-modal='true'
      aria-labelledby='kamra-startup-sync-title'
      aria-busy='true'
    >
      <div style={styles.startupSyncModal}>
        {gifLoadFailed ? (
          <div style={styles.startupSyncFallback} aria-hidden='true'>
            🥕🥕🥕
          </div>
        ) : (
          <img
            src={STARTUP_SYNC_GIF_SRC}
            alt='Betöltés: lista szinkronizálása'
            style={styles.startupSyncGif}
            onError={() => setGifLoadFailed(true)}
          />
        )}
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
