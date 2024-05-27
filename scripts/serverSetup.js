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
  let fileInput = ``;

  let hasSSH = false;
  let hasFTP = false;
  let hasSMTP = false;
  let hasHTTP = false;
  let hasSQL = false;

  let completedServers = [];
  let hackedServers = [];

  //Declare the color object
  const color = {
    "info"  : `\x1b[38;5;255m`, // Set the info color to white
    "warn"  : `\x1b[38;5;226m`, // Set the warn color to yellow 
    "error" : `\x1b[38;5;196m`  // Set the error color to red
  }

  if (ns.args.includes(`-h`) || ns.args.includes(`--help`)) {
    ns.tprint(`${color.info} + What this program does:
    This program will check every server in the game to see if the player has a high enough hacking level for them, and if so will use every port buster
    the player has and that hasn't been used on the server before on that server. It will then attempt to run NUKE.exe on them to gain root access.
    There are a few arguments that can be given to this program.
    |
    |
    |
    |-c
    |++This will tell the script to copy a file to every server and run it if it's a script. If used the program will wait for an input in the prompt.
    |
    |--copyfile
    |+++See -c.
    |
    |-k
    |++This will kill all processes on every server once it has been hacked.
    |
    |--killall
    |+++See -k.
    |
    |-l
    |++At the end of the script the program will print a list of every server that gained root access, and their used ram compared to max ram.
    |
    |--ls
    |+++See -l
    |
    |-h
    |++Prints this message then exits the program.
    |
    |--help
    |+++See -h.`);
    ns.exit();
  }

  if (ns.args.includes(`-c`) || ns.args.includes(`--copyfile`)) {
    fileInput = await ns.prompt(`What file are we copying?`, {type: `text`});
    if (ns.fileExists(fileInput) === false) {
      ns.tprint(`${color.error}ERROR! Given file does not exist on this machine! Exiting program`);
      ns.exit();
    }
  }

  //Get the amount of port buster programs on the home machine
  {
    if (ns.fileExists(`BruteSSH.exe`, `home`) == true) {
      hasSSH = true;
      ns.tprint(`${color.info}Info: Found file [BruteSSH.exe] on machine [home]`);
    }
    if (ns.fileExists(`FTPCrack.exe`, `home`) == true) {
      hasFTP = true;
      ns.tprint(`${color.info}Info: Found file [FTPCrack.exe] on machine [home]`);
    }
    if (ns.fileExists(`relaySMTP.exe`, `home`) == true) {
      hasSMTP = true;
      ns.tprint(`${color.info}Info: Found file [relaySMTP.exe] on machine [home]`);
    }
    if (ns.fileExists(`HTTPWorm.exe`, `home`) == true) {
      hasHTTP = true;
      ns.tprint(`${color.info}Info: Found file [HTTPWorm.exe] on machine [home]`);
    }
    if (ns.fileExists(`SQLInject.exe`, `home`) == true) {
      hasSQL = true;
      ns.tprint(`${color.info}Info: Found file [SQLInject.exe] on machine [home]`);
    }
  }

  function appendArrays(completedServers, targetProperties, serverArray) {
    completedServers.push(targetProperties.hostname);
    serverArray.push(...ns.scan(targetProperties.hostname));
    serverArray = serverArray.filter((server) => server != `home`);
  }

  async function scanServers(fileInput) {
    for (let highestWeight = []; serverArray.length > currentServer; currentServer++) {

      const targetProperties = await ns.getServer(serverArray[currentServer]);
      await ns.sleep(20);

      // Skip the server if it's the home machine
      if (targetProperties.hostname === `home`) {
        ns.print(`${color.warn}Warning! Target machine is home machine, skipping server.`);
        continue;
      }
      // Skip the server if it has already been tested
      if (completedServers.includes(targetProperties.hostname)) {
        ns.print(`${color.warn}Warning! Target machine has already been hit by this program, skipping server`);
        continue;
      }
      ns.tprint(`${color.info}Info: Target machine is [${targetProperties.hostname}]`)
      // Skip the server if the hacking level for it is greater than the player's current hacking level
      if (targetProperties.requiredHackingSkill > ns.getHackingLevel()) {
        appendArrays(completedServers, targetProperties.hostname, serverArray);
        ns.tprint(`${color.warn}Warning! Target machine has a higher required hacking level than the player currently has, skipping server`);
        continue;
      }

      if (targetProperties.sshPortOpen === false && hasSSH === true) {
        ns.brutessh(targetProperties.hostname);
        ns.tprint(`${color.info}Info: Ran ns.brutessh() on machine [${targetProperties.hostname}]`);
      }
      if (targetProperties.ftpPortOpen === false && hasFTP === true) {
        ns.ftpcrack(targetProperties.hostname);
        ns.tprint(`${color.info}Info: Ran ns.ftpcrack() on machine [${targetProperties.hostname}]`);
      }
      if (targetProperties.smtpPortOpen === false && hasSMTP === true) {
        ns.relaysmtp(targetProperties.hostname);
        ns.tprint(`${color.info}Info: Ran ns.relaysmtp() on machine [${targetProperties.hostname}]`);
      }
      if (targetProperties.httpPortOpen === false && hasHTTP === true) {
        ns.httpworm(targetProperties.hostname);
        ns.tprint(`${color.info}Info: Ran ns.httpworm() on machine [${targetProperties.hostname}]`);
      }
      if (targetProperties.sqlPortOpen === false && hasSQL === true) {
        ns.sqlinject(targetProperties.hostname);
        ns.tprint(`${color.info}Info: Ran ns.sqlinject() on machine [${targetProperties.hostname}]`);
      }
      if (targetProperties.hasAdminRights === false) {
        try {
          ns.nuke(targetProperties.hostname);
          ns.tprint(`${color.info}Info: Attempting to run ns.nuke on machine [${targetProperties.hostname}]`);
        }
        catch (error) {
          ns.tprint(`${color.error}ERROR! Could not run ns.nuke() on machine [${targetProperties.hostname}]`);
        }
      }

      if (targetProperties.hasAdminRights === true && (ns.args.includes(`-c`) || ns.args.includes(`--copyfile`))) {

        // Returns a weight that can be used to sort servers by hack desirability
        // Thanks to xsinx in the BitBurner discord for the function, it can be found pinned in the #early-game channel. I've modified it slightly to work better with this script but the vast majority of this function is unmodified
        function Weight(ns, server) {
          if (!server) return 0;

          // Don't ask, endgame stuff
          if (server.hostname.startsWith('hacknet-node')) return 0;

          // Get the player information
          let player = ns.getPlayer();

          // Set security to minimum on the server object (for Formula.exe functions)
          server.hackDifficulty = server.minDifficulty;

          // We use weakenTime instead of minDifficulty since we got access to it, 
          // and we add hackChance to the mix (pre-formulas.exe hack chance formula is based on current security, which is useless)
          let weight = server.moneyMax / ns.formulas.hacking.weakenTime(server, player) * ns.formulas.hacking.hackChance(server, player);
          return weight;
        }

        // Compare the output of the Weight function to the current highest weight found, if it is found to be larger then set the new weight value and hostname
        let serverWeight = Weight(ns, targetProperties);
        if (highestWeight[0] < serverWeight) highestWeight = [serverWeight, targetProperties.hostname];

        let isScript = false;
        let maxThreads = 0;
        ns.scp(fileInput, targetProperties.hostname);

        if (fileInput.includes(`.js`) || fileInput.includes(`.script`)) {
        isScript = true;
        // Calculate the maximum number of threads the specified script can run with on the target server
        if (ns.args.includes(`--kill-all`)) {
          ns.tprint(`${color.info}Info: Killing all scripts on machine [${targetProperties.hostname}]`);
          ns.killall(targetProperties.hostname);
          maxThreads = Math.floor(targetProperties.maxRam / ns.getScriptRam(fileInput));
        }
        else {
          const remainingRam = targetProperties.maxRam - targetProperties.ramUsed;
          maxThreads = Math.floor(remainingRam / ns.getScriptRam(fileInput));
        }
      }

        if (maxThreads > 0 && isScript === true) {
          let highestWeightServer = ns.getServer(highestWeight[1])
          ns.tprint(`${color.info}Info: Running program [${fileInput}] on machine [${targetProperties.hostname}] with thread count [${maxThreads}]`);
          ns.exec(fileInput, targetProperties.hostname, maxThreads, highestWeightServer.hostname, highestWeightServer.minDifficulty, highestWeightServer.moneyMax);
        }

      }

      if (targetProperties.hasAdminRights === true) hackedServers.push(targetProperties.hostname);
      appendArrays(completedServers, targetProperties.hostname, serverArray);

    }
  }
  scanServers(fileInput);
  if (ns.args.includes(`-l`) || ns.args.includes(`--ls`)) {
    let serverObject = {}
    ns.tprint(`${color.info}Info: The script hacked the following servers with the following properties:`)
    hackedServers.forEach((server) =>
      serverObject = ns.getServer(hackedServers[server]),
      ns.tprint(`${color.info}Server Name [${serverObject.hostname}]. Used Ram/Max Ram [${serverObject.ramUsed}/${serverObject.maxRam}]`)
    );
    
  }
  await scanServers(fileInput);
}