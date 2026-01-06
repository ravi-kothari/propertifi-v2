'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    ChatBubbleLeftRightIcon,
    XMarkIcon,
    PaperAirplaneIcon,
    ChevronDownIcon,
    SparklesIcon,
} from '@heroicons/react/24/outline';

interface Message {
    id: string;
    role: 'user' | 'assistant';
    content: string;
    timestamp: Date;
}

const US_STATES = [
    { id: 'california', name: 'California' },
    { id: 'texas', name: 'Texas' },
    { id: 'florida', name: 'Florida' },
    { id: 'newyork', name: 'New York' },
    { id: 'arizona', name: 'Arizona' },
];

const PRESET_PROMPTS = [
    'What are the security deposit rules?',
    'How much notice for eviction?',
    'Is there rent control?',
    'What disclosures are required?',
];

export default function PropertyLawsChat() {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState<Message[]>([]);
    const [inputValue, setInputValue] = useState('');
    const [selectedState, setSelectedState] = useState('california');
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    useEffect(() => {
        if (isOpen && inputRef.current) {
            inputRef.current.focus();
        }
    }, [isOpen]);

    const handleSend = async () => {
        if (!inputValue.trim() || isLoading) return;

        const userMessage: Message = {
            id: Date.now().toString(),
            role: 'user',
            content: inputValue.trim(),
            timestamp: new Date(),
        };

        setMessages((prev) => [...prev, userMessage]);
        setInputValue('');
        setIsLoading(true);

        try {
            const conversationHistory = messages.map((m) => ({
                role: m.role,
                content: m.content,
            }));

            const response = await fetch('/api/chat/property-laws', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    message: userMessage.content,
                    state: selectedState,
                    conversationHistory,
                }),
            });

            const data = await response.json();

            if (response.ok) {
                const assistantMessage: Message = {
                    id: (Date.now() + 1).toString(),
                    role: 'assistant',
                    content: data.response,
                    timestamp: new Date(),
                };
                setMessages((prev) => [...prev, assistantMessage]);
            } else {
                const errorMessage: Message = {
                    id: (Date.now() + 1).toString(),
                    role: 'assistant',
                    content: `Sorry, I encountered an error: ${data.error}. Please try again.`,
                    timestamp: new Date(),
                };
                setMessages((prev) => [...prev, errorMessage]);
            }
        } catch (error) {
            const errorMessage: Message = {
                id: (Date.now() + 1).toString(),
                role: 'assistant',
                content: 'Sorry, I had trouble connecting. Please check your connection and try again.',
                timestamp: new Date(),
            };
            setMessages((prev) => [...prev, errorMessage]);
        } finally {
            setIsLoading(false);
        }
    };

    const handlePresetClick = (prompt: string) => {
        setInputValue(prompt);
        inputRef.current?.focus();
    };

    return (
        <>
            {/* Chat Toggle Button */}
            <motion.button
                onClick={() => setIsOpen(!isOpen)}
                className="fixed bottom-6 right-6 z-50 flex items-center justify-center w-14 h-14 bg-gradient-to-br from-blue-600 to-purple-600 rounded-full shadow-lg hover:shadow-xl transition-shadow"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                aria-label="Property Laws Chat"
            >
                {isOpen ? (
                    <XMarkIcon className="h-6 w-6 text-white" />
                ) : (
                    <ChatBubbleLeftRightIcon className="h-6 w-6 text-white" />
                )}
            </motion.button>

            {/* Chat Window */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 20, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 20, scale: 0.95 }}
                        transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                        className="fixed bottom-24 right-6 z-40 w-[380px] h-[520px] bg-white rounded-2xl shadow-2xl border border-gray-200 flex flex-col overflow-hidden"
                    >
                        {/* Header */}
                        <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-4 text-white">
                            <div className="flex items-center gap-2 mb-2">
                                <SparklesIcon className="h-5 w-5" />
                                <h3 className="font-semibold">Property Laws Assistant</h3>
                            </div>
                            <div className="flex items-center gap-2">
                                <span className="text-sm text-blue-100">State:</span>
                                <select
                                    value={selectedState}
                                    onChange={(e) => setSelectedState(e.target.value)}
                                    className="bg-white/20 border border-white/30 rounded-lg px-2 py-1 text-sm text-white focus:outline-none focus:ring-2 focus:ring-white/50"
                                >
                                    {US_STATES.map((state) => (
                                        <option key={state.id} value={state.id} className="text-gray-900">
                                            {state.name}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        {/* Messages */}
                        <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
                            {messages.length === 0 ? (
                                <div className="text-center py-8">
                                    <SparklesIcon className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                                    <p className="text-gray-500 text-sm mb-4">
                                        Ask me about landlord-tenant laws in{' '}
                                        {US_STATES.find((s) => s.id === selectedState)?.name}!
                                    </p>
                                    <div className="flex flex-wrap gap-2 justify-center">
                                        {PRESET_PROMPTS.map((prompt) => (
                                            <button
                                                key={prompt}
                                                onClick={() => handlePresetClick(prompt)}
                                                className="text-xs bg-white border border-gray-200 px-3 py-1.5 rounded-full hover:bg-blue-50 hover:border-blue-200 transition-colors"
                                            >
                                                {prompt}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            ) : (
                                messages.map((message) => (
                                    <div
                                        key={message.id}
                                        className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                                    >
                                        <div
                                            className={`max-w-[85%] rounded-2xl px-4 py-2.5 ${message.role === 'user'
                                                    ? 'bg-blue-600 text-white rounded-br-md'
                                                    : 'bg-white text-gray-800 border border-gray-200 rounded-bl-md shadow-sm'
                                                }`}
                                        >
                                            <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                                        </div>
                                    </div>
                                ))
                            )}
                            {isLoading && (
                                <div className="flex justify-start">
                                    <div className="bg-white border border-gray-200 rounded-2xl rounded-bl-md px-4 py-3 shadow-sm">
                                        <div className="flex gap-1">
                                            <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></span>
                                            <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></span>
                                            <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></span>
                                        </div>
                                    </div>
                                </div>
                            )}
                            <div ref={messagesEndRef} />
                        </div>

                        {/* Disclaimer */}
                        <div className="px-4 py-2 bg-yellow-50 border-t border-yellow-100">
                            <p className="text-xs text-yellow-700 text-center">
                                ⚠️ For informational purposes only. Consult an attorney for legal advice.
                            </p>
                        </div>

                        {/* Input */}
                        <div className="p-3 border-t border-gray-200 bg-white">
                            <div className="flex gap-2">
                                <input
                                    ref={inputRef}
                                    type="text"
                                    value={inputValue}
                                    onChange={(e) => setInputValue(e.target.value)}
                                    onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                                    placeholder="Ask about property laws..."
                                    className="flex-1 px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                                    disabled={isLoading}
                                />
                                <button
                                    onClick={handleSend}
                                    disabled={!inputValue.trim() || isLoading}
                                    className="px-4 py-2.5 bg-blue-600 text-white rounded-xl hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                >
                                    <PaperAirplaneIcon className="h-5 w-5" />
                                </button>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}
