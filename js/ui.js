let calcMethod = 'darcy';
let minorMethod = 'leq';

function $(id) { return document.getElementById(id); }
function setText(id, val) { const el = $(id); if (el) el.textContent = val; }
function toggleHidden(id, hide) { const el = $(id); if (el) el.classList.toggle('hidden', hide); }
function isWaterFluid(key) { return key === 'water' || key === 'water_hot'; }
function isGasFluid(key) { return ['air', 'nat_gas', 'steam'].includes(key); }
function isCustomFluid(key) { return key === 'custom_fluid'; }
function getVelocityGuideline(id) {
  return VELOCITY_GUIDELINES.find(g => g.id === id) || VELOCITY_GUIDELINES[0];
}

function isSteamFluid(key) { return key === 'steam'; }

function getSteamPressureInfo() {
  const raw = $('steam-pressure') ? $('steam-pressure').value.trim() : '';
  const pressure = parseFloat(raw);
  const unit = $('steam-pressure-unit') ? $('steam-pressure-unit').value : 'barG';
  const pressureBarA = steamPressureToBarA(pressure, unit);
  const rho = saturatedSteamDensity(pressureBarA);
  return { raw, pressure, unit, pressureBarA, rho };
}

function updateSteamConditionUI() {
  const isSteam = $('fluid-type').value === 'steam';
  toggleHidden('steam-condition-fields', !isSteam);
  toggleHidden('steam-pressure-help', !isSteam);
  const readout = $('steam-density-readout');
  if (!readout) return;
  if (!isSteam) {
    readout.textContent = '—';
    return;
  }
  const info = getSteamPressureInfo();
  const minP = SAT_STEAM_DENSITY_TABLE[0].p_barA;
  const maxP = SAT_STEAM_DENSITY_TABLE[SAT_STEAM_DENSITY_TABLE.length - 1].p_barA;
  if (!info.raw) {
    readout.textContent = 'Enter steam pressure';
  } else if (!(info.pressure > 0) || !Number.isFinite(info.pressureBarA)) {
    readout.textContent = 'Invalid pressure';
  } else if (!Number.isFinite(info.rho)) {
    readout.textContent = `Out of table range (${minP}–${maxP} barA)`;
  } else {
    readout.textContent = `${info.rho.toFixed(3)} kg/m³ at ${info.pressureBarA.toFixed(3)} barA`;
  }
}

function buildVelocityGuidelineSelect() {
  const sel = $('velocity-basis');
  sel.innerHTML = '';
  const groups = [];
  VELOCITY_GUIDELINES.forEach(guide => {
    if (!groups.includes(guide.group)) groups.push(guide.group);
  });
  groups.forEach(group => {
    const optgroup = document.createElement('optgroup');
    optgroup.label = group;
    VELOCITY_GUIDELINES.filter(g => g.group === group).forEach(guide => {
      const option = document.createElement('option');
      option.value = guide.id;
      option.textContent = guide.label;
      optgroup.appendChild(option);
    });
    sel.appendChild(optgroup);
  });
  setSuggestedVelocityGuideline($('fluid-type').value);
}

function setSuggestedVelocityGuideline(fluidKey) {
  const suggested = DEFAULT_VELOCITY_GUIDELINE[fluidKey] || 'none';
  $('velocity-basis').value = suggested;
}

function formatVelocityReference(guide) {
  if (!guide || guide.type === 'none') return 'No selected reference';
  if (guide.type === 'range') return `${guide.min.toFixed(2)}–${guide.max.toFixed(2)} m/s`;
  return `${guide.target.toFixed(2)} m/s (reference value)`;
}


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
  const customEps = parseFloat($('custom-eps').value);
  const eps = mat === 'custom_mat' ? customEps : MATERIAL_EPS[mat];
  const eD = Number.isFinite(eps) && eps > 0 ? eps / 1000 / geom.D : null;
  setText('info-od', geom.od.toFixed(1));
  setText('info-wt', geom.wt.toFixed(2));
  setText('info-id', geom.id_mm.toFixed(2));
  setText('info-area', geom.area_cm2.toFixed(2));
  setText('info-ed', Number.isFinite(eD) ? eD.toExponential(2) : '—');
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
  if (key === 'steam') {
    const info = getSteamPressureInfo();
    return { key, rho: info.rho, mu: fd.mu, name: fd.name, class: fd.class, service: fd.service };
  }
  return { key, rho: fd.rho, mu: fd.mu, name: fd.name, class: fd.class, service: fd.service };
}

