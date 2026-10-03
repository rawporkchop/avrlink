// Small CSV parser so model names can contain commas or quoted characters.
export function parseCSV(text) {
  const rows = [];
  let row = [];
  let field = '';
  let quoted = false;

  for (let i = 0; i < text.length; i++) {
    const char = text[i];
    const next = text[i + 1];

    if (quoted) {
      if (char === '"' && next === '"') { field += '"'; i++; }
      else if (char === '"') quoted = false;
      else field += char;
    } else if (char === '"') quoted = true;
    else if (char === ',') { row.push(field.trim()); field = ''; }
    else if (char === '\n') { row.push(field.trim()); rows.push(row); row = []; field = ''; }
    else if (char !== '\r') field += char;
  }

  if (field || row.length) { row.push(field.trim()); rows.push(row); }
  return rows;
}

// Turns the CSV text into [{ brand, model, version, notes }, ...]
export function parseCompatibility(text) {
  const rows = parseCSV(text);
  if (!rows.length) return [];

  const headers = rows[0].map((h) => h.toLowerCase());
  const col = (name) => headers.indexOf(name);
  const brandIdx = col('brand');
  const modelIdx = col('model');
  const versionIdx = col('tested version');
  const notesIdx = col('notes');

  if (brandIdx === -1 || modelIdx === -1) {
    throw new Error('compatibility.csv must contain brand and model columns');
  }

  return rows
    .slice(1)
    .map((r) => ({
      brand: (r[brandIdx] || '').trim(),
      model: (r[modelIdx] || '').trim(),
      version: versionIdx === -1 ? '' : (r[versionIdx] || '').trim(),
      notes: notesIdx === -1 ? '' : (r[notesIdx] || '').trim(),
    }))
    .filter((m) => m.brand && m.model);
}
