/** @param {NS} ns */
export async function main(ns) {

    const host = ns.getHostName();
    const serverMinSecurity = ns.getServerMinSecurity(host);
    const serverMaxMoney = ns.getServerMaxMoney(host);

    for (i=1; i=1;) {
        if (ns.getServerSecurityLevel(host) != serverMinSecurity) {
            ns.weaken(host);
        }
        else {
            if (ns.serverMaxMoney(host) != ns.getServerMoneyAvaliable(host)) {
                ns.grow(host);
            }
            else {
                ns.hack(host);
            }
        }
    }

}