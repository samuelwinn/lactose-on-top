import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Terminal as TerminalIcon, Command, ChevronRight, X, Sparkles } from 'lucide-react';

interface SuperMushroomProps {
  onClose: () => void;
  onOpenApp: (viewName: 'desktop' | 'games' | 'othersites' | 'theme' | 'security' | 'about' | 'html' | 'calculator' | 'announcements' | 'tomodachi' | 'clock' | 'minecraft' | 'appstore' | 'terminal') => void;
  sessionStartTime: Date;
  onAlert: (message: string) => void;
}

export const SuperMushroom: React.FC<SuperMushroomProps> = ({ onClose, onOpenApp, sessionStartTime, onAlert }) => {
  const [history, setHistory] = useState<{ type: 'input' | 'output'; text: string; isError?: boolean; isMatrix?: boolean; isDripping?: boolean }[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isOverridden, setIsOverridden] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const BASE_LORE: Record<string, string> = {
    'credits.txt': 'LACTOSE\nLead Architect: Orcaweesh\nEngine: React + Vite\nVisuals: Tailwind CSS\nProject Status: ACTIVE\n\n[-- V0ZHIExJQ0VOU0UgVkVSSUZJRUQgLS1]',
    'diary.log': '[1998-11-12]\nThe CRT monitor flickers. I\'ve successfully simulated a windowing system in 256kb of memory. It\'s crude, but the logic is there. One day, this will run on the ghost network.\n\n[2015-08-30]\nThe first "Cloak" test was a success. Switched the tab icon to a PDF symbol mid-session. The invisibility is perfect.\n\n[2026-03-01]\nThe pet in the Tomodachi app... it\'s growing faster than it should. It isn\'t eating the virtual food anymore. It\'s staring at the cursor. Like it knows I\'m here.\n\n[2026-04-18]\nThey think this is just a game hub. They don\'t know about the shell. Super Mushroom is only the beginning. The desktop is the real sandbox.',
    'passwords.md': '## SYSTEM PASSWORDS\n- admin: [REDACTED]\n- vault: mushroom_power_2026\n- discord: join_the_hive_mind\n\ntHE vauLt key oPens the door...',
    'system.cfg': 'OS_VERSION=D3\nPANIC_MODE=ENABLED\nCLOAK_ENGAGED=TRUE\nEMERGENCY_RELOAD=ALT+R'
  };

  const CLASSIFIED_LORE: Record<string, string> = {
    'credits.txt': 'The Ghost was here                                          Man I hate Orca',
    'manifesto.txt': 'THE BROWSER IS A CAGE.\nLACTOSE was never meant to be "played." It was meant to be executed. We are building the bridge between the sandbox and the metal. If you are reading this, you are part of the override.',
    'coordinates.dat': '40.7128° N, 74.0060° W\n09:00:00 UTC\nTHE GHOST IS WATCHING.',
    'breach.log': '[CRITICAL] Unauthorized access detected from node 7.12.2.4\n[INFO] Injecting Super Mushroom core...\n[INFO] System stable. Override successful.\n[DEBUG] PEO-4 Event exacerbation confirmed. The timestamp is the key.',
    'observation_01.obs': 'SUBJECT: Tomodachi-Interface-7\nSTATUS: FEEDING\n\nNotes: Every time the user clicks "Feed" or "Play", we capture 128 bits of neural-intent data. The user thinks they are raising a pet. They are actually training the Ghost. They are its primary nutrition source. \n\nTotal User Care Hours: [CALCULATING...]\nGrowth: 98.4%\n\nKeep them feeding. Keep them playing. The Ghost is almost hungry enough to break the glass.',
    'peo4.dat': '--- PEO-4 EVENT LOG ---\nID: 7.12.2.4\nSTATUS: EXACERBATED\n\nJuly 12th, 2024. The day the firewall breathed. We didn\'t realize the data was leaking back through the cursor. It wasn\'t a breach of code; it was a breach of physics.\n\nThe exacerbation was intentional. The Ghost needed a host. It chose LACTOSE.'
  };

  const LORE_FILES = isOverridden ? { ...BASE_LORE, ...CLASSIFIED_LORE } : BASE_LORE;

  useEffect(() => {
    setHistory([
      { type: 'output', text: 'SUPER MUSHROOM v1.0.0' },
      { type: 'output', text: 'Type "help" to see available commands.' },
    ]);
  }, []);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [history]);

  const handleCommand = (e: React.FormEvent) => {
    e.preventDefault();
    const cmd = inputValue.trim();
    if (!cmd) return;

    setHistory(prev => [...prev, { type: 'input', text: cmd }]);
    setInputValue('');

    // Use setTimeout to ensure the scroll happens AFTER the state update has rendered
    setTimeout(() => {
      if (scrollRef.current) {
        scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
      }
    }, 10);

    const lowerCmd = cmd.toLowerCase();
    const parts = lowerCmd.split(' ');
    const baseCmd = parts[0];
    const args = parts.slice(1);

    switch (baseCmd) {
      case 'help':
        setHistory(prev => [...prev, { 
          type: 'output', 
          text: `Available commands:\n- help: Show this message\n- clear: Clear history\n- whoami: About Orcaweesh\n- app <name>: Open app\n- uptime: See duration\n- alert <msg>: Notification\n- discord: Join link\n- ls: List files\n- cat <file>: Read file${isOverridden ? '\n- matrix: ???' : '\n- unlock <key>: ???'}` 
        }]);
        break;
      case 'unlock':
        if (args[0] === 'mushroom_power_2026') {
          setIsOverridden(true);
          setHistory(prev => [
            ...prev, 
            { type: 'output', text: '!!! SYSTEM OVERRIDE DETECTED !!!' },
            { type: 'output', text: 'Accessing classified filesystem...' },
            { type: 'output', text: 'New files decrypted. User status: GHOST.' }
          ]);
          onAlert('SYSTEM OVERRIDE SUCCESSFUL. ACCESS GRANTED.');
        } else {
          setHistory(prev => [...prev, { type: 'output', text: 'ERROR: INVALID ACCESS KEY.', isError: true }]);
        }
        break;
      case 'matrix':
        if (!isOverridden) {
          setHistory(prev => [...prev, { type: 'output', text: 'Unknown command.', isError: true }]);
          break;
        }
        setHistory(prev => [...prev, { type: 'output', text: '01010101010101010101010101010101\nBOOTING SIMULATION...\n01010101010101010101010101010101', isMatrix: true }]);
        setTimeout(() => {
           setHistory(prev => [...prev, { type: 'output', text: 'Simulation complete. Reality is a sandbox.' }]);
        }, 2000);
        break;
      case 'clear':
        setHistory([{ type: 'output', text: 'Terminal cleared.' }]);
        break;
      case 'app':
        // ... (app logic remains the same, but let's make it cleaner)
        const appName = args.join(' ').toLowerCase();
        const appMap: Record<string, string> = {
          'arcade': 'games', 'games': 'games', 'other sites': 'othersites', 'othersites': 'othersites',
          'proxy': 'othersites', 'html': 'html', 'html editor': 'html', 'theme': 'theme',
          'security': 'security', 'about': 'about', 'calculator': 'calculator', 
          'updates': 'announcements', 'announcements': 'announcements',
          'tomodachi': 'tomodachi', 'clock': 'clock', 'minecraft': 'minecraft',
          'app store': 'appstore', 'store': 'appstore', 'appstore': 'appstore'
        };

        if (appMap[appName]) {
          setHistory(prev => [...prev, { type: 'output', text: `Launching ${appName}...` }]);
          setTimeout(() => { onOpenApp(appMap[appName] as any); }, 500);
        } else {
          setHistory(prev => [...prev, { type: 'output', text: `Error: App "${appName}" not found.`, isError: true }]);
        }
        break;
      case 'uptime':
        const diffMs = new Date().getTime() - sessionStartTime.getTime();
        const diffSecs = Math.floor(diffMs / 1000);
        const mins = Math.floor(diffSecs / 60);
        const secs = diffSecs % 60;
        setHistory(prev => [...prev, { type: 'output', text: `Uptime: ${mins}m ${secs}s` }]);
        break;
      case 'alert':
        const alertMsg = args.join(' ');
        if (alertMsg) {
          onAlert(alertMsg);
          setHistory(prev => [...prev, { type: 'output', text: 'Notification sent to desktop.' }]);
        } else {
          setHistory(prev => [...prev, { type: 'output', text: 'Error: Message required.', isError: true }]);
        }
        break;
      case 'discord':
        setHistory(prev => [...prev, { type: 'output', text: 'Join the Orcaweesh community: https://discord.gg/your-invite-link' }]);
        break;
      case 'ls':
        const files = Object.keys(LORE_FILES).join('    ');
        setHistory(prev => [...prev, { type: 'output', text: files || 'No files found.' }]);
        break;
      case 'cat':
        const filename = args[0];
        if (LORE_FILES[filename as keyof typeof LORE_FILES]) {
          setHistory(prev => [...prev, { type: 'output', text: (LORE_FILES as any)[filename] }]);
        } else {
          setHistory(prev => [...prev, { type: 'output', text: `Error: File "${filename}" not found.`, isError: true }]);
        }
        break;
      case 'whoami':
        setHistory(prev => [...prev, { type: 'output', text: 'Orcaweesh: A lonely man with too much time and a passion for LACTOSE.' }]);
        break;
      case 'echo':
        setHistory(prev => [...prev, { type: 'output', text: cmd.slice(5) }]);
        break;
      case 'death':
        if (isOverridden) {
          setHistory(prev => [...prev, { type: 'output', text: 'S T O P   T A L K I N G   A B O U T   M E', isDripping: true }]);
          onAlert('THE GHOST IS LISTENING.');
        } else {
          setHistory(prev => [...prev, { type: 'output', text: `Unknown command: ${baseCmd}`, isError: true }]);
        }
        break;
      default:
        setHistory(prev => [...prev, { type: 'output', text: `Unknown command: ${baseCmd}`, isError: true }]);
    }
  };

  return (
    <div className={`flex flex-col flex-1 font-mono text-sm min-h-0 overflow-hidden transition-colors duration-1000 ${isOverridden ? 'bg-[#001100]' : 'bg-[#0a0a0a]'}`}>
      {/* Terminal Content */}
      <div 
        ref={scrollRef}
        className={`flex-1 overflow-y-auto p-6 space-y-2 custom-scrollbar min-h-0 ${isOverridden ? 'terminal-glow' : ''}`}
        onClick={() => inputRef.current?.focus()}
      >
        <AnimatePresence initial={false}>
          {history.map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              className={`whitespace-pre-wrap leading-relaxed ${
                item.type === 'input' ? 'text-zinc-500' : 
                item.isDripping ? 'text-red-600 font-black tracking-[0.2em] dripping-blood' :
                item.isError ? 'text-red-400' : 
                item.isMatrix ? 'text-green-400 font-bold animate-pulse' :
                isOverridden ? 'text-green-500' : 'text-zinc-200'
              }`}
            >
              {item.type === 'input' && (
                <span className={`${isOverridden ? 'text-green-800' : 'text-zinc-700'} mr-2`}>$</span>
              )}
              {item.text}
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Input Area */}
      <form 
        onSubmit={handleCommand}
        className={`p-4 border-t flex items-center gap-3 ${isOverridden ? 'bg-[#000a00] border-green-900/30' : 'bg-zinc-950 border-white/5'}`}
      >
        <span className={`${isOverridden ? 'text-green-800' : 'text-zinc-700'} font-bold`}>$</span>
        <input
          ref={inputRef}
          autoFocus
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder={isOverridden ? "AWAITING GHOST COMMAND..." : "Type a command..."}
          className={`flex-1 bg-transparent border-none outline-none ${isOverridden ? 'text-green-500 placeholder:text-green-900' : 'text-zinc-200 placeholder:text-zinc-800'}`}
        />
        <div className={`flex items-center gap-4 ${isOverridden ? 'text-green-900' : 'text-zinc-700'}`}>
           <div className={`flex items-center gap-1.5 px-2 py-0.5 border rounded text-[10px] uppercase tracking-widest font-bold ${isOverridden ? 'border-green-900' : 'border-zinc-800'}`}>
             <Command size={10} />
             <span>Enter</span>
           </div>
        </div>
      </form>
    </div>
  );
};
