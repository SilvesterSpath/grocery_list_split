import { styles } from '../styles/groceryAppStyles.js';

export function ClearListConfirmModal({ onConfirm, onClose }) {
  return (
    <div style={styles.modalOverlay} onClick={onClose}>
      <div
        style={styles.modal}
        role='dialog'
        aria-modal='true'
        aria-labelledby='clear-list-title'
        onClick={(e) => e.stopPropagation()}
      >
        <div id='clear-list-title' style={styles.modalTitle}>
          Lista törlése
        </div>
        <p style={styles.modalMessage}>
          Biztosan töröljük az egész listát? A művelet nem vonható vissza.
        </p>
        <div style={styles.modalBtns}>
          <button type='button' style={styles.modalCancel} onClick={onClose}>
            Mégse
          </button>
          <button
            type='button'
            style={styles.modalDanger}
            onClick={onConfirm}
          >
            Törlés
          </button>
        </div>
      </div>
    </div>
  );
}
