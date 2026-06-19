import { useState } from 'react';
import { styles } from '../styles/groceryAppStyles.js';
import { normalizePresetEntry } from '../utils/storeZones.js';

function presetEntryDisplayName(entry) {
  return normalizePresetEntry(entry)?.name ?? '';
}

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
    setLoadMode('replace');
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
        Object.entries(presets).map(([name, presetEntries]) => (
          <div key={name} style={styles.presetCard}>
            <div style={styles.presetCardTop}>
              <div>
                <div style={styles.presetCardName}>{name}</div>
                <div style={styles.presetCardCount}>
                  {presetEntries.length} tétel
                </div>
              </div>
              <div style={styles.presetCardActions}>
                <button
                  type='button'
                  style={styles.presetLoadBtn}
                  onClick={() => requestLoadPreset(name)}
                >
                  Betöltés
                </button>
                <button
                  type='button'
                  style={styles.presetDeleteBtn}
                  onClick={() => onDeletePreset(name)}
                  aria-label={`Mentett lista törlése: ${name}`}
                  title={`Mentett lista törlése: ${name}`}
                >
                  ✕
                </button>
              </div>
            </div>
            <div style={styles.presetTags}>
              {(expandedPresets[name]
                ? presetEntries
                : presetEntries.slice(0, 8)
              ).map((entry, i) => {
                const label = presetEntryDisplayName(entry);
                if (!label) return null;
                return (
                  <span key={i} style={styles.tag}>
                    {label}
                  </span>
                );
              })}
              {presetEntries.length > 8 && (
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
                    : `+${presetEntries.length - 8} további`}
                </button>
              )}
            </div>
          </div>
        ))
      )}

      {loadPresetName && (
        <div style={styles.modalOverlay} onClick={closeLoadModal}>
          <div style={styles.modal} onClick={(e) => e.stopPropagation()}>
            <div style={styles.modalTitle}>Betöltés</div>
            <select
              style={styles.modalInput}
              value={loadMode}
              onChange={(e) => setLoadMode(e.target.value)}
              aria-label='Betöltési mód'
            >
              <option value='replace'>Csere (a jelenlegi lista helyett)</option>
              <option value='add'>Hozzáadás (a jelenlegi listához)</option>
            </select>
            <div style={styles.modalBtns}>
              <button type='button' style={styles.modalCancel} onClick={closeLoadModal}>
                Mégse
              </button>
              <button type='button' style={styles.modalSave} onClick={confirmLoad}>
                Rendben
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
