/** @param {NS} ns */
export async function main(ns) {

    /* A list of every used NetScript function, their descriptions, and their Ram costs
    The format is this, ns.someFunction(arg1, arg2, ..., argX) [Ram cost] description
    Any argument with a ? after it dictates that it is optional

    ns.getServer(host?) [2 GB] Returns the server object (Which has info such as the server's name, weather each port buster has been used or not, its minimum security level, maximum money, and so on.) of the given host. The host argument must be a string of a valid server, and if left empty default to the server the script is running on.
    ns.scan(host?) [0.2 GB] Returns an array of every server host name that can be directly connected to from the machine, host (Not considering backdoors). The host argument must be a string of a valid server, and if left empty default to the server the script is running on.
    ns.fileExists(filename, host?) [0.1 GB] Returns true or false depending on if the given file, filename, exists on the machine, host. The filename argument must be the full filepath of a script (ex. "/scripts/serversetup.js"). The host argument must be a string of a valid server, and if left empty default to the server the script is running on.
    ns.getHackingLevel(host) [0.05 GB] Returns the player's current hacking level.
    ns.brutessh(host) [0.05 GB] Runs BruteSSH.exe on the machine, host. The host argument must be a string of a valid server.
    ns.ftpcrack(host) [0.05 GB] Runs FTPCrack.exe on the machine, host. The host argument must be a string of a valid server.
    ns.relaysmtp(host) [0.05 GB] Runs relaySMTP.exe on the machine, host. The host argument must be a string of a valid server.
    ns.httpworm(host) [0.05 GB] Runs HTTPWorm.exe on the machine, host. The host argument must be a string of a valid server.
    ns.sqlinject(host) [0.05 GB] Runs SQLInject.exe on the machine, host. The host argument must be a string of a valid server.
    ns.nuke(host) [0.05 GB] Runs NUKE.exe on the machine, host. The host argument must be a string of a valid server.

    KNOWN BUGS: The script currently only works on servers directly next to the host server due to the push pushing an object rather than strings.
    */

    //Declare the needed variables
    let serverArray = ns.scan();
    let currentServer = 0;

    let bruteSSH = false;
    let ftpCrack = false;
    let relaySMTP = false;
    let httpWorm = false;
    let sqlInject = false;

    let completedServers = [];

    //Get the amount of port buster programs on the home machine
    {
      if(ns.fileExists("BruteSSH.exe", "home") == true) {
        bruteSSH = true;
        ns.tprint("Found file [BruteSSH.exe] on machine [home]")
      }
      if(ns.fileExists("FTPCrack.exe", "home") == true) {
        ftpCrack = true;
        ns.tprint("Found file [FTPCrack.exe] on machine [home]")
      }
      if(ns.fileExists("relaySMTP.exe", "home") == true) {
        relaySMTP = true;
        ns.tprint("Found file [relaySMTP.exe] on machine [home]")
      }
      if(ns.fileExists("HTTPWorm.exe", "home") == true) {
        httpWorm = true;
        ns.tprint("Found file [HTTPWorm.exe] on machine [home]")
      }
      if(ns.fileExists("SQLInject.exe", "home") == true) {
        sqlInject = true;
        ns.tprint("Found file [SQLInject.exe] on machine [home]")
      }
    }

    for(; serverArray.length > currentServer; currentServer++) {

      try {ns.getServer(serverArray[currentServer])}
      catch(error) {ns.tprint(error); continue;}
      const targetProperties = ns.getServer(serverArray[currentServer]);
      ns.tprint("Info: Target machine is [" + targetProperties.hostname + "]")
      if(targetProperties.hostname === "home") {
        ns.tprint("Warning! Target machine is home machine, skipping server.");
        continue;
      }
      
      if(targetProperties.requiredHackingSkill > ns.getHackingLevel()) {
        ns.tprint("Warning! Target machine has a higher required hacking level than the player currently has, skipping server");
        continue;
      }
      if(completedServers.includes(targetProperties.hostname)) {
        ns.tprint("Warning! Target machine has already been hit by this program, skipping server");
        continue;
      }
      if(targetProperties.sshPortOpen === false && bruteSSH === true) {
        ns.brutessh(targetProperties.hostname);
        ns.tprint("Ran ns.brutessh() on machine [" + targetProperties.hostname + "]");
      }
      if(targetProperties.ftpPortOpen === false && ftpCrack === true) {
        ns.ftpcrack(targetProperties.hostname);
        ns.tprint("Ran ns.ftpcrack() on machine [" + targetProperties.hostname + "]");
      }
      if(targetProperties.smtpPortOpen === false && relaySMTP === true) {
        ns.relaysmtp(targetProperties.hostname);
        ns.tprint("Ran ns.relaysmtp() on machine [" + targetProperties.hostname + "]");
      }
      if(targetProperties.httpPortOpen === false && httpWorm === true) {
        ns.httpworm(targetProperties.hostname);
        ns.tprint("Ran ns.httpworm() on machine [" + targetProperties.hostname + "]");
      }
      if(targetProperties.sqlPortOpen === false && sqlInject === true) {
        ns.sqlinject(targetProperties.hostname);
        ns.tprint("Ran ns.sqlinject() on machine [" + targetProperties.hostname + "]");
      }
      if(targetProperties.hasAdminRights === false) {
        try {
          ns.nuke(targetProperties.hostname);
          ns.tprint("Attempting to run ns.nuke on machine [" + targetProperties.hostname + "]")
        }
        catch(error) {
          ns.tprint("ERROR! Could not run ns.nuke() on machine [" + targetProperties.hostname + "] due to [" + error + "]");
        }
      }

      completedServers.push(targetProperties.hostname);
      serverArray.push(ns.scan(targetProperties.hostname));
      serverArray = serverArray.filter((server) => server != "home")
      ns.tprint("serverArray is currently at [" + serverArray + "]")

    }
}