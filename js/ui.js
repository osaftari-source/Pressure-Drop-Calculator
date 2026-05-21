let calcMethod = 'darcy';
let minorMethod = 'leq';

function $(id) { return document.getElementById(id); }
function setText(id, val) { const el = $(id); if (el) el.textContent = val; }
function toggleHidden(id, hide) { const el = $(id); if (el) el.classList.toggle('hidden', hide); }
function isWaterFluid(key) { return key === 'water' || key === 'water_hot'; }
function isGasFluid(key) { return ['air', 'nat_gas', 'steam'].includes(key); }
function isCustomFluid(key) { return key === 'custom_fluid'; }

function buildNPSSelect() {
  const sel = $('nps');
  Object.keys(NPS_DATA).forEach(n => {
    const o = document.createElement('option');
    o.value = n; o.textContent = 'NPS ' + n + '"';
    sel.appendChild(o);
  });
  sel.value = '4';
  buildScheduleSelect();
}

function buildScheduleSelect() {
  const nps = $('nps').value;
  const sel = $('schedule');
  sel.innerHTML = '';
  const scheds = NPS_DATA[nps].scheds;
  const order = ['10','20','30','40','60','80','100','120','140','160','STD','XS','XXS'];
  order.filter(s => scheds[s]).forEach(s => {
    const o = document.createElement('option');
    o.value = s; o.textContent = ['STD','XS','XXS'].includes(s) ? s : 'Sch ' + s;
    sel.appendChild(o);
  });
  sel.value = scheds['40'] ? '40' : scheds['STD'] ? 'STD' : Object.keys(scheds)[0];
  updatePipeInfo();
}

function updatePipeInfo() {
  const geom = getPipeGeometry($('nps').value, $('schedule').value);
  if (!geom) return;
  const mat = $('material').value;
  const eps = mat === 'custom_mat' ? (parseFloat($('custom-eps').value) || 0.046) : MATERIAL_EPS[mat];
  const eD = eps / 1000 / geom.D;
  setText('info-od', geom.od.toFixed(1));
  setText('info-wt', geom.wt.toFixed(2));
  setText('info-id', geom.id_mm.toFixed(2));
  setText('info-area', geom.area_cm2.toFixed(2));
  setText('info-ed', eD.toExponential(2));
  toggleHidden('custom-roughness-field', mat !== 'custom_mat');
  updateFlowInfo();
}

function getFluidProps() {
  const key = $('fluid-type').value;
  if (key === 'custom_fluid') {
    return {
      key,
      rho: parseFloat($('cust-rho').value),
      mu: parseFloat($('cust-mu').value),
      name: $('cust-name').value || 'Custom fluid',
      class: 'custom',
      service: 'custom'
    };
  }
  const fd = FLUID_DATA[key];
  return { key, rho: fd.rho, mu: fd.mu, name: fd.name, class: fd.class, service: fd.service };
}

function updateFlowInfo() {
  const fluid = getFluidProps();
  const geom = getPipeGeometry($('nps').value, $('schedule').value);
  setText('fl-rho', Number.isFinite(fluid.rho) ? fluid.rho.toFixed(3).replace(/\.000$/, '') : '—');
  setText('fl-mu', Number.isFinite(fluid.mu) ? fluid.mu.toFixed(3) : '—');
  setText('fluid-class', fluid.service === 'gas' ? 'Gas / vapor' : fluid.service === 'custom' ? 'Custom' : isWaterFluid(fluid.key) ? 'Water service' : 'Liquid');
  if (!geom || !(fluid.rho > 0) || !(fluid.mu > 0)) return;
  const flowVal = parseFloat($('flowrate').value);
  const Q = getQ_m3s(Number.isFinite(flowVal) ? flowVal : 0, $('flow-unit').value, fluid.rho);
  const V = Q / geom.A;
  const Re = fluid.rho * V * geom.D / (fluid.mu * 1e-3);
  setText('fl-vel', Number.isFinite(V) ? V.toFixed(3) : '—');
  setText('fl-re', Number.isFinite(Re) ? Re.toFixed(0) : '—');
  setText('fl-regime', flowRegime(Re));
}

