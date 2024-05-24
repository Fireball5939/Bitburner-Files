/** @param {NS} ns */
export async function main(ns) {

  /* A list of every used NetScript function, their descriptions, and their Ram costs
  The format is this, ns.someFunction(arg1, arg2, ..., argX) [Ram cost]: Description, where the description has a format of X: Function description. Arg1 (Object type): Description of argument. Arg2(Object Type): Description of argument... ArgX(Object Type): Description of argument. 
  Any argument with a ? after it dictates that it is optional, if there is an optional argument needed that comes after another optional argument then it is needed. (Example, ns.run(script, threads?, arguments?) where you need arguments you have to give threads first).

  ns.getServer(host?) [2 GB]: Gets the server object that represents the server of the given hostname, defaulting to the current server if no host is given. Host (String): A valid hostname for a server to get the object of
  ns.exec(script, hostname, threads?, arg1?, arg2?, ..., argX?) [1.3 GB]: Runs the given script on the target server with the given number of threads and arguments. Script (String): A valid string for a file that exists on the target server. Host (String): A valid hostname for a server to run the script on. Threads (Optional, number): The number of threads to run the script with (Required if you need to give arguments). Args (Optional, Boolians Numbers and Strings): Arguments to pass to the script when it runs.
  ns.scp(files, destination, source?) [0.6 GB]: Copies the given files (Single with a direct string, or multiple with an array of strings) to the target server, optionally pulling the file from a given server. Files (String or Array of strings): What file or files to copy. Destination (String): A valid hostname for a server to recieve the files. Source (Optional, String): A valid hostname for a server to look for the files from.
  ns.killall(host?, safetyguard?) [0.5 GB]: Kills all processes on the target server, defaulting to the current server if no host is given. Host (Optional, String): A valid hostname for a server to kill the processes on. Safetyguard (Optional, boolean): Will skip the script that called the function if True.
  ns.scan(host?) [0.2 GB]: Returns an array of every server that can be directly connected to from the given host, defaulting to the current machine if not given. Host (Optional. String): A valid hostname to scan the connections on.
  ns.fileExists(filename, host?) [0.1 GB]: Returns True if the given file exists on the given server, defaulting to the current server if not given. Filename (String): Must be a valid ***full*** filepath of a file to check for. Host (Optional, String): Must be a valid hostname of a server to check for the file on.
  ns.getHackingLevel() [0.05 GB] Returns the player's current hacking level.
  ns.brutessh(host) [0.05 GB] Runs BruteSSH.exe on the target server. Host (String): Must be a valid hostname of a server to run on.
  ns.ftpcrack(host) [0.05 GB] Runs FTPCrack.exe on the machine, host. Host (String): Must be a valid hostname of a server to run on.
  ns.relaysmtp(host) [0.05 GB] Runs relaySMTP.exe on the machine, host. Host (String): Must be a valid hostname of a server to run on.
  ns.httpworm(host) [0.05 GB] Runs HTTPWorm.exe on the machine, host. Host (String): Must be a valid hostname of a server to run on.
  ns.sqlinject(host) [0.05 GB] Runs SQLInject.exe on the machine, host. Host (String): Must be a valid hostname of a server to run on.
  ns.nuke(host) [0.05 GB] Runs NUKE.exe on the machine, host. Host (String): Must be a valid hostname of a server to run on.

  */



  //Declare the needed variables
  let serverArray = ns.scan();
  let currentServer = 0;
  let fileInput = "";

  let hasSSH = false;
  let hasFTP = false;
  let hasSMTP = false;
  let hasHTTP = false;
  let hasSQL = false;

  let completedServers = [];
  let hackedServers = [];

  //Declare the color object
  const color = {
    "info": "\x1b[38;5;255m",
    "warn": "\x1b[38;5;226m",
    "error": "\x1b[38;5;196m"
  }

  if (ns.args.includes("--help")) {
    ns.tprint(color.info + "What this program does:");
    ns.tprint(color.info + "This program will check every server in the game to see if the player has a high enough hacking level for them, and if so will use every port buster");
    ns.tprint(color.info + "the player has and that hasn't been used on the server before on that server. It will then attempt to run NUKE.exe on them to gain root access.");
    ns.tprint(color.info + "There are a few arguments that can be given to this program.");
    ns.tprint(color.info + "|");
    ns.tprint(color.info + "|");
    ns.tprint(color.info + "|");
    ns.tprint(color.info + "|--copy-file");
    ns.tprint(color.info + "|---What this argument does is it tells the program that a given file will be copied and run on each server, if used the next argument must be a");
    ns.tprint(color.info + "|---valid file on the host machine of this script")
    ns.tprint(color.info + "|");
    ns.tprint(color.info + "|--kill-all");
    ns.tprint(color.info + "|---What this argument does is instead of using the remaining ram on each server it runs the given script at the max number of threads it can by");
    ns.tprint(color.info + "|---killing all processes on the servers.");
    ns.tprint(color.info + "|");
    ns.tprint(color.info + "|--help");
    ns.tprint(color.info + "|---Prints this message then exits the program, any arguments given if this is used are thrown away.");
    ns.exit();
  }
  if (ns.args.includes("--copy-file")) {
    fileInput = await ns.prompt("What file are we copying?", { type: "text" });
    if (ns.fileExists(fileInput) === false) {
      ns.tprint(color.error + "ERROR! Given file does not exist on this machine! Exiting program");
      ns.exit();
    }
  }

  //Get the amount of port buster programs on the home machine
  {
    if (ns.fileExists("BruteSSH.exe", "home") == true) {
      hasSSH = true;
      ns.tprint(color.info + "Info: Found file [BruteSSH.exe] on machine [home]")
    }
    if (ns.fileExists("FTPCrack.exe", "home") == true) {
      hasFTP = true;
      ns.tprint(color.info + "Info: Found file [FTPCrack.exe] on machine [home]")
    }
    if (ns.fileExists("relaySMTP.exe", "home") == true) {
      hasSMTP = true;
      ns.tprint(color.info + "Info: Found file [relaySMTP.exe] on machine [home]")
    }
    if (ns.fileExists("HTTPWorm.exe", "home") == true) {
      hasHTTP = true;
      ns.tprint(color.info + "Info: Found file [HTTPWorm.exe] on machine [home]")
    }
    if (ns.fileExists("SQLInject.exe", "home") == true) {
      hasSQL = true;
      ns.tprint(color.info + "Info: Found file [SQLInject.exe] on machine [home]")
    }
  }

  function scanServers(fileInput) {
    for (let highestWeight = []; serverArray.length > currentServer; currentServer++) {

      const targetProperties = ns.getServer(serverArray[currentServer]);

      if (targetProperties.hostname === "home") {
        ns.print(color.warn + "Warning! Target machine is home machine, skipping server.");
        continue;
      }
      if (completedServers.includes(targetProperties.hostname)) {
        ns.print(color.warn + "Warning! Target machine has already been hit by this program, skipping server");
        continue;
      }
      ns.tprint(color.info + "Info: Target machine is [" + targetProperties.hostname + "]")
      if (targetProperties.requiredHackingSkill > ns.getHackingLevel()) {
        completedServers.push(targetProperties.hostname);
        serverArray.push(...ns.scan(targetProperties.hostname));
        serverArray = serverArray.filter((server) => server != "home");
        ns.tprint(color.warn + "Warning! Target machine has a higher required hacking level than the player currently has, skipping server");
        continue;
      }

      if (targetProperties.sshPortOpen === false && hasSSH === true) {
        ns.brutessh(targetProperties.hostname);
        ns.tprint(color.info + "Info: Ran ns.brutessh() on machine [" + targetProperties.hostname + "]");
      }
      if (targetProperties.ftpPortOpen === false && hasFTP === true) {
        ns.ftpcrack(targetProperties.hostname);
        ns.tprint(color.info + "Info: Ran ns.ftpcrack() on machine [" + targetProperties.hostname + "]");
      }
      if (targetProperties.smtpPortOpen === false && hasSMTP === true) {
        ns.relaysmtp(targetProperties.hostname);
        ns.tprint(color.info + "Info: Ran ns.relaysmtp() on machine [" + targetProperties.hostname + "]");
      }
      if (targetProperties.httpPortOpen === false && hasHTTP === true) {
        ns.httpworm(targetProperties.hostname);
        ns.tprint(color.info + "Info: Ran ns.httpworm() on machine [" + targetProperties.hostname + "]");
      }
      if (targetProperties.sqlPortOpen === false && hasSQL === true) {
        ns.sqlinject(targetProperties.hostname);
        ns.tprint(color.info + "Info: Ran ns.sqlinject() on machine [" + targetProperties.hostname + "]");
      }
      if (targetProperties.hasAdminRights === false) {
        try {
          ns.nuke(targetProperties.hostname);
          ns.tprint(color.info + "Info: Attempting to run ns.nuke on machine [" + targetProperties.hostname + "]");
        }
        catch (error) {
          ns.tprint(color.error + "ERROR! Could not run ns.nuke() on machine [" + targetProperties.hostname + "]");
        }
      }

      if (targetProperties.hasAdminRights === true && ns.args.includes("--copy-file" || "-c")) {

        // Returns a weight that can be used to sort servers by hack desirability
        function Weight(ns, server) {
          if (!server) return 0;

          // Don't ask, endgame stuff
          if (server.startsWith('hacknet-node')) return 0;

          // Get the server information
          let so = server;

          // Set security to minimum on the server object (for Formula.exe functions)
          so.hackDifficulty = so.minDifficulty;

          // We cannot hack a server that has more than our hacking skill so these have no value
          if (so.requiredHackingSkill > ns.getHackingLevel()) return 0;

          // Default pre-Formulas.exe weight. minDifficulty directly affects times, so it substitutes for min security times
          let weight = so.moneyMax / so.minDifficulty;

          // If we have formulas, we can refine the weight calculation
          if (ns.fileExists('Formulas.exe')) {
            // We use weakenTime instead of minDifficulty since we got access to it, 
            // and we add hackChance to the mix (pre-formulas.exe hack chance formula is based on current security, which is useless)
            weight = so.moneyMax / ns.formulas.hacking.weakenTime(so, player) * ns.formulas.hacking.hackChance(so, player);
          }
          else
            // If we do not have formulas, we can't properly factor in hackchance, so we lower the hacking level tolerance by half
            if (so.requiredHackingSkill > ns.getHackingLevel() / 2)
              return 0;

          return weight;
        }
        serverWeight = Weight(ns, targetProperties);
        if (highestWeight[0] < serverWeight) {
          highestWeight = [serverWeight, targetProperties.hostname];
        }

        let maxThreads = 0;
        ns.scp(fileInput, targetProperties.hostname);

        if (ns.args.includes("--kill-all")) {
          ns.tprint(color.info + "Info: Killing all scripts on machine [" + targetProperties.hostname + "]");
          ns.killall(targetProperties.hostname);
          maxThreads = Math.floor(targetProperties.maxRam / ns.getScriptRam(fileInput));
        }
        else {
          const remainingRam = targetProperties.maxRam - targetProperties.ramUsed;
          maxThreads = Math.floor(remainingRam / ns.getScriptRam(fileInput));
        }

        if (maxThreads > 0) {
          ns.tprint(color.info + "Info: Running program [" + fileInput + "] on machine [" + targetProperties.hostname + "] with thread count [" + maxThreads + "]");
          ns.exec(fileInput, targetProperties.hostname, maxThreads, highestWeight[1], targetProperties.minDifficulty, targetProperties.moneyMax);
        }

      }

      if (targetProperties.hasAdminRights === true) hackedServers.push(targetProperties.hostname);
      completedServers.push(targetProperties.hostname);
      serverArray.push(...ns.scan(targetProperties.hostname));
      serverArray = serverArray.filter((server) => server != "home");

    }
  }
  scanServers(fileInput);
  if (ns.args.includes("--ls")) ns.tprint(color.info + "We have hacked the following servers [" + hackedServers + "]");
}