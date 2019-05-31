const params = {
    LAST_POW_BLOCK: 200, // 345600
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
        ret = blockValue / 100 * 0;
    } else if (nHeight > 165) {
        ret = blockValue / 100 * 80; //80%

    }


    return ret;
};

const getSubsidy = (nHeight = 1) => {
    let nSubsidy = 0.0;
    if (nHeight == 0) {
        nSubsidy = 0;
    } else if (nHeight == 1) {
        nSubsidy = 7000000;
    } else if (nHeight <= params.LAST_POW_BLOCK && nHeight > 1) { //end PoW
        nSubsidy = 10.8;
    } else if (nHeight <= 238620 && nHeight > params.LAST_POW_BLOCK) { //Start PoS
        nSubsidy = 10.8;
    } else if (nHeight <= 764221 && nHeight >= 238621) {
        nSubsidy = 9;
    } else if (nHeight <= 1289222 && nHeight >= 764222) {
        nSubsidy = 5.4;
    } else {
        nSubsidy = 5.4;
    }


    return nSubsidy;
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

/**
 * How we identify if a raw transaction is Proof Of Stake & Masternode reward
 * @param {String} rpctx The transaction hash string.
 */
const isRewardRawTransaction = (rpctx) => {
    return rpctx.vin.length == 1 &&
        rpctx.vout.length == 3 &&
        // First vout is always in this format
        rpctx.vout[0].value == 0.0 &&
        rpctx.vout[0].n == 0 &&
        rpctx.vout[0].scriptPubKey &&
        rpctx.vout[0].scriptPubKey.type == "nonstandard";

}

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
    isRewardRawTransaction,
    getROI,
    isAddress,
    isBlock,
    isPoS,
    isTX
};