import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { Navbar } from "@/components/Navbar";
import { HeroSection } from "@/components/HeroSection";
import { TickerBar } from "@/components/TickerBar";
import { AboutProjectSection } from "@/components/AboutProjectSection";
import { ResearchSection } from "@/components/ResearchSection";
import { ChecklistsSection } from "@/components/ChecklistsSection";
import { ArticlesSection } from "@/components/ArticlesSection";
import { ArbitrationAdSection } from "@/components/ArbitrationAdSection";
import { PlatformPromoSection } from "@/components/PlatformPromoSection";
import { BookPromoSection } from "@/components/BookPromoSection";
import { TelegramSubscribeSection } from "@/components/TelegramSubscribeSection";
import { AcademySection } from "@/components/AcademySection";
import { CertificationSection } from "@/components/CertificationSection";
import { ConferenceTeaserSection } from "@/components/ConferenceTeaserSection";
import { FaqSection } from "@/components/FaqSection";
import { Footer } from "@/components/Footer";
import { FloatingCubes } from "@/components/FloatingCubes";

const homeFaq = [
  {
    question: "Что такое банкротство физических лиц?",
    answer: "Банкротство физических лиц (БФЛ) — это законная процедура списания долгов граждан через арбитражный суд или МФЦ (внесудебное банкротство). Регулируется Федеральным законом № 127-ФЗ. Позволяет списать долги по кредитам, микрозаймам, ЖКХ, распискам и другим обязательствам.",
  },
  {
    question: "Кому подходит платформа «ТехнологИИ права»?",
    answer: "Платформа создана для юристов, арбитражных управляющих, руководителей юридических компаний и всех, кто работает в сфере банкротства физических лиц. Мы помогаем масштабировать практику с помощью исследований, обучения и цифровых инструментов.",
  },
  {
    question: "Какие исследования доступны на платформе?",
    answer: "Доступно 8 аналитических исследований: рынок БФЛ в России 2026, сравнение игроков рынка, влияние ИИ на работу юриста, цифровой путь клиента, экономика юридической практики, технологии лидеров рынка, автоматизация документооборота, AI-инструменты для коммуникации и продаж.",
  },
  {
    question: "Как получить книгу о банкротстве?",
    answer: "Книга «Банкротство физических лиц» (117 страниц, редакция май 2026) доступна безоплатно. Получить можно через Telegram-бот @NeuroPravo_Bot — напишите /start или нажмите кнопку «Получить книгу» на странице книги.",
  },
  {
    question: "Когда и где пройдёт конференция?",
    answer: "Конференция «ТехнологИИ Права» пройдёт 25–26 сентября 2026 года в Москве, Технополис «Инновация». 6 тематических потоков, 80+ спикеров, 1500+ участников. Темы: БФЛ, AI-инструменты, масштабирование юридической практики.",
  },
  {
    question: "Что такое Академия и какие курсы доступны?",
    answer: "Академия ТехнологИИ права — онлайн-обучение для юристов по банкротству. Курсы: юридические аспекты БФЛ, неосвобождение от обязательств, оспаривание сделок, эффективная команда, продажи юридических услуг. Четыре уровня: Старт, Практика, Рост, Экспертный.",
  },
  {
    question: "Что умеет Telegram-бот NeuroPravo?",
    answer: "Бот @NeuroPravo_Bot безоплатно отправляет книгу о банкротстве, чек-листы для юристов (подготовка заявления, взаимодействие с АУ, внесудебное банкротство, анализ сделок), аналитические исследования и информацию о курсах Академии.",
  },
];

const Index = () => {
  const { hash } = useLocation();

  // Прокрутка к якорю (#book, #platform, ...) при заходе на главную по ссылке
  // с другой страницы. Несколько попыток — секции с данными рендерятся асинхронно.
  useEffect(() => {
    if (!hash) return;
    const id = hash.slice(1);
    let tries = 0;
    const timer = setInterval(() => {
      const el = document.getElementById(id);
      if (el) {
        el.scrollIntoView({ behavior: "smooth" });
        clearInterval(timer);
      } else if (++tries > 20) {
        clearInterval(timer);
      }
    }, 100);
    return () => clearInterval(timer);
  }, [hash]);

  return (
    <div className="min-h-screen bg-background relative">
      <FloatingCubes />
      <Navbar />
      <HeroSection />
      <TickerBar />
      <AboutProjectSection />
      <ConferenceTeaserSection />
      <div className="h-px bg-gradient-to-r from-transparent via-neon-magenta/15 to-transparent" />
      <AcademySection />
      <CertificationSection />
      <ResearchSection />
      <ChecklistsSection />
      <div className="h-px bg-gradient-to-r from-transparent via-neon-cyan/15 to-transparent" />
      <PlatformPromoSection />
      <ArticlesSection />
      <div className="h-px bg-gradient-to-r from-transparent via-neon-magenta/10 to-transparent" />
      <BookPromoSection />
      <ArbitrationAdSection />
      <div className="h-px bg-gradient-to-r from-transparent via-neon-magenta/15 to-transparent" />
      <TelegramSubscribeSection />
      <FaqSection items={homeFaq} title="Частые вопросы" subtitle="Ответы на ключевые вопросы о платформе, банкротстве и наших сервисах" />
      <Footer />
    </div>
  );
};

export default Index;
