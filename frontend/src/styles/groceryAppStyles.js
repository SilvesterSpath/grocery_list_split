export const globalCSS = `
  @import url('https://fonts.googleapis.com/css2?family=Fraunces:ital,wght@0,500;0,650;0,750;1,500&family=DM+Sans:wght@400;500;600&display=swap');
  :root{
    --bg: #fbf7f0;
    --surface: #ffffff;
    --surface-2: #f4efe6;
    --text: #241d12;
    --muted: #8c7a63;
    --muted-2: #b6a894;
    --border: #efe7dc;
    --shadow: 0 2px 14px rgba(36, 29, 18, 0.08);
    --shadow-strong: 0 20px 70px rgba(36, 29, 18, 0.22);
    --accent: #e8783a;
    --accent-2: #ffb68b;
    --success: #22c55e;
    --danger: #dc2626;
    --danger-border: #fecaca;
    --ring: rgba(232, 120, 58, 0.28);
    --text-on-accent: #ffffff;
    --overlay-scrim: rgba(44, 36, 22, 0.42);
    --overlay-scrim-soft: rgba(44, 36, 22, 0.34);
    --drag-handle: color-mix(in srgb, var(--muted) 28%, var(--border));
    --row-border: color-mix(in srgb, var(--border) 78%, var(--surface));
    --row-surface: color-mix(in srgb, var(--surface) 94%, var(--bg));
    --toggle-on: color-mix(in srgb, var(--success) 52%, var(--surface-2));
  }

  :root[data-theme="dark"]{
    --bg: #0b0f14;
    --surface: #111827;
    --surface-2: #0f172a;
    --text: #e5e7eb;
    --muted: #b3b9c6;
    --muted-2: #7d8698;
    --border: #1f2937;
    --shadow: 0 12px 34px rgba(0, 0, 0, 0.55);
    --shadow-strong: 0 32px 90px rgba(0, 0, 0, 0.75);
    --accent: #ff7a2f;
    --accent-2: #ffd1b6;
    --success: #34d399;
    --danger: #f87171;
    --danger-border: rgba(248, 113, 113, 0.38);
    --ring: rgba(255, 122, 47, 0.35);
    --text-on-accent: #ffffff;
    --overlay-scrim: rgba(0, 0, 0, 0.55);
    --overlay-scrim-soft: rgba(0, 0, 0, 0.48);
    --drag-handle: color-mix(in srgb, var(--muted-2) 45%, var(--border));
    --row-border: color-mix(in srgb, var(--border) 88%, var(--surface));
    --row-surface: color-mix(in srgb, var(--surface) 96%, var(--bg));
    --toggle-on: color-mix(in srgb, var(--success) 42%, var(--surface-2));
  }

  .kamra-sr-only {
    position: absolute;
    width: 1px;
    height: 1px;
    padding: 0;
    margin: -1px;
    overflow: hidden;
    clip: rect(0, 0, 0, 0);
    clip-path: inset(50%);
    white-space: nowrap;
    border: 0;
  }

  button:focus-visible,
  select:focus-visible,
  input:focus-visible {
    outline: 2px solid var(--accent);
    outline-offset: 2px;
  }

  button[role='menuitem']:hover {
    background: color-mix(in srgb, var(--surface-2) 72%, var(--surface));
  }

  * { box-sizing: border-box; margin: 0; padding: 0; }
  html, body { height: 100%; }
  body { background: var(--bg); color: var(--text); }
  select { cursor: pointer; }
  ::selection{ background: var(--ring); }
  a, button, input { color: inherit; }
  button{ -webkit-tap-highlight-color: transparent; }
  input::placeholder{ color: color-mix(in srgb, var(--muted) 70%, transparent); }
  ::-webkit-scrollbar { width: 4px; }
  ::-webkit-scrollbar-track { background: transparent; }
  ::-webkit-scrollbar-thumb { background: color-mix(in srgb, var(--muted) 40%, transparent); border-radius: 4px; }

  .item-row-enter { opacity: 0; transform: translateY(-6px); }
  .item-row-enter-active { opacity: 1; transform: none; transition: all 0.2s; }
`;

