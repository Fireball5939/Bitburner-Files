/** @param {NS} ns */
export async function main(ns) {

    const host = ns.args[0];
    const serverMinSecurity = ns.args[1];
    const serverMaxMoney = ns.args[2];
    let securityReset = 0

    if(serverMaxMoney == 0) {
        ns.tprint("Closing this program on server [" + host + "] due to server not having money to hack.")
        ns.exit();
    }

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