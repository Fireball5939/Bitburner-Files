/** @param {NS} ns */
export async function main(ns) {

	const serverArray = ns.scan();
	let currentServer = 0;
    if(ns.args.length > 0 && ns.fileExists(ns.args[0]) == true) {

		for(; currentServer < serverArray.length; currentServer++) {

			let host = serverArray[currentServer];
			
			if(ns.hasRootAccess(host) == true) {

			ns.killall(host);
			ns.scp('/scripts/hackCopyScript.js', host);
			ns.exec('hackCopyScript.js', host);
			let maxThreads = Math.floor(ns.getServerMaxRam(host)/ns.getScriptRam(ns.args[0]))
			ns.scp(ns.args[0], host);
			ns.exec(ns.args[0], host, maxThreads);

			}

			else {
				ns.tprint("We do not have root access for [" + host + "], skipping server");
				continue;
			}
		}

    }

}