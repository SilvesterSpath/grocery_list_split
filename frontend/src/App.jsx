import { useEffect, useRef, useState } from 'react';
import {
  createPreset,
  deletePreset as deletePresetApi,
  getState,
  overwritePreset,
  putGlobal,
} from './api/groceryApi.js';
import { AppHeader } from './components/AppHeader.jsx';
import { GroceryListPanel } from './components/GroceryListPanel.jsx';
import { PresetsPanel } from './components/PresetsPanel.jsx';
import { StartupSyncModal } from './components/StartupSyncModal.jsx';
import { defaultLists } from './data/data.js';
import { globalCSS, styles } from './styles/groceryAppStyles.js';
import {
  loadTheme,
  makeItem,
  saveTheme,
  translateKnownItemsInList,
  translateKnownPresets,
} from './utils/groceryHelpers.js';
import {
  DEFAULT_STORE_ZONE,
  ensureListWalkOrder,
  frontendItemsToPresetEntries,
  insertItemAtZoneTop,
  moveNeededItemToZoneTop,
  normalizeItem,
  presetEntriesToFrontendItems,
} from './utils/storeZones.js';

function normalizeItemsInList(items) {
  if (!Array.isArray(items)) return [];
  return ensureListWalkOrder(items.map((item) => normalizeItem(item)));
}

