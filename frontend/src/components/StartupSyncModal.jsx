import { useState } from 'react';
import { styles } from '../styles/groceryAppStyles.js';

const STARTUP_SYNC_GIF_SRC = '/jumping-carrots.gif';

export function StartupSyncModal() {
  const [gifLoadFailed, setGifLoadFailed] = useState(false);

  return (
    <div style={styles.startupSyncOverlay} role='dialog' aria-modal='true'>
      <div style={styles.startupSyncModal}>
        {gifLoadFailed ? (
          <div style={styles.startupSyncFallback}>🥕🥕🥕</div>
        ) : (
          <img
            src={STARTUP_SYNC_GIF_SRC}
            alt='Sync animation'
            style={styles.startupSyncGif}
            onError={() => setGifLoadFailed(true)}
          />
        )}
        <div style={styles.startupSyncText}>Syncing your lists...</div>
      </div>
    </div>
  );
}
