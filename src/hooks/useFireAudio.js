import { useCallback, useEffect, useRef, useState } from 'react';

/**
 * Ambiance de feu synthétisée via la Web Audio API — aucun fichier externe.
 * - Un lit de bruit brun filtré (grondement des braises) en boucle.
 * - Des « pops » aléatoires (crépitements) programmés en continu.
 * Le contexte audio ne démarre qu'après une interaction utilisateur (règle navigateurs).
 */
function createFireEngine() {
  let ctx = null;
  let master = null;
  let bedGain = null;
  let crackTimer = null;
  let started = false;

  // Bruit brun : intègre du bruit blanc pour un spectre chaud et grave.
  function brownNoiseBuffer(context, seconds = 3) {
    const len = context.sampleRate * seconds;
    const buf = context.createBuffer(1, len, context.sampleRate);
    const d = buf.getChannelData(0);
    let last = 0;
    for (let i = 0; i < len; i++) {
      const white = Math.random() * 2 - 1;
      last = (last + 0.02 * white) / 1.02;
      d[i] = last * 3.2;
    }
    return buf;
  }

  function scheduleCrackle() {
    if (!ctx) return;
    // Un pop = courte enveloppe de bruit filtrée passe-bande, hauteur aléatoire.
    const now = ctx.currentTime;
    const burst = ctx.createBufferSource();
    const b = ctx.createBuffer(1, ctx.sampleRate * 0.06, ctx.sampleRate);
    const bd = b.getChannelData(0);
    for (let i = 0; i < bd.length; i++) bd[i] = (Math.random() * 2 - 1) * (1 - i / bd.length);
    burst.buffer = b;
    const bp = ctx.createBiquadFilter();
    bp.type = 'bandpass';
    bp.frequency.value = 900 + Math.random() * 2600;
    bp.Q.value = 0.8 + Math.random() * 1.4;
    const g = ctx.createGain();
    const peak = 0.05 + Math.random() * 0.14;
    g.gain.setValueAtTime(0, now);
    g.gain.linearRampToValueAtTime(peak, now + 0.004);
    g.gain.exponentialRampToValueAtTime(0.0005, now + 0.05 + Math.random() * 0.05);
    burst.connect(bp).connect(g).connect(master);
    burst.start(now);
    burst.stop(now + 0.12);
    // Prochain crépitement : intervalle irrégulier pour un rendu organique.
    crackTimer = setTimeout(scheduleCrackle, 60 + Math.random() * 260);
  }

  function ensure() {
    if (ctx) return;
    const AC = window.AudioContext || window.webkitAudioContext;
    ctx = new AC();
    master = ctx.createGain();
    master.gain.value = 0;
    master.connect(ctx.destination);

    const bed = ctx.createBufferSource();
    bed.buffer = brownNoiseBuffer(ctx, 3);
    bed.loop = true;
    const lp = ctx.createBiquadFilter();
    lp.type = 'lowpass';
    lp.frequency.value = 620;
    bedGain = ctx.createGain();
    bedGain.gain.value = 0.5;
    // Léger LFO sur le filtre pour un souffle vivant.
    const lfo = ctx.createOscillator();
    const lfoGain = ctx.createGain();
    lfo.frequency.value = 0.15;
    lfoGain.gain.value = 180;
    lfo.connect(lfoGain).connect(lp.frequency);
    bed.connect(lp).connect(bedGain).connect(master);
    bed.start();
    lfo.start();
  }

  return {
    async on() {
      ensure();
      if (ctx.state === 'suspended') await ctx.resume();
      if (!started) { scheduleCrackle(); started = true; }
      master.gain.cancelScheduledValues(ctx.currentTime);
      master.gain.setTargetAtTime(0.55, ctx.currentTime, 0.6);
    },
    off() {
      if (!ctx) return;
      master.gain.cancelScheduledValues(ctx.currentTime);
      master.gain.setTargetAtTime(0, ctx.currentTime, 0.35);
    },
    dispose() {
      if (crackTimer) clearTimeout(crackTimer);
      if (ctx) ctx.close();
      ctx = null;
    },
  };
}

export function useFireAudio() {
  const engineRef = useRef(null);
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    engineRef.current = createFireEngine();
    return () => engineRef.current?.dispose();
  }, []);

  const toggle = useCallback(() => {
    setEnabled((prev) => {
      const next = !prev;
      if (next) engineRef.current?.on();
      else engineRef.current?.off();
      return next;
    });
  }, []);

  return { enabled, toggle };
}
