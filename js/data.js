const NPS_DATA = {
  "1/2":   {od:21.3,  scheds:{10:{wt:1.65},40:{wt:2.77},80:{wt:3.73},160:{wt:4.78},STD:{wt:2.77},XS:{wt:3.73},XXS:{wt:7.47}}},
  "3/4":   {od:26.7,  scheds:{10:{wt:1.65},40:{wt:2.87},80:{wt:3.91},160:{wt:5.56},STD:{wt:2.87},XS:{wt:3.91},XXS:{wt:7.82}}},
  "1":     {od:33.4,  scheds:{10:{wt:1.65},20:{wt:2.77},40:{wt:3.38},80:{wt:4.55},160:{wt:6.35},STD:{wt:3.38},XS:{wt:4.55},XXS:{wt:9.09}}},
  "1-1/4":{od:42.2,  scheds:{10:{wt:1.65},40:{wt:3.56},80:{wt:4.85},160:{wt:6.35},STD:{wt:3.56},XS:{wt:4.85},XXS:{wt:9.70}}},
  "1-1/2":{od:48.3,  scheds:{10:{wt:1.65},40:{wt:3.68},80:{wt:5.08},160:{wt:7.14},STD:{wt:3.68},XS:{wt:5.08},XXS:{wt:10.16}}},
  "2":     {od:60.3,  scheds:{10:{wt:1.65},20:{wt:2.77},40:{wt:3.91},80:{wt:5.54},160:{wt:8.74},STD:{wt:3.91},XS:{wt:5.54},XXS:{wt:11.07}}},
  "2-1/2":{od:73.0,  scheds:{10:{wt:2.11},40:{wt:5.16},80:{wt:7.01},160:{wt:9.53},STD:{wt:5.16},XS:{wt:7.01},XXS:{wt:14.02}}},
  "3":     {od:88.9,  scheds:{10:{wt:2.11},20:{wt:2.77},40:{wt:5.49},80:{wt:7.62},160:{wt:11.13},STD:{wt:5.49},XS:{wt:7.62},XXS:{wt:15.24}}},
  "3-1/2":{od:101.6, scheds:{10:{wt:2.11},40:{wt:5.74},80:{wt:8.08},STD:{wt:5.74},XS:{wt:8.08}}},
  "4":     {od:114.3, scheds:{10:{wt:2.11},20:{wt:3.05},40:{wt:6.02},80:{wt:8.56},120:{wt:11.10},160:{wt:13.49},STD:{wt:6.02},XS:{wt:8.56},XXS:{wt:17.12}}},
  "5":     {od:141.3, scheds:{10:{wt:2.77},20:{wt:3.40},40:{wt:6.55},80:{wt:9.53},120:{wt:12.70},160:{wt:15.88},STD:{wt:6.55},XS:{wt:9.53},XXS:{wt:19.05}}},
  "6":     {od:168.3, scheds:{10:{wt:2.77},20:{wt:3.40},40:{wt:7.11},80:{wt:10.97},120:{wt:14.27},160:{wt:18.26},STD:{wt:7.11},XS:{wt:10.97},XXS:{wt:21.95}}},
  "8":     {od:219.1, scheds:{10:{wt:2.77},20:{wt:3.76},30:{wt:4.78},40:{wt:8.18},60:{wt:10.31},80:{wt:12.70},100:{wt:15.09},120:{wt:17.48},140:{wt:19.05},160:{wt:23.01},STD:{wt:8.18},XS:{wt:12.70},XXS:{wt:22.23}}},
  "10":    {od:273.1, scheds:{10:{wt:3.40},20:{wt:4.19},30:{wt:5.16},40:{wt:9.27},60:{wt:12.70},80:{wt:15.09},100:{wt:18.26},120:{wt:21.44},140:{wt:25.40},160:{wt:28.58},STD:{wt:9.27},XS:{wt:12.70},XXS:{wt:25.40}}},
  "12":    {od:323.9, scheds:{10:{wt:3.96},20:{wt:4.57},30:{wt:5.54},40:{wt:9.53},60:{wt:14.27},80:{wt:17.48},100:{wt:21.44},120:{wt:25.40},140:{wt:28.58},160:{wt:33.32},STD:{wt:9.53},XS:{wt:12.70},XXS:{wt:25.40}}},
  "14":    {od:355.6, scheds:{10:{wt:3.96},20:{wt:6.35},30:{wt:7.92},40:{wt:9.53},60:{wt:12.70},80:{wt:15.88},100:{wt:19.05},120:{wt:23.80},140:{wt:27.79},160:{wt:31.75},STD:{wt:9.53},XS:{wt:12.70}}},
  "16":    {od:406.4, scheds:{10:{wt:4.19},20:{wt:6.35},30:{wt:7.92},40:{wt:9.53},60:{wt:12.70},80:{wt:16.66},100:{wt:21.44},120:{wt:26.19},140:{wt:30.96},160:{wt:36.53},STD:{wt:9.53},XS:{wt:12.70}}},
  "18":    {od:457.2, scheds:{10:{wt:4.19},20:{wt:6.35},30:{wt:7.92},40:{wt:11.13},60:{wt:14.27},80:{wt:19.05},100:{wt:23.80},120:{wt:29.36},140:{wt:34.93},160:{wt:39.67},STD:{wt:9.53},XS:{wt:12.70}}},
  "20":    {od:508.0, scheds:{10:{wt:4.78},20:{wt:6.35},30:{wt:9.53},40:{wt:12.70},60:{wt:15.09},80:{wt:20.62},100:{wt:26.19},120:{wt:32.54},140:{wt:38.10},160:{wt:44.45},STD:{wt:9.53},XS:{wt:12.70}}},
  "24":    {od:609.6, scheds:{10:{wt:5.54},20:{wt:6.35},30:{wt:9.53},40:{wt:14.27},60:{wt:17.48},80:{wt:24.61},100:{wt:30.96},120:{wt:38.89},140:{wt:46.02},160:{wt:52.37},STD:{wt:9.53},XS:{wt:12.70}}}
};

