class GroceryApiError extends Error {
  constructor({ status, message }) {
    super(message);
    this.name = 'GroceryApiError';
    this.status = status;
  }
}

function getApiBaseUrl() {
  // In Vercel you can set VITE_API_BASE_URL to your Render API origin.
  return import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:5000';
}

function toUrl(path) {
  const base = getApiBaseUrl();
  if (!base) return path;
  if (path.startsWith('/')) return `${base}${path}`;
  return `${base}/${path}`;
}

async function requestJSON(url, { method = 'GET', body } = {}) {
  const res = await fetch(url, {
    method,
    headers: body ? { 'Content-Type': 'application/json' } : undefined,
    body: body ? JSON.stringify(body) : undefined,
  });

  if (!res.ok) {
    let message = `Request failed with ${res.status}`;
    try {
      const data = await res.json();
      if (typeof data?.message === 'string') message = data.message;
    } catch {
      // ignore invalid json body
    }
    throw new GroceryApiError({ status: res.status, message });
  }

  return res.json();
}

export async function getState() {
  return requestJSON(toUrl('/api/state'));
}

export async function putGlobal(itemsNames) {
  return requestJSON(toUrl('/api/global'), {
    method: 'PUT',
    body: { itemsNames },
  });
}

export async function createPreset(name, itemsNames) {
  return requestJSON(toUrl('/api/presets'), {
    method: 'POST',
    body: { name, itemsNames },
  });
}

export async function overwritePreset(name, itemsNames) {
  const encoded = encodeURIComponent(name);
  return requestJSON(toUrl(`/api/presets/${encoded}`), {
    method: 'PUT',
    body: { itemsNames },
  });
}

export async function deletePreset(name) {
  const encoded = encodeURIComponent(name);
  return requestJSON(toUrl(`/api/presets/${encoded}`), { method: 'DELETE' });
}

