/** @param {NS} ns */
export async function main(ns) {

    const host = ns.getHostname();
    const serverMinSecurity = ns.getServerMinSecurityLevel(host);
    const serverMaxMoney = ns.getServerMaxMoney(host);
    let i = 0

    for (i=2; i!=1; i++) {
        if (ns.getServerSecurityLevel(host) != serverMinSecurity) {
            await ns.weaken(host);
        }
        else {
            if (serverMaxMoney != ns.getServerMoneyAvailable(host)) {
                await ns.grow(host);
            }
            else {
                await ns.hack(host);
            }
        }
    }

}