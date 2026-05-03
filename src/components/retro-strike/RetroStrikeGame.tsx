/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { motion, AnimatePresence } from 'motion/react';
import { useState, useEffect, useRef, useCallback } from 'react';
import { Sword, Shield, Zap, Heart, Trophy, RefreshCcw, User, Info } from 'lucide-react';
import { GameState, Character, Player, InputState } from './types';
import { CHARACTERS, GAME_WIDTH, GAME_HEIGHT, GROUND_Y, GRAVITY, JUMP_FORCE, MOVE_SPEED } from './constants';

export default function App() {
  const [gameState, setGameState] = useState<GameState>(GameState.BOOTING);
  const [p1Char, setP1Char] = useState<Character | null>(null);
  const [p2Char, setP2Char] = useState<Character | null>(null);
  const [winner, setWinner] = useState<1 | 2 | null>(null);
  const [timer, setTimer] = useState(99);

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const requestRef = useRef<number>(null);
  const playersRef = useRef<{ p1: Player; p2: Player } | null>(null);
  const inputsRef = useRef<{ p1: InputState; p2: InputState }>({
    p1: { up: false, down: false, left: false, right: false, attack1: false, attack2: false, block: false, special: false },
    p2: { up: false, down: false, left: false, right: false, attack1: false, attack2: false, block: false, special: false },
  });

  useEffect(() => {
    if (gameState === GameState.BOOTING) {
      const bootTimer = setTimeout(() => {
        setGameState(GameState.MENU);
      }, 3500);
      return () => clearTimeout(bootTimer);
    }
  }, [gameState]);

  const startGame = () => {
    if (!p1Char || !p2Char) return;

    const p1: Player = {
      id: 1,
      character: p1Char,
      x: 150,
      y: GROUND_Y,
      vx: 0,
      vy: 0,
      health: p1Char.stats.health,
      power: 0,
      isJumping: false,
      isAttacking: false,
      isBlocking: false,
      isSpecial: false,
      isStunned: false,
      direction: 'right',
      currentMove: null,
      comboCount: 0,
      lastHurtTime: 0,
    };

    const p2: Player = {
      id: 2,
      character: p2Char,
      x: GAME_WIDTH - 150,
      y: GROUND_Y,
      vx: 0,
      vy: 0,
      health: p2Char.stats.health,
      power: 0,
      isJumping: false,
      isAttacking: false,
      isBlocking: false,
      isSpecial: false,
      isStunned: false,
      direction: 'left',
      currentMove: null,
      comboCount: 0,
      lastHurtTime: 0,
    };

    playersRef.current = { p1, p2 };
    setWinner(null);
    setTimer(99);
    setGameState(GameState.FIGHTING);
  };

  const updatePhysics = useCallback(() => {
    if (!playersRef.current) return;
    const { p1, p2 } = playersRef.current;
    const inputs = inputsRef.current;

    const updatePlayer = (p: Player, input: InputState, other: Player) => {
      if (p.isStunned) return;

      // Movement
      if (!p.isAttacking && !p.isSpecial) {
        const charSpeed = MOVE_SPEED * (0.6 + p.character.stats.speed / 10);
        if (input.left) {
          p.vx = -charSpeed;
          p.direction = 'left';
        } else if (input.right) {
          p.vx = charSpeed;
          p.direction = 'right';
        } else {
          p.vx = 0;
        }

        if (input.up && !p.isJumping) {
          p.vy = JUMP_FORCE;
          p.isJumping = true;
          input.up = false;
        }

        p.isBlocking = input.block && !p.isJumping;
      }

      // Special Trigger
      if (input.special && p.power >= 100 && !p.isAttacking && !p.isSpecial) {
        input.special = false;
        p.isSpecial = true;
        p.power = 0;
        p.currentMove = p.character.specialMove;

        // Perform Special Move Logic
        switch(p.character.id) {
          case 'kaze': // Hurricane Blast
            setTimeout(() => {
              const currentP = p; 
              const currentO = other;
              const dist = Math.abs(currentP.x - currentO.x);
              if (dist < 500 && Math.abs(currentP.y - currentO.y) < 150) {
                currentO.health -= 25;
                currentO.lastHurtTime = Date.now();
                currentO.vx = currentP.direction === 'right' ? 30 : -30;
                currentO.vy = -5;
              }
              currentP.isSpecial = false;
              currentP.currentMove = null;
            }, 600);
            break;
          case 'brutus': // Earthshaker Slam
            setTimeout(() => {
              const currentO = other;
              if (currentO.y >= GROUND_Y - 20) {
                currentO.health -= 35;
                currentO.lastHurtTime = Date.now();
                currentO.vy = -15;
                currentO.vx = (currentO.x > p.x ? 5 : -5);
              }
              p.isSpecial = false;
              p.currentMove = null;
            }, 800);
            break;
          case 'luna': // Eclipse Swap
            setTimeout(() => {
              const px = p.x;
              p.x = other.x;
              other.x = px;
              other.health -= 20;
              other.lastHurtTime = Date.now();
              p.isSpecial = false;
              p.currentMove = null;
            }, 400);
            break;
          case 'volt': // Overload Zap
            setTimeout(() => {
              const dist = Math.abs(p.x - other.x);
              if (dist < 250 && Math.abs(p.y - other.y) < 200) {
                other.health -= 35;
                other.lastHurtTime = Date.now();
                other.isStunned = true;
                setTimeout(() => { other.isStunned = false; }, 1000);
              }
              p.isSpecial = false;
              p.currentMove = null;
            }, 500);
            break;
          case 'ignis': // Nova Burst
            setTimeout(() => {
              const dist = Math.abs(p.x - other.x);
              if (dist < 300 && Math.abs(p.y - other.y) < 250) {
                other.health -= 45;
                other.lastHurtTime = Date.now();
                other.vy = -20;
              }
              p.isSpecial = false;
              p.currentMove = null;
            }, 1000);
            break;
          case 'glacia': // Absolute Zero
            setTimeout(() => {
              const dist = Math.abs(p.x - other.x);
              if (dist < 350) {
                other.health -= 15;
                other.lastHurtTime = Date.now();
                other.isStunned = true;
                other.vx = 0;
                setTimeout(() => { other.isStunned = false; }, 1500);
              }
              p.isSpecial = false;
              p.currentMove = null;
            }, 500);
            break;
          case 'yuri': // Void Ambush
            setTimeout(() => {
              p.x = other.x + (other.direction === 'right' ? -60 : 60);
              p.direction = other.direction === 'right' ? 'right' : 'left';
              other.health -= 30;
              other.lastHurtTime = Date.now();
              p.isSpecial = false;
              p.currentMove = null;
            }, 400);
            break;
          case 'rex': // Apex Predator (The Lunge)
            p.vx = (other.x > p.x ? 25 : -25);
            const checkPin = setInterval(() => {
              const dist = Math.abs(p.x - other.x);
              if (dist < 50) {
                clearInterval(checkPin);
                other.isStunned = true;
                other.health -= 40;
                other.lastHurtTime = Date.now();
                p.vx = 0;
                setTimeout(() => {
                  other.isStunned = false;
                  p.isSpecial = false;
                  p.currentMove = null;
                }, 800);
              }
            }, 16);
            setTimeout(() => {
              clearInterval(checkPin);
              p.isSpecial = false;
              p.currentMove = null;
            }, 1000);
            break;
          case 'jade': // Zen Strike
            p.vx = (p.direction === 'right' ? 30 : -30);
            setTimeout(() => {
               const dist = Math.abs(p.x - other.x);
               if (dist < 100) {
                 other.health -= 25;
                 other.lastHurtTime = Date.now();
               }
               p.vx = 0;
               p.isSpecial = false;
               p.currentMove = null;
            }, 500);
            break;
          case 'aero': // Wind Burst
            setTimeout(() => {
              const dist = Math.abs(p.x - other.x);
              if (dist < 400) {
                other.vx = p.direction === 'right' ? 50 : -50;
                other.health -= 20;
                other.lastHurtTime = Date.now();
              }
              p.isSpecial = false;
              p.currentMove = null;
            }, 300);
            break;
          case 'midas': // Golden Touch
            setTimeout(() => {
              const dist = Math.abs(p.x - other.x);
              if (dist < 120 && Math.abs(p.y - other.y) < 100) {
                other.health -= 55;
                other.lastHurtTime = Date.now();
                other.vy = -5;
              }
              p.isSpecial = false;
              p.currentMove = null;
            }, 800);
            break;
          case 'nova': // Supernova
            const suckTimer = setInterval(() => {
                other.x += (p.x - other.x) * 0.1;
                other.y += (p.y - other.y) * 0.1;
            }, 16);
            setTimeout(() => {
              clearInterval(suckTimer);
              const dist = Math.abs(p.x - other.x);
              if (dist < 150) {
                other.health -= 35;
                other.lastHurtTime = Date.now();
                other.vy = -20;
              }
              p.isSpecial = false;
              p.currentMove = null;
            }, 1000);
            break;
          default:
            p.isSpecial = false;
            p.currentMove = null;
        }
      }

      // Attacks
      if ((input.attack1 || input.attack2) && !p.isAttacking && !p.isBlocking) {
        const isAtk1 = input.attack1;
        input.attack1 = false;
        input.attack2 = false;
        p.isAttacking = true;
        p.currentMove = isAtk1 ? p.character.moves[0] : p.character.moves[1];
        
        // Basic Collision Check
        setTimeout(() => {
          if (playersRef.current) {
            const dist = Math.abs(p.x - other.x);
            if (dist < 100 && Math.abs(p.y - other.y) < 50) {
              if (other.isBlocking && (other.direction === 'left' ? p.x < other.x : p.x > other.x)) {
                other.health -= 1;
              } else {
                const damage = (input.attack1 ? 5 : 10) * (p.character.stats.power / 5);
                other.health -= damage;
                other.lastHurtTime = Date.now();
                p.comboCount++;
                p.power = Math.min(100, p.power + damage * 1.5);
              }
            }
          }
        }, 100);

        setTimeout(() => {
          p.isAttacking = false;
          p.currentMove = null;
        }, 300);
      }

      // Physics
      p.x += p.vx;
      p.y += p.vy;
      p.vy += GRAVITY;

      if (p.y >= GROUND_Y) {
        p.y = GROUND_Y;
        p.vy = 0;
        p.isJumping = false;
      }

      // Bounds
      p.x = Math.max(50, Math.min(GAME_WIDTH - 50, p.x));
    };

    updatePlayer(p1, inputs.p1, p2);
    updatePlayer(p2, inputs.p2, p1);

    if (p1.health <= 0) {
      setWinner(2);
      setGameState(GameState.GAME_OVER);
    } else if (p2.health <= 0) {
      setWinner(1);
      setGameState(GameState.GAME_OVER);
    }
  }, []);

  const draw = useCallback((ctx: CanvasRenderingContext2D) => {
    if (!playersRef.current) return;
    const { p1, p2 } = playersRef.current;

    ctx.clearRect(0, 0, GAME_WIDTH, GAME_HEIGHT);

    // Floor
    ctx.fillStyle = '#1e1e1e';
    ctx.fillRect(0, GROUND_Y + 40, GAME_WIDTH, 40);
    ctx.strokeStyle = '#444';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(0, GROUND_Y + 40);
    ctx.lineTo(GAME_WIDTH, GROUND_Y + 40);
    ctx.stroke();

    const drawPlayer = (p: Player) => {
      ctx.save();
      ctx.translate(p.x, p.y);
      
      // Shadow
      ctx.fillStyle = 'rgba(0,0,0,0.3)';
      ctx.beginPath();
      ctx.ellipse(0, 45, 40, 10, 0, 0, Math.PI * 2);
      ctx.fill();

      // Hit Shake
      if (Date.now() - p.lastHurtTime < 100) {
        ctx.translate((Math.random() - 0.5) * 10, 0);
      }

      // Body (Semi-abstract retro shape)
      ctx.fillStyle = p.character.color;
      ctx.fillRect(-25, -60, 50, 100);

      // Low Health Highlight
      if (p.health < 20) {
        ctx.strokeStyle = `rgba(255, 0, 0, ${0.5 + Math.sin(Date.now() / 100) * 0.5})`;
        ctx.lineWidth = 4;
        ctx.strokeRect(-27, -62, 54, 104);
      }
      
      // Special Aura
      if (p.power >= 100) {
        ctx.strokeStyle = '#fff';
        ctx.lineWidth = 2;
        ctx.strokeRect(-30 + Math.sin(Date.now() / 100) * 2, -65, 60, 110);
      }

      // Special Move Visual
      if (p.isSpecial) {
        ctx.save();
        ctx.font = 'bold 24px "Courier New"';
        ctx.fillStyle = '#fff';
        ctx.textAlign = 'center';
        ctx.fillText(p.character.specialMove.toUpperCase(), 0, -110);
        
        switch(p.character.id) {
          case 'kaze': // Hurricane Blast
            ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
            ctx.beginPath();
            const sweep = (Date.now() % 500) / 500;
            ctx.arc(p.direction === 'right' ? sweep * 300 : -sweep * 300, 0, 80, 0, Math.PI * 2);
            ctx.fill();
            break;
          case 'brutus': // Earthshaker Slam
            ctx.fillStyle = 'rgba(150, 100, 50, 0.5)';
            ctx.fillRect(-GAME_WIDTH, 40, GAME_WIDTH * 2, 20);
            for(let i=0; i<10; i++) {
              ctx.fillRect((Math.random()-0.5)*400, 40-Math.random()*50, 10, 10);
            }
            break;
          case 'luna': // Eclipse Swap
            ctx.fillStyle = 'rgba(129, 140, 248, 0.6)';
            ctx.beginPath();
            ctx.arc(0, 0, Math.abs(100 * Math.sin(Date.now() / 100)), 0, Math.PI * 2);
            ctx.fill();
            break;
          case 'volt': // Overload Zap
            ctx.strokeStyle = '#facc15';
            ctx.lineWidth = 4;
            for(let i=0; i<8; i++) {
              ctx.beginPath();
              ctx.moveTo(0, 0);
              ctx.lineTo((Math.random()-0.5)*400, (Math.random()-0.5)*400);
              ctx.stroke();
            }
            break;
          case 'ignis': // Nova Burst
            const pulse = (Date.now() % 1000) / 1000;
            ctx.fillStyle = `rgba(248, 113, 113, ${0.8 * (1-pulse)})`;
            ctx.beginPath();
            ctx.arc(0, 0, pulse * 400, 0, Math.PI * 2);
            ctx.fill();
            break;
          case 'glacia': // Absolute Zero
            ctx.fillStyle = 'rgba(147, 197, 253, 0.4)';
            ctx.beginPath();
            ctx.moveTo(-200, 45);
            ctx.lineTo(200, 45);
            ctx.lineTo(150, -100);
            ctx.lineTo(-150, -100);
            ctx.closePath();
            ctx.fill();
            break;
          case 'yuri': // Void Ambush
            ctx.fillStyle = 'rgba(192, 132, 252, 0.4)';
            ctx.fillRect(-40, -70, 80, 120);
            break;
          case 'rex': // Apex Predator (Lunge indicator)
            ctx.strokeStyle = 'rgba(74, 222, 128, 0.8)';
            ctx.setLineDash([10, 10]);
            ctx.beginPath();
            ctx.moveTo(0, 0);
            ctx.lineTo(p.direction === 'right' ? 400 : -400, 0);
            ctx.stroke();
            ctx.setLineDash([]);
            break;
          case 'jade': // Zen Strike
            ctx.fillStyle = 'rgba(45, 212, 191, 0.3)';
            ctx.fillRect(p.direction === 'right' ? 0 : -300, -60, 300, 100);
            break;
          case 'aero': // Wind Burst
            ctx.strokeStyle = 'rgba(251, 146, 60, 0.6)';
            ctx.lineWidth = Math.abs(10 * Math.sin(Date.now()/50));
            ctx.beginPath();
            ctx.arc(0, 0, 150, 0, Math.PI * 2);
            ctx.stroke();
            break;
          case 'midas': // Golden Touch
            ctx.fillStyle = 'rgba(251, 191, 36, 0.8)';
            ctx.beginPath();
            ctx.moveTo(0, -60);
            ctx.lineTo(p.direction === 'right' ? 100 : -100, 0);
            ctx.lineTo(0, 60);
            ctx.fill();
            break;
          case 'nova': // Supernova
            ctx.fillStyle = 'rgba(244, 114, 182, 0.5)';
            ctx.beginPath();
            ctx.arc(0, 0, 200, 0, Math.PI * 2);
            ctx.fill();
            ctx.fillStyle = '#fff';
            ctx.beginPath();
            ctx.arc(0, 0, Math.abs(20 * Math.sin(Date.now()/50)), 0, Math.PI * 2);
            ctx.fill();
            break;
        }
        ctx.restore();
      }
      ctx.fillStyle = p.character.accent;
      ctx.fillRect(-20, -50, 40, 40);

      // Facing
      ctx.fillStyle = '#fff';
      if (p.direction === 'right') {
        ctx.fillRect(15, -45, 10, 5);
      } else {
        ctx.fillRect(-25, -45, 10, 5);
      }

      // Blocking Shield
      if (p.isBlocking) {
        ctx.strokeStyle = '#fff';
        ctx.lineWidth = 4;
        const xOff = p.direction === 'right' ? 30 : -30;
        ctx.strokeRect(xOff - 5, -40, 10, 60);
      }

      // Attacking Visual
      if (p.isAttacking) {
        ctx.fillStyle = '#fff';
        const xOff = p.direction === 'right' ? 30 : -80;
        ctx.fillRect(xOff, -30, 50, 15);
      }

      // Name label
      ctx.font = 'bold 12px "Courier New"';
      ctx.fillStyle = '#fff';
      ctx.textAlign = 'center';
      ctx.fillText(p.character.name, 0, -75);

      ctx.restore();
    };

    drawPlayer(p1);
    drawPlayer(p2);
  }, []);

  const gameLoop = useCallback(() => {
    if (gameState !== GameState.FIGHTING) return;
    updatePhysics();
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (ctx) draw(ctx);
    requestRef.current = requestAnimationFrame(gameLoop);
  }, [gameState, updatePhysics, draw]);

  useEffect(() => {
    requestRef.current = requestAnimationFrame(gameLoop);
    return () => {
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
    };
  }, [gameLoop]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const key = e.key.toLowerCase();
      // P1: WASD + F (Atk1), G (Atk2), V (Block), Space (Special)
      if (key === 'w') inputsRef.current.p1.up = true;
      if (key === 's') inputsRef.current.p1.down = true;
      if (key === 'a') inputsRef.current.p1.left = true;
      if (key === 'd') inputsRef.current.p1.right = true;
      
      // Only set attack/special to true if NOT a repeat event
      if (!e.repeat) {
        if (key === 'f') inputsRef.current.p1.attack1 = true;
        if (key === 'g') inputsRef.current.p1.attack2 = true;
        if (key === 'v') inputsRef.current.p1.block = true;
        if (e.code === 'Space') {
          e.preventDefault();
          inputsRef.current.p1.special = true;
        }

        // P2: Arrows + K (Atk1), L (Atk2), M (Block), Enter (Special)
        if (key === 'arrowup') inputsRef.current.p2.up = true;
        if (key === 'arrowdown') inputsRef.current.p2.down = true;
        if (key === 'arrowleft') inputsRef.current.p2.left = true;
        if (key === 'arrowright') inputsRef.current.p2.right = true;
        if (key === 'k') inputsRef.current.p2.attack1 = true;
        if (key === 'l') inputsRef.current.p2.attack2 = true;
        if (key === 'm') inputsRef.current.p2.block = true;
        if (e.code === 'Enter') {
          e.preventDefault();
          inputsRef.current.p2.special = true;
        }
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      const key = e.key.toLowerCase();
      if (key === 'w') inputsRef.current.p1.up = false;
      if (key === 's') inputsRef.current.p1.down = false;
      if (key === 'a') inputsRef.current.p1.left = false;
      if (key === 'd') inputsRef.current.p1.right = false;
      if (key === 'f') inputsRef.current.p1.attack1 = false;
      if (key === 'g') inputsRef.current.p1.attack2 = false;
      if (key === 'v') inputsRef.current.p1.block = false;
      if (e.code === 'Space') inputsRef.current.p1.special = false;

      if (key === 'arrowup') inputsRef.current.p2.up = false;
      if (key === 'arrowdown') inputsRef.current.p2.down = false;
      if (key === 'arrowleft') inputsRef.current.p2.left = false;
      if (key === 'arrowright') inputsRef.current.p2.right = false;
      if (key === 'k') inputsRef.current.p2.attack1 = false;
      if (key === 'l') inputsRef.current.p2.attack2 = false;
      if (key === 'm') inputsRef.current.p2.block = false;
      if (e.code === 'Enter') inputsRef.current.p2.special = false;
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, []);

  useEffect(() => {
    let interval: number;
    if (gameState === GameState.FIGHTING && timer > 0) {
      interval = window.setInterval(() => {
        // Health Regeneration
        if (playersRef.current) {
          const { p1, p2 } = playersRef.current;
          [p1, p2].forEach(p => {
            if (p.health > 0 && p.health < p.character.stats.health) {
              const regenAmount = p.health < 20 ? 5 : 2;
              p.health = Math.min(p.character.stats.health, p.health + regenAmount);
            }
          });
        }

        setTimer((t) => {
          if (t <= 1) {
            setGameState(GameState.GAME_OVER);
            // Decide winner by health
            if (playersRef.current) {
               if (playersRef.current.p1.health > playersRef.current.p2.health) setWinner(1);
               else if (playersRef.current.p2.health > playersRef.current.p1.health) setWinner(2);
            }
            return 0;
          }
          return t - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [gameState, timer]);

  return (
    <div id="game-root" className="w-full h-full bg-neutral-950 text-white font-mono selection:bg-emerald-500 overflow-hidden flex flex-col items-center justify-center p-4">
      
      {/* BACKGROUND DECO */}
      <div className="absolute inset-0 pointer-events-none opacity-10 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white/20 via-transparent to-transparent" />
      <div className="absolute inset-0 pointer-events-none opacity-20" style={{ backgroundImage: 'linear-gradient(rgba(18, 16, 16, 0) 50%, rgba(0, 0, 0, 0.25) 50%), linear-gradient(90deg, rgba(255, 0, 0, 0.06), rgba(0, 255, 0, 0.02), rgba(0, 0, 255, 0.06))', backgroundSize: '100% 2px, 3px 100%' }} />

      <AnimatePresence mode="wait">
        {gameState === GameState.BOOTING && (
          <motion.div 
            key="booting"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 z-[100] bg-neutral-950 flex flex-col items-center justify-center overflow-hidden"
          >
            <div className="flex flex-col items-center">
              <motion.div
                initial={{ y: -800, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ 
                  duration: 0.8, 
                  type: "spring", 
                  bounce: 0.4,
                  delay: 0.2
                }}
              >
                <h1 className="text-6xl md:text-8xl font-pixel text-white drop-shadow-[0_0_30px_rgba(255,255,255,0.4)]">
                  RETRO
                </h1>
              </motion.div>
              
              <motion.div
                initial={{ y: 800, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ 
                  duration: 0.8, 
                  type: "spring", 
                  bounce: 0.4,
                  delay: 0.5
                }}
              >
                <h1 className="text-8xl md:text-[12rem] font-black italic text-red-600 drop-shadow-[0_0_20px_rgba(220,38,38,0.5)] pr-8">
                  STRIKE
                </h1>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 1.5, duration: 0.5 }}
                className="mt-12 space-y-2 text-center"
              >
                <p className="text-emerald-400 font-bold tracking-[0.4em] text-sm uppercase">Made by Orcaweesh</p>
                <div className="h-1 w-24 bg-emerald-500 mx-auto" />
              </motion.div>
            </div>
            
            {/* Scanline effect for booting screen */}
            <div className="absolute inset-0 pointer-events-none opacity-30" style={{ backgroundImage: 'linear-gradient(rgba(18, 16, 16, 0) 50%, rgba(0, 0, 0, 0.25) 50%), linear-gradient(90deg, rgba(255, 0, 0, 0.06), rgba(0, 255, 0, 0.02), rgba(0, 0, 255, 0.06))', backgroundSize: '100% 2px, 3px 100%' }} />
          </motion.div>
        )}

        {gameState === GameState.MENU && (
          <motion.div 
            key="menu"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="flex flex-col items-center gap-8 z-10"
          >
            <div className="flex flex-col items-center gap-2">
              <span className="font-pixel text-4xl md:text-6xl text-white drop-shadow-[0_0_10px_rgba(255,255,255,0.5)]">RETRO</span>
              <h1 className="text-7xl md:text-9xl font-black italic text-transparent bg-clip-text bg-gradient-to-b from-red-500 to-red-900 drop-shadow-[0_10px_20px_rgba(239,68,68,0.3)] uppercase pr-8">
                STRIKE
              </h1>
            </div>
            
            <button 
              onClick={() => setGameState(GameState.CHARACTER_SELECT)}
              className="group relative px-12 py-4 bg-white text-black font-bold text-xl hover:scale-105 transition-transform active:scale-95"
            >
              <div className="absolute -inset-1 bg-emerald-500 opacity-0 group-hover:opacity-50 transition-opacity blur" />
              START GAME
            </button>
          </motion.div>
        )}

        {gameState === GameState.CHARACTER_SELECT && (
          <motion.div 
            key="select"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="w-full max-w-5xl z-10 space-y-12"
          >
            <div className="flex justify-between items-end border-b-4 border-white pb-4">
              <div>
                <h2 className="text-4xl font-italic font-black italic">CHOOSE YOUR FIGHTER</h2>
                <div className="flex gap-4 mt-2">
                  <div className={`px-4 py-1 flex items-center gap-2 ${p1Char ? 'bg-emerald-500 text-black' : 'bg-neutral-800 text-neutral-500'}`}>
                    <User size={16} /> P1: {p1Char?.name || 'SELECTING...'}
                  </div>
                  <div className={`px-4 py-1 flex items-center gap-2 ${p2Char ? 'bg-orange-500 text-black' : 'bg-neutral-800 text-neutral-500'}`}>
                    <User size={16} /> P2: {p2Char?.name || 'SELECTING...'}
                  </div>
                </div>
              </div>
              <button 
                disabled={!p1Char || !p2Char}
                onClick={startGame}
                className="px-8 py-3 bg-white text-black font-black uppercase disabled:opacity-20 hover:bg-emerald-400 transition-colors"
                id="btn-ready"
              >
                FIGHT!
              </button>
            </div>

            <div className="grid grid-cols-3 md:grid-cols-6 gap-4">
              {CHARACTERS.map((char) => {
                const isP1 = p1Char?.id === char.id;
                const isP2 = p2Char?.id === char.id;
                return (
                  <motion.div
                    key={char.id}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => {
                      if (!p1Char) {
                        setP1Char(char);
                        // Add some selection audio feel if possible but keep it silent for now
                      }
                      else if (!p2Char && !isP1) setP2Char(char);
                      else if (isP1) setP1Char(null);
                      else if (isP2) setP2Char(null);
                    }}
                    className={`relative cursor-pointer aspect-square border-4 group transition-all overflow-hidden ${
                      isP1 ? 'border-emerald-500 ring-4 ring-emerald-500/30' : 
                      isP2 ? 'border-orange-500 ring-4 ring-orange-500/30' : 
                      'border-neutral-800'
                    }`}
                  >
                    {/* Abstract Character Avatar */}
                    <div className="absolute inset-0 grid grid-cols-4 grid-rows-4 opacity-40">
                       {Array.from({length: 16}).map((_, i) => (
                         <div 
                           key={i} 
                           style={{ 
                             backgroundColor: i % 3 === 0 ? char.accent : char.color,
                             opacity: Math.sin(i * 1.5) > 0 ? 1 : 0.5
                           }} 
                         />
                       ))}
                    </div>
                    
                    <div 
                      className="absolute inset-0 opacity-0 group-hover:opacity-40 transition-opacity" 
                      style={{ backgroundColor: char.color }}
                    />
                    
                    <div className="absolute inset-0 flex flex-col items-center justify-center p-4 z-10">
                      <div className="text-center font-black text-xl italic tracking-tighter truncate w-full drop-shadow-lg group-hover:scale-110 transition-transform">
                        {char.name}
                      </div>
                      <div className="mt-2 flex gap-1.5 text-[8px] font-bold">
                        <div className="flex gap-0.5 items-center">
                          <Zap size={8} className="text-yellow-400" />
                          <div className="flex gap-0.5">
                            {[1, 2, 3, 4, 5].map(v => (
                              <div key={v} className={`w-0.5 h-2 ${char.stats.speed >= v * 2 ? 'bg-white' : 'bg-white/10'}`} />
                            ))}
                          </div>
                        </div>
                        <div className="flex gap-0.5 items-center">
                          <Sword size={8} className="text-red-400" />
                          <div className="flex gap-0.5">
                            {[1, 2, 3, 4, 5].map(v => (
                              <div key={v} className={`w-0.5 h-2 ${char.stats.power >= v * 2 ? 'bg-white' : 'bg-white/10'}`} />
                            ))}
                          </div>
                        </div>
                        <div className="flex gap-0.5 items-center">
                          <Shield size={8} className="text-blue-400" />
                          <div className="flex gap-0.5">
                            {[1, 2, 3, 4, 5].map(v => (
                              <div key={v} className={`w-0.5 h-2 ${char.stats.defense >= v * 2 ? 'bg-white' : 'bg-white/10'}`} />
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                    {isP1 && <div className="absolute top-0 left-0 bg-emerald-500 text-black px-2 py-0.5 text-xs font-black z-20 italic">P1</div>}
                    {isP2 && <div className="absolute top-0 right-0 bg-orange-500 text-black px-2 py-0.5 text-xs font-black z-20 italic">P2</div>}
                  </motion.div>
                );
              })}
            </div>

            {(p1Char || p2Char) && (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="grid grid-cols-2 gap-8 h-48 bg-neutral-900 border-4 border-white p-6"
              >
                {[p1Char, p2Char].map((char, i) => char ? (
                  <div key={i} className="flex gap-6">
                    <div className="w-32 h-32 bg-neutral-800 flex items-center justify-center border-4 border-white/10">
                       <User size={64} className="text-white/20" />
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between items-start">
                        <h3 className="text-2xl font-black italic" style={{ color: char.color }}>{char.name}</h3>
                        <div className="flex gap-3">
                           <div className="flex flex-col items-center gap-1">
                             <Heart size={14} className="text-emerald-400" />
                             <div className="flex gap-0.5">
                               {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(v => (
                                 <div key={v} className={`w-1 h-3 ${char.stats.health >= v * 15 ? 'bg-emerald-400' : 'bg-white/10'}`} />
                               ))}
                             </div>
                           </div>
                           <div className="flex flex-col items-center gap-1">
                             <Zap size={14} className="text-yellow-400" />
                             <div className="flex gap-0.5">
                               {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(v => (
                                 <div key={v} className={`w-1 h-3 ${char.stats.speed >= v ? 'bg-yellow-400' : 'bg-white/10'}`} />
                               ))}
                             </div>
                           </div>
                           <div className="flex flex-col items-center gap-1">
                             <Sword size={14} className="text-red-400" />
                             <div className="flex gap-0.5">
                               {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(v => (
                                 <div key={v} className={`w-1 h-3 ${char.stats.power >= v ? 'bg-red-400' : 'bg-white/10'}`} />
                               ))}
                             </div>
                           </div>
                           <div className="flex flex-col items-center gap-1">
                             <Shield size={14} className="text-blue-400" />
                             <div className="flex gap-0.5">
                               {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(v => (
                                 <div key={v} className={`w-1 h-3 ${char.stats.defense >= v ? 'bg-blue-400' : 'bg-white/10'}`} />
                               ))}
                             </div>
                           </div>
                        </div>
                      </div>
                      <p className="text-xs text-emerald-400 font-bold mt-1 uppercase tracking-tight">Special: {char.specialMove}</p>
                      <p className="text-xs text-neutral-300 mt-2 leading-relaxed">{char.description.split(' - ')[1] || char.description}</p>
                    </div>
                  </div>
                ) : <div key={i} className="flex items-center justify-center text-neutral-600 border-2 border-dashed border-neutral-800 font-black italic">Select Controller {i+1}</div>)}
              </motion.div>
            )}
            
            <div className="grid grid-cols-2 gap-8 text-[10px] text-neutral-500 uppercase tracking-widest">
              <div className="space-y-1">
                <p className="text-white mb-2">PLAYER 1 CONTROLS</p>
                <div className="flex gap-4">
                  <span>W,A,S,D: MOVE & JUMP</span>
                  <span>F, G: ATTACK</span>
                  <span>V: BLOCK | SPACE: SPECIAL</span>
                </div>
              </div>
              <div className="space-y-1">
                <p className="text-white mb-2">PLAYER 2 CONTROLS</p>
                <div className="flex gap-4">
                  <span>ARROWS: MOVE & JUMP</span>
                  <span>K, L: ATTACK</span>
                  <span>M: BLOCK | ENTER: SPECIAL</span>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {gameState === GameState.FIGHTING && (
          <motion.div 
            key="battle"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-col items-center gap-4 z-10"
          >
            <div className="w-[800px] flex justify-between items-center px-4 pt-4">
              {/* P1 HUD */}
              <div className="flex-1 space-y-1">
                <div className="flex justify-between items-end text-xs font-black italic">
                  <span className="text-emerald-400">P1 {p1Char?.name}</span>
                  <span>{Math.ceil(playersRef.current?.p1.health || 0)}%</span>
                </div>
                <div className="h-6 bg-neutral-900 border-2 border-white overflow-hidden relative">
                  <motion.div 
                    initial={{ width: '100%' }}
                    animate={{ width: `${((playersRef.current?.p1.health ?? 100) / (p1Char?.stats.health || 100)) * 100}%` }}
                    className="h-full bg-gradient-to-r from-emerald-600 to-emerald-400"
                  />
                </div>
                {/* POWER BAR P1 */}
                <div className="h-2 bg-neutral-900 border border-white/20 mt-1 overflow-hidden relative">
                  <motion.div 
                    animate={{ width: `${playersRef.current?.p1.power ?? 0}%` }}
                    className={`h-full ${playersRef.current?.p1.power === 100 ? 'bg-white animate-pulse' : 'bg-emerald-800'}`}
                  />
                </div>
              </div>

              {/* TIMER */}
              <div className="w-32 flex flex-col items-center">
                 <div className="text-4xl font-black italic text-yellow-400 leading-none">{timer.toString().padStart(2, '0')}</div>
                 <div className="text-[10px] text-neutral-500 mt-1">ROUND 1</div>
              </div>

              {/* P2 HUD */}
              <div className="flex-1 space-y-1 text-right">
                <div className="flex justify-between items-end text-xs font-black italic flex-row-reverse">
                  <span className="text-orange-400">P2 {p2Char?.name}</span>
                  <span>{Math.ceil(playersRef.current?.p2.health || 0)}%</span>
                </div>
                <div className="h-6 bg-neutral-900 border-2 border-white overflow-hidden relative">
                  <motion.div 
                    initial={{ width: '100%' }}
                    animate={{ width: `${((playersRef.current?.p2.health ?? 100) / (p2Char?.stats.health || 100)) * 100}%` }}
                    className="h-full bg-gradient-to-l from-orange-600 to-orange-400 absolute right-0"
                  />
                </div>
                {/* POWER BAR P2 */}
                <div className="h-2 bg-neutral-900 border border-white/20 mt-1 overflow-hidden relative">
                  <motion.div 
                    animate={{ width: `${playersRef.current?.p2.power ?? 0}%` }}
                    className={`h-full absolute right-0 ${playersRef.current?.p2.power === 100 ? 'bg-white animate-pulse' : 'bg-orange-800'}`}
                  />
                </div>
              </div>
            </div>

            <canvas 
              ref={canvasRef}
              width={GAME_WIDTH}
              height={GAME_HEIGHT}
              className="bg-neutral-900 border-4 border-white shadow-[0_0_50px_rgba(0,0,0,0.5)]"
            />
            
            <div className="w-full flex justify-between text-[10px] text-neutral-500 italic pb-2">
              <div className="flex gap-4">
                <span className="text-emerald-500 font-bold">P1: WASDFGV</span>
                <span>COMBO: {playersRef.current?.p1.comboCount || 0}</span>
              </div>
              <div className="flex gap-4 flex-row-reverse">
                <span className="text-orange-500 font-bold">P2: ARROWSKLM</span>
                <span>COMBO: {playersRef.current?.p2.comboCount || 0}</span>
              </div>
            </div>
          </motion.div>
        )}

        {gameState === GameState.GAME_OVER && (
          <motion.div 
            key="over"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="flex flex-col items-center gap-8 z-10"
          >
            <div className="text-center">
              <Trophy size={80} className="mx-auto text-yellow-400 mb-4 animate-bounce" />
              <h2 className="text-9xl font-black italic tracking-tighter italic">
                {winner ? `PLAYER ${winner} WINS!` : 'DRAW!'}
              </h2>
              <p className="text-2xl text-emerald-400 mt-4 italic font-black uppercase">
                {winner === 1 ? p1Char?.name : p2Char?.name} DOMINATES THE ARENA!
              </p>
            </div>

            <div className="flex gap-4">
              <button 
                onClick={startGame}
                className="flex items-center gap-2 px-8 py-4 bg-white text-black font-black hover:scale-105 transition-transform"
              >
                <RefreshCcw size={20} /> REMATCH
              </button>
              <button 
                onClick={() => {
                  setP1Char(null);
                  setP2Char(null);
                  setGameState(GameState.CHARACTER_SELECT);
                }}
                className="flex items-center gap-2 px-8 py-4 bg-neutral-800 text-white font-black hover:scale-105 transition-transform border-4 border-white"
              >
                <User size={20} /> NEW FIGHTERS
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* FOOTER */}
      <footer className="absolute bottom-4 left-4 right-4 flex justify-between items-center text-[10px] text-white/20 select-none">
      </footer>
    </div>
  );
}
