/** @param {NS} ns */
export async function main(ns) {

    const host = ns.getHostname();
    const serverMinSecurity = ns.getServerMinSecurityLevel(host);
    const serverMaxMoney = ns.getServerMaxMoney(host);
    let securityReset = 0

    while (true) {

        if (serverMaxMoney != ns.getServerMoneyAvailable(host)) {
            await ns.grow(host);
            securityReset++
            ns.print("This is grow #" + securityReset + ", security reset is at 15");
            if (securityReset > 15) {

                while (ns.getServerSecurityLevel(host) > serverMinSecurity) {
                    await ns.weaken(host);

                }
                securityReset = 0;
            }
        }
        else {

            if (ns.getServerSecurityLevel(host) != serverMinSecurity) {
                await ns.weaken(host);

            }
            else {
                await ns.hack(host);
                
            }
        }
    }

}