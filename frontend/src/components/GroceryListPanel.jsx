import { useEffect, useRef, useState } from 'react';
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
  const [isActionsMenuOpen, setIsActionsMenuOpen] = useState(false);
  const actionsMenuWrapRef = useRef(null);
  const actionsMenuBtnRef = useRef(null);

  const addItem = () => {
    onAddItem();
    inputRef.current?.focus();
  };

  useEffect(() => {
    if (!isActionsMenuOpen) return;

    const onDocumentMouseDown = (e) => {
      if (!actionsMenuWrapRef.current?.contains(e.target)) {
        setIsActionsMenuOpen(false);
      }
    };
    const onDocumentKeyDown = (e) => {
      if (e.key === 'Escape') {
        setIsActionsMenuOpen(false);
        actionsMenuBtnRef.current?.focus();
      }
    };

    document.addEventListener('mousedown', onDocumentMouseDown);
    document.addEventListener('keydown', onDocumentKeyDown);
    return () => {
      document.removeEventListener('mousedown', onDocumentMouseDown);
      document.removeEventListener('keydown', onDocumentKeyDown);
    };
  }, [isActionsMenuOpen]);

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
          <button
            type='button'
            style={{ ...styles.ghostBtn, ...styles.actionBtnHalf }}
            onClick={onOpenSavePreset}
          >
            💾 Mentés
          </button>
          <button
            type='button'
            style={{ ...styles.ghostBtn, ...styles.actionBtnHalf }}
            onClick={onOpenPresetOverlay}
          >
            📂 Lista betöltése
          </button>
          <div ref={actionsMenuWrapRef} style={styles.actionsMenuWrap}>
            <button
              ref={actionsMenuBtnRef}
              type='button'
              aria-label='Lista műveletek'
              aria-haspopup='menu'
              aria-expanded={isActionsMenuOpen}
              style={styles.actionsMenuBtn}
              onClick={() => setIsActionsMenuOpen((open) => !open)}
              onMouseDown={(e) => e.stopPropagation()}
            >
              ⋯
            </button>
            {isActionsMenuOpen && (
              <div
                role='menu'
                aria-label='Lista műveletek menü'
                style={styles.actionsMenuDropdown}
                onMouseDown={(e) => e.stopPropagation()}
              >
                <button
                  type='button'
                  role='menuitem'
                  style={{ ...styles.actionsMenuItem, ...styles.actionsMenuItemDanger }}
                  onClick={() => {
                    setIsActionsMenuOpen(false);
                    onClearAll();
                  }}
                >
                  Lista törlése
                </button>
              </div>
            )}
          </div>
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
            <section
              style={{
                ...styles.section,
                ...(neededItems.length > 0 ? styles.sectionFollows : {}),
              }}
            >
              <div style={styles.sectionLabel}>
                <span
                  style={styles.sectionDot({ color: 'var(--muted-2)' })}
                />
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
