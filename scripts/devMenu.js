/** @param {NS} ns */
export async function main(ns) {
    globalThis.webpack_require ?? webpackChunkbitburner.push([[-1], {}, w => globalThis.webpack_require = w]);
    Object.keys(webpack_require.m).forEach(k => Object.values(webpack_require(k)).forEach(p => p?.toPage?.('Dev')));
  }
//Credits: yichizhng in the BitBurner discord for this script. You can find it pinned in the #exploits-and-other-shenanigans channel of the discord.