function updateMethodOptions() {
  const fluidKey = $('fluid-type').value;
  const hazenBtn = $('btn-hazen');
  const water = isWaterFluid(fluidKey);

  hazenBtn.disabled = !water;
  hazenBtn.classList.toggle('disabled', !water);
  if (!water && calcMethod === 'hazen') calcMethod = 'darcy';

  if (calcMethod === 'hazen') minorMethod = 'leq';
  $('btn-darcy').classList.toggle('active', calcMethod === 'darcy');
  $('btn-hazen').classList.toggle('active', calcMethod === 'hazen');
  $('btn-leq').classList.toggle('active', minorMethod === 'leq');
  $('btn-k').classList.toggle('active', minorMethod === 'k');
  $('btn-k').disabled = calcMethod === 'hazen';
  $('btn-k').classList.toggle('disabled', calcMethod === 'hazen');
  toggleHidden('minor-method-wrap', false);
  toggleHidden('hazen-c-wrap', calcMethod !== 'hazen');
  updateHazenCDefault();
  updateMethodGuidance();
  updateFittingTitles();
}

function updateHazenCDefault() {
  if (calcMethod !== 'hazen') return;
  const key = $('fluid-type').value;
  const fd = FLUID_DATA[key];
  if (fd && fd.hw_c && (!$('hazen-c').dataset.userEdited)) $('hazen-c').value = fd.hw_c;
}

function updateMethodGuidance() {
  const key = $('fluid-type').value;
  const fd = FLUID_DATA[key];
  let msg = '';
  if (isWaterFluid(key)) {
    msg = 'Both Darcy-Weisbach and Hazen-Williams are available for water service. Darcy-Weisbach is more general. Hazen-Williams is commonly used for water piping with equivalent length approach.';
  } else if (isGasFluid(key)) {
    msg = 'Darcy-Weisbach is available as a preliminary incompressible estimate. For detailed gas or steam design, compressible flow calculation and operating condition data are required.';
  } else if (isCustomFluid(key)) {
    msg = 'Darcy-Weisbach is used for custom fluid. Ensure density and viscosity are entered at operating condition.';
  } else {
    msg = 'Darcy-Weisbach is recommended for this fluid. Hazen-Williams is intended for water service only.';
  }
  $('method-guidance').textContent = msg;
}

function buildFittings() {
  const grid = $('fitting-grid');
  grid.innerHTML = '';
  FITTINGS.forEach(fit => {
    const div = document.createElement('div');
    div.className = 'fitting-row';
    div.innerHTML = `<label id="label_${fit.id}" title="L/D=${fit.ld || '—'} | K=${fit.k || '—'}">${fit.name}</label><input type="number" id="fit_${fit.id}" value="0" min="0" step="1">`;
    grid.appendChild(div);
  });
  updateFittingTitles();
}

function updateFittingTitles() {
  FITTINGS.forEach(fit => {
    const label = $('label_' + fit.id);
    if (!label) return;
    const data = calcMethod === 'hazen' || minorMethod === 'leq'
      ? (fit.ld > 0 ? `L/D = ${fit.ld}` : 'L/D unavailable')
      : (fit.k > 0 ? `K = ${fit.k}` : 'K unavailable');
    label.title = `${fit.name} | ${data}`;
  });
}

function validateInputs(inputs) {
  const errors = [];
  const geom = getPipeGeometry(inputs.nps, inputs.schedule);
  if (!geom) errors.push('Selected pipe size and schedule data is not available.');
  if (!(inputs.flowVal > 0)) errors.push('Flow rate must be greater than zero.');
  if (!(inputs.pipeLen >= 0)) errors.push('Pipe length cannot be negative.');
  if (!(inputs.rho > 0)) errors.push('Density must be greater than zero.');
  if (!(inputs.mu_cp > 0)) errors.push('Viscosity must be greater than zero.');
  if (inputs.materialKey === 'custom_mat' && !(inputs.epsCustom > 0)) errors.push('Custom roughness must be greater than zero.');
  if (inputs.calcMethod === 'hazen' && !(inputs.hazenC > 0)) errors.push('Hazen-Williams C factor must be greater than zero.');
  if (inputs.calcMethod === 'hazen' && !isWaterFluid(inputs.fluidKey)) errors.push('Hazen-Williams is available only for water service.');
  FITTINGS.forEach(f => {
    const raw = $('fit_' + f.id).value;
    const qty = Number(raw);
    if (raw !== '' && (!Number.isInteger(qty) || qty < 0)) errors.push(`${f.name}: fitting quantity must be a whole number and cannot be negative.`);
  });
  return errors;
}

