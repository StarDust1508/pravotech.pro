import { useState } from "react";
import { X } from "lucide-react";
import { BrandTitle } from "@/components/BrandTitle";

type DocKey = "privacy" | "cookie" | "terms" | "consent";

const docs: Record<DocKey, { title: string; content: string }> = {
  privacy: {
    title: "Политика конфиденциальности",
    content: `1. Общие положения

1.1. Настоящая Политика конфиденциальности определяет порядок обработки и защиты персональных данных пользователей сайта «Технологии права» (далее — Сайт).

1.2. Оператором персональных данных является ООО «Технологии права» (далее — Оператор).

1.3. Политика разработана в соответствии с Федеральным законом от 27.07.2006 №152-ФЗ «О персональных данных».

2. Цели обработки персональных данных

2.1. Оператор обрабатывает персональные данные в следующих целях:
— предоставление доступа к материалам и исследованиям Сайта;
— обработка заявок на участие в конференции и иных мероприятиях;
— обработка заявок на партнёрство и спонсорство;
— направление информационных рассылок (с согласия Пользователя);
— улучшение качества работы Сайта;
— выполнение требований законодательства РФ.

3. Перечень обрабатываемых данных

3.1. Оператор может обрабатывать: ФИО, email, телефон, наименование организации и должность, Telegram, данные об использовании Сайта (IP-адрес, тип браузера — обезличенные данные).

4. Правовые основания обработки

4.1. Обработка осуществляется на основании согласия субъекта (ст. 6 ч. 1 п. 1 №152-ФЗ), исполнения договора (ст. 6 ч. 1 п. 5), законного интереса Оператора (ст. 6 ч. 1 п. 7).

5. Порядок обработки

5.1. Обработка включает сбор, запись, систематизацию, хранение, уточнение, использование, передачу, обезличивание, блокирование, удаление и уничтожение данных.

5.2. Оператор обеспечивает конфиденциальность и принимает меры для предотвращения несанкционированного доступа.

6. Сроки обработки

6.1. Данные хранятся не дольше, чем требуют цели обработки. По запросу субъекта уничтожаются в срок не более 30 дней.

7. Права субъекта

7.1. Пользователь вправе запросить уточнение, блокирование или удаление данных, отозвать согласие на обработку. Обращения: info@pravotechhub.ru.

8. Меры защиты

8.1. Шифрование (SSL/TLS), ограничение доступа, обновление средств защиты, резервное копирование.

9. Актуальная версия Политики размещается на Сайте. Контакт: info@pravotechhub.ru.`,
  },

  cookie: {
    title: "Политика использования файлов cookie",
    content: `1. Файлы cookie — небольшие текстовые файлы, сохраняемые на устройстве при посещении сайта «Технологии права».

2. Типы cookie:
— Необходимые (технические) — базовая работа Сайта.
— Аналитические — обезличенные данные о взаимодействии (Яндекс.Метрика, Google Analytics).
— Функциональные — запоминание предпочтений.
— Маркетинговые — релевантная реклама.

3. Сроки: сессионные удаляются при закрытии браузера, постоянные — от 30 дней до 2 лет.

4. Управление: через настройки браузера. Отключение может ограничить функциональность.

5. Продолжая использовать Сайт, вы соглашаетесь с использованием cookie.

6. Контакт: info@pravotechhub.ru.`,
  },

  terms: {
    title: "Пользовательское соглашение",
    content: `1. Настоящее Соглашение регулирует отношения между ООО «Технологии права» и пользователем сайта pravotechhub.ru.

2. Использование Сайта означает принятие условий Соглашения. Администрация вправе изменять условия.

3. Пользователь обязуется: использовать Сайт в соответствии с законодательством РФ, не нарушать работу Сайта, не копировать материалы без разрешения, предоставлять достоверные данные.

4. Все материалы Сайта являются интеллектуальной собственностью Администрации. Цитирование допускается со ссылкой на источник.

5. Сайт предоставляется «как есть». Администрация не несёт ответственности за убытки от использования Сайта. Исследования носят информационный характер.

6. Споры разрешаются по законодательству РФ. Контакт: info@pravotechhub.ru.`,
  },

  consent: {
    title: "Согласие на обработку персональных данных",
    content: `В соответствии со ст. 9 ФЗ от 27.07.2006 №152-ФЗ «О персональных данных», даю согласие ООО «Технологии права» на обработку моих данных:

1. Данные: ФИО, email, телефон, организация, должность, Telegram.

2. Цели: доступ к исследованиям, обработка заявок на конференцию/партнёрство/спикерство, информирование о новых материалах.

3. Способы: сбор, запись, систематизация, хранение, уточнение, использование, передача, обезличивание, удаление. С использованием и без средств автоматизации.

4. Срок: до момента отзыва.

5. Отзыв: письменное заявление на info@pravotechhub.ru. Данные уничтожаются в срок не более 30 дней.

6. Оператор вправе передавать данные третьим лицам для достижения целей обработки с соблюдением законодательства РФ.

7. Заполняя форму на сайте, Пользователь подтверждает ознакомление с настоящим согласием и Политикой конфиденциальности.

Контакт: info@pravotechhub.ru | +7 (495) 123-45-67`,
  },
};