const MATERIAL_EPS = {
  cs_comm:    0.046,
  cs_new:     0.025,
  ss:         0.015,
  pvc:        0.0015,
  ci:         0.26,
  duct_iron:  0.12,
  concrete:   1.0,
  copper:     0.0015,
  custom_mat: null
};

const MATERIAL_HW_C = {
  cs_comm:120, cs_new:130, ss:140, pvc:150,
  ci:100, duct_iron:120, concrete:80, copper:140, custom_mat:120
};

const FLUID_DATA = {
  water:       {rho:998,   mu:1.002,  name:'Water (20°C)',                hw_c:130, class:'water',  service:'liquid'},
  water_hot:   {rho:972,   mu:0.355,  name:'Hot water (80°C)',      hw_c:130, class:'water',  service:'liquid'},
  seawater:    {rho:1025,  mu:1.08,   name:'Seawater',                          hw_c:null,class:'liquid', service:'liquid'},
  glycol:      {rho:1050,  mu:3.50,   name:'Ethylene glycol 40%',               hw_c:null,class:'liquid', service:'liquid'},
  chemical:    {rho:1000,  mu:2.00,   name:'Chemical liquid (generic)',         hw_c:null,class:'liquid', service:'liquid'},
  oil_light:   {rho:800,   mu:5.0,    name:'Light oil',                         hw_c:null,class:'liquid', service:'liquid'},
  oil_crude:   {rho:870,   mu:25.0,   name:'Crude oil',                         hw_c:null,class:'liquid', service:'liquid'},
  air:         {rho:1.20,  mu:0.018,  name:'Air',                       hw_c:null,class:'gas',    service:'gas'},
  nat_gas:     {rho:0.717, mu:0.011,  name:'Natural gas',                       hw_c:null,class:'gas',    service:'gas'},
  steam:       {rho:null,  mu:0.014,  name:'Steam',                             hw_c:null,class:'gas',    service:'gas'},
  custom_fluid:{rho:null,  mu:null,   name:'Custom fluid',                      hw_c:null,class:'custom', service:'custom'}
};

