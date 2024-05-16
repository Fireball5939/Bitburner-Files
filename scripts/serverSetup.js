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

  //Declare the color object
  const color = {
    "info": "\x1b[0m",
    "warn": "\x1b[38;5;226m",
    "error": "\x1b[38;5;196m"
  }

  //Check to see if the given file in argument 2 (ns.args[1]) exists
  if (ns.args[0] != "--copy-file" && ns.args[0] != undefined && ns.args[0] != "--help") {
    ns.tprint(color.error + "ERROR! Unknown argument! Try --help if you need help")
  }
  if(ns.args[0] == "--help") {
    ns.tprint(color.info + "What this program does: This program will check every server in the game to see if the player has a high enough hacking level for them, and if so will use every port buster the player has and that hasn't been used on the server before on that server. It will then attempt to run NUKE.exe on them to gain root access. There are a few arguments that can be given to this program.")
    ns.tprint(color.info + "|")
    ns.tprint(color.info + "|")
    ns.tprint(color.info + "|")
    ns.tprint(color.info + "--copy-file")
    ns.tprint(color.info + "|-What this argument does is it tells the program that a given file will be copied and run on each server, if used the next argument must be a valid file on the host machine of this script")
    ns.tprint(color.info + "|")
    ns.tprint(color.info + "--kill-all")
    ns.tprint(color.info + "|-What this argument does is instead of using the remaining ram on each server it runs the given script at the max number of threads it can by killing all processes on the servers.")
    ns.exit();
  }
  if (ns.args[0] == "--copy-file") {
    if (ns.fileExists(ns.args[1]) === false) {
      ns.tprint(color.error + "ERROR! Given file does not exist on this machine! Exiting program");
      ns.exit();
    }
  }

  //Get the amount of port buster programs on the home machine
  {
    if (ns.fileExists("BruteSSH.exe", "home") == true) {
      bruteSSH = true;
      ns.tprint(color.info + "Info: Found file [BruteSSH.exe] on machine [home]")
    }
    if (ns.fileExists("FTPCrack.exe", "home") == true) {
      ftpCrack = true;
      ns.tprint(color.info + "Info: Found file [FTPCrack.exe] on machine [home]")
    }
    if (ns.fileExists("relaySMTP.exe", "home") == true) {
      relaySMTP = true;
      ns.tprint(color.info + "Info: Found file [relaySMTP.exe] on machine [home]")
    }
    if (ns.fileExists("HTTPWorm.exe", "home") == true) {
      httpWorm = true;
      ns.tprint(color.info + "Info: Found file [HTTPWorm.exe] on machine [home]")
    }
    if (ns.fileExists("SQLInject.exe", "home") == true) {
      sqlInject = true;
      ns.tprint(color.info + "Info: Found file [SQLInject.exe] on machine [home]")
    }
  }

  for (; serverArray.length > currentServer; currentServer++) {

    const targetProperties = ns.getServer(serverArray[currentServer]);
    ns.tprint(color.info + "Info: Target machine is [" + targetProperties.hostname + "]")

    if (targetProperties.hostname === "home") {
      ns.tprint(color.warn + "Warning! Target machine is home machine, skipping server.");
      continue;
    }
    if (targetProperties.requiredHackingSkill > ns.getHackingLevel()) {
      ns.tprint(color.warn + "Warning! Target machine has a higher required hacking level than the player currently has, skipping server");
      continue;
    }
    if (completedServers.includes(targetProperties.hostname)) {
      ns.tprint(color.warn + "Warning! Target machine has already been hit by this program, skipping server");
      continue;
    }

    if (targetProperties.sshPortOpen === false && bruteSSH === true) {
      ns.brutessh(targetProperties.hostname);
      ns.tprint(color.info + "Info: Ran ns.brutessh() on machine [" + targetProperties.hostname + "]");
    }
    if (targetProperties.ftpPortOpen === false && ftpCrack === true) {
      ns.ftpcrack(targetProperties.hostname);
      ns.tprint(color.info + "Info: Ran ns.ftpcrack() on machine [" + targetProperties.hostname + "]");
    }
    if (targetProperties.smtpPortOpen === false && relaySMTP === true) {
      ns.relaysmtp(targetProperties.hostname);
      ns.tprint(color.info + "Info: Ran ns.relaysmtp() on machine [" + targetProperties.hostname + "]");
    }
    if (targetProperties.httpPortOpen === false && httpWorm === true) {
      ns.httpworm(targetProperties.hostname);
      ns.tprint(color.info + "Info: Ran ns.httpworm() on machine [" + targetProperties.hostname + "]");
    }
    if (targetProperties.sqlPortOpen === false && sqlInject === true) {
      ns.sqlinject(targetProperties.hostname);
      ns.tprint(color.info + "Info: Ran ns.sqlinject() on machine [" + targetProperties.hostname + "]");
    }
    if (targetProperties.hasAdminRights === false) {
      try {
        ns.nuke(targetProperties.hostname);
        ns.tprint(color.info + "Info: Attempting to run ns.nuke on machine [" + targetProperties.hostname + "]");
      }
      catch (error) {
        ns.tprint(color.error + "ERROR! Could not run ns.nuke() on machine [" + targetProperties.hostname + "] due to [" + error + "]");
      }
    }

    if (targetProperties.hasAdminRights === true && ns.args[0] == "--copy-file") {

      let maxThreads = 0;
      ns.scp(ns.args[1], targetProperties.hostname);

      if (ns.args[2] == "--kill-all") {
        ns.tprint(color.info + "Info: Killing all scripts on machine [" + targetProperties.hostname + "]");
        ns.killall(targetProperties.hostname);
        maxThreads = Math.floor(targetProperties.maxRam / ns.getScriptRam(ns.args[1]));
      }
      else {
        const remainingRam = targetProperties.maxRam - targetProperties.ramUsed;
        maxThreads = Math.floor(remainingRam / ns.getScriptRam(ns.args[1]));
      }

      if (maxThreads > 0) {
      ns.tprint(color.info + "Info: Running program [" + ns.args[1] + "] on machine [" + targetProperties.hostname + "] with thread count [" + maxThreads + "]");
      ns.exec(ns.args[1], targetProperties.hostname, maxThreads);
      }

    }

    completedServers.push(targetProperties.hostname);
    serverArray.push(...ns.scan(targetProperties.hostname));
    serverArray = serverArray.filter((server) => server != "home");
    ns.tprint(color.info + "Info: We have hacked the following servers [" + completedServers + "]");

  }
}