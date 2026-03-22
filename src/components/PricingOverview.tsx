import React, { useState } from 'react';
import { pricingData, PricingPlan } from '../data/pricingData';
import { formatCurrency } from '../utils/formatters';
import { Check, Info, Zap } from 'lucide-react';
import { motion } from 'motion/react';

interface PricingOverviewProps {
  onSelectPlan: (plan: PricingPlan) => void;
}

const PricingOverview: React.FC<PricingOverviewProps> = ({ onSelectPlan }) => {
  const [filter, setFilter] = useState<'all' | 'essential' | 'plus' | 'premium' | '1m'>('all');

  const filteredPlans = pricingData.filter(plan => {
    if (filter === 'all') return true;
    if (filter === '1m') return plan.duration === '1 Tháng';
    return plan.tier === filter;
  });

  const filterButtons = [
    { id: 'all', label: 'Tất cả' },
    { id: 'essential', label: 'Essential' },
    { id: 'plus', label: 'Plus' },
    { id: 'premium', label: 'Premium' },
    { id: '1m', label: 'Gói 1 tháng' },
  ];

  return (
    <section id="pricing" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-4">Bảng Giá Tổng Quan</h2>
          <p className="text-slate-600 max-w-2xl mx-auto">
            Lựa chọn gói phù hợp với nhu cầu giao dịch của bạn. Tất cả đều là tài khoản chính hãng, dùng riêng 100%.
          </p>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap justify-center gap-2 mb-12">
          {filterButtons.map((btn) => (
            <button
              key={btn.id}
              onClick={() => setFilter(btn.id as any)}
              className={`px-6 py-2 rounded-full text-sm font-bold transition-all ${
                filter === btn.id 
                ? 'bg-blue-600 text-white shadow-md' 
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {btn.label}
            </button>
          ))}
        </div>

        {/* Pricing Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredPlans.map((plan, index) => (
            <motion.div
              layout
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ y: -10, transition: { duration: 0.2 } }}
              key={plan.id}
              className={`relative flex flex-col p-6 rounded-[2rem] border transition-all hover:shadow-[0_20px_50px_rgba(8,_112,_184,_0.1)] ${
                plan.isHot ? 'border-blue-200 bg-blue-50/30' : 'border-slate-100 bg-white'
              }`}
            >
              {plan.isHot && (
                <motion.div 
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1.5 bg-blue-600 text-white text-[10px] font-black uppercase tracking-[0.2em] rounded-full shadow-lg shadow-blue-200"
                >
                  Phổ biến nhất
                </motion.div>
              )}
              
              <div className="mb-6">
                <div className="flex justify-between items-start mb-4">
                  <span className={`text-[10px] font-black uppercase tracking-[0.2em] px-3 py-1 rounded-full ${
                    plan.tier === 'essential' ? 'bg-slate-100 text-slate-600' :
                    plan.tier === 'plus' ? 'bg-indigo-100 text-indigo-600' :
                    'bg-amber-100 text-amber-700'
                  }`}>
                    {plan.tier}
                  </span>
                  {plan.isPartnerDeal && (
                    <span className="text-[10px] font-black text-blue-600 flex items-center uppercase tracking-widest">
                      <Zap className="w-3.5 h-3.5 mr-1 fill-blue-600" />
                      Deal đối tác
                    </span>
                  )}
                </div>
                <h3 className="text-2xl font-black text-slate-900 mb-1 tracking-tight">{plan.name}</h3>
                <p className="text-sm text-slate-500 font-bold">{plan.duration}</p>
              </div>

              <div className="mb-8">
                <div className="text-4xl font-black text-slate-900 tracking-tighter">
                  {formatCurrency(plan.priceVND)}
                </div>
                {plan.note && (
                  <p className="mt-3 text-xs text-blue-600 font-bold leading-tight bg-blue-50 p-2 rounded-lg border border-blue-100">
                    {plan.note}
                  </p>
                )}
              </div>

              <ul className="space-y-4 mb-10 flex-grow">
                {plan.benefits.slice(0, 4).map((benefit, i) => (
                  <li key={i} className="flex items-start text-sm text-slate-600 font-bold">
                    <div className="w-5 h-5 rounded-full bg-emerald-50 flex items-center justify-center mr-3 shrink-0 mt-0.5">
                      <Check className="w-3.5 h-3.5 text-emerald-600" />
                    </div>
                    {benefit}
                  </li>
                ))}
              </ul>

              <div className="space-y-3">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => onSelectPlan(plan)}
                  className="w-full py-4 px-4 rounded-2xl bg-slate-900 text-white font-black text-sm hover:bg-slate-800 transition-all flex items-center justify-center shadow-xl shadow-slate-200"
                >
                  <Info className="w-4 h-4 mr-2" />
                  Xem chi tiết & Tính năng
                </motion.button>
                <motion.a
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  href={`https://zalo.me/0583156019?text=Chào Quân TradingView, tôi muốn tư vấn gói ${plan.name}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-4 px-4 rounded-2xl bg-blue-600 text-white font-black text-sm hover:bg-blue-700 transition-all flex items-center justify-center shadow-xl shadow-blue-200"
                >
                  Chat Zalo ngay
                </motion.a>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PricingOverview;
