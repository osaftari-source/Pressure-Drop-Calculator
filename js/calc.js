const G = 9.81;
const PA2KGCM2 = 1 / 98066.5;

function colebrookTurb(Re, eD) {
  let f = 0.02;
  for (let i = 0; i < 60; i++) {
    const rhs = -2 * Math.log10(eD / 3.7 + 2.51 / (Re * Math.sqrt(f)));
    f = 1 / (rhs * rhs);
  }
  return f;
}

function frictionFactor(Re, eD) {
  if (!Number.isFinite(Re) || Re <= 0) return NaN;
  if (Re < 2300) return 64 / Re;
  if (Re < 4000) {
    const fL = 64 / 2300;
    const fT = colebrookTurb(4000, eD);
    return fL + (fT - fL) * (Re - 2300) / 1700;
  }
  return colebrookTurb(Re, eD);
}

function flowRegime(Re) {
  if (!Number.isFinite(Re) || Re <= 0) return '—';
  if (Re < 2300) return 'Laminar';
  if (Re < 4000) return 'Transition';
  return 'Turbulent';
}

function getQ_m3s(val, unit, rho) {
  switch (unit) {
    case 'm3h': return val / 3600;
    case 'lps': return val / 1000;
    case 'gpm': return val * 6.30902e-5;
    case 'm3s': return val;
    case 'kgh': return val / rho / 3600;
    default: return val / 3600;
  }
}

function getPipeGeometry(nps, schedule) {
  const d = NPS_DATA[nps];
  if (!d || !d.scheds[schedule]) return null;
  const wt = d.scheds[schedule].wt;
  const od = d.od;
  const id_mm = od - 2 * wt;
  if (id_mm <= 0) return null;
  const D = id_mm / 1000;
  const A = Math.PI * D * D / 4;
  return { od, wt, id_mm, D, A, area_cm2: A * 1e4 };
}


function steamPressureToBarA(value, unit) {
  const def = STEAM_PRESSURE_UNITS[unit];
  if (!def || !Number.isFinite(value)) return NaN;
  return def.toBarA(value);
}

function saturatedSteamDensity(pBarA) {
  const table = SAT_STEAM_DENSITY_TABLE;
  if (!Number.isFinite(pBarA)) return NaN;
  if (pBarA < table[0].p_barA || pBarA > table[table.length - 1].p_barA) return NaN;
  for (let i = 0; i < table.length - 1; i++) {
    const a = table[i];
    const b = table[i + 1];
    if (pBarA >= a.p_barA && pBarA <= b.p_barA) {
      const t = (pBarA - a.p_barA) / (b.p_barA - a.p_barA);
      return a.rho + t * (b.rho - a.rho);
    }
  }
  return table[table.length - 1].rho;
}

function buildFittingRows(inputs, hydraulics) {
  const { minorMethod, fittingQty } = inputs;
  const { D, f, rho, V } = hydraulics;
  const rows = [];
  let fittingHead = 0;
  let leqIncluded = 0;
  let kIncluded = 0;

  FITTINGS.forEach(fit => {
    const qty = Number(fittingQty[fit.id] || 0);
    if (!qty) return;

    const needsLD = minorMethod === 'leq';
    const hasData = needsLD ? fit.ld > 0 : fit.k > 0;
    let head = 0;
    let dataUsed = needsLD ? 'L/D unavailable' : 'K unavailable';
    let status = needsLD ? 'Not calculated — L/D data unavailable' : 'Not calculated — K data unavailable';

    if (hasData) {
      if (needsLD) {
        const leq = fit.ld * D * qty;
        head = f * (leq / D) * (V * V / (2 * G));
        leqIncluded += leq;
        dataUsed = `L/D = ${fit.ld}`;
      } else {
        const kTotal = fit.k * qty;
        head = kTotal * (V * V / (2 * G));
        kIncluded += kTotal;
        dataUsed = `K = ${fit.k}`;
      }
      fittingHead += head;
      status = 'Included';
    }

    rows.push({
      name: fit.name,
      qty,
      dataUsed,
      status,
      included: hasData,
      head_m: head,
      dp_kgcm2: head * rho * G * PA2KGCM2
    });
  });

  return { rows, fittingHead, leqIncluded, kIncluded };
}

