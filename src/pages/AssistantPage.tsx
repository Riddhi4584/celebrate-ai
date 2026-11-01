import React, { useState, useRef, useEffect } from 'react';
import {
  Sparkles,
  Send,
  Bot,
  User,
  Copy,
  Check,
  RefreshCw,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  Shield,
  Lightbulb,
} from 'lucide-react';
import { useEventContext } from '../context/EventContext';
import { AiPlanningEngine } from '../services/aiService';
import { ChatMessage, StructuredProposal } from '../types';
import { formatCurrency, generateId } from '../utils/formatters';

const SUGGESTED_PROMPTS = [
  'Reduce my budget by 15% without compromising food quality',
  'Create a 7-day final preparation checklist',
  'Create a backup contingency plan in case of rain',
  'Suggest a gourmet vegetarian menu for my guests',
  'Find areas where my current plan exceeds the budget',
  'Suggest outdoor photo-op and lighting ideas',
];

export const AssistantPage: React.FC = () => {
  const { activeEvent, updateEvent, applyStructuredProposal, settings } = useEventContext();
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [previewProposal, setPreviewProposal] = useState<StructuredProposal | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  if (!activeEvent) {
    return <div className="p-8 text-center text-stone-500">Please select an event.</div>;
  }

  const messages = activeEvent.chatHistory || [];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const handleSend = async (messageText?: string) => {
    const textToSend = messageText || inputMessage;
    if (!textToSend.trim() || isTyping) return;

    const userMsg: ChatMessage = {
      id: generateId('msg'),
      sender: 'user',
      content: textToSend,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    const updatedHistory = [...messages, userMsg];
    updateEvent({
      ...activeEvent,
      chatHistory: updatedHistory,
    });

    setInputMessage('');
    setIsTyping(true);

    try {
      const aiResponse = await AiPlanningEngine.processUserChat(
        textToSend,
        activeEvent,
        settings.geminiApiKey || settings.openaiApiKey
      );

      updateEvent({
        ...activeEvent,
        chatHistory: [...updatedHistory, aiResponse],
      });
    } catch (err) {
      console.error('Chat processing error:', err);
      const errorMsg: ChatMessage = {
        id: generateId('msg'),
        sender: 'ai',
        content: "I encountered a minor issue processing your query, but I'm still ready to help. Try asking about budget optimizations, menu suggestions, or rain contingencies!",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      updateEvent({
        ...activeEvent,
        chatHistory: [...updatedHistory, errorMsg],
      });
    } finally {
      setIsTyping(false);
    }
  };

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleApplyConfirmedProposal = () => {
    if (previewProposal) {
      applyStructuredProposal(previewProposal);
      setPreviewProposal(null);
    }
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto flex flex-col h-[calc(100vh-8.5rem)]">
      {/* Header bar */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b border-stone-200 pb-4 shrink-0">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#E05368]">
            <Sparkles className="w-4 h-4" />
            Interactive Event Planning Partner
          </div>
          <h1 className="font-serif text-2xl font-bold text-[#2D1236]">
            AI Assistant: {activeEvent.title}
          </h1>
          <p className="text-xs text-stone-500">
            Armed with full context of your {activeEvent.guestCount} guests, {formatCurrency(activeEvent.totalBudget, activeEvent.currency)} budget, and {activeEvent.city} location.
          </p>
        </div>

        <div className="flex items-center gap-2 text-[11px] font-semibold text-stone-600 bg-white px-3 py-1.5 rounded-xl border border-stone-200 shadow-2xs">
          <Shield className="w-3.5 h-3.5 text-emerald-600" />
          <span>{settings.useDemoAi ? 'Contextual Demo Engine Active' : 'External LLM Connected'}</span>
        </div>
      </div>

      {/* Chat Messages Container */}
      <div className="flex-1 bg-white rounded-3xl p-4 sm:p-6 border border-stone-200/90 shadow-2xs overflow-y-auto space-y-5">
        {messages.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center p-8 space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-[#FAF0F2] text-[#E05368] flex items-center justify-center">
              <Sparkles className="w-6 h-6" />
            </div>
            <h3 className="font-serif text-lg font-bold text-[#2D1236]">Ask CelebrateAI Anything</h3>
            <p className="text-xs text-stone-500 max-w-sm">
              I can rebalance budgets, generate task checklists, draft emergency rain protocols, and evaluate trade-offs.
            </p>
          </div>
        ) : (
          messages.map((msg) => {
            const isAi = msg.sender === 'ai';
            return (
              <div
                key={msg.id}
                className={`flex gap-3.5 ${isAi ? 'items-start' : 'items-start flex-row-reverse'}`}
              >
                <div
                  className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 shadow-xs ${
                    isAi
                      ? 'bg-gradient-to-tr from-[#E05368] to-[#9C88FF] text-white'
                      : 'bg-[#2D1236] text-white'
                  }`}
                >
                  {isAi ? <Bot className="w-5 h-5" /> : <User className="w-5 h-5" />}
                </div>

                <div
                  className={`max-w-[85%] rounded-3xl p-4 sm:p-5 space-y-3 shadow-2xs ${
                    isAi
                      ? 'bg-[#FAF8F5] border border-stone-200 text-[#2D1236]'
                      : 'bg-[#2D1236] text-white'
                  }`}
                >
                  <div className="flex items-center justify-between gap-4 border-b border-stone-200/50 pb-2">
                    <span className="text-[10px] font-bold uppercase tracking-wider opacity-70">
                      {isAi ? 'CelebrateAI Planning Engine' : 'You'}
                    </span>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] opacity-60 font-mono">{msg.timestamp}</span>
                      {isAi && (
                        <button
                          onClick={() => handleCopy(msg.content, msg.id)}
                          className="opacity-60 hover:opacity-100 transition-opacity"
                          title="Copy message"
                        >
                          {copiedId === msg.id ? (
                            <Check className="w-3 h-3 text-emerald-600" />
                          ) : (
                            <Copy className="w-3 h-3" />
                          )}
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Message Markdown Body */}
                  <div className="text-xs sm:text-sm leading-relaxed whitespace-pre-wrap font-sans">
                    {msg.content}
                  </div>

                  {/* Structured Action Proposal Card */}
                  {msg.structuredProposal && (
                    <div className="mt-3 p-4 rounded-2xl bg-white border border-[#E05368]/30 shadow-sm space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-[#E05368] flex items-center gap-1">
                          <Sparkles className="w-3 h-3" /> Actionable Plan Proposal
                        </span>
                        {msg.structuredProposal.applied ? (
                          <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 flex items-center gap-1">
                            <CheckCircle2 className="w-3 h-3" /> Applied to Workspace
                          </span>
                        ) : null}
                      </div>

                      <p className="text-xs font-semibold text-[#2D1236]">
                        {msg.structuredProposal.description}
                      </p>

                      <ul className="text-[11px] text-stone-600 space-y-1 list-disc list-inside">
                        {msg.structuredProposal.changesSummary.map((ch, i) => (
                          <li key={i}>{ch}</li>
                        ))}
                      </ul>

                      {!msg.structuredProposal.applied && (
                        <div className="pt-2">
                          <button
                            onClick={() => setPreviewProposal(msg.structuredProposal!)}
                            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold text-white bg-gradient-to-r from-[#E05368] to-[#D43D56] hover:brightness-105 shadow-xs"
                          >
                            Review & Apply Changes
                            <ArrowRight className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            );
          })
        )}

        {isTyping && (
          <div className="flex gap-3 items-center text-xs text-stone-500 animate-pulse">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-[#E05368] to-[#9C88FF] text-white flex items-center justify-center">
              <Bot className="w-4 h-4" />
            </div>
            <span>CelebrateAI is analyzing your event context and calculating recommendations...</span>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Suggested Prompt Chips */}
      <div className="flex items-center gap-2 overflow-x-auto py-1 shrink-0">
        <span className="text-[10px] font-bold uppercase tracking-wider text-stone-400 flex items-center gap-1 shrink-0">
          <Lightbulb className="w-3 h-3 text-[#E05368]" /> Suggestions:
        </span>
        {SUGGESTED_PROMPTS.map((prompt, i) => (
          <button
            key={i}
            onClick={() => handleSend(prompt)}
            className="px-3 py-1.5 rounded-full text-xs font-medium bg-white hover:bg-stone-50 border border-stone-200 text-stone-700 whitespace-nowrap shadow-2xs transition-colors"
          >
            {prompt}
          </button>
        ))}
      </div>

      {/* Chat Input Field */}
      <div className="bg-white rounded-2xl p-2 border border-stone-200/90 shadow-sm flex items-center gap-2 shrink-0">
        <input
          type="text"
          placeholder="Ask a question about your celebration, budget cuts, tasks, or menus..."
          value={inputMessage}
          onChange={(e) => setInputMessage(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') handleSend();
          }}
          className="flex-1 px-4 py-2 text-xs sm:text-sm outline-none text-[#2D1236]"
        />

        <button
          onClick={() => handleSend()}
          disabled={!inputMessage.trim() || isTyping}
          className="p-3 rounded-xl bg-gradient-to-r from-[#E05368] to-[#D43D56] hover:brightness-105 text-white disabled:opacity-40 transition-all shadow-xs"
        >
          <Send className="w-4 h-4" />
        </button>
      </div>

      {/* Confirmation Modal Before Applying Structured Proposals */}
      {previewProposal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl border border-stone-200 space-y-5">
            <div className="flex items-center gap-3 border-b border-stone-100 pb-3">
              <div className="w-10 h-10 rounded-xl bg-[#FAF0F2] text-[#E05368] flex items-center justify-center">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-serif text-xl font-bold text-[#2D1236]">Confirm Plan Adjustment</h3>
                <p className="text-xs text-stone-500">CelebrateAI will update your live workspace data</p>
              </div>
            </div>

            <p className="text-xs sm:text-sm text-stone-700 font-medium">
              {previewProposal.description}
            </p>

            <div className="bg-[#FAF8F5] p-4 rounded-2xl border border-stone-200/80 space-y-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-stone-400 block">
                Workspace Changes Preview:
              </span>
              <ul className="text-xs text-stone-700 space-y-1.5 list-disc list-inside">
                {previewProposal.changesSummary.map((item, i) => (
                  <li key={i}>{item}</li>
                ))}
              </ul>
            </div>

            <div className="p-3 rounded-xl bg-amber-50 text-amber-900 text-xs border border-amber-200 flex items-center gap-2">
              <Shield className="w-4 h-4 text-amber-700 shrink-0" />
              <span>Existing tasks and confirmed vendors will not be erased.</span>
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                onClick={() => setPreviewProposal(null)}
                className="px-4 py-2.5 rounded-xl text-xs font-medium text-stone-600 hover:bg-stone-100"
              >
                Cancel
              </button>
              <button
                onClick={handleApplyConfirmedProposal}
                className="px-5 py-2.5 rounded-xl text-xs font-semibold text-white bg-gradient-to-r from-[#E05368] to-[#D43D56] shadow-sm"
              >
                Confirm & Apply Changes
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
