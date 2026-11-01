import React, { useState } from 'react';
import {
  Settings,
  Download,
  Upload,
  RefreshCw,
  Key,
  Shield,
  Check,
  Database,
} from 'lucide-react';
import { useEventContext } from '../context/EventContext';
import { StorageService } from '../services/storage';
import { Currency } from '../types';

export const SettingsPage: React.FC = () => {
  const { settings, updateSettings, resetDemoData } = useEventContext();

  const [geminiKey, setGeminiKey] = useState(settings.geminiApiKey || '');
  const [openaiKey, setOpenaiKey] = useState(settings.openaiApiKey || '');
  const [useDemoAi, setUseDemoAi] = useState(settings.useDemoAi !== false);
  const [currency, setCurrency] = useState<Currency>(settings.defaultCurrency || 'INR');

  const [savedStatus, setSavedStatus] = useState(false);
  const [importStatus, setImportStatus] = useState<string | null>(null);

  const handleSaveApiKeys = (e: React.FormEvent) => {
    e.preventDefault();
    updateSettings({
      geminiApiKey: geminiKey,
      openaiApiKey: openaiKey,
      useDemoAi,
      defaultCurrency: currency,
    });
    setSavedStatus(true);
    setTimeout(() => setSavedStatus(false), 2500);
  };

  const handleExportData = () => {
    const json = StorageService.exportBackup();
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `CelebrateAI_Full_Backup_${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleImportData = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const text = event.target?.result as string;
        const success = StorageService.importBackup(text);
        if (success) {
          setImportStatus('Backup restored successfully! Refreshing...');
          setTimeout(() => {
            window.location.reload();
          }, 1000);
        } else {
          setImportStatus('Invalid JSON backup file structure.');
        }
      } catch {
        setImportStatus('Failed to read or parse JSON file.');
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      {/* Top Header */}
      <div className="border-b border-stone-200 pb-5">
        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#E05368]">
          <Settings className="w-4 h-4" />
          System Preferences & Data Governance
        </div>
        <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[#2D1236]">
          Settings & Local Data Management
        </h1>
        <p className="text-xs sm:text-sm text-stone-500">
          Configure AI intelligence providers, default currencies, and full JSON backup exports.
        </p>
      </div>

      {savedStatus && (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs sm:text-sm flex items-center gap-2 animate-in fade-in">
          <Check className="w-4 h-4 text-emerald-600" />
          <span>Settings successfully updated and saved locally!</span>
        </div>
      )}

      {/* AI Provider Configuration Card */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200/90 shadow-2xs space-y-6">
        <div className="flex items-center gap-3 border-b border-stone-100 pb-4">
          <div className="w-10 h-10 rounded-xl bg-[#FAF0F2] text-[#E05368] flex items-center justify-center">
            <Key className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-serif text-lg font-bold text-[#2D1236]">GenAI Engine Configuration</h3>
            <p className="text-xs text-stone-500">CelebrateAI is provider-independent with an intelligent built-in fallback</p>
          </div>
        </div>

        <form onSubmit={handleSaveApiKeys} className="space-y-5">
          {/* Demo AI Toggle */}
          <div className="p-4 rounded-2xl bg-[#FAF8F5] border border-stone-200/80 flex items-center justify-between gap-4">
            <div className="space-y-1">
              <span className="text-xs font-bold text-[#2D1236] block">
                Use Built-in Contextual Demo Engine (Recommended)
              </span>
              <p className="text-xs text-stone-500 leading-relaxed max-w-xl">
                Generates rich, mathematically accurate, and customized celebration plans based on your actual event data without requiring paid cloud API keys.
              </p>
            </div>
            <input
              type="checkbox"
              checked={useDemoAi}
              onChange={(e) => setUseDemoAi(e.target.checked)}
              className="w-5 h-5 rounded text-[#E05368] focus:ring-[#E05368] cursor-pointer"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-stone-600">
                Google Gemini API Key (Optional)
              </label>
              <input
                type="password"
                placeholder="AIzaSy..."
                value={geminiKey}
                onChange={(e) => setGeminiKey(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-stone-300 text-xs outline-none focus:border-[#E05368]"
              />
              <span className="text-[10px] text-stone-400">Can also be loaded via VITE_GEMINI_API_KEY</span>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-stone-600">
                OpenAI API Key (Optional)
              </label>
              <input
                type="password"
                placeholder="sk-..."
                value={openaiKey}
                onChange={(e) => setOpenaiKey(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-stone-300 text-xs outline-none focus:border-[#E05368]"
              />
              <span className="text-[10px] text-stone-400">Can also be loaded via VITE_OPENAI_API_KEY</span>
            </div>
          </div>

          <div className="p-3 rounded-xl bg-amber-50 text-amber-900 text-xs border border-amber-200 flex items-center gap-2">
            <Shield className="w-4 h-4 text-amber-700 shrink-0" />
            <span>Security notice: Keys entered here are stored in local browser state and never bundled in public repository code.</span>
          </div>

          {/* Currency setting */}
          <div className="space-y-1.5 pt-2">
            <label className="text-xs font-bold uppercase tracking-wider text-stone-600">
              Default App Currency
            </label>
            <select
              value={currency}
              onChange={(e) => setCurrency(e.target.value as Currency)}
              className="w-full sm:w-64 px-4 py-2.5 rounded-xl border border-stone-300 text-xs outline-none bg-white"
            >
              <option value="INR">INR (₹ - Indian Rupee - Default)</option>
              <option value="USD">USD ($ - US Dollar)</option>
              <option value="EUR">EUR (€ - Euro)</option>
              <option value="GBP">GBP (£ - British Pound)</option>
            </select>
          </div>

          <div className="pt-2">
            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl text-xs font-semibold text-white bg-gradient-to-r from-[#E05368] to-[#D43D56] shadow-sm hover:brightness-105"
            >
              Save Preferences
            </button>
          </div>
        </form>
      </div>

      {/* Data Backup & Reset */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200/90 shadow-2xs space-y-6">
        <div className="flex items-center gap-3 border-b border-stone-100 pb-4">
          <div className="w-10 h-10 rounded-xl bg-[#FAF0F2] text-[#E05368] flex items-center justify-center">
            <Database className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-serif text-lg font-bold text-[#2D1236]">Data Portability & Backup</h3>
            <p className="text-xs text-stone-500">Export your celebrations to JSON or restore from a previous session</p>
          </div>
        </div>

        {importStatus && (
          <div className="p-3 rounded-xl bg-blue-50 border border-blue-200 text-blue-800 text-xs">
            {importStatus}
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {/* Export JSON */}
          <div className="p-5 rounded-2xl bg-[#FAF8F5] border border-stone-200 space-y-3 flex flex-col justify-between">
            <div className="space-y-1">
              <strong className="text-xs font-bold text-[#2D1236] block">Export JSON Backup</strong>
              <p className="text-xs text-stone-500 leading-relaxed">
                Download all your celebrations, expense line items, vendors, and guests into a portable JSON file.
              </p>
            </div>
            <button
              onClick={handleExportData}
              className="w-full py-2 px-3 rounded-xl bg-white border border-stone-200 text-xs font-semibold text-[#2D1236] hover:bg-stone-50 flex items-center justify-center gap-1.5 transition-colors shadow-2xs"
            >
              <Download className="w-3.5 h-3.5 text-[#E05368]" />
              Download Backup
            </button>
          </div>

          {/* Import JSON */}
          <div className="p-5 rounded-2xl bg-[#FAF8F5] border border-stone-200 space-y-3 flex flex-col justify-between">
            <div className="space-y-1">
              <strong className="text-xs font-bold text-[#2D1236] block">Restore Backup</strong>
              <p className="text-xs text-stone-500 leading-relaxed">
                Upload a previously saved CelebrateAI backup file to restore your events.
              </p>
            </div>
            <label className="w-full py-2 px-3 rounded-xl bg-white border border-stone-200 text-xs font-semibold text-[#2D1236] hover:bg-stone-50 flex items-center justify-center gap-1.5 transition-colors shadow-2xs cursor-pointer text-center">
              <Upload className="w-3.5 h-3.5 text-[#E05368]" />
              <span>Upload Backup File</span>
              <input
                type="file"
                accept=".json"
                onChange={handleImportData}
                className="hidden"
              />
            </label>
          </div>

          {/* Reset Demo Data */}
          <div className="p-5 rounded-2xl bg-[#FAF8F5] border border-stone-200 space-y-3 flex flex-col justify-between">
            <div className="space-y-1">
              <strong className="text-xs font-bold text-[#2D1236] block">Reset to Sample Events</strong>
              <p className="text-xs text-stone-500 leading-relaxed">
                Re-populate your workspace with sample celebrations (Jaipur Wedding & Rooftop Birthday).
              </p>
            </div>
            <button
              onClick={() => {
                if (window.confirm('Reset all events to the sample demo data? Any custom events created will be replaced.')) {
                  resetDemoData();
                  alert('Demo events restored!');
                }
              }}
              className="w-full py-2 px-3 rounded-xl bg-white border border-stone-200 text-xs font-semibold text-rose-700 hover:bg-rose-50 flex items-center justify-center gap-1.5 transition-colors shadow-2xs"
            >
              <RefreshCw className="w-3.5 h-3.5 text-rose-600" />
              Reset Demo Data
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
