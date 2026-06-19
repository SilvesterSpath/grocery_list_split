import { useEffect, useRef, useState } from 'react';
import { styles } from '../styles/groceryAppStyles.js';
import { normalizeStoreZone, STORE_ZONES } from '../utils/storeZones.js';

export function ItemRow({
  item,
  showZoneTint = false,
  editingId,
  editingName,
  setEditingName,
  onStartEdit,
  onCommitEdit,
  onEditKey,
  onToggleNeeded,
  onToggleBought,
  onDelete,
  onChangeStoreZone,
  isDragging,
  isDragOver,
  onDragStart,
  onDragOver,
  onDrop,
  onDragEnd,
}) {
  const isEditing = editingId === item.id;
  const editRef = useRef(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const menuWrapRef = useRef(null);
  const menuBtnRef = useRef(null);
  const firstMenuItemRef = useRef(null);

  useEffect(() => {
    if (isEditing) editRef.current?.focus();
  }, [isEditing]);

  useEffect(() => {
    if (!menuOpen) return;
    const onDocMouseDown = (e) => {
      if (!menuWrapRef.current?.contains(e.target)) {
        setMenuOpen(false);
      }
    };
    const onKeyDown = (e) => {
      if (e.key === 'Escape') {
        e.stopPropagation();
        setMenuOpen(false);
        menuBtnRef.current?.focus();
      }
    };
    document.addEventListener('mousedown', onDocMouseDown);
    document.addEventListener('keydown', onKeyDown);
    return () => {
      document.removeEventListener('mousedown', onDocMouseDown);
      document.removeEventListener('keydown', onKeyDown);
    };
  }, [menuOpen]);

  useEffect(() => {
    if (menuOpen) {
      queueMicrotask(() => firstMenuItemRef.current?.focus());
    }
  }, [menuOpen]);

  useEffect(() => {
    if (isEditing) setMenuOpen(false);
  }, [isEditing]);

  const boughtLabel = item.bought ? 'Nincs a kosárban' : 'Kosárba';
  const neededLabel = item.needed ? 'Már megvan' : 'Szükséges';
  const isBasketDisabled = !item.needed;
  const basketTitle = isBasketDisabled
    ? 'Kosárba jelölés csak a Megvenni tételeknél elérhető'
    : boughtLabel;

  const handleEditPick = () => {
    setMenuOpen(false);
    onStartEdit(item);
  };

  const handleDeletePick = () => {
    setMenuOpen(false);
    onDelete(item.id);
  };

  const storeZone = normalizeStoreZone(item.storeZone);

  const handleZonePick = (zoneId) => {
    setMenuOpen(false);
    if (normalizeStoreZone(zoneId) !== storeZone) {
      onChangeStoreZone(item.id, zoneId);
    }
  };

  const getMenuFocusables = () => {
    if (!menuWrapRef.current) return [];
    return Array.from(
      menuWrapRef.current.querySelectorAll(
        'button[role="menuitem"], button[role="menuitemradio"]',
      ),
    );
  };

  const handleMenuKeyDown = (e) => {
    const focusables = getMenuFocusables();
    if (focusables.length === 0) return;

    const idx = focusables.indexOf(document.activeElement);
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      focusables[(idx + 1) % focusables.length]?.focus();
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      focusables[(idx - 1 + focusables.length) % focusables.length]?.focus();
    } else if (e.key === 'Home') {
      e.preventDefault();
      focusables[0]?.focus();
    } else if (e.key === 'End') {
      e.preventDefault();
      focusables[focusables.length - 1]?.focus();
    }
  };

  const zoneTintStyle =
    showZoneTint && !item.bought ? styles.itemRowZoneTint(storeZone) : {};

  return (
    <div
      className='kamra-item-row'
      draggable
      onDragStart={(e) => onDragStart(e, item.id)}
      onDragOver={(e) => onDragOver(e, item.id)}
      onDrop={(e) => onDrop(e, item.id)}
      onDragEnd={onDragEnd}
      style={{
        ...styles.itemRow,
        ...zoneTintStyle,
        ...(isDragging ? styles.itemDragging : {}),
        ...(isDragOver ? styles.itemDragOver : {}),
        ...(item.bought ? styles.itemBought : {}),
        ...(menuOpen ? styles.itemRowMenuOpen : {}),
      }}
    >
      <span
        style={styles.dragHandle}
        title='Húzd az átrendezéshez'
        aria-label='Átrendezés húzással'
      >
        ⠿
      </span>

      <label
        style={{
          ...styles.checkboxLabel,
          ...(isBasketDisabled ? styles.checkboxLabelDisabled : {}),
        }}
        title={basketTitle}
        aria-label={basketTitle}
      >
        <input
          type='checkbox'
          className='kamra-sr-only'
          checked={item.bought}
          disabled={isBasketDisabled}
          onChange={() => onToggleBought(item.id)}
        />
        <span
          style={{
            ...styles.customCheck,
            ...(item.bought ? styles.customCheckChecked : {}),
            ...(isBasketDisabled ? styles.customCheckDisabled : {}),
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

      <div ref={menuWrapRef} style={styles.rowMenuWrap}>
        <button
          className='kamra-row-menu-btn'
          ref={menuBtnRef}
          type='button'
          style={styles.rowMenuBtn}
          aria-label='További műveletek a tételnél'
          aria-expanded={menuOpen}
          aria-haspopup='menu'
          onClick={() => setMenuOpen((o) => !o)}
          onMouseDown={(e) => e.stopPropagation()}
        >
          ⋯
        </button>
        {menuOpen ? (
          <div
            role='menu'
            aria-label='Tétel műveletek'
            style={styles.rowMenuDropdown}
            onKeyDown={handleMenuKeyDown}
            onMouseDown={(e) => e.stopPropagation()}
          >
            {!isEditing ? (
              <button
                ref={firstMenuItemRef}
                type='button'
                role='menuitem'
                style={styles.rowMenuItem}
                onClick={handleEditPick}
              >
                Szerkesztés
              </button>
            ) : null}
            <div
              role='group'
              aria-label='Boltban hely'
              style={styles.rowMenuZoneGroup}
            >
              <div style={styles.rowMenuSectionLabel}>Boltban hely</div>
              {STORE_ZONES.map(({ id, label }) => {
                const checked = storeZone === id;
                return (
                  <button
                    key={id}
                    type='button'
                    role='menuitemradio'
                    aria-checked={checked}
                    style={{
                      ...styles.rowMenuItem,
                      ...(checked ? styles.rowMenuItemChecked : {}),
                    }}
                    onClick={() => handleZonePick(id)}
                  >
                    <span style={styles.rowMenuItemCheck} aria-hidden='true'>
                      {checked ? '✓' : ''}
                    </span>
                    {label}
                  </button>
                );
              })}
            </div>
            <button
              ref={isEditing ? firstMenuItemRef : null}
              type='button'
              role='menuitem'
              className='kamra-menu-item-danger'
              style={{ ...styles.rowMenuItem, ...styles.rowMenuItemDanger }}
              onClick={handleDeletePick}
            >
              Törlés
            </button>
          </div>
        ) : null}
      </div>
    </div>
  );
}
