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
import { defaultLists } from './data/data.js';
import { globalCSS, styles } from './styles/groceryAppStyles.js';
import {
  loadTheme,
  makeItem,
  saveTheme,
  translateKnownItemsInList,
  translateKnownPresets,
} from './utils/groceryHelpers.js';

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
  const [dragState, setDragState] = useState(null);
  const [dragOver, setDragOver] = useState(null);
  const [activeTab, setActiveTab] = useState('list');

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
        setItems(translateKnownItemsInList(apiItems ?? []));
        setPresets(translateKnownPresets(apiPresets ?? defaultLists));
        setLoadedPresetName(
          typeof activePresetName === 'string' ? activePresetName : '',
        );
        allowListAutoSave.current = true;
      } catch (err) {
        console.error('Failed to load grocery list from API', err);
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

  const addItem = () => {
    const name = newItemName.trim();
    if (!name) return;
    setItems((prev) => [...prev, makeItem(name)]);
    setNewItemName('');
  };

  const deleteItem = (id) => {
    setItems((prev) => prev.filter((i) => i.id !== id));
  };

  const toggleNeeded = (id) =>
    setItems((prev) =>
      prev.map((i) => (i.id === id ? { ...i, needed: !i.needed } : i)),
    );

  const toggleBought = (id) =>
    setItems((prev) => {
      const idx = prev.findIndex((i) => i.id === id);
      if (idx === -1) return prev;

      const current = prev[idx];
      const nextItem = { ...current, bought: !current.bought };

      const without = [...prev.slice(0, idx), ...prev.slice(idx + 1)];

      // When an item is checked (put in basket), move it to the bottom.
      if (nextItem.bought) return [...without, nextItem];

      // When unchecked, move it back above bought items.
      const firstBoughtIdx = without.findIndex((i) => i.bought);
      if (firstBoughtIdx === -1) return [...without, nextItem];
      return [
        ...without.slice(0, firstBoughtIdx),
        nextItem,
        ...without.slice(firstBoughtIdx),
      ];
    });

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
    const newItems = presetItems.map(makeItem);

    if (items.length === 0) {
      setItems(newItems);
      console.log('debug loadedPresetName set from addFromPreset empty-list', {
        presetName,
      });
      setLoadedPresetName(presetName);
      setActiveTab('list');
      return;
    }

    const choice = (mode ?? '').trim().toLowerCase();
    if (choice === 'add') {
      setItems([...items, ...newItems]);
      console.log('debug loadedPresetName set from addFromPreset add', {
        presetName,
      });
      setLoadedPresetName(presetName);
      setActiveTab('list');
      return;
    }
    if (choice === 'replace') {
      setItems(newItems);
      console.log('debug loadedPresetName set from addFromPreset replace', {
        presetName,
      });
      setLoadedPresetName(presetName);
      setActiveTab('list');
      return;
    }

    window.alert('Válassz műveletet: add vagy replace.');
  };

  const handleOpenSavePreset = () => {
    const hasActivePreset = loadedPresetName.trim() !== '';
    setSaveMode(hasActivePreset ? 'overwrite' : 'new');
    setPresetSaveErrorMessage('');
    setNewPresetName('');
    setShowSavePreset(true);
  };

  const saveAsPreset = async () => {
    const names = items.map((i) => i.name);
    const activePresetName = loadedPresetName.trim();
    const canOverwriteActive = activePresetName !== '';

    if (saveMode === 'overwrite' && canOverwriteActive) {
      try {
        await overwritePreset(activePresetName, names);
      } catch (err) {
        console.error('Failed to overwrite active preset on API', err);
        setPresetSaveErrorMessage('Nem sikerült felülírni a listát.');
        return;
      }

      setPresets((prev) => {
        const next = { ...prev };
        delete next[activePresetName];
        return { [activePresetName]: names, ...next };
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
        await overwritePreset(name, names);
      } catch (err) {
        console.error('Failed to overwrite preset on API', err);
        setPresetSaveErrorMessage('Nem sikerült felülírni a listát.');
        return;
      }
    } else {
      try {
        await createPreset(name, names);
      } catch (err) {
        console.error('Failed to create preset on API', err);
        setPresetSaveErrorMessage('Nem sikerült menteni az új listát.');
        return;
      }
    }

    setPresets((prev) => {
      const next = { ...prev };
      delete next[name];
      return { [name]: names, ...next };
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

  const clearBought = () => {
    setItems((prev) => prev.filter((i) => !i.bought));
    console.log('debug loadedPresetName clear from clearBought');
    setLoadedPresetName('');
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
      return next;
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

  return (
    <div style={styles.root}>
      <style>{globalCSS}</style>

      <AppHeader
        theme={theme}
        onToggleTheme={() => setTheme((t) => (t === 'dark' ? 'light' : 'dark'))}
        boughtCount={boughtCount}
        itemCount={items.length}
        activeTab={activeTab}
        onTabChange={setActiveTab}
      />

      <main style={styles.main}>
        {activeTab === 'list' && (
          <GroceryListPanel
            items={items}
            neededItems={neededItems}
            haveItems={haveItems}
            boughtCount={boughtCount}
            newItemName={newItemName}
            onNewItemNameChange={setNewItemName}
            onAddItem={addItem}
            showSavePreset={showSavePreset}
            onOpenSavePreset={handleOpenSavePreset}
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
            onClearBought={clearBought}
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
            dragState={dragState}
            dragOver={dragOver}
            onDragStart={handleDragStart}
            onDragOver={handleDragOver}
            onDrop={handleDrop}
            onDragEnd={handleDragEnd}
          />
        )}

        {activeTab === 'presets' && (
          <PresetsPanel
            presets={presets}
            mainListItemCount={items.length}
            onAddFromPreset={addFromPreset}
            onDeletePreset={deletePreset}
          />
        )}
      </main>
    </div>
  );
}
