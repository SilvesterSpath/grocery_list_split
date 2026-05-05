import { useEffect, useRef } from 'react';
import { styles } from '../styles/groceryAppStyles.js';

export function ItemRow({
  item,
  editingId,
  editingName,
  setEditingName,
  onStartEdit,
  onCommitEdit,
  onEditKey,
  onToggleNeeded,
  onToggleBought,
  onDelete,
  isDragging,
  isDragOver,
  onDragStart,
  onDragOver,
  onDrop,
  onDragEnd,
}) {
  const isEditing = editingId === item.id;
  const editRef = useRef(null);

  useEffect(() => {
    if (isEditing) editRef.current?.focus();
  }, [isEditing]);

  const boughtLabel = item.bought ? 'Nincs a kosárban' : 'Kosárba';
  const neededLabel = item.needed ? 'Már megvan' : 'Szükséges';

  return (
    <div
      draggable
      onDragStart={(e) => onDragStart(e, item.id)}
      onDragOver={(e) => onDragOver(e, item.id)}
      onDrop={(e) => onDrop(e, item.id)}
      onDragEnd={onDragEnd}
      style={{
        ...styles.itemRow,
        ...(isDragging ? styles.itemDragging : {}),
        ...(isDragOver ? styles.itemDragOver : {}),
        ...(item.bought ? styles.itemBought : {}),
      }}
    >
      <span
        style={styles.dragHandle}
        title='Húzd az átrendezéshez'
        aria-hidden='true'
      >
        ⠿
      </span>

      <label
        style={styles.checkboxLabel}
        title={boughtLabel}
        aria-label={boughtLabel}
      >
        <input
          type='checkbox'
          className='kamra-sr-only'
          checked={item.bought}
          onChange={() => onToggleBought(item.id)}
        />
        <span
          style={{
            ...styles.customCheck,
            ...(item.bought ? styles.customCheckChecked : {}),
          }}
          aria-hidden='true'
        >
          {item.bought && <span style={styles.checkMark}>✓</span>}
        </span>
      </label>

      {isEditing ? (
        <input
          ref={editRef}
          style={styles.editInput}
          value={editingName}
          onChange={(e) => setEditingName(e.target.value)}
          onBlur={() => onCommitEdit(item.id)}
          onKeyDown={(e) => onEditKey(e, item.id)}
        />
      ) : (
        <span
          style={{
            ...styles.itemName,
            ...(item.bought ? styles.itemNameBought : {}),
            ...(!item.needed ? styles.itemNameHave : {}),
          }}
          onDoubleClick={() => onStartEdit(item)}
          title='Dupla kattintás a szerkesztéshez'
        >
          {item.name}
        </span>
      )}

      <label
        style={styles.toggleLabel}
        title={neededLabel}
        aria-label={neededLabel}
      >
        <input
          type='checkbox'
          className='kamra-sr-only'
          checked={item.needed}
          onChange={() => onToggleNeeded(item.id)}
        />
        <span
          style={{
            ...styles.toggle,
            ...(item.needed ? styles.toggleOn : styles.toggleOff),
          }}
          aria-hidden='true'
        >
          <span
            style={{
              ...styles.toggleKnob,
              ...(item.needed ? styles.toggleKnobOn : {}),
            }}
          />
        </span>
      </label>

      {!isEditing && (
        <button
          type='button'
          style={styles.iconBtn}
          onClick={() => onStartEdit(item)}
          title='Név szerkesztése'
          aria-label='Név szerkesztése'
        >
          ✎
        </button>
      )}

      <button
        type='button'
        style={{ ...styles.iconBtn, ...styles.deleteBtn }}
        onClick={() => onDelete(item.id)}
        title='Törlés'
        aria-label='Tétel törlése'
      >
        ✕
      </button>
    </div>
  );
}
