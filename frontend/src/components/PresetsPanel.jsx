import { useState } from 'react';
import { styles } from '../styles/groceryAppStyles.js';

export function PresetsPanel({
  presets,
  onAddFromPreset,
  onDeletePreset,
  mainListItemCount,
}) {
  const [expandedPresets, setExpandedPresets] = useState({});
  const [loadPresetName, setLoadPresetName] = useState(null);
  const [loadMode, setLoadMode] = useState('add');

  const toggleExpanded = (presetName) => {
    setExpandedPresets((prev) => ({
      ...prev,
      [presetName]: !prev[presetName],
    }));
  };

  const openLoadModal = (presetName) => {
    setLoadPresetName(presetName);
    setLoadMode('add');
  };

  const requestLoadPreset = (presetName) => {
    if (mainListItemCount === 0) {
      onAddFromPreset(presetName, 'replace');
      return;
    }
    openLoadModal(presetName);
  };

  const closeLoadModal = () => {
    setLoadPresetName(null);
  };

  const confirmLoad = () => {
    if (!loadPresetName) return;
    onAddFromPreset(loadPresetName, loadMode);
    closeLoadModal();
  };

  return (
    <div>
      <div style={styles.presetsHeader}>
        <p style={styles.presetsHint}>
          Válassz egy mentett listát, és töltsd be a tételeit a jelenlegi
          listádba.
        </p>
      </div>
      {Object.keys(presets).length === 0 ? (
        <div style={styles.empty}>
          <div style={styles.emptyIcon}>📋</div>
          <div style={styles.emptyText}>Még nincs mentett lista</div>
          <div style={styles.emptyHint}>
            Állíts össze egy listát, és mentsd el későbbre
          </div>
        </div>
      ) : (
        Object.entries(presets).map(([name, itemNames]) => (
          <div key={name} style={styles.presetCard}>
            <div style={styles.presetCardTop}>
              <div>
                <div style={styles.presetCardName}>{name}</div>
                <div style={styles.presetCardCount}>
                  {itemNames.length} tétel
                </div>
              </div>
              <div style={styles.presetCardActions}>
                <button
                  style={styles.presetLoadBtn}
                  onClick={() => requestLoadPreset(name)}
                >
                  Betöltés a listába
                </button>
                <button
                  style={styles.presetDeleteBtn}
                  onClick={() => onDeletePreset(name)}
                >
                  ✕
                </button>
              </div>
            </div>
            <div style={styles.presetTags}>
              {(expandedPresets[name] ? itemNames : itemNames.slice(0, 8)).map(
                (n, i) => (
                  <span key={i} style={styles.tag}>
                    {n}
                  </span>
                ),
              )}
              {itemNames.length > 8 && (
                <button
                  type='button'
                  style={{
                    ...styles.tagMore,
                    border: 'none',
                    cursor: 'pointer',
                  }}
                  onClick={() => toggleExpanded(name)}
                >
                  {expandedPresets[name]
                    ? 'Kevesebb'
                    : `+${itemNames.length - 8} more`}
                </button>
              )}
            </div>
          </div>
        ))
      )}

      {loadPresetName && (
        <div style={styles.modalOverlay} onClick={closeLoadModal}>
          <div style={styles.modal} onClick={(e) => e.stopPropagation()}>
            <div style={styles.modalTitle}>Betöltés a listába</div>
            <select
              style={styles.modalInput}
              value={loadMode}
              onChange={(e) => setLoadMode(e.target.value)}
            >
              <option value='add'>add (hozzáadás)</option>
              <option value='replace'>replace (csere)</option>
            </select>
            <div style={styles.modalBtns}>
              <button style={styles.modalCancel} onClick={closeLoadModal}>
                Mégse
              </button>
              <button style={styles.modalSave} onClick={confirmLoad}>
                OK
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