function updateFlowInfo() {
  updateSteamConditionUI();
  const fluid = getFluidProps();
  const geom = getPipeGeometry($('nps').value, $('schedule').value);
  setText('fl-rho', Number.isFinite(fluid.rho) ? fluid.rho.toFixed(3).replace(/\.000$/, '') : '—');
  setText('fl-mu', Number.isFinite(fluid.mu) ? fluid.mu.toFixed(3) : '—');
  setText('fluid-class', fluid.service === 'gas' ? 'Gas / vapor' : fluid.service === 'custom' ? 'Custom' : isWaterFluid(fluid.key) ? 'Water service' : 'Liquid');
  if (!geom || !(fluid.rho > 0) || !(fluid.mu > 0)) {
    setText('fl-vel', '—'); setText('fl-re', '—'); setText('fl-regime', '—');
    return;
  }
  const flowVal = parseFloat($('flowrate').value);
  if (!(flowVal > 0)) {
    setText('fl-vel', '—'); setText('fl-re', '—'); setText('fl-regime', '—');
    return;
  }
  const Q = getQ_m3s(flowVal, $('flow-unit').value, fluid.rho);
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
  const input = $('hazen-c');
  const tag = $('hazen-c-tag');
  const key = $('fluid-type').value;
  const fd = FLUID_DATA[key];
  if (fd && fd.hw_c && !input.dataset.userEdited) {
    input.value = fd.hw_c;
    input.classList.add('reference-input');
    tag.textContent = 'Reference value';
    tag.className = 'input-tag reference-tag';
  }
}