function getInputs() {
  const fluid = getFluidProps();
  const fittingQty = {};
  FITTINGS.forEach(f => { fittingQty[f.id] = Number($('fit_' + f.id).value || 0); });
  return {
    nps: $('nps').value,
    schedule: $('schedule').value,
    materialKey: $('material').value,
    epsCustom: parseFloat($('custom-eps').value),
    pipeLen: parseFloat($('pipe-len').value),
    elevation: parseFloat($('elevation').value) || 0,
    fluidKey: fluid.key,
    rho: fluid.rho,
    mu_cp: fluid.mu,
    flowVal: parseFloat($('flowrate').value),
    flowUnit: $('flow-unit').value,
    calcMethod,
    minorMethod,
    hazenC: parseFloat($('hazen-c').value),
    fittingQty
  };
}

function showValidation(errors) {
  const box = $('validation-box');
  if (!errors.length) { box.classList.add('hidden'); box.innerHTML = ''; return; }
  box.innerHTML = '<strong>Please fix the following inputs:</strong><ul>' + errors.map(e => `<li>${e}</li>`).join('') + '</ul>';
  box.classList.remove('hidden');
}

function fmt(x, d = 4) { return Number.isFinite(x) ? x.toFixed(d) : '—'; }
function addTableRow(tbody, cells, isTotal = false) {
  const tr = document.createElement('tr');
  if (isTotal) tr.className = 'total-row';
  tr.innerHTML = cells.map(c => `<td>${c}</td>`).join('');
  tbody.appendChild(tr);
}

function renderResults(res) {
  const { result, fittingRows, inputs } = res;
  const badge = $('result-method-badge');
  badge.className = result.method === 'hazen' ? 'badge badge-teal' : 'badge badge-blue';
  badge.textContent = result.label;

  setText('out-dp', fmt(result.dp_total_kgcm2, 4));
  setText('out-vel', fmt(result.velocity, 3));
  setText('out-re', fmt(result.Re, 0));
  setText('out-regime', result.regime);
  if (result.method === 'hazen') {
    setText('out-factor-label', 'Hazen C');
    setText('out-factor', String(result.C));
    setText('out-factor-unit', `S = ${fmt(result.S, 6)}`);
    setText('result-summary', `Total head = ${fmt(result.totalHead, 3)} m · Total ΔP = ${fmt(result.dp_total_kpa, 2)} kPa · Minor loss basis = L/D equivalent length.`);
  } else {
    setText('out-factor-label', 'Friction factor');
    setText('out-factor', fmt(result.f, 5));
    setText('out-factor-unit', inputs.minorMethod === 'leq' ? 'Minor loss: L/D method' : 'Minor loss: K-method');
    setText('result-summary', `Total head = ${fmt(result.totalHead, 3)} m · Total ΔP = ${fmt(result.dp_total_kpa, 2)} kPa.`);
  }

  const cbody = $('component-breakdown-body');
  cbody.innerHTML = '';
  result.breakdown.forEach(r => addTableRow(cbody, [r.component, fmt(r.head_m, 3), fmt(r.dp_kgcm2, 5)], r.total));

  const fbody = $('fitting-status-body');
  fbody.innerHTML = '';
  if (!fittingRows.length) addTableRow(fbody, ['No fittings entered', '—', '—', '—']);
  fittingRows.forEach(r => addTableRow(fbody, [r.name, r.qty, r.dataUsed, r.status]));

  renderVelocityCheck(result.velocity, inputs.fluidKey);
  renderEngineeringNotes(inputs);

  toggleHidden('results', false);
  $('results').scrollIntoView({ behavior: 'smooth', block: 'start' });
}

