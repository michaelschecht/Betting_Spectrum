import React, { useState } from 'react';
import { Strategy, StrategyTemplate } from '../types';
import { Send, Sparkles, HelpCircle, ArrowUpRight, BrainCircuit, Play, History, RotateCcw } from 'lucide-react';
import ReactMarkdown from 'react-markdown';

interface Message {
  role: 'user' | 'assistant';
  content: string;
  templates?: StrategyTemplate[];
}

interface AiAdvisorProps {
  currentStrategy: Strategy;
  onApplyTemplate: (template: StrategyTemplate) => void;
}

const COMMON_PROMPTS = [
  "Does buying point-spread favorites in NBA historically cash?",
  "Formulate an MLB underdog value betting strategy",
  "Critique my NFL favorite moneyline model - is it EV+?",
  "Suggest a high-win-rate NHL totals strategy"
];

export default function AiAdvisor({ currentStrategy, onApplyTemplate }: AiAdvisorProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      content: `Welcome to the **EdgeFinder Quantitative Advisory Space**! 

I have indexed historical game results, rosters, and moneyline vigs over the past 25 years. 
What strategy concept would you like to build? You can outline rules in natural language (e.g. *"Show me the stats of betting home dogs in divisions when coming off consecutive losses"*), ask for optimal sizing, or test custom options.`,
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [statusMessage, setStatusMessage] = useState('');

  const loadingSentences = [
    'Scanning past 25 years of game database matrices...',
    'Evaluating vig weights and moneyline arbitrage odds...',
    'Performing regression analytics on player injury rosters...',
    'Formulating Kelly Criterion decimal sizing vectors...',
    'Isolating sport divisional performance indicators...'
  ];

  const handleSendMessage = async (text: string) => {
    if (!text.trim() || isGenerating) return;

    const userMessage: Message = { role: 'user', content: text };
    setMessages((prev) => [...prev, userMessage]);
    setInputValue('');
    setIsGenerating(true);

    let loadIdx = 0;
    setStatusMessage(loadingSentences[0]);
    const loadInterval = setInterval(() => {
      loadIdx = (loadIdx + 1) % loadingSentences.length;
      setStatusMessage(loadingSentences[loadIdx]);
    }, 1500);

    try {
      const response = await fetch('/api/strategy-advisor', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: text,
          currentStrategy
        })
      });

      if (!response.ok) {
        throw new Error('Advisor API request failed');
      }

      const data = await response.json();
      
      const assistantMessage: Message = {
        role: 'assistant',
        content: data.analysis,
        templates: data.suggestedTemplates
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch (err) {
      console.error(err);
      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content: '⚠️ **System Error**: I am unable to connect with the server-side Gemini intelligence node. Please check your **Settings > Secrets** panel in Google AI Studio to ensure your `GEMINI_API_KEY` is registered and verified.'
        }
      ]);
    } finally {
      clearInterval(loadInterval);
      setIsGenerating(false);
    }
  };

  const clearChat = () => {
    setMessages([
      {
        role: 'assistant',
        content: `Aviation systems recalculated. **EdgeFinder console cleared.** How can I assist you with sports analytics now?`,
      }
    ]);
  };

  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-2xl shadow-xl flex flex-col h-[520px] overflow-hidden lg:col-span-2">
      {/* Advisor Header */}
      <div className="bg-zinc-950 border-b border-zinc-850 px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="p-1.5 bg-sky-500/10 border border-sky-500/20 text-sky-400 rounded-lg">
            <BrainCircuit className="w-4 h-4 animate-glow" />
          </div>
          <div>
            <h3 className="text-xs font-semibold text-zinc-200">Gemini Quant Advisor</h3>
            <span className="text-[9px] text-emerald-400 font-mono tracking-wide">Ready for backtest execution</span>
          </div>
        </div>

        <button
          onClick={clearChat}
          className="p-1 text-zinc-500 hover:text-zinc-300 rounded-md transition-colors"
          title="Reset Advisory Conversation"
        >
          <RotateCcw className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Chat Messages */}
      <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-4 bg-zinc-950/40">
        {messages.map((m, idx) => {
          const isAi = m.role === 'assistant';
          return (
            <div key={idx} className={`flex flex-col ${isAi ? 'items-start' : 'items-end'} max-w-full`}>
              <div
                className={`max-w-[90%] px-3.5 py-2.5 rounded-2xl text-xs leading-relaxed ${
                  isAi
                    ? 'bg-zinc-900 border border-zinc-800 text-zinc-300 rounded-tl-none'
                    : 'bg-sky-600 border border-sky-500 text-white rounded-tr-none'
                }`}
              >
                <div className="markdown-body">
                  <ReactMarkdown>{m.content}</ReactMarkdown>
                </div>

                {/* Templates rendering */}
                {isAi && m.templates && m.templates.length > 0 && (
                  <div className="mt-3.5 border-t border-zinc-800 pt-3 flex flex-col gap-2">
                    <span className="text-[10px] font-semibold text-sky-300 uppercase tracking-wider font-mono flex items-center gap-1">
                      <Sparkles className="w-3.5 h-3.5" />
                      Suggested Strategies to Execute
                    </span>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {m.templates.map((tmpl, tIdx) => (
                        <div
                          key={tIdx}
                          className="p-2.5 bg-zinc-950/80 border border-zinc-800 hover:border-sky-500/50 rounded-xl transition-all flex flex-col justify-between gap-2 text-left"
                        >
                          <div>
                            <div className="font-bold text-[11px] text-zinc-200 line-clamp-1">{tmpl.name}</div>
                            <div className="text-[10px] text-zinc-400 leading-tight mt-0.5 mt-0.5 line-clamp-2">{tmpl.description}</div>
                          </div>
                          <button
                            onClick={() => onApplyTemplate(tmpl)}
                            className="w-full mt-1.5 py-1 text-[10px] font-semibold bg-sky-500/10 border border-sky-500/20 hover:bg-sky-500 hover:text-white text-sky-300 rounded-md transition-all flex items-center justify-center gap-1 cursor-pointer"
                          >
                            <Play className="w-2.5 h-2.5 fill-current" />
                            <span>Inject & Test Selection</span>
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          );
        })}

        {/* Loading Bubble */}
        {isGenerating && (
          <div className="flex flex-col items-start max-w-[90%]">
            <div className="bg-zinc-900 border border-zinc-850 px-4 py-3 rounded-2xl rounded-tl-none flex items-center gap-3">
              <div className="flex gap-1.5 justify-center py-1">
                <span className="w-2 h-2 rounded-full bg-sky-500 animate-bounce" style={{ animationDelay: '0ms' }}></span>
                <span className="w-2 h-2 rounded-full bg-sky-500 animate-bounce" style={{ animationDelay: '150ms' }}></span>
                <span className="w-2 h-2 rounded-full bg-sky-500 animate-bounce" style={{ animationDelay: '300ms' }}></span>
              </div>
              <span className="text-[11px] font-mono text-zinc-400 animate-pulse">{statusMessage}</span>
            </div>
          </div>
        )}
      </div>

      {/* Suggested Starters (Only shown when chat is starting/short) */}
      {messages.length < 3 && !isGenerating && (
        <div className="p-3 bg-zinc-950 border-t border-zinc-850 flex flex-col gap-1.5">
          <span className="text-[9px] uppercase font-bold text-zinc-500 tracking-wider">Diagnostic Starters</span>
          <div className="flex flex-wrap gap-1.5">
            {COMMON_PROMPTS.map((p, idx) => (
              <button
                key={idx}
                onClick={() => handleSendMessage(p)}
                className="px-2.5 py-1 text-[10px] text-zinc-400 bg-zinc-900 border border-zinc-850 hover:border-zinc-750 hover:text-zinc-200 rounded-lg transition-all flex items-center gap-1 text-left"
              >
                <span>{p}</span>
                <ArrowUpRight className="w-2.5 h-2.5 shrink-0" />
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Chat Input */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSendMessage(inputValue);
        }}
        className="p-3 bg-zinc-950 border-t border-zinc-850 flex items-center gap-2"
      >
        <input
          type="text"
          value={inputValue}
          disabled={isGenerating}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder="Ask analytical questions or design suggestions..."
          className="flex-1 bg-zinc-900 border border-zinc-800 rounded-xl px-3.5 py-2 text-xs text-zinc-200 placeholder-zinc-500 focus:outline-none focus:border-sky-500 transition-colors"
        />
        <button
          type="submit"
          disabled={isGenerating || !inputValue.trim()}
          className="p-2 bg-sky-600 hover:bg-sky-500 disabled:bg-zinc-800 disabled:text-zinc-500 text-white rounded-xl transition-all cursor-pointer"
        >
          <Send className="w-3.5 h-3.5" />
        </button>
      </form>
    </div>
  );
}
