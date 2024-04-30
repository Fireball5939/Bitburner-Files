/** @param {NS} ns */
export async function main(ns) {

  /*

    This is a list of every function used, what they do, and what the input parameters are. If a parameter is optional it will be listed as such in the format of (parameter1, parameter2?, parameter3?)


    ns.nuke(host); This will run NUKE.exe on the target machine 'host' and gain root access if enough ports are open, the 'host' value must be a string with the name of a valid server (n00dles, hong-fang-tea, ect). This will return nothing.

    ns.sqlinject(host); This will run SQLInject.exe on the target machine 'host' and open a port for NUKE.exe, the 'host' value must be a string with the name of a valid server (n00dles, hong-fang-tea, ect). This will return nothing.

    ns.httpworm(host); This will run HTTPWorm.exe on the target machine 'host' and open a port for NUKE.exe, the 'host' value must be a string with the name of a valid server (n00dles, hong-fang-tea, ect). This will return nothing.

    ns.relaysmtp(host); This will run RelaySMTP.exe on the target machine 'host' and open a port for NUKE.exe, the 'host' value must be a string with the name of a valid server (n00dles, hong-fang-tea, ect). This will return nothing.

    ns.ftpcrack(host); This will run FTPCrack.exe on the target machine 'host' and open a port for NUKE.exe, the 'host' value must be a string with the name of a valid server (n00dles, hong-fang-tea, ect). This will return nothing.

    ns.brutessh(host); This will run BruteSSH.exe on the target machine 'host' and open a port for NUKE.exe, the 'host' value must be a string with the name of a valid server (n00dles, hong-fang-tea, ect). This will return nothing.

    ns.hasrootaccess(host); This will check to see if the player has root access on the target machine 'host' and return true if you do, and false otherwise, the 'host' value must be a string with the name of a valid server (n00dles, hong-fang-tea, ect). This will return a boolean.

    ns.getservermaxram(host); This will check how much total ram the target server 'host' has and return the value as a number, the 'host' value must be a string with the name of a valid server (n00dles, hong-fang-tea, ect). This will return an integer.

    ns.gethackinglevel(); This will get the current hacking level of the player and return the value as a number. This will return an integer.

    ns.getservernumportsrequired(host); This will get the number of open ports the target server 'host' needs for root access to be gained and return the value as a number,the 'host' value must be a string with the name of a valid server (n00dles, hong-fang-tea, ect). This will return an integer.

    ns.getscriptram(script, host?); This will get the amount of ram the target script 'script' uses with one thread and returns it as a number, the 'script' value must be a string for the full path of a file, example "/scripts/serverSetup.js", the 'host' value is optional and if given will check the file at the target server 'host', otherwise defaulting to the server the script is running on, the 'host' value must be a string with the name of a valid server (n00dles, hong-fang-tea, ect). This will return an integer.

    ns.getserverrequiredhackinglevel(host); This will get the required hacking level the player needs to run ns.hack(), ns.grow(), and ns.weaken() on the target server 'host' and return it as a number, the 'host' value must be a string with the name of a valid server (n00dles, hong-fang-tea, ect). This will return an integer.

    ns.fileexists(filename, host?); This will check to see if the target file 'filename' exists on the target machine 'host' and return true if it exists, and false otherwise, the 'host' value is optional and if given will check for the file at the target server 'host', otherwise defaulting to the server the script is running on, the 'host' value must be a string with the name of a valid server (n00dles, hong-fang-tea, ect). This will return a boolean.

    ns.scan(host?); This will return an array with every server that can be directly connected to from the 'host' machine, the 'host' value is optional and if given will check what servers can be connected to from the 'host' server, otherwise defaulting to the current server, the 'host' value must be a string with the name of a valid server (n00dles, hong-fang-tea, ect). This will return an array of strings.

    ns.killall(host?, safetyguard?); This will kill all processes on the target server 'host' and returns true if scripts were killed, and false otherwise, the 'host' value is optional and if given will dictate what server to kill all processes on, the 'safetyguard' value is optional and if given will either skip or not skip the current process from the killall function. The 'host' value must be a string with the name of a valid server (n00dles, hong-fang-tea, ect), the 'safetyguard' value must be a boolean. This will return a boolean.

    ns.exec(script, hostname, threadoroptions?, arg0?, arg1?, ..., argX?); This will run the target script 'script' on the target server 'hostname' with the given number of threads 'threadoroptions' or number of threads in the given runoptions interface 'threadoroptions' and passes any other arguments to that script 'ar0, arg1, ..., argX', it then returns the PID of that process, and 0 if it failed. The 'script' value must be a valid full filepath given as a string (Example, '/scripts/serverSetup.js') that exists on the target server 'hostname', the 'hostname' value must be a valid server name given as a string (Example, 'n00dles', 'hong-fang-tea', ect), the 'threadoroptions' value must be either a number or a runoptions object, the 'arg's given to the script must be valid arguments (Numbers, Strings, and Booleans). This returns an integer.

 */

  const serverCount = ns.scan();
  let currentServer = 0;
  let portBusters = 0;
  {
    /*Get the number of port busters we have */
    if (ns.fileExists('brutessh.exe', 'home') == true) {
      portBusters++
      ns.tprint('BruteSSH.exe detected.')
      if (ns.fileExists('ftpcrack.exe', 'home') == true) {
        portBusters++
        ns.tprint('FTPCrack.exe detected.')
        if (ns.fileExists('relaysmtp.exe', 'home') == true) {
          portBusters++
          ns.tprint('RelaySMTP.exe detected.')
          if (ns.fileExists('httpworm.exe', 'home') == true) {
            portBusters++
            ns, tprint('HTTPWorm.exe detected.')
            if (ns.fileExists('sqlinject.exe', 'home') == true) {
              portBusters++
              ns.tprint('SQLInject.exe detected.')
            }
          }
        }
      }
    }
    else {
      ns.tprint('No port busters detected.')
    }
  }

  if (ns.args.length != 0) {
    
    for (; currentServer < serverCount.length; currentServer++) {

      let host = serverCount[currentServer];

      if (ns.getServerRequiredHackingLevel(host) <= ns.getHackingLevel()) {

        if (ns.hasRootAccess(host) == false) {

          let portsNeeded = ns.getServerNumPortsRequired(host);
          ns.tprint('[' + host + '] requires [' + portsNeeded + '] ports open to run NUKE.exe');

          if (portsNeeded <= portBusters) {

            /* Open the ports of the target server */ {

              if (portsNeeded > 0) {
                ns.brutessh(host);

                if (portsNeeded > 1) {
                  ns.ftpcrack(host);

                  if (portsNeeded > 2) {
                    ns.relaysmtp(host);

                    if (portsNeeded > 3) {
                      ns.httpworm(host);

                      if (portsNeeded > 4) {
                        ns.sqlinject(host);

                      }
                    }
                  }
                }
              }
            }

            try {
              ns.nuke(host);
            }

            catch (error) {
              ns.tprint('ERROR! NUKE.exe failed due to [' + error + ']');
            }

          }

          else {

            ns.tprint('Not enough port busters developed to nuke [' + host + '], skipping server.');
            continue;

          }

        }

        if (ns.args[0] == true) {

          let maxThreads = Math.floor(ns.getServerMaxRam(host) / ns.getScriptRam(ns.args[1]));
          ns.tprint('The maximum number of threads that [' + ns.args[1] + 'can run with is [' + maxThreads + '] on [' + host + '].');
          ns.scp(ns.args[1], host);
          if (maxThreads > 0) {
            ns.exec(ns.args[1], host);
            let serverUsedRamPercentage = ns.getServerUsedRam(host) / ns.getServerMaxRam(host) * 100
            ns.tprint('Server [' + host + '] is using [' + serverUsedRamPercentage + '%] of its max ram.');

          }
        }
      }
      else {
        ns.tprint('Player does not have a high enough hacking level for this [' + host + '], skipping server.');
        continue;
      }
    }

  }

  else {

    ns.tprint('ERROR! No arguments given! Required arguments are [2], [weather or not to copy a file to each server], [what file to copy and run on each server]');
    ns.tprint('|');
    ns.tprint('Format is "run scripts/serverSetup.js (True or False) (What file to copy, only needed if arg [0] is True)"');

  }
}
