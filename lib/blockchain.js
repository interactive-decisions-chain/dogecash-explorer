
const params = {
  LAST_POW_BLOCK: 1440, // 345600
  RAMP_TO_BLOCK: 0,
  LAST_SEESAW_BLOCK: 0
};

const avgBlockTime = 60; // 1 minute (60 seconds)

const blocksPerDay = (24 * 60 * 60) / avgBlockTime; // 1440

const blocksPerWeek = blocksPerDay * 7; // 10080

const blocksPerMonth = (blocksPerDay * 365.25) / 12; // 306810

const blocksPerYear = blocksPerDay * 365.25; // 3681720

const mncoins = 5000.0;

const getMNBlocksPerDay = (mns) => {
  return blocksPerDay / mns;
};

const getMNBlocksPerWeek = (mns) => {
  return getMNBlocksPerDay(mns) * (365.25 / 52);
};

const getMNBlocksPerMonth = (mns) => {
  return getMNBlocksPerDay(mns) * (365.25 / 12);
};

const getMNBlocksPerYear = (mns) => {
  return getMNBlocksPerDay(mns) * 365.25;
};

const getMNSubsidy = (nHeight = 0, nMasternodeCount = 0, nMoneySupply = 0) => {
  const blockValue = getSubsidy(nHeight);
  let ret = 0.0;

// initial blocks have no mn reward
if (nHeight <= 165) {
    ret = blockValue  / 100 * 0;
} else if (nHeight > 165) {
    ret = blockValue  / 100 * 80; //80%
  
}


  return ret;
};

const getSubsidy = (nHeight = 1) => {
  let nSubsidy = 0.0;
  let nSlowSubsidy = 50.0;
//Pow Phase
var phase1 = nHeight > 1 && nHeight <= params.LAST_POW_BLOCK;
//POS Starts here
var phase2 = nHeight > params.LAST_POW_BLOCK && nHeight <= 11520;
var phase3 = nHeight >= 11521 && nHeight <= 97920;
var phase4 = nHeight >= 97921 && nHeight <= 184320;
var phase5 = nHeight >= 184321 && nHeight <= 525599;
var phase6 = nHeight >= 525600 && nHeight <= 1051200;
var phase7 = nHeight >= 1051201 && nHeight <= 1576801;


    

    if (nHeight == 1) return 1050000;
if(phase1) 
    nSubsidy = 1;
else if (phase2)
    nSubsidy = 10;
else if (phase3)
    nSubsidy = 16;
else if (phase4)
    nSubsidy = 14;
else if (phase5)
    nSubsidy = 12;
else if (phase6)
    nSubsidy = 10;
else if (phase7)
    nSubsidy = 6;
else 
    nSubsidy = 6;

  return  nSubsidy;
};

const getROI = (subsidy, mns) => {
  return ((getMNBlocksPerYear(mns) * subsidy) / mncoins) * 100.0;
};

const isAddress = (s) => {
  return typeof(s) === 'string' && s.length === 34;
};

const isBlock = (s) => {
  return !isNaN(s) || (typeof(s) === 'string');
};

const isPoS = (b) => {
  return !!b && b.height > params.LAST_POW_BLOCK; // > 182700
};

const isTX = (s) => {
  return typeof(s) === 'string' && s.length === 64;
};

module.exports = {
  avgBlockTime,
  blocksPerDay,
  blocksPerMonth,
  blocksPerWeek,
  blocksPerYear,
  mncoins,
  params,
  getMNBlocksPerDay,
  getMNBlocksPerMonth,
  getMNBlocksPerWeek,
  getMNBlocksPerYear,
  getMNSubsidy,
  getSubsidy,
  getROI,
  isAddress,
  isBlock,
  isPoS,
  isTX
};
