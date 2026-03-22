import React, { useState, useEffect, useRef } from 'react';
import { PricingPlan, pricingData } from '../data/pricingData';
import { officialTradingViewData } from '../data/officialTradingViewData';
import { formatCurrency, formatUSD } from '../utils/formatters';
import { Check, MessageCircle, TrendingDown, Info, ChevronRight, Zap, Users, ShieldCheck } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface PlanExplorerProps {
  selectedPlan: PricingPlan | null;
}

const PlanExplorer: React.FC<PlanExplorerProps> = ({ selectedPlan: initialSelectedPlan }) => {
  const [selectedPlan, setSelectedPlan] = useState<PricingPlan>(initialSelectedPlan || pricingData[0]);
  const explorerRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (initialSelectedPlan) {
      setSelectedPlan(initialSelectedPlan);
      explorerRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, [initialSelectedPlan]);

  const officialPrice = officialTradingViewData.plans[selectedPlan.tier];
  
  // Calculate savings
  // Duration in months (approximate)
  const durationMonths = parseInt(selectedPlan.duration) || 1;
  const officialTotalVND = officialPrice.priceVND * durationMonths;
  const savings = officialTotalVND - selectedPlan.priceVND;
  const savingsPercent = Math.round((savings / officialTotalVND) * 100);

  return (
    <section id="explorer" ref={explorerRef} className="py-20 bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-4">Khám Phá Chi Tiết Từng Gói</h2>
          <p className="text-slate-600">Bấm vào từng gói để xem giải thích chi tiết lợi ích và tính năng.</p>
        </div>

        <div className="grid lg:grid-cols-12 gap-8">
          {/* Left: Quick Selector */}
          <div className="lg:col-span-4 space-y-4">
            <h3 className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] mb-6">Danh sách gói</h3>
            <div className="max-h-[600px] overflow-y-auto pr-4 space-y-3 custom-scrollbar">
              {pricingData.map((plan, idx) => (
                <motion.button
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.05 }}
                  key={plan.id}
                  onClick={() => setSelectedPlan(plan)}
                  className={`w-full text-left p-5 rounded-2xl border transition-all flex items-center justify-between group relative overflow-hidden ${
                    selectedPlan.id === plan.id 
                    ? 'bg-white border-blue-500 shadow-xl ring-1 ring-blue-500' 
                    : 'bg-white border-slate-200 hover:border-blue-300'
                  }`}
                >
                  {selectedPlan.id === plan.id && (
                    <motion.div 
                      layoutId="active-indicator"
                      className="absolute left-0 top-0 bottom-0 w-1.5 bg-blue-600"
                    />
                  )}
                  <div className="relative z-10">
                    <p className={`text-[10px] font-black uppercase tracking-[0.2em] mb-1.5 ${
                      selectedPlan.id === plan.id ? 'text-blue-600' : 'text-slate-400'
                    }`}>
                      {plan.tier}
                    </p>
                    <p className="font-black text-slate-900 tracking-tight">{plan.name}</p>
                  </div>
                  <ChevronRight className={`w-5 h-5 transition-transform duration-300 ${
                    selectedPlan.id === plan.id ? 'text-blue-600 translate-x-1' : 'text-slate-300 group-hover:text-slate-400'
                  }`} />
                </motion.button>
              ))}
            </div>
          </div>

          {/* Right: Detail Panel */}
          <div className="lg:col-span-8">
            <AnimatePresence mode="wait">
              <motion.div
                key={selectedPlan.id}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
                className="bg-white rounded-3xl shadow-xl border border-slate-100 overflow-hidden"
              >
                <div className="p-8 sm:p-10">
                  {/* Header */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <span className="px-3 py-1 bg-blue-600 text-white text-[10px] font-bold uppercase tracking-widest rounded-full">
                          {selectedPlan.tier}
                        </span>
                        {selectedPlan.isPartnerDeal && (
                          <span className="px-3 py-1 bg-green-50 text-green-700 text-[10px] font-bold uppercase tracking-widest rounded-full border border-green-100">
                            Deal độc quyền đối tác
                          </span>
                        )}
                      </div>
                      <h3 className="text-3xl font-extrabold text-slate-900">{selectedPlan.name}</h3>
                      <p className="text-slate-500 font-medium">{selectedPlan.duration}</p>
                    </div>
                    <div className="text-left sm:text-right">
                      <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Giá Quân TradingView</p>
                      <div className="text-4xl font-black text-blue-600">{formatCurrency(selectedPlan.priceVND)}</div>
                    </div>
                  </div>

                  {/* Savings Card */}
                  <div className="bg-blue-50 rounded-2xl p-6 mb-8 flex flex-col sm:flex-row items-center justify-between gap-4 border border-blue-100">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-200">
                        <TrendingDown className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <p className="text-sm font-bold text-blue-900">Tiết kiệm ước tính {savingsPercent}%</p>
                        <p className="text-xs text-blue-700">So với giá gốc {formatCurrency(officialPrice.priceVND)}/tháng</p>
                      </div>
                    </div>
                    <div className="text-center sm:text-right">
                      <p className="text-xs font-bold text-blue-400 uppercase tracking-widest">Bạn tiết kiệm được</p>
                      <p className="text-xl font-bold text-blue-700">~{formatCurrency(savings)}</p>
                    </div>
                  </div>

                  {/* Content Grid */}
                  <div className="grid md:grid-cols-2 gap-10">
                    <div>
                      <div className="mb-8">
                        <h4 className="text-sm font-bold text-slate-900 uppercase tracking-widest mb-3 flex items-center">
                          <Info className="w-4 h-4 mr-2 text-blue-600" />
                          Mô tả gói
                        </h4>
                        <p className="text-slate-600 leading-relaxed">{selectedPlan.description}</p>
                      </div>

                      <div className="mb-8">
                        <h4 className="text-sm font-bold text-slate-900 uppercase tracking-widest mb-3 flex items-center">
                          <Users className="w-4 h-4 mr-2 text-blue-600" />
                          Ai nên mua gói này?
                        </h4>
                        <p className="text-slate-600 leading-relaxed">{selectedPlan.suitableFor}</p>
                      </div>

                      <div className="mb-8">
                        <h4 className="text-sm font-bold text-slate-900 uppercase tracking-widest mb-3 flex items-center">
                          <Zap className="w-4 h-4 mr-2 text-blue-600" />
                          Lợi ích chính
                        </h4>
                        <ul className="space-y-3">
                          {selectedPlan.benefits.map((benefit, i) => (
                            <li key={i} className="flex items-start text-sm text-slate-600">
                              <Check className="w-4 h-4 text-green-500 mr-2 shrink-0 mt-0.5" />
                              {benefit}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>

                    <div>
                      <div className="mb-8">
                        <h4 className="text-sm font-bold text-slate-900 uppercase tracking-widest mb-3 flex items-center">
                          <ShieldCheck className="w-4 h-4 mr-2 text-blue-600" />
                          Tính năng cụ thể
                        </h4>
                        <div className="bg-slate-50 rounded-2xl p-5 border border-slate-100">
                          <ul className="space-y-3">
                            {selectedPlan.features.map((feature, i) => (
                              <li key={i} className="flex items-start text-sm text-slate-700 font-medium">
                                <div className="w-1.5 h-1.5 rounded-full bg-blue-600 mr-3 mt-2 shrink-0"></div>
                                {feature}
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>

                      {selectedPlan.note && (
                        <div className="mb-8 p-4 bg-amber-50 rounded-xl border border-amber-100">
                          <p className="text-xs text-amber-800 font-bold uppercase tracking-widest mb-1">Ghi chú quan trọng</p>
                          <p className="text-sm text-amber-700">{selectedPlan.note}</p>
                        </div>
                      )}

                      <a
                        href={`https://zalo.me/0583156019?text=Chào Quân TradingView, tôi muốn tư vấn gói ${selectedPlan.name}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-full py-4 px-6 rounded-2xl bg-blue-600 text-white font-bold text-lg hover:bg-blue-700 transition-all flex items-center justify-center shadow-xl shadow-blue-200 group"
                      >
                        <MessageCircle className="w-6 h-6 mr-3 group-hover:scale-110 transition-transform" />
                        Chat Zalo tư vấn gói này
                      </a>
                    </div>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PlanExplorer;
