import { styles } from '../styles/groceryAppStyles.js';

export function SavePresetModal({
  newPresetName,
  onNewPresetNameChange,
  existingPresetNames = [],
  onSave,
  onClose,
  errorMessage,
}) {
  const sortedNames = [...existingPresetNames].sort((a, b) =>
    a.localeCompare(b, 'hu'),
  );
  const query = newPresetName.trim().toLocaleLowerCase('hu');
  const suggestedNames = query
    ? sortedNames.filter((name) => name.toLocaleLowerCase('hu').includes(query))
    : sortedNames;

  return (
    <div style={styles.modalOverlay} onClick={onClose}>
      <div style={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div style={styles.modalTitle}>Aktuális lista mentése</div>
        <input
          style={styles.modalInput}
          autoFocus
          list='preset-name-suggestions'
          placeholder='Lista neve…'
          value={newPresetName}
          onChange={(e) => onNewPresetNameChange(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') onSave();
            if (e.key === 'Escape') onClose();
          }}
        />
        {suggestedNames.length > 0 && (
          <datalist id='preset-name-suggestions'>
            {suggestedNames.map((name) => (
              <option key={name} value={name} />
            ))}
          </datalist>
        )}
        {typeof errorMessage === 'string' && errorMessage.trim() !== '' && (
          <div style={{ marginBottom: 14, color: '#dc2626', fontSize: 12 }}>
            {errorMessage}
          </div>
        )}
        <div style={styles.modalBtns}>
          <button style={styles.modalCancel} onClick={onClose}>
            Mégse
          </button>
          <button style={styles.modalSave} onClick={onSave}>
            Mentés
          </button>
        </div>
      </div>
    </div>
  );
}
