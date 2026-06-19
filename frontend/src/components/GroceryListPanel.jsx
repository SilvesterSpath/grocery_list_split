import { useRef } from 'react';
import { ItemRow } from './ItemRow.jsx';
import { SavePresetModal } from './SavePresetModal.jsx';
import { styles } from '../styles/groceryAppStyles.js';
import { STORE_ZONES } from '../utils/storeZones.js';

export function GroceryListPanel({
  items,
  neededItems,
  haveItems,
  newItemName,
  onNewItemNameChange,
  onAddItem,
  selectedStoreZone,
  onSelectedStoreZoneChange,
  showSavePreset,
  onOpenSavePreset,
  onOpenPresetOverlay,
  onCloseSavePreset,
  newPresetName,
  onNewPresetNameChange,
  existingPresetNames,
  onSaveAsPreset,
  saveMode,
  onSaveModeChange,
  activePresetName,
  presetSaveErrorMessage,
  onClearAll,
  loadedPresetName,
  editingId,
  editingName,
  setEditingName,
  onStartEdit,
  onCommitEdit,
  onEditKey,
  onToggleNeeded,
  onToggleBought,
  onDeleteItem,
  onChangeStoreZone,
  dragState,
  dragOver,
  onDragStart,
  onDragOver,
  onDrop,
  onDragEnd,
}) {
  const inputRef = useRef(null);

  const addItem = () => {
    onAddItem();
    inputRef.current?.focus();
  };

  return (
    <>
      <div
        role='radiogroup'
        aria-label='Boltban hely'
        style={styles.zoneSelector}
      >
        {STORE_ZONES.map(({ id, label }) => {
          const selected = selectedStoreZone === id;
          return (
            <button
              key={id}
              type='button'
              role='radio'
              className='kamra-zone-option'
              aria-checked={selected}
              aria-label={`${label} zóna`}
              style={styles.zoneSelectorOption({ selected })}
              onClick={() => onSelectedStoreZoneChange(id)}
            >
              <span
                style={styles.zoneSelectorDot({ variant: id })}
                aria-hidden='true'
              />
              {label}
            </button>
          );
        })}
      </div>
      <div style={styles.addRow}>
        <input
          ref={inputRef}
          style={styles.addInput}
          placeholder='Tétel hozzáadása…'
          value={newItemName}
          onChange={(e) => onNewItemNameChange(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && addItem()}
        />
        <button
          type='button'
          style={styles.addBtn}
          onClick={addItem}
          aria-label='Tétel hozzáadása'
        >
          +
        </button>
      </div>

      <div style={styles.actionsBlock}>
        <div style={styles.actionsRowSplit}>
          <div style={{ ...styles.actionLoadGroup, ...styles.actionBtnHalf }}>
            <button
              className='kamra-btn-save'
              type='button'
              style={styles.actionLoadBtn}
              onClick={onOpenSavePreset}
            >
              💾 Mentés
            </button>
          </div>
          <div style={{ ...styles.actionLoadGroup, ...styles.actionBtnHalf }}>
            <button
              className='kamra-btn-load'
              type='button'
              style={styles.actionLoadBtn}
              onClick={onOpenPresetOverlay}
            >
              📂 Lista betöltése
            </button>
            <button
              className='kamra-btn-clear-list'
              type='button'
              aria-label='Lista törlése'
              title='Lista törlése'
              style={styles.actionClearListBtn}
              onClick={onClearAll}
            >
              ✕
            </button>
          </div>
        </div>
      </div>

      {showSavePreset && (
        <SavePresetModal
          newPresetName={newPresetName}
          onNewPresetNameChange={onNewPresetNameChange}
          existingPresetNames={existingPresetNames}
          saveMode={saveMode}
          onSaveModeChange={onSaveModeChange}
          activePresetName={activePresetName}
          onSave={onSaveAsPreset}
          onClose={onCloseSavePreset}
          errorMessage={presetSaveErrorMessage}
        />
      )}

      {items.length === 0 ? (
        <div style={styles.empty}>
          <div style={styles.emptyIcon}>🥕</div>
          <div style={styles.emptyText}>A listád üres</div>
          <div style={styles.emptyHint}>
            Adj hozzá tételeket fent, vagy tölts be egy mentett listát
          </div>
        </div>
      ) : (
        <>
          {neededItems.length > 0 && (
            <section style={styles.section}>
              <div style={styles.sectionLabel}>
                <span style={styles.sectionDot({ color: 'var(--success)' })} />
                Megvenni ({neededItems.length})
                {loadedPresetName ? ` - ${loadedPresetName}` : ''}
              </div>
              {neededItems.map((item) => (
                <ItemRow
                  key={item.id}
                  item={item}
                  showZoneTint
                  editingId={editingId}
                  editingName={editingName}
                  setEditingName={setEditingName}
                  onStartEdit={onStartEdit}
                  onCommitEdit={onCommitEdit}
                  onEditKey={onEditKey}
                  onToggleNeeded={onToggleNeeded}
                  onToggleBought={onToggleBought}
                  onDelete={onDeleteItem}
                  onChangeStoreZone={onChangeStoreZone}
                  isDragging={dragState === item.id}
                  isDragOver={dragOver === item.id}
                  onDragStart={onDragStart}
                  onDragOver={onDragOver}
                  onDrop={onDrop}
                  onDragEnd={onDragEnd}
                />
              ))}
            </section>
          )}

          {haveItems.length > 0 && (
            <section
              style={{
                ...styles.section,
                ...(neededItems.length > 0 ? styles.sectionFollows : {}),
              }}
            >
              <div style={styles.sectionLabel}>
                <span style={styles.sectionDot({ color: 'var(--muted-2)' })} />
                Már megvan ({haveItems.length})
              </div>
              {haveItems.map((item) => (
                <ItemRow
                  key={item.id}
                  item={item}
                  editingId={editingId}
                  editingName={editingName}
                  setEditingName={setEditingName}
                  onStartEdit={onStartEdit}
                  onCommitEdit={onCommitEdit}
                  onEditKey={onEditKey}
                  onToggleNeeded={onToggleNeeded}
                  onToggleBought={onToggleBought}
                  onDelete={onDeleteItem}
                  onChangeStoreZone={onChangeStoreZone}
                  isDragging={dragState === item.id}
                  isDragOver={dragOver === item.id}
                  onDragStart={onDragStart}
                  onDragOver={onDragOver}
                  onDrop={onDrop}
                  onDragEnd={onDragEnd}
                />
              ))}
            </section>
          )}
        </>
      )}
    </>
  );
}