// Saturated steam vapor density reference table for preliminary calculation.
// Pressure is absolute pressure in barA. Density is kg/m³.
// Values are used by linear interpolation to estimate operating density from steam pressure.
const SAT_STEAM_DENSITY_TABLE = [
  {p_barA:0.5, rho:0.293},
  {p_barA:1.0, rho:0.598},
  {p_barA:1.5, rho:0.863},
  {p_barA:2.0, rho:1.129},
  {p_barA:3.0, rho:1.651},
  {p_barA:4.0, rho:2.163},
  {p_barA:5.0, rho:2.668},
  {p_barA:6.0, rho:3.170},
  {p_barA:7.0, rho:3.667},
  {p_barA:8.0, rho:4.162},
  {p_barA:9.0, rho:4.655},
  {p_barA:10.0, rho:5.147},
  {p_barA:12.0, rho:6.130},
  {p_barA:15.0, rho:7.590},
  {p_barA:20.0, rho:9.990},
  {p_barA:25.0, rho:12.400},
  {p_barA:30.0, rho:14.830},
  {p_barA:35.0, rho:17.310},
  {p_barA:40.0, rho:20.090},
  {p_barA:45.0, rho:22.740},
  {p_barA:50.0, rho:25.230},
  {p_barA:60.0, rho:31.100},
  {p_barA:70.0, rho:37.730},
  {p_barA:80.0, rho:45.140},
  {p_barA:90.0, rho:53.450},
  {p_barA:100.0, rho:62.720}
];

const STEAM_PRESSURE_UNITS = {
  barG:   {label:'barG',    toBarA:v => v + 1.01325},
  barA:   {label:'barA',    toBarA:v => v},
  kgcm2G: {label:'kg/cm²G', toBarA:v => v * 0.980665 + 1.01325},
  kgcm2A: {label:'kg/cm²A', toBarA:v => v * 0.980665},
  MPaG:   {label:'MPaG',    toBarA:v => v * 10 + 1.01325},
  MPaA:   {label:'MPaA',    toBarA:v => v * 10},
  kPaG:   {label:'kPaG',    toBarA:v => v / 100 + 1.01325},
  kPaA:   {label:'kPaA',    toBarA:v => v / 100}
};

const FITTINGS = [
  {id:'elb90',   name:'Elbow 90° (standard)',  ld:30,  k:0.75},
  {id:'elb90lr', name:'Elbow 90° (long radius)',ld:16,  k:0.45},
  {id:'elb45',   name:'Elbow 45°',              ld:16,  k:0.35},
  {id:'tee_run', name:'Tee — straight through', ld:20,  k:0.20},
  {id:'tee_br',  name:'Tee — branch connection', ld:60,  k:1.00},
  {id:'gate',    name:'Gate valve (fully open)', ld:8,   k:0.19},
  {id:'globe',   name:'Globe valve (fully open)',ld:340, k:6.00},
  {id:'ball',    name:'Ball valve (fully open)', ld:3,   k:0.05},
  {id:'check_sw',name:'Check valve (swing)',     ld:100, k:2.50},
  {id:'check_lf',name:'Check valve (lift)',      ld:600, k:12.0},
  {id:'bfly',    name:'Butterfly valve',         ld:45,  k:0.80},
  {id:'reducer', name:'Reducer (concentric)',    ld:0,   k:0.50},
  {id:'expander',name:'Expander',                ld:0,   k:1.00},
  {id:'entrance',name:'Entrance — inlet from tank/vessel/reservoir', ld:0, k:0.50},
  {id:'exit',    name:'Exit — outlet to tank/atmosphere', ld:0, k:1.00}
];