export const styles = {
  root: {
    fontFamily: "'DM Sans', sans-serif",
    minHeight: '100vh',
    background: 'var(--bg)',
    color: 'var(--text)',
    maxWidth: 620,
    margin: '0 auto',
    paddingBottom: 52,
  },

  header: {
    background: 'color-mix(in srgb, var(--surface) 92%, transparent)',
    borderBottom: '1px solid var(--border)',
    position: 'sticky',
    top: 0,
    zIndex: 100,
    boxShadow: 'var(--shadow)',
    backdropFilter: 'saturate(130%) blur(10px)',
  },

  headerInner: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '14px 18px 10px',
  },

  logo: {
    display: 'flex',
    alignItems: 'center',
    gap: 8,
  },

  logoIcon: {
    fontSize: 26,
  },

  logoText: {
    fontFamily: "'Fraunces', serif",
    fontSize: 24,
    fontWeight: 750,
    color: 'var(--text)',
    letterSpacing: '-0.5px',
  },

  headerStats: {
    display: 'flex',
    gap: 6,
    alignItems: 'center',
  },

  themeBtn: {
    fontFamily: "'DM Sans', sans-serif",
    fontSize: 12,
    fontWeight: 600,
    padding: '6px 10px',
    borderRadius: 999,
    border: '1px solid var(--border)',
    background: 'color-mix(in srgb, var(--surface) 75%, var(--surface-2))',
    boxShadow: '0 1px 0 color-mix(in srgb, var(--text) 8%, transparent)',
    cursor: 'pointer',
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'transform 0.08s, background 0.15s, border-color 0.15s',
  },

  themeIcon: {
    fontSize: 13,
    opacity: 0.9,
  },

  badge: {
    background: 'color-mix(in srgb, var(--success) 20%, var(--surface))',
    color: 'color-mix(in srgb, var(--success) 72%, var(--text))',
    fontSize: 11,
    fontWeight: 600,
    padding: '3px 8px',
    borderRadius: 20,
    border: '1px solid color-mix(in srgb, var(--success) 35%, var(--border))',
  },

  totalBadge: {
    background: 'var(--surface-2)',
    color: 'var(--muted)',
    fontSize: 11,
    fontWeight: 600,
    padding: '3px 8px',
    borderRadius: 20,
  },

  main: {
    padding: '14px 16px 0',
  },

  addRow: {
    display: 'flex',
    gap: 8,
    marginBottom: 9,
  },

  addInput: {
    flex: 1,
    fontFamily: "'DM Sans', sans-serif",
    fontSize: 15,
    padding: '10px 14px',
    border: '1px solid var(--border)',
    borderRadius: 10,
    background: 'var(--surface)',
    color: 'var(--text)',
    cursor: 'text',
    transition: 'border-color 0.15s, box-shadow 0.15s',
  },

  addBtn: {
    width: 44,
    height: 44,
    background: 'var(--accent)',
    color: 'var(--text-on-accent)',
    border: 'none',
    borderRadius: 10,
    fontSize: 22,
    fontWeight: 300,
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
    transition: 'background 0.15s, transform 0.1s',
  },

  actionsBlock: {
    display: 'flex',
    flexDirection: 'column',
    gap: 7,
    marginBottom: 10,
  },

  actionsRowSplit: {
    display: 'flex',
    gap: 8,
    width: '100%',
  },

  actionBtnHalf: {
    flex: 1,
    minWidth: 0,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '10px 8px',
    boxSizing: 'border-box',
  },

  actionBtnFull: {
    flex: 1,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '10px 8px',
    boxSizing: 'border-box',
  },

  ghostBtn: {
    fontFamily: "'DM Sans', sans-serif",
    fontSize: 12,
    fontWeight: 500,
    padding: '5px 10px',
    border: '1px solid var(--border)',
    borderRadius: 8,
    background: 'var(--surface)',
    color: 'var(--muted)',
    cursor: 'pointer',
    transition: 'all 0.15s',
  },

  dangerBtn: {
    color: 'var(--danger)',
    borderColor: 'var(--danger-border)',
  },

  actionsMenuWrap: {
    position: 'relative',
    flexShrink: 0,
  },

  actionsMenuBtn: {
    fontFamily: "'DM Sans', sans-serif",
    fontSize: 18,
    fontWeight: 700,
    lineHeight: 1,
    color: 'var(--muted)',
    background: 'var(--surface)',
    border: '1px solid var(--border)',
    borderRadius: 8,
    cursor: 'pointer',
    minWidth: 36,
    height: 36,
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 0,
  },

  actionsMenuDropdown: {
    position: 'absolute',
    top: '100%',
    right: 0,
    marginTop: 4,
    minWidth: 160,
    background: 'var(--surface)',
    border: '1px solid var(--border)',
    borderRadius: 10,
    boxShadow: 'var(--shadow)',
    zIndex: 70,
    overflow: 'hidden',
  },

  actionsMenuItem: {
    fontFamily: "'DM Sans', sans-serif",
    fontSize: 13,
    fontWeight: 500,
    width: '100%',
    textAlign: 'left',
    padding: '10px 12px',
    background: 'var(--surface)',
    border: 'none',
    color: 'var(--text)',
    cursor: 'pointer',
  },

  actionsMenuItemDanger: {
    color: 'var(--danger)',
  },

  section: {
    marginBottom: 16,
  },

  sectionFollows: {
    marginTop: 17,
  },

  sectionLabel: {
    fontSize: 11,
    fontWeight: 600,
    letterSpacing: '0.05em',
    textTransform: 'uppercase',
    color: 'var(--muted)',
    marginBottom: 7,
    paddingBottom: 6,
    borderBottom: '1px solid color-mix(in srgb, var(--border) 55%, transparent)',
    display: 'flex',
    alignItems: 'center',
    gap: 6,
  },

  sectionDot: ({ color }) => ({
    width: 7,
    height: 7,
    borderRadius: '50%',
    background: color,
    display: 'inline-block',
    flexShrink: 0,
  }),

  itemRow: {
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
    gap: 8,
    background: 'var(--row-surface)',
    borderWidth: '1px',
    borderStyle: 'solid',
    borderColor: 'var(--row-border)',
    borderRadius: 10,
    padding: '6px 10px',
    marginBottom: 6,
    transition: 'all 0.15s',
    cursor: 'default',
    userSelect: 'none',
  },

  itemRowMenuOpen: {
    zIndex: 6,
  },

  itemDragging: {
    opacity: 0.4,
    transform: 'scale(0.98)',
  },

  itemDragOver: {
    borderColor: 'var(--accent)',
    boxShadow: '0 0 0 3px var(--ring)',
  },

  itemBought: {
    background: 'color-mix(in srgb, var(--row-surface) 82%, var(--surface-2))',
    borderColor: 'var(--row-border)',
  },

  dragHandle: {
    fontSize: 16,
    color: 'var(--drag-handle)',
    cursor: 'grab',
    flexShrink: 0,
    lineHeight: 1,
  },

  checkboxLabel: {
    display: 'flex',
    alignItems: 'center',
    cursor: 'pointer',
    flexShrink: 0,
  },

  checkboxLabelDisabled: {
    cursor: 'not-allowed',
  },

  customCheck: {
    width: 18,
    height: 18,
    border: '1px solid color-mix(in srgb, var(--muted) 45%, var(--border))',
    borderRadius: 5,
    background: 'var(--surface)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'all 0.15s',
    flexShrink: 0,
  },

  customCheckChecked: {
    background: 'var(--success)',
    borderColor: 'var(--success)',
  },

  customCheckDisabled: {
    background: 'color-mix(in srgb, var(--surface) 70%, var(--surface-2))',
    borderColor: 'color-mix(in srgb, var(--border) 75%, var(--surface))',
    opacity: 0.7,
  },

  checkMark: {
    color: 'var(--text-on-accent)',
    fontSize: 11,
    fontWeight: 700,
    lineHeight: 1,
  },

  itemName: {
    flex: 1,
    minWidth: 0,
    fontSize: 21,
    fontWeight: 500,
    color: 'var(--text)',
    cursor: 'pointer',
    wordBreak: 'break-word',
    lineHeight: 1.3,
  },

  itemNameBought: {
    textDecoration: 'line-through',
    color: 'color-mix(in srgb, var(--muted) 65%, var(--text))',
  },

  itemNameHave: {
    color: 'var(--muted)',
  },

  editInput: {
    flex: 1,
    minWidth: 0,
    fontFamily: "'DM Sans', sans-serif",
    fontSize: 14,
    fontWeight: 500,
    padding: '2px 6px',
    border: '1px solid var(--accent)',
    borderRadius: 6,
    background: 'var(--surface)',
    color: 'var(--text)',
    cursor: 'text',
  },

  toggleLabel: {
    cursor: 'pointer',
    flexShrink: 0,
  },

  toggle: {
    display: 'flex',
    alignItems: 'center',
    width: 30,
    height: 17,
    borderRadius: 8,
    padding: '2px',
    transition: 'background 0.2s',
    flexShrink: 0,
    border: '1px solid color-mix(in srgb, var(--border) 70%, transparent)',
    boxSizing: 'border-box',
  },

  toggleOn: {
    background: 'var(--toggle-on)',
    borderColor: 'color-mix(in srgb, var(--success) 35%, var(--border))',
    justifyContent: 'flex-end',
  },

  toggleOff: {
    background: 'color-mix(in srgb, var(--muted) 28%, var(--border))',
    borderColor: 'color-mix(in srgb, var(--border) 80%, var(--surface))',
    justifyContent: 'flex-start',
  },

  toggleKnob: {
    width: 10,
    height: 10,
    borderRadius: '50%',
    background: 'var(--surface)',
    boxShadow:
      '0 2px 6px color-mix(in srgb, var(--text) 14%, transparent)',
    transition: 'all 0.2s',
    flexShrink: 0,
  },

  toggleKnobOn: {},

  iconBtn: {
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    color: 'color-mix(in srgb, var(--muted) 65%, var(--text))',
    fontSize: 14,
    padding: '2px 4px',
    borderRadius: 4,
    lineHeight: 1,
    transition: 'color 0.15s',
    flexShrink: 0,
  },

  rowMenuWrap: {
    position: 'relative',
    flexShrink: 0,
    alignSelf: 'stretch',
    display: 'flex',
    alignItems: 'center',
  },

  rowMenuBtn: {
    fontFamily: "'DM Sans', sans-serif",
    fontSize: 18,
    fontWeight: 700,
    lineHeight: 1,
    letterSpacing: '0.02em',
    color: 'var(--muted-2)',
    background: 'transparent',
    border: 'none',
    borderRadius: 8,
    cursor: 'pointer',
    padding: 0,
    minWidth: 40,
    minHeight: 40,
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'color 0.15s, background 0.15s',
  },

  rowMenuDropdown: {
    position: 'absolute',
    right: 0,
    top: '100%',
    marginTop: 3,
    minWidth: 148,
    padding: '4px 0',
    background: 'var(--surface)',
    border: '1px solid var(--row-border)',
    borderRadius: 10,
    boxShadow: 'var(--shadow)',
    zIndex: 50,
  },

  rowMenuItem: {
    fontFamily: "'DM Sans', sans-serif",
    display: 'block',
    width: '100%',
    textAlign: 'left',
    fontSize: 14,
    fontWeight: 500,
    padding: '9px 14px',
    minHeight: 40,
    boxSizing: 'border-box',
    border: 'none',
    background: 'transparent',
    color: 'var(--text)',
    cursor: 'pointer',
    transition: 'background 0.12s',
  },

  rowMenuItemDanger: {
    color: 'var(--danger)',
  },

  empty: {
    textAlign: 'center',
    padding: '60px 20px',
  },

  emptyIcon: {
    fontSize: 48,
    marginBottom: 12,
  },

  emptyText: {
    fontFamily: "'Fraunces', serif",
    fontSize: 20,
    fontWeight: 600,
    color: 'var(--muted)',
    marginBottom: 6,
  },

  emptyHint: {
    fontSize: 13,
    color: 'var(--muted-2)',
  },

  // Presets tab
  presetsHeader: {
    marginBottom: 14,
  },

  presetsHint: {
    fontSize: 13,
    color: 'var(--muted)',
    lineHeight: 1.5,
  },

  presetCard: {
    background: 'var(--surface)',
    border: '1px solid var(--border)',
    borderRadius: 12,
    padding: '14px 14px 10px',
    marginBottom: 10,
  },

  presetCardTop: {
    display: 'flex',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    marginBottom: 10,
    gap: 10,
  },

  presetCardName: {
    fontFamily: "'Fraunces', serif",
    fontSize: 16,
    fontWeight: 600,
    color: 'var(--text)',
    marginBottom: 2,
  },

  presetCardCount: {
    fontSize: 12,
    color: 'var(--muted)',
  },

  presetCardActions: {
    display: 'flex',
    gap: 6,
    alignItems: 'center',
    flexShrink: 0,
  },

  presetLoadBtn: {
    fontFamily: "'DM Sans', sans-serif",
    fontSize: 12,
    fontWeight: 600,
    padding: '6px 12px',
    border: 'none',
    borderRadius: 8,
    background: 'var(--accent)',
    color: 'var(--text-on-accent)',
    cursor: 'pointer',
    transition: 'background 0.15s',
  },

  presetDeleteBtn: {
    fontFamily: "'DM Sans', sans-serif",
    fontSize: 12,
    padding: '6px 8px',
    border: '1px solid var(--danger-border)',
    borderRadius: 8,
    background: 'var(--surface)',
    color: 'var(--danger)',
    cursor: 'pointer',
  },

  presetTags: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: 5,
  },

  tag: {
    fontSize: 17,
    fontWeight: 500,
    padding: '3px 8px',
    borderRadius: 20,
    background: 'var(--surface-2)',
    color: 'var(--muted)',
  },

  tagMore: {
    fontSize: 17,
    fontWeight: 500,
    padding: '3px 8px',
    borderRadius: 20,
    background: 'color-mix(in srgb, var(--surface-2) 70%, var(--border))',
    color: 'var(--muted)',
  },

  // Modal
  modalOverlay: {
    position: 'fixed',
    inset: 0,
    background: 'var(--overlay-scrim)',
    zIndex: 200,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },

  modal: {
    background: 'var(--surface)',
    borderRadius: 14,
    padding: 24,
    width: '100%',
    maxWidth: 360,
    boxShadow: 'var(--shadow-strong)',
  },

  modalTitle: {
    fontFamily: "'Fraunces', serif",
    fontSize: 18,
    fontWeight: 600,
    marginBottom: 14,
    color: 'var(--text)',
  },

  modalInput: {
    fontFamily: "'DM Sans', sans-serif",
    fontSize: 15,
    padding: '10px 14px',
    border: '1px solid var(--border)',
    borderRadius: 10,
    width: '100%',
    marginBottom: 14,
    color: 'var(--text)',
    background: 'var(--surface)',
  },

  modalBtns: {
    display: 'flex',
    gap: 8,
    justifyContent: 'flex-end',
  },

  modalCancel: {
    fontFamily: "'DM Sans', sans-serif",
    fontSize: 13,
    fontWeight: 500,
    padding: '8px 16px',
    border: '1px solid var(--border)',
    borderRadius: 8,
    background: 'var(--surface)',
    color: 'var(--muted)',
    cursor: 'pointer',
  },

  modalSave: {
    fontFamily: "'DM Sans', sans-serif",
    fontSize: 13,
    fontWeight: 600,
    padding: '8px 16px',
    border: 'none',
    borderRadius: 8,
    background: 'var(--accent)',
    color: 'var(--text-on-accent)',
    cursor: 'pointer',
  },

  startupSyncOverlay: {
    position: 'fixed',
    inset: 0,
    background: 'var(--overlay-scrim-soft)',
    zIndex: 300,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },

  startupSyncModal: {
    background: 'var(--surface)',
    borderRadius: 14,
    padding: '18px 20px 16px',
    width: '100%',
    maxWidth: 280,
    boxShadow: 'var(--shadow-strong)',
    border: '1px solid var(--border)',
    textAlign: 'center',
  },

  startupSyncGif: {
    width: 120,
    height: 120,
    objectFit: 'contain',
    display: 'block',
    margin: '0 auto 8px',
  },

  startupSyncFallback: {
    fontSize: 44,
    lineHeight: 1,
    marginBottom: 10,
  },

  startupSyncText: {
    fontFamily: "'DM Sans', sans-serif",
    fontSize: 14,
    fontWeight: 600,
    color: 'var(--muted)',
  },

  loadPresetsOverlay: {
    position: 'fixed',
    inset: 0,
    background: 'var(--overlay-scrim)',
    zIndex: 180,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
  },

  loadPresetsDialog: {
    width: '100%',
    maxWidth: 620,
    maxHeight: '88vh',
    overflow: 'hidden',
    border: '1px solid var(--border)',
    borderRadius: 14,
    background: 'var(--surface)',
    boxShadow: 'var(--shadow-strong)',
    display: 'flex',
    flexDirection: 'column',
  },

  loadPresetsHeader: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 8,
    padding: '12px 14px',
    borderBottom: '1px solid var(--border)',
  },

  loadPresetsTitle: {
    fontFamily: "'Fraunces', serif",
    fontSize: 18,
    fontWeight: 600,
    color: 'var(--text)',
  },

  loadPresetsCloseBtn: {
    fontFamily: "'DM Sans', sans-serif",
    border: '1px solid var(--border)',
    borderRadius: 8,
    background: 'var(--surface)',
    color: 'var(--muted)',
    minWidth: 34,
    height: 34,
    padding: 0,
    cursor: 'pointer',
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    lineHeight: 1,
    fontSize: 14,
  },

  loadPresetsBody: {
    padding: '12px 14px 14px',
    overflowY: 'auto',
  },
};
