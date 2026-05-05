import { useRef } from 'react';
import { ItemRow } from './ItemRow.jsx';
import { SavePresetModal } from './SavePresetModal.jsx';
import { styles } from '../styles/groceryAppStyles.js';

export function GroceryListPanel({
  items,
  neededItems,
  haveItems,
  boughtCount,
  newItemName,
  onNewItemNameChange,
  onAddItem,
  showSavePreset,
  onOpenSavePreset,
  onCloseSavePreset,
  newPresetName,
  onNewPresetNameChange,
  existingPresetNames,
  onSaveAsPreset,
  saveMode,
  onSaveModeChange,
  activePresetName,
  presetSaveErrorMessage,
  onClearBought,
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
      <div style={styles.addRow}>
        <input
          ref={inputRef}
          style={styles.addInput}
          placeholder='Tétel hozzáadása…'
          value={newItemName}
          onChange={(e) => onNewItemNameChange(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && addItem()}
        />
        <button style={styles.addBtn} onClick={addItem}>
          +
        </button>
      </div>

      {items.length > 0 && (
        <div style={styles.actionsBlock}>
          <div style={styles.actionsRowSplit}>
            <button
              type='button'
              style={{ ...styles.ghostBtn, ...styles.actionBtnHalf }}
              onClick={onOpenSavePreset}
            >
              💾 Mentés listaként
            </button>
            <button
              type='button'
              style={{ ...styles.ghostBtn, ...styles.dangerBtn, ...styles.actionBtnHalf }}
              onClick={onClearAll}
            >
              🗑 Mind törlése
            </button>
          </div>
          {boughtCount > 0 && (
            <div style={styles.actionsRowSplit}>
              <button
                type='button'
                style={{ ...styles.ghostBtn, ...styles.actionBtnFull }}
                onClick={onClearBought}
              >
                🧹 Megvett törlése
              </button>
            </div>
          )}
        </div>
      )}

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
                <span style={styles.sectionDot({ color: '#22c55e' })} />
                Megvenni ({neededItems.length})
                {loadedPresetName ? ` - ${loadedPresetName}` : ''}
              </div>
              {neededItems.map((item) => (
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
            <section style={styles.section}>
              <div style={styles.sectionLabel}>
                <span style={styles.sectionDot({ color: '#94a3b8' })} />
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