function calculate(inputs) {
  const pipe = getPipeGeometry(inputs.nps, inputs.schedule);
  const eps = inputs.materialKey === 'custom_mat' ? inputs.epsCustom : MATERIAL_EPS[inputs.materialKey];
  const eD = eps / 1000 / pipe.D;
  const rho = inputs.rho;
  const mu = inputs.mu_cp * 1e-3;
  const Q = getQ_m3s(inputs.flowVal, inputs.flowUnit, rho);
  const V = Q / pipe.A;
  const Re = rho * V * pipe.D / mu;
  const f = frictionFactor(Re, eD);
  const regime = flowRegime(Re);

  const hydraulics = { D: pipe.D, f, rho, V };
  const fitting = buildFittingRows(inputs, hydraulics);
  const pipeHead = f * (inputs.pipeLen / pipe.D) * (V * V / (2 * G));
  const elevationHead = inputs.elevation;

  let result;
  if (inputs.calcMethod === 'hazen') {
    const C = inputs.hazenC;
    const R_h = pipe.D / 4;
    const S = Math.pow(V / (0.8492 * C * Math.pow(R_h, 0.63)), 1 / 0.54);
    const frictionHead = S * (inputs.pipeLen + fitting.leqIncluded);
    const totalHead = frictionHead + elevationHead;
    result = {
      method: 'hazen',
      label: 'Hazen-Williams',
      velocity: V,
      Re,
      regime,
      C,
      S,
      frictionHead,
      elevationHead,
      totalHead,
      dp_total_kgcm2: totalHead * rho * G * PA2KGCM2,
      dp_total_kpa: totalHead * rho * G / 1000,
      breakdown: [
        { component: 'Friction', head_m: frictionHead, dp_kgcm2: frictionHead * rho * G * PA2KGCM2 },
        { component: 'Elevation', head_m: elevationHead, dp_kgcm2: elevationHead * rho * G * PA2KGCM2 },
        { component: 'Total', head_m: totalHead, dp_kgcm2: totalHead * rho * G * PA2KGCM2, total: true }
      ]
    };
  } else {
    const totalHead = pipeHead + fitting.fittingHead + elevationHead;
    result = {
      method: 'darcy',
      label: 'Darcy-Weisbach',
      velocity: V,
      Re,
      regime,
      f,
      pipeHead,
      fittingHead: fitting.fittingHead,
      elevationHead,
      totalHead,
      dp_total_kgcm2: totalHead * rho * G * PA2KGCM2,
      dp_total_kpa: totalHead * rho * G / 1000,
      breakdown: [
        { component: 'Straight Pipe', head_m: pipeHead, dp_kgcm2: pipeHead * rho * G * PA2KGCM2 },
        { component: 'Fittings', head_m: fitting.fittingHead, dp_kgcm2: fitting.fittingHead * rho * G * PA2KGCM2 },
        { component: 'Elevation', head_m: elevationHead, dp_kgcm2: elevationHead * rho * G * PA2KGCM2 },
        { component: 'Total', head_m: totalHead, dp_kgcm2: totalHead * rho * G * PA2KGCM2, total: true }
      ]
    };
  }

  const pipeInfo = { od: pipe.od, wt: pipe.wt, id: pipe.id_mm, area_cm2: pipe.area_cm2, eD };
  const steam = inputs.fluidKey === 'steam' ? {
    pressure: inputs.steamPressure,
    pressureUnit: inputs.steamPressureUnit,
    pressureBarA: inputs.steamPressureBarA,
    density: inputs.rho,
    condition: 'Saturated steam'
  } : null;
  return { result, fittingRows: fitting.rows, pipeInfo, fluid: FLUID_DATA[inputs.fluidKey], inputs, steam };
}