export const Footer = () => {
  const [openDoc, setOpenDoc] = useState<DocKey | null>(null);

  const scrollToSection = (href: string) => {
    const element = document.querySelector(href);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <>
      <footer id="contacts" className="py-12 border-t border-border">
        <div className="container">
          <div className="grid md:grid-cols-3 gap-8 mb-8">
            <div>
              <BrandTitle className="font-display text-lg font-bold" uppercase />
              <p className="text-muted-foreground text-sm mt-2 max-w-xs">
                Платформа об ИИ, цифровых технологиях и масштабировании юридического бизнеса в сфере БФЛ.
              </p>
            </div>
            <div>
              <h4 className="font-display font-bold text-sm uppercase mb-3 text-foreground/80">Разделы</h4>
              <div className="space-y-2">
                <button onClick={() => scrollToSection("#about")} className="block text-sm text-muted-foreground hover:text-neon-cyan transition-colors">О проекте</button>
                <button onClick={() => scrollToSection("#research")} className="block text-sm text-muted-foreground hover:text-neon-cyan transition-colors">Исследования</button>
                <button onClick={() => scrollToSection("#academy")} className="block text-sm text-muted-foreground hover:text-neon-cyan transition-colors">Академия</button>
                <button onClick={() => scrollToSection("#conference")} className="block text-sm text-muted-foreground hover:text-neon-cyan transition-colors">Конференция</button>
              </div>
            </div>
            <div>
              <h4 className="font-display font-bold text-sm uppercase mb-3 text-foreground/80">Контакты</h4>
              <div className="space-y-2 text-sm text-muted-foreground">
                <p>info@pravotechhub.ru</p>
                <p>+7 (495) 123-45-67</p>
                <p>Москва, Россия</p>
              </div>
            </div>
          </div>
          <div className="pt-6 border-t border-border">
            <div className="flex flex-wrap justify-center gap-x-6 gap-y-2 mb-4 text-xs text-muted-foreground">
              <button onClick={() => setOpenDoc("privacy")} className="hover:text-neon-cyan transition-colors">Политика конфиденциальности</button>
              <button onClick={() => setOpenDoc("cookie")} className="hover:text-neon-cyan transition-colors">Политика использования cookies</button>
              <button onClick={() => setOpenDoc("terms")} className="hover:text-neon-cyan transition-colors">Пользовательское соглашение</button>
              <button onClick={() => setOpenDoc("consent")} className="hover:text-neon-cyan transition-colors">Согласие на обработку ПДн</button>
            </div>
            <p className="text-center text-xs text-muted-foreground mb-1">
              &copy; 2026 Технологии права. Все права защищены.
            </p>
            <p className="text-center text-[11px] text-muted-foreground/60">
              Оставляя свои данные на сайте, вы даёте согласие на обработку персональных данных в соответствии с Федеральным законом №152-ФЗ «О персональных данных» и подтверждаете ознакомление с политикой конфиденциальности.
            </p>
          </div>
        </div>
      </footer>

      {openDoc && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-background/80 backdrop-blur-sm" onClick={() => setOpenDoc(null)} />
          <div className="relative bg-card border border-border rounded-2xl max-w-2xl w-full max-h-[85vh] flex flex-col">
            <div className="flex items-center justify-between p-6 pb-4 border-b border-border">
              <h3 className="font-display text-xl font-bold">{docs[openDoc].title}</h3>
              <button onClick={() => setOpenDoc(null)} className="text-muted-foreground hover:text-foreground transition-colors">
                <X size={20} />
              </button>
            </div>
            <div className="p-6 overflow-y-auto custom-scrollbar">
              <div className="text-sm text-muted-foreground whitespace-pre-line leading-relaxed">
                {docs[openDoc].content}
              </div>
            </div>
            <div className="p-4 border-t border-border">
              <button
                onClick={() => setOpenDoc(null)}
                className="w-full px-6 py-2.5 border border-border text-foreground/70 font-display font-bold rounded-lg hover:border-neon-cyan/50 transition-colors text-sm uppercase tracking-wider"
              >
                Закрыть
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
