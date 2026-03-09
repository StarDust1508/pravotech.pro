"use client";

import React from 'react';
import { motion } from 'framer-motion';

export default function WhyPartnerSection() {
  const scrollToSponsorForm = () => {
    const element = document.getElementById('sponsor-form');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="py-20 px-4 bg-background relative overflow-hidden">
      <div className="absolute inset-0 bg-grid-white/[0.02] bg-grid" />
      <div className="relative max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="font-display text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-neon-cyan via-neon-magenta to-neon-cyan bg-clip-text text-transparent">
            Почему PravoTechHub?
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Крупнейшая IT-конференция в сфере правовых технологий с доказанной эффективностью
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-center group"
          >
            <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-r from-neon-cyan to-blue-500 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
              <span className="text-3xl font-bold text-primary-foreground">5K+</span>
            </div>
            <h3 className="text-xl font-display font-bold mb-2">Участников</h3>
            <p className="text-sm text-muted-foreground">Ежегодная аудитория конференции</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-center group"
          >
            <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-r from-neon-magenta to-purple-500 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
              <span className="text-3xl font-bold text-primary-foreground">85%</span>
            </div>
            <h3 className="text-xl font-display font-bold mb-2">C-Level</h3>
            <p className="text-sm text-muted-foreground">Топ-менеджеры и владельцы бизнеса</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
            className="text-center group"
          >
            <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
              <span className="text-3xl font-bold text-primary-foreground">320%</span>
            </div>
            <h3 className="text-xl font-display font-bold mb-2">Средний ROI</h3>
            <p className="text-sm text-muted-foreground">Возврат инвестиций партнеров</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4 }}
            className="text-center group"
          >
            <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-r from-orange-500 to-yellow-500 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
              <span className="text-3xl font-bold text-primary-foreground">150+</span>
            </div>
            <h3 className="text-xl font-display font-bold mb-2">Лидов</h3>
            <p className="text-sm text-muted-foreground">Качественных контактов на спонсора</p>
          </motion.div>
        </div>

        <div className="grid md:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="space-y-6"
          >
            <h3 className="text-3xl font-display font-bold">
              Уникальная экосистема
            </h3>
            <div className="space-y-4">
              <div className="flex items-start gap-4">
                <div className="w-6 h-6 bg-neon-cyan rounded-full flex-shrink-0 mt-1 flex items-center justify-center">
                  <span className="text-xs text-primary-foreground">✓</span>
                </div>
                <div>
                  <h4 className="font-semibold mb-1">Эксклюзивный нетворкинг</h4>
                  <p className="text-sm text-muted-foreground">Доступ к закрытым мероприятиям с ключевыми игроками рынка</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="w-6 h-6 bg-neon-magenta rounded-full flex-shrink-0 mt-1 flex items-center justify-center">
                  <span className="text-xs text-primary-foreground">✓</span>
                </div>
                <div>
                  <h4 className="font-semibold mb-1">Медийное покрытие</h4>
                  <p className="text-sm text-muted-foreground">Освещение в ведущих профильных изданиях и соцсетях</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="w-6 h-6 bg-green-500 rounded-full flex-shrink-0 mt-1 flex items-center justify-center">
                  <span className="text-xs text-primary-foreground">✓</span>
                </div>
                <div>
                  <h4 className="font-semibold mb-1">B2B площадка</h4>
                  <p className="text-sm text-muted-foreground">Прямые контакты с потенциальными клиентами и партнерами</p>
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="bg-muted/30 rounded-2xl p-8 border border-border"
          >
            <div className="text-center mb-6">
              <h4 className="text-2xl font-display font-bold mb-2">Отзыв партнера</h4>
              <div className="flex justify-center mb-4">
                {[1, 2, 3, 4, 5].map(star => (
                  <span key={star} className="text-yellow-500 text-xl">★</span>
                ))}
              </div>
            </div>
            <blockquote className="text-center italic text-muted-foreground mb-4">
              "PravoTechHub превзошел все наши ожидания. За 2 дня мы получили 180 качественных лидов и заключили 3 крупные сделки. ROI составил 420%."
            </blockquote>
            <div className="text-center">
              <p className="font-semibold">Алексей Петров</p>
              <p className="text-sm text-muted-foreground">Директор по развитию, LegalTech Solutions</p>
            </div>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-16 text-center"
        >
          <div className="bg-gradient-to-r from-neon-cyan/10 to-neon-magenta/10 rounded-2xl p-8 border border-neon-cyan/20">
            <h4 className="text-2xl font-display font-bold mb-4">
              🎯 Готовы к коллаборации?
            </h4>
            <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
              Присоединяйтесь к экосистеме инноваций и станьте частью будущего правовых технологий
            </p>
            <button 
              onClick={scrollToSponsorForm}
              className="px-8 py-3 bg-neon-cyan text-primary-foreground font-display font-bold rounded-lg shadow-neon-cyan hover:opacity-90 transition-opacity"
            >
              Стать партнером
            </button>
          </div>
        </motion.div>
      </div>
    </section>
  );
}