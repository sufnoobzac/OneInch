const axios = require("axios");
const web3 = require("web3");

const decimals = {
  4: "kwei",
  6: "mwei",
  8: "8_dec",
  9: "gwei",
  18: "ether",
};

const tokens = {
  WBTC: {
    address: "0x2260fac5e5542a773aa44fbcfedf7c193bc2c599",
    decimals: 8,
  },
  USDT: {
    address: "0xdac17f958d2ee523a2206206994597c13d831ec7",
    decimals: 6,
  },
};

class OneInch {
  constructor(bearerToken) {
    this.bearerToken = bearerToken;
  }

  async getTokenPrice(value, src, dst) {
    const url = "https://api.1inch.dev/swap/v5.2/1/quote";
    let amount = 0;

    if (src.decimals === 8) {
      amount = web3.utils.toWei(value, "gwei") / 10;
    } else {
      amount = web3.utils.toWei(value, decimals[src.decimals]);
    }

    const config = {
      headers: {
        Authorization: `Bearer ${this.bearerToken}`,
      },
      params: {
        src: src.address,
        dst: dst.address,
        amount: amount,
      },
    };

    try {
      const response = await axios.get(url, config);
      if (dst.decimals === 8) {
        return web3.utils.fromWei(response.data.toAmount, "gwei") * 10;
      }
      return web3.utils.fromWei(response.data.toAmount, decimals[dst.decimals]);
    } catch {
      return undefined;
    }
  }
}

module.exports = { OneInch, tokens };