function updateMethodGuidance() {
  const key = $('fluid-type').value;
  const fd = FLUID_DATA[key];
  let msg = '';
  if (isWaterFluid(key)) {
    msg = 'Both Darcy-Weisbach and Hazen-Williams are available for water service. Darcy-Weisbach is more general. Hazen-Williams is commonly used for water piping with equivalent length approach.';
  } else if (isGasFluid(key)) {
    msg = 'Darcy-Weisbach is available as a preliminary estimate. For steam, saturated steam density is estimated from the entered pressure; for detailed steam design, verify steam properties and project criteria.';
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
    div.innerHTML = `<label id="label_${fit.id}" title="L/D=${fit.ld || '—'} | K=${fit.k || '—'}">${fit.name}</label><input type="number" id="fit_${fit.id}" placeholder="0" min="0" step="1">`;
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
  if (inputs.fluidKey === 'steam') {
    const minP = SAT_STEAM_DENSITY_TABLE[0].p_barA;
    const maxP = SAT_STEAM_DENSITY_TABLE[SAT_STEAM_DENSITY_TABLE.length - 1].p_barA;
    if (!Number.isFinite(inputs.steamPressure)) errors.push('Steam pressure is required for saturated steam calculation.');
    else if (!(inputs.steamPressure > 0)) errors.push('Steam pressure must be greater than zero.');
    else if (!Number.isFinite(inputs.steamPressureBarA) || !Number.isFinite(inputs.rho)) errors.push(`Steam pressure is outside the supported saturation table range (${minP}–${maxP} barA).`);
  }
  if (!Number.isFinite(inputs.flowVal)) errors.push('Flow rate is required. Enter your actual flow rate.');
  else if (!(inputs.flowVal > 0)) errors.push('Flow rate must be greater than zero.');
  if (!Number.isFinite(inputs.pipeLen)) errors.push('Straight pipe length is required. Enter 0 if no straight pipe length is included.');
  else if (!(inputs.pipeLen >= 0)) errors.push('Pipe length cannot be negative.');
  if (!inputs.elevationEntered) errors.push('Elevation difference is required. Enter 0 if both endpoints are at the same elevation.');
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
  const steamInfo = getSteamPressureInfo();
  const fittingQty = {};
  FITTINGS.forEach(f => { fittingQty[f.id] = Number($('fit_' + f.id).value || 0); });
  return {
    nps: $('nps').value,
    schedule: $('schedule').value,
    materialKey: $('material').value,
    epsCustom: parseFloat($('custom-eps').value),
    pipeLen: parseFloat($('pipe-len').value),
    elevation: parseFloat($('elevation').value),
    elevationEntered: $('elevation').value.trim() !== '',
    fluidKey: fluid.key,
    rho: fluid.rho,
    mu_cp: fluid.mu,
    steamPressure: steamInfo.pressure,
    steamPressureUnit: steamInfo.unit,
    steamPressureBarA: steamInfo.pressureBarA,
    flowVal: parseFloat($('flowrate').value),
    flowUnit: $('flow-unit').value,
    calcMethod,
    minorMethod,
    hazenC: parseFloat($('hazen-c').value),
    velocityGuideId: $('velocity-basis').value,
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
    const steamNote = inputs.fluidKey === 'steam' ? ` · Steam density = ${fmt(inputs.rho, 3)} kg/m³ at ${fmt(inputs.steamPressureBarA, 3)} barA` : '';
    setText('result-summary', `Total head = ${fmt(result.totalHead, 3)} m · Total ΔP = ${fmt(result.dp_total_kpa, 2)} kPa${steamNote}.`);
  }

  const cbody = $('component-breakdown-body');
  cbody.innerHTML = '';
  result.breakdown.forEach(r => addTableRow(cbody, [r.component, fmt(r.head_m, 3), fmt(r.dp_kgcm2, 5)], r.total));

  const fbody = $('fitting-status-body');
  fbody.innerHTML = '';
  if (!fittingRows.length) addTableRow(fbody, ['No fittings entered', '—', '—', '—']);
  fittingRows.forEach(r => addTableRow(fbody, [r.name, r.qty, r.dataUsed, r.status]));

  renderVelocityCheck(result.velocity, inputs.velocityGuideId);
  renderEngineeringNotes(inputs);

  toggleHidden('results', false);
  $('results').scrollIntoView({ behavior: 'smooth', block: 'start' });
}

function renderVelocityCheck(V, guideId) {
  const vc = $('vel-check');
  const guide = getVelocityGuideline(guideId);
  let cls = 'vel-warn';
  let msg = '';

  setText('vel-calculated', `${fmt(V, 2)} m/s`);
  setText('vel-basis-output', guide.label);
  setText('vel-range-output', formatVelocityReference(guide));

  if (guide.type === 'none') {
    cls = 'vel-warn';
    msg = 'Review required. Select an applicable reference basis or verify velocity against project/service criteria.';
  } else if (guide.type === 'range') {
    if (V < guide.min) {
      cls = 'vel-warn';
      msg = 'Below Recommended Range. Review service suitability, flushing/settling concerns, and whether the pipe is oversized.';
    } else if (V > guide.max) {
      cls = 'vel-bad';
      msg = 'Above Recommended Range. Review pipe size, pressure drop, erosion, vibration, noise, and project design criteria.';
    } else {
      cls = 'vel-ok';
      msg = 'Within Recommended Range for the selected velocity guideline basis.';
    }
  } else {
    cls = 'vel-warn';
    msg = 'Review Against Reference. The source provides a recommended reference value rather than a range; verify acceptability using project criteria.';
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
    'Velocity guideline comparison is advisory and uses the selected basis from Introduction to Process Engineering and Design, Table 5.1.',
    'For detailed design, verify with project standard, vendor data, or recognized hydraulic references.'
  ];
  if (inputs.calcMethod === 'darcy') notes.splice(3, 0, 'Darcy-Weisbach uses incompressible flow approach.');
  if (isGasFluid(inputs.fluidKey)) notes.splice(4, 0, 'Gas/air results are preliminary unless density and viscosity are entered at operating condition. For steam, saturated steam density is estimated from pressure; superheated steam is not yet modeled.');
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
    const key = $('fluid-type').value;
    toggleHidden('custom-fluid-fields', key !== 'custom_fluid');
    toggleHidden('steam-condition-fields', key !== 'steam');
    toggleHidden('steam-pressure-help', key !== 'steam');
    if (key === 'steam' && !$('flowrate').value) $('flow-unit').value = 'kgh';
    setSuggestedVelocityGuideline(key);
    updateMethodOptions(); updateFlowInfo();
  });
  $('velocity-basis').addEventListener('change', () => {
    if (!$('results').classList.contains('hidden')) renderVelocityCheck(parseFloat($('out-vel').textContent), $('velocity-basis').value);
  });
  ['flowrate','flow-unit','cust-rho','cust-mu','pipe-len','elevation','steam-pressure'].forEach(id => $(id).addEventListener('input', updateFlowInfo));
  $('flow-unit').addEventListener('change', updateFlowInfo);
  $('steam-pressure-unit').addEventListener('change', updateFlowInfo);
  $('hazen-c').addEventListener('input', () => {
    const input = $('hazen-c');
    const tag = $('hazen-c-tag');
    input.dataset.userEdited = '1';
    input.classList.remove('reference-input');
    tag.textContent = 'User input';
    tag.className = 'input-tag user-tag';
  });
  $('btn-darcy').addEventListener('click', () => { calcMethod = 'darcy'; updateMethodOptions(); });
  $('btn-hazen').addEventListener('click', () => { if (!$('btn-hazen').disabled) { calcMethod = 'hazen'; updateMethodOptions(); } });
  $('btn-leq').addEventListener('click', () => { minorMethod = 'leq'; updateMethodOptions(); });
  $('btn-k').addEventListener('click', () => { if (!$('btn-k').disabled) { minorMethod = 'k'; updateMethodOptions(); } });
  $('calc-btn').addEventListener('click', onCalculate);
}

document.addEventListener('DOMContentLoaded', () => {
  buildNPSSelect();
  buildVelocityGuidelineSelect();
  buildFittings();
  bindEvents();
  toggleHidden('custom-fluid-fields', true);
  toggleHidden('steam-condition-fields', $('fluid-type').value !== 'steam');
  toggleHidden('steam-pressure-help', $('fluid-type').value !== 'steam');
  updateMethodOptions();
  updateFlowInfo();
});