export default function GroceryApp() {
  const allowListAutoSave = useRef(false);
  const [theme, setTheme] = useState(loadTheme);
  const [items, setItems] = useState(() => []);
  const [presets, setPresets] = useState(() =>
    translateKnownPresets(defaultLists),
  );
  const [editingId, setEditingId] = useState(null);
  const [editingName, setEditingName] = useState('');
  const [newItemName, setNewItemName] = useState('');
  const [showSavePreset, setShowSavePreset] = useState(false);
  const [saveMode, setSaveMode] = useState('new');
  const [newPresetName, setNewPresetName] = useState('');
  const [presetSaveErrorMessage, setPresetSaveErrorMessage] = useState('');
  const [loadedPresetName, setLoadedPresetName] = useState('');
  const [selectedStoreZone, setSelectedStoreZone] =
    useState(DEFAULT_STORE_ZONE);
  const [dragState, setDragState] = useState(null);
  const [dragOver, setDragOver] = useState(null);
  const [isHydrating, setIsHydrating] = useState(true);
  const [isLoadPresetsOverlayOpen, setIsLoadPresetsOverlayOpen] =
    useState(false);

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    saveTheme(theme);
  }, [theme]);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const {
          items: apiItems,
          presets: apiPresets,
          activePresetName,
        } = await getState();
        if (cancelled) {
          return;
        }
        setItems(
          normalizeItemsInList(translateKnownItemsInList(apiItems ?? [])),
        );
        setPresets(translateKnownPresets(apiPresets ?? defaultLists));
        setLoadedPresetName(
          typeof activePresetName === 'string' ? activePresetName : '',
        );
        allowListAutoSave.current = true;
        setIsHydrating(false);
      } catch (err) {
        console.error('Failed to load grocery list from API', err);
        if (!cancelled) setIsHydrating(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (!allowListAutoSave.current) {
      return;
    }
    putGlobal(items, loadedPresetName).catch((err) => {
      console.error('Failed to save grocery list to API', err);
    });
  }, [items, loadedPresetName]);

  useEffect(() => {
    if (!isLoadPresetsOverlayOpen) return;
    const onKeyDown = (e) => {
      if (e.key === 'Escape') {
        setIsLoadPresetsOverlayOpen(false);
      }
    };
    document.addEventListener('keydown', onKeyDown);
    return () => {
      document.removeEventListener('keydown', onKeyDown);
    };
  }, [isLoadPresetsOverlayOpen]);

  const addItem = () => {
    const name = newItemName.trim();
    if (!name) return;
    setItems((prev) =>
      ensureListWalkOrder(
        insertItemAtZoneTop(
          prev,
          makeItem(name, { storeZone: selectedStoreZone }),
        ),
      ),
    );
    setNewItemName('');
  };

  const deleteItem = (id) => {
    setItems((prev) => prev.filter((i) => i.id !== id));
  };

  const changeStoreZone = (id, zone) => {
    setItems((prev) =>
      ensureListWalkOrder(moveNeededItemToZoneTop(prev, id, zone)),
    );
  };

  const toggleNeeded = (id) =>
    setItems((prev) =>
      ensureListWalkOrder(
        prev.map((i) => {
          if (i.id !== id) return i;
          const nextNeeded = !i.needed;
          return {
            ...i,
            needed: nextNeeded,
            bought: nextNeeded ? i.bought : false,
          };
        }),
      ),
    );

  const toggleBought = (id) =>
    setItems((prev) =>
      ensureListWalkOrder(
        prev.map((i) => (i.id === id ? { ...i, bought: !i.bought } : i)),
      ),
    );

  const startEdit = (item) => {
    setEditingId(item.id);
    setEditingName(item.name);
  };

  const commitEdit = (id) => {
    const name = editingName.trim();
    if (name) {
      setItems((prev) => prev.map((i) => (i.id === id ? { ...i, name } : i)));
    }
    setEditingId(null);
  };

  const handleEditKey = (e, id) => {
    if (e.key === 'Enter') commitEdit(id);
    if (e.key === 'Escape') setEditingId(null);
  };

  const addFromPreset = (presetName, mode) => {
    console.log('debug addFromPreset called', { presetName, mode });
    const presetItems = presets[presetName] || [];
    const newItems = presetEntriesToFrontendItems(presetItems);

    if (items.length === 0) {
      setItems(ensureListWalkOrder(newItems));
      console.log('debug loadedPresetName set from addFromPreset empty-list', {
        presetName,
      });
      setLoadedPresetName(presetName);
      setIsLoadPresetsOverlayOpen(false);
      return;
    }

    const choice = (mode ?? '').trim().toLowerCase();
    if (choice === 'add') {
      setItems(ensureListWalkOrder([...items, ...newItems]));
      console.log('debug loadedPresetName set from addFromPreset add', {
        presetName,
      });
      setLoadedPresetName(presetName);
      setIsLoadPresetsOverlayOpen(false);
      return;
    }
    if (choice === 'replace') {
      setItems(ensureListWalkOrder(newItems));
      console.log('debug loadedPresetName set from addFromPreset replace', {
        presetName,
      });
      setLoadedPresetName(presetName);
      setIsLoadPresetsOverlayOpen(false);
      return;
    }

    window.alert('Válassz műveletet: hozzáadás vagy csere.');
  };

  const handleOpenSavePreset = () => {
    const hasActivePreset = loadedPresetName.trim() !== '';
    setSaveMode(hasActivePreset ? 'overwrite' : 'new');
    setPresetSaveErrorMessage('');
    setNewPresetName('');
    setShowSavePreset(true);
  };

  const handleOpenLoadPresetsOverlay = () => {
    setIsLoadPresetsOverlayOpen(true);
  };

  const handleCloseLoadPresetsOverlay = () => {
    setIsLoadPresetsOverlayOpen(false);
  };

  const saveAsPreset = async () => {
    const presetEntries = frontendItemsToPresetEntries(items);
    const activePresetName = loadedPresetName.trim();
    const canOverwriteActive = activePresetName !== '';

    if (saveMode === 'overwrite' && canOverwriteActive) {
      try {
        await overwritePreset(activePresetName, presetEntries);
      } catch (err) {
        console.error('Failed to overwrite active preset on API', err);
        setPresetSaveErrorMessage('Nem sikerült felülírni a listát.');
        return;
      }

      setPresets((prev) => {
        const next = { ...prev };
        delete next[activePresetName];
        return { [activePresetName]: presetEntries, ...next };
      });
      setPresetSaveErrorMessage('');
      setShowSavePreset(false);
      return;
    }

    const name = newPresetName.trim();
    if (!name) {
      setPresetSaveErrorMessage('Adj meg egy lista nevet.');
      return;
    }

    const exists = Object.prototype.hasOwnProperty.call(presets, name);
    if (exists) {
      try {
        await overwritePreset(name, presetEntries);
      } catch (err) {
        console.error('Failed to overwrite preset on API', err);
        setPresetSaveErrorMessage('Nem sikerült felülírni a listát.');
        return;
      }
    } else {
      try {
        await createPreset(name, presetEntries);
      } catch (err) {
        console.error('Failed to create preset on API', err);
        setPresetSaveErrorMessage('Nem sikerült menteni az új listát.');
        return;
      }
    }

    setPresets((prev) => {
      const next = { ...prev };
      delete next[name];
      return { [name]: presetEntries, ...next };
    });
    setLoadedPresetName(name);
    setPresetSaveErrorMessage('');
    setNewPresetName('');
    setShowSavePreset(false);
  };

  const deletePreset = async (name) => {
    const shouldDelete = window.confirm(
      'Biztosan töröljük ezt a mentett listát?',
    );
    if (!shouldDelete) return;

    try {
      await deletePresetApi(name);
    } catch (err) {
      console.error('Failed to delete preset on API', err);
      return;
    }

    setPresets((prev) => {
      const next = { ...prev };
      delete next[name];
      return next;
    });
  };

  const clearAll = () => {
    const shouldClear = window.confirm('Biztosan töröljük az egész listát?');
    if (!shouldClear) return;
    setItems([]);
    console.log('debug loadedPresetName clear from clearAll');
    setLoadedPresetName('');
  };

  const handleDragStart = (e, id) => {
    setDragState(id);
    e.dataTransfer.effectAllowed = 'move';
  };
  const handleDragOver = (e, id) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    setDragOver(id);
  };
  const handleDrop = (e, targetId) => {
    e.preventDefault();
    if (!dragState || dragState === targetId) return;
    setItems((prev) => {
      const next = [...prev];
      const fromIdx = next.findIndex((i) => i.id === dragState);
      const toIdx = next.findIndex((i) => i.id === targetId);
      const [moved] = next.splice(fromIdx, 1);
      next.splice(toIdx, 0, moved);
      return ensureListWalkOrder(next);
    });
    setDragState(null);
    setDragOver(null);
  };
  const handleDragEnd = () => {
    setDragState(null);
    setDragOver(null);
  };

  const neededItems = items.filter((i) => i.needed);
  const haveItems = items.filter((i) => !i.needed);
  const boughtCount = items.filter((i) => i.bought).length;
  const remainingNeededCount = neededItems.filter((i) => !i.bought).length;

  return (
    <div style={styles.root}>
      <style>{globalCSS}</style>

      <AppHeader
        theme={theme}
        onToggleTheme={() => setTheme((t) => (t === 'dark' ? 'light' : 'dark'))}
        boughtCount={boughtCount}
        itemCount={remainingNeededCount}
      />

      <main style={styles.main}>
        <GroceryListPanel
          items={items}
          neededItems={neededItems}
          haveItems={haveItems}
          newItemName={newItemName}
          onNewItemNameChange={setNewItemName}
          onAddItem={addItem}
          selectedStoreZone={selectedStoreZone}
          onSelectedStoreZoneChange={setSelectedStoreZone}
          showSavePreset={showSavePreset}
          onOpenSavePreset={handleOpenSavePreset}
          onOpenPresetOverlay={handleOpenLoadPresetsOverlay}
          onCloseSavePreset={() => {
            setShowSavePreset(false);
            setPresetSaveErrorMessage('');
          }}
          newPresetName={newPresetName}
          onNewPresetNameChange={setNewPresetName}
          existingPresetNames={Object.keys(presets)}
          onSaveAsPreset={saveAsPreset}
          saveMode={saveMode}
          onSaveModeChange={setSaveMode}
          activePresetName={loadedPresetName}
          presetSaveErrorMessage={presetSaveErrorMessage}
          onClearAll={clearAll}
          loadedPresetName={loadedPresetName}
          editingId={editingId}
          editingName={editingName}
          setEditingName={setEditingName}
          onStartEdit={startEdit}
          onCommitEdit={commitEdit}
          onEditKey={handleEditKey}
          onToggleNeeded={toggleNeeded}
          onToggleBought={toggleBought}
          onDeleteItem={deleteItem}
          onChangeStoreZone={changeStoreZone}
          dragState={dragState}
          dragOver={dragOver}
          onDragStart={handleDragStart}
          onDragOver={handleDragOver}
          onDrop={handleDrop}
          onDragEnd={handleDragEnd}
        />
      </main>

      {isLoadPresetsOverlayOpen && (
        <div
          style={styles.loadPresetsOverlay}
          role='dialog'
          aria-modal='true'
          aria-labelledby='load-presets-overlay-title'
          onClick={handleCloseLoadPresetsOverlay}
        >
          <div
            style={styles.loadPresetsDialog}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={styles.loadPresetsHeader}>
              <div
                id='load-presets-overlay-title'
                style={styles.loadPresetsTitle}
              >
                Lista betöltése
              </div>
              <button
                type='button'
                style={styles.loadPresetsCloseBtn}
                aria-label='Lista betöltése panel bezárása'
                onClick={handleCloseLoadPresetsOverlay}
              >
                ✕
              </button>
            </div>
            <div style={styles.loadPresetsBody}>
              <PresetsPanel
                presets={presets}
                mainListItemCount={items.length}
                onAddFromPreset={addFromPreset}
                onDeletePreset={deletePreset}
              />
            </div>
          </div>
        </div>
      )}

      {isHydrating && <StartupSyncModal />}
    </div>
  );
}