function renderVelocityCheck(V, fluidKey) {
  const vc = $('vel-check');
  let cls = 'vel-ok';
  let msg = '';
  if (isGasFluid(fluidKey)) {
    cls = 'vel-warn';
    msg = `Velocity ${fmt(V, 2)} m/s — Preliminary only. Gas/air/steam velocity limits depend on operating pressure, density, noise, erosion, and line service. Review with project criteria.`;
  } else if (isCustomFluid(fluidKey)) {
    cls = 'vel-warn';
    msg = `Velocity ${fmt(V, 2)} m/s — Review required. Custom fluid selected; verify acceptable velocity against project/service criteria.`;
  } else {
    if (V < 0.6) { cls = 'vel-warn'; msg = `Velocity ${fmt(V, 2)} m/s — Low. Check risk of settling, poor flushing, or oversized pipe.`; }
    else if (V <= 3.0) { cls = 'vel-ok'; msg = `Velocity ${fmt(V, 2)} m/s — Typical. Velocity is within typical liquid piping range.`; }
    else { cls = 'vel-bad'; msg = `Velocity ${fmt(V, 2)} m/s — High. Review pressure drop, erosion, noise, and pipe size.`; }
  }
  vc.className = cls;
  vc.textContent = msg;
}

function renderEngineeringNotes(inputs) {
  const notes = [
    'Preliminary pressure drop estimation.',
    'Single-phase flow only; pipe is assumed flowing full.',
    'Fluid properties are assumed constant.',
    'Pipe dimensions are based on ASME B36.10 data available in this app.',
    'Fitting K and L/D values are generic preliminary values.',
    'For detailed design, verify with project standard, vendor data, or recognized hydraulic references.'
  ];
  if (inputs.calcMethod === 'darcy') notes.splice(3, 0, 'Darcy-Weisbach uses incompressible flow approach.');
  if (isGasFluid(inputs.fluidKey)) notes.splice(4, 0, 'Gas/air/steam results are preliminary unless density and viscosity are entered at operating condition.');
  if (inputs.calcMethod === 'hazen') notes.splice(3, 0, 'Hazen-Williams is used only for water service with L/D / equivalent length approach.');
  const ul = $('engineering-notes');
  ul.innerHTML = notes.map(n => `<li>${n}</li>`).join('');
}

function onCalculate() {
  const inputs = getInputs();
  const errors = validateInputs(inputs);
  showValidation(errors);
  if (errors.length) return;
  const res = calculate(inputs);
  renderResults(res);
}

function bindEvents() {
  $('nps').addEventListener('change', buildScheduleSelect);
  $('schedule').addEventListener('change', updatePipeInfo);
  $('material').addEventListener('change', updatePipeInfo);
  $('custom-eps').addEventListener('input', updatePipeInfo);
  $('fluid-type').addEventListener('change', () => {
    toggleHidden('custom-fluid-fields', $('fluid-type').value !== 'custom_fluid');
    updateMethodOptions(); updateFlowInfo();
  });
  ['flowrate','flow-unit','cust-rho','cust-mu','pipe-len','elevation'].forEach(id => $(id).addEventListener('input', updateFlowInfo));
  $('flow-unit').addEventListener('change', updateFlowInfo);
  $('hazen-c').addEventListener('input', () => { $('hazen-c').dataset.userEdited = '1'; });
  $('btn-darcy').addEventListener('click', () => { calcMethod = 'darcy'; updateMethodOptions(); });
  $('btn-hazen').addEventListener('click', () => { if (!$('btn-hazen').disabled) { calcMethod = 'hazen'; updateMethodOptions(); } });
  $('btn-leq').addEventListener('click', () => { minorMethod = 'leq'; updateMethodOptions(); });
  $('btn-k').addEventListener('click', () => { if (!$('btn-k').disabled) { minorMethod = 'k'; updateMethodOptions(); } });
  $('calc-btn').addEventListener('click', onCalculate);
}

document.addEventListener('DOMContentLoaded', () => {
  buildNPSSelect();
  buildFittings();
  bindEvents();
  toggleHidden('custom-fluid-fields', true);
  updateMethodOptions();
  updateFlowInfo();
});
