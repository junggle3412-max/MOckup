import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Sparkles, 
  Settings2, 
  Layers, 
  CheckCircle2, 
  AlertCircle, 
  Loader2, 
  Download, 
  RefreshCcw,
  Zap,
  Image as ImageIcon
} from 'lucide-react';
import ImageUploader from './ImageUploader';
import SelectionCanvas from './SelectionCanvas';
import { ModelType, GenerateConfig } from '../types';
import { generateLogoMockup } from '../lib/gemini';

export default function MockupStudio() {
  const [mockup, setMockup] = useState<string | null>(null);
  const [logo, setLogo] = useState<string | null>(null);
  const [selection, setSelection] = useState<{ x: number; y: number; w: number; h: number } | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [userApiKey, setUserApiKey] = useState<string>(localStorage.getItem('gemini_api_key') || '');

  const [config, setConfig] = useState<GenerateConfig>({
    model: ModelType.NANO_BANANA_2,
    quality: "1K",
    aspectRatio: "1:1",
  });

  const handleGenerate = async () => {
    if (!mockup || !logo || !selection) return;

    setIsGenerating(true);
    setError(null);
    try {
      // Convert base64 to data string (strip prefix for Gemini if needed, but the lib handles metadata)
      const mockupData = mockup.split(',')[1];
      const logoData = logo.split(',')[1];
      
      const generatedImage = await generateLogoMockup(
        mockupData,
        logoData,
        selection,
        config,
        userApiKey
      );
      setResult(generatedImage);
    } catch (err: any) {
      setError(err.message || "Failed to generate mockup. Please try again.");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleDownload = () => {
    if (!result) return;
    const link = document.createElement('a');
    link.href = result;
    link.download = `mockup-${Date.now()}.png`;
    link.click();
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 lg:py-12 flex flex-col gap-8" id="mockup-studio">
      <header className="flex flex-col gap-2">
        <div className="flex items-center gap-2 text-primary">
          <Zap size={24} className="fill-current" />
          <span className="text-xs font-bold uppercase tracking-[0.2em] opacity-80">Next-Gen Studio • Studio Thế Hệ Mới</span>
        </div>
        <h1 className="text-4xl md:text-5xl font-black tracking-tight text-neutral-900">
          AI Mockup <span className="text-primary italic">Engine</span>
        </h1>
        <p className="text-neutral-500 max-w-xl text-sm md:text-base">
          Tạo mockup logo chuyên nghiệp với công nghệ AI. Tải ảnh lên, chọn vùng đặt logo và nhận kết quả ngay lập tức.
        </p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Inputs */}
        <div className="lg:col-span-4 flex flex-col gap-6 sticky top-8">
          <section className="bg-white p-6 rounded-3xl border shadow-sm space-y-6">
            <div className="flex items-center gap-2 border-b pb-4">
              <Layers size={18} className="text-neutral-400" />
              <h2 className="text-sm font-bold uppercase tracking-wider">1. Assets • Tài Nguyên</h2>
            </div>
            
            <ImageUploader 
              label="Product Mockup • Sản phẩm" 
              image={mockup} 
              onImageUpload={setMockup} 
              onClear={() => {setMockup(null); setResult(null);}}
              id="mockup-uploader"
            />
            
            <ImageUploader 
              label="Brand Logo • Logo" 
              image={logo} 
              onImageUpload={setLogo} 
              onClear={() => setLogo(null)}
              id="logo-uploader"
            />
          </section>

          <section className="bg-white p-6 rounded-3xl border shadow-sm space-y-6">
            <div className="flex items-center gap-2 border-b pb-4">
              <Settings2 size={18} className="text-neutral-400" />
              <h2 className="text-sm font-bold uppercase tracking-wider">Config • Cấu Hình</h2>
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest px-1">Gemini API Key</label>
                <input
                  type="password"
                  placeholder="Nhập API Key của bạn..."
                  value={userApiKey}
                  onChange={(e) => {
                    const val = e.target.value;
                    setUserApiKey(val);
                    localStorage.setItem('gemini_api_key', val);
                  }}
                  className="w-full bg-neutral-50 border-neutral-200 border rounded-xl text-xs font-mono p-3 focus:ring-2 focus:ring-primary outline-none"
                />
                <p className="text-[10px] text-neutral-400 px-1 italic">
                  * API Key được lưu cục bộ trong trình duyệt của bạn.
                </p>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest px-1">Model • Chọn Model</label>
                <div className="grid grid-cols-1 gap-2">
                  {[
                    { id: ModelType.NANO_BANANA_NORMAL, name: "Nano Banana", desc: "Nhanh & Ổn định" },
                    { id: ModelType.NANO_BANANA_2, name: "Nano Banana 2", desc: "Cân bằng hiệu năng" },
                    { id: ModelType.NANO_BANANA_PRO, name: "Nano Banana Pro", desc: "Chất lượng cao nhất" }
                  ].map((m) => (
                    <button
                      key={m.id}
                      onClick={() => setConfig({ ...config, model: m.id })}
                      className={`flex items-center justify-between p-3 rounded-xl border-2 transition-all text-left
                        ${config.model === m.id ? 'border-primary bg-primary/5' : 'border-neutral-100 hover:border-neutral-200'}`}
                    >
                      <div>
                        <p className={`text-xs font-bold ${config.model === m.id ? 'text-primary' : 'text-neutral-700'}`}>{m.name}</p>
                        <p className="text-[10px] text-neutral-400 font-medium">{m.desc}</p>
                      </div>
                      {config.model === m.id && <CheckCircle2 size={14} className="text-primary" />}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest px-1">Output Resolution</label>
                <select 
                  value={config.quality}
                  onChange={(e) => setConfig({ ...config, quality: e.target.value as any })}
                  className="w-full bg-neutral-50 border-neutral-200 rounded-xl text-xs font-bold p-3 focus:ring-2 focus:ring-primary outline-none"
                >
                  <option value="512px">Web Standard (512px)</option>
                  <option value="1K">HD Resolution (1K)</option>
                  <option value="2K">Retina Quality (2K)</option>
                  <option value="4K">Professional Master (4K)</option>
                </select>
              </div>
            </div>
          </section>
        </div>

        {/* Right Column: Interaction & Result */}
        <div className="lg:col-span-8 space-y-6">
          <AnimatePresence mode="wait">
            {mockup && !result ? (
              <motion.div
                key="workspace"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="bg-white p-8 rounded-[2rem] border shadow-xl flex flex-col gap-8"
              >
                <SelectionCanvas 
                  image={mockup} 
                  onSelectionChange={setSelection}
                  id="main-canvas"
                />

                <div className="flex items-center justify-between pt-4 border-t border-neutral-100 gap-4">
                   <div className="flex flex-col">
                     <p className="text-xs font-bold text-neutral-300 uppercase tracking-widest">Selection Status</p>
                     <p className="text-sm font-medium text-neutral-500">
                       {selection ? `${Math.round(selection.w)}x${Math.round(selection.h)} Area Targeted` : "Waiting for selection..."}
                     </p>
                   </div>
                   
                   <button
                    disabled={!logo || !selection || isGenerating}
                    onClick={handleGenerate}
                    className="relative px-8 py-4 bg-neutral-900 text-white rounded-2xl font-black text-xs uppercase tracking-[0.2em] transition-all
                      hover:bg-primary shadow-lg hover:shadow-primary/20 hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-50 disabled:cursor-not-allowed group overflow-hidden"
                   >
                     <AnimatePresence mode="wait">
                       {isGenerating ? (
                         <motion.div key="loading" className="flex items-center gap-2">
                           <Loader2 className="animate-spin" size={16} />
                           Đang xử lý...
                         </motion.div>
                       ) : (
                         <motion.div key="ready" className="flex items-center gap-2">
                           <Sparkles size={16} className="group-hover:animate-pulse" />
                           Tạo Mockup Ngay
                         </motion.div>
                       )}
                     </AnimatePresence>
                   </button>
                </div>
              </motion.div>
            ) : result ? (
              <motion.div
                key="result"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-white p-8 rounded-[2rem] border shadow-2xl flex flex-col gap-6"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-green-50 text-green-600 rounded-lg">
                      <CheckCircle2 size={18} />
                    </div>
                    <div>
                      <h3 className="text-sm font-bold uppercase tracking-wider">Result Engine</h3>
                      <p className="text-xs text-neutral-400 font-medium tracking-tight">AI Generation successful • {config.model}</p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button 
                      onClick={() => setResult(null)}
                      className="p-2.5 bg-neutral-100 rounded-xl hover:bg-neutral-200 transition-colors"
                      title="Adjust"
                    >
                      <RefreshCcw size={18} />
                    </button>
                    <button 
                      onClick={handleDownload}
                      className="flex items-center gap-2 px-5 py-2.5 bg-primary text-white rounded-xl font-bold text-xs hover:shadow-lg hover:shadow-primary/30 transition-all"
                    >
                      <Download size={16} />
                      Save Image
                    </button>
                  </div>
                </div>

                <div className="relative rounded-2xl overflow-hidden bg-neutral-100 group">
                  <img src={result} className="w-full h-auto max-h-[600px] object-contain shadow-2xl" alt="AI Result" />
                  <div className="absolute inset-x-0 bottom-0 p-6 bg-gradient-to-t from-black/60 to-transparent translate-y-full group-hover:translate-y-0 transition-transform">
                     <p className="text-white text-[10px] font-bold tracking-widest uppercase opacity-80 italic">Verified Model Output: {config.model}</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <button 
                    onClick={() => setResult(null)}
                    className="flex flex-col items-center gap-1 p-4 rounded-2xl border-2 border-dashed border-neutral-100 hover:border-primary hover:bg-primary/5 transition-all group"
                  >
                    <RefreshCcw size={18} className="text-neutral-400 group-hover:text-primary transition-colors" />
                    <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-400 group-hover:text-primary">Tweak Selection</span>
                  </button>
                  <div className="flex flex-col items-center gap-1 p-4 rounded-2xl bg-neutral-50 border-2 border-transparent">
                    <Zap size={18} className="text-yellow-500 fill-current" />
                    <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-400">Optimized for Production</span>
                  </div>
                </div>
              </motion.div>
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="h-[600px] flex flex-col items-center justify-center gap-6 border-2 border-dashed border-neutral-100 rounded-[2rem] bg-neutral-50/30"
              >
                <div className="relative">
                  <div className="absolute inset-0 scale-150 blur-3xl bg-primary/10 rounded-full" />
                  <ImageIcon size={64} className="text-neutral-200 relative" />
                </div>
                <div className="text-center space-y-2">
                  <h3 className="text-lg font-bold text-neutral-400">Ready to visualize?</h3>
                  <p className="text-sm text-neutral-300 max-w-xs">Upload your product mockup and logo on the left to start the AI engine.</p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {error && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-4 bg-red-50 border border-red-100 rounded-2xl flex items-start gap-3 text-red-600"
            >
              <AlertCircle size={18} className="shrink-0 mt-0.5" />
              <div className="text-xs space-y-1">
                <p className="font-bold uppercase tracking-wider">Engine Error</p>
                <p className="opacity-80">{error}</p>
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}