// Velocity reference basis for advisory checks only.
// Source basis: Introduction to Process Engineering and Design, Table 5.1 — Recommended Fluid Velocities.
const VELOCITY_GUIDELINES = [
  {id:'none', group:'General', label:'No reference selected — review against project criteria', type:'none'},
  {id:'water_suction', group:'Water', label:'Water — pump suction line', type:'range', min:0.3, max:1.5, unit:'m/s'},
  {id:'water_discharge', group:'Water', label:'Water — pump discharge line', type:'range', min:2.0, max:3.0, unit:'m/s'},
  {id:'water_average', group:'Water', label:'Water — average service', type:'range', min:1.0, max:2.5, unit:'m/s'},
  {id:'water_gravity', group:'Water', label:'Water — gravity flow', type:'range', min:0.5, max:1.0, unit:'m/s'},
  {id:'steam_sat_0_2', group:'Steam', label:'Steam — saturated, 0–2 atm g', type:'range', min:20, max:30, unit:'m/s'},
  {id:'steam_sat_2_10', group:'Steam', label:'Steam — saturated, 2–10 atm g', type:'range', min:30, max:50, unit:'m/s'},
  {id:'steam_super_below_10', group:'Steam', label:'Steam — superheated, below 10 atm g', type:'range', min:20, max:50, unit:'m/s'},
  {id:'steam_super_above_10', group:'Steam', label:'Steam — superheated, above 10 atm g', type:'range', min:30, max:75, unit:'m/s'},
  {id:'steam_vacuum', group:'Steam', label:'Steam — vacuum lines', type:'range', min:100, max:125, unit:'m/s'},
  {id:'air_0_2', group:'Air', label:'Air — 0–2 atm g', type:'target', target:20, unit:'m/s'},
  {id:'air_above_2', group:'Air', label:'Air — above 2 atm g', type:'target', target:30, unit:'m/s'},
  {id:'ammonia_liquid', group:'Refrigerant / Ammonia', label:'Ammonia / refrigerant — liquid', type:'target', target:1.8, unit:'m/s'},
  {id:'ammonia_gas', group:'Refrigerant / Ammonia', label:'Ammonia / refrigerant — gas', type:'target', target:30, unit:'m/s'},
  {id:'organic_oils', group:'Other Fluids', label:'Organic liquids and oils', type:'range', min:1.8, max:2.0, unit:'m/s'},
  {id:'natural_gas', group:'Other Fluids', label:'Natural gas', type:'range', min:25, max:35, unit:'m/s'},
  {id:'chlorine_liquid', group:'Other Fluids', label:'Chlorine — liquid', type:'target', target:1.5, unit:'m/s'},
  {id:'chlorine_gas', group:'Other Fluids', label:'Chlorine — gas', type:'range', min:10, max:25, unit:'m/s'},
  {id:'hcl_liquid', group:'Other Fluids', label:'Hydrochloric acid — aqueous liquid', type:'target', target:1.5, unit:'m/s'},
  {id:'hcl_gas', group:'Other Fluids', label:'Hydrochloric acid — gas', type:'target', target:10, unit:'m/s'},
  {id:'inorganic_liquids', group:'Other Fluids', label:'Inorganic liquids', type:'range', min:1.2, max:1.8, unit:'m/s'},
  {id:'gas_vapours', group:'Other Fluids', label:'Gas and vapours', type:'range', min:15, max:30, unit:'m/s'}
];

const DEFAULT_VELOCITY_GUIDELINE = {
  water: 'water_average',
  water_hot: 'water_average',
  oil_light: 'organic_oils',
  oil_crude: 'organic_oils',
  air: 'air_0_2',
  nat_gas: 'natural_gas',
  steam: 'steam_sat_0_2',
  seawater: 'none',
  glycol: 'none',
  chemical: 'none',
  custom_fluid: 'none'
};

