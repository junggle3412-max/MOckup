/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import MockupStudio from './components/MockupStudio';

export default function App() {
  return (
    <div className="min-h-screen bg-[#FAFAFA] text-neutral-900 font-sans selection:bg-primary/20 selection:text-primary">
      {/* Mesh Background */}
      <div className="fixed inset-0 pointer-events-none opacity-40 z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-primary/20 blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[30%] h-[30%] rounded-full bg-secondary/10 blur-[100px]" />
      </div>

      <main className="relative z-10">
        <MockupStudio />
      </main>

      <footer className="relative z-10 border-t border-neutral-100 py-12 mt-12 bg-white">
        <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-neutral-900 rounded-lg flex items-center justify-center text-white font-black text-xs">M</div>
            <span className="text-xs font-bold tracking-widest uppercase">Mockup AI © 2026</span>
          </div>
          <div className="flex gap-8">
            <a href="#" className="text-[10px] font-bold uppercase tracking-widest text-neutral-400 hover:text-primary transition-colors">Privacy</a>
            <a href="#" className="text-[10px] font-bold uppercase tracking-widest text-neutral-400 hover:text-primary transition-colors">Terms</a>
            <a href="#" className="text-[10px] font-bold uppercase tracking-widest text-neutral-400 hover:text-primary transition-colors">API Docs</a>
          </div>
        </div>
      </footer>
    </div>
  );
}

