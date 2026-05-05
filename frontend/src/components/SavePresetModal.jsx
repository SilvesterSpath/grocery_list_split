import { styles } from '../styles/groceryAppStyles.js';

export function SavePresetModal({
  newPresetName,
  onNewPresetNameChange,
  existingPresetNames = [],
  saveMode,
  onSaveModeChange,
  activePresetName,
  onSave,
  onClose,
  errorMessage,
}) {
  const hasActivePresetName = typeof activePresetName === 'string' && activePresetName.trim() !== '';
  const canEditName = !hasActivePresetName || saveMode === 'new';
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
        {hasActivePresetName && (
          <>
            <div style={{ marginBottom: 8, color: 'var(--muted)' }}>
              Aktuális lista: <strong>{activePresetName}</strong>
            </div>
            <div style={{ marginBottom: 12, display: 'grid', gap: 6 }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <input
                  type='radio'
                  name='save-mode'
                  value='overwrite'
                  checked={saveMode === 'overwrite'}
                  onChange={() => onSaveModeChange('overwrite')}
                />
                Felülírás
              </label>
              <label style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <input
                  type='radio'
                  name='save-mode'
                  value='new'
                  checked={saveMode === 'new'}
                  onChange={() => onSaveModeChange('new')}
                />
                Mentés új néven
              </label>
            </div>
          </>
        )}
        <input
          style={{ ...styles.modalInput, cursor: 'text' }}
          autoFocus
          list='preset-name-suggestions'
          placeholder='Lista neve…'
          value={newPresetName}
          disabled={!canEditName}
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
          <div
            style={{ marginBottom: 14, color: 'var(--danger)', fontSize: 12 }}
          >
            {errorMessage}
          </div>
        )}
        <div style={styles.modalBtns}>
          <button type='button' style={styles.modalCancel} onClick={onClose}>
            Mégse
          </button>
          <button type='button' style={styles.modalSave} onClick={onSave}>
            Mentés
          </button>
        </div>
      </div>
    </div>
  );
}
