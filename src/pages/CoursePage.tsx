import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, ChevronLeft, ChevronRight, GraduationCap, BookOpen, Users, CheckCircle2, Star, X, ArrowRight, Scale, Briefcase, Shield, FileText, Award, Monitor, Video, ClipboardCheck, ListChecks, BookMarked, UserPlus, TrendingUp, Building2 } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { api } from "@/lib/api";
import type { AcademyCourse, AcademyTeacher, AcademyReview } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";
import neosvobozhdenieHero from "@/assets/hero-image1.png";
import yuridicheskieAspektyHero from "@/assets/hero-image2.png";
import osparivanieHero from "@/assets/hero-image3.png";
import effektivnayaKomandaHero from "@/assets/hero-image4.png";
import prodazhiHero from "@/assets/hero-image5.png";

const courseHeroImages: Record<string, string> = {
  "neosvobozhdenie-ot-obyazatelstv": neosvobozhdenieHero,
  "yuridicheskie-aspekty-bfl": yuridicheskieAspektyHero,
  "osparivanie-sdelok": osparivanieHero,
  "effektivnaya-komanda": effektivnayaKomandaHero,
  "prodazhi-yuridicheskih-uslug": prodazhiHero,
};

const levelDescriptors: Record<string, string> = {
  Старт: "Вход в практику БФЛ",
  Практика: "Углубление навыков",
  Рост: "Масштабирование практики",
  Экспертный: "Флагманский формат",
};

interface RichIntro {
  eyebrow: string;
  titlePre: string;
  titleAccent: string;
  titlePost: string;
  lead: string;
  outcomesLabel: string;
  outcomes: string[];
}

interface AudienceSegment {
  icon: LucideIcon;
  title: string;
  desc: string;
  primary?: boolean;
}

interface RichLearningItem {
  icon: LucideIcon;
  title: string;
  desc: string;
  featured?: boolean;
}

interface RichReview {
  author_name: string;
  author_role: string;
  rating: number;
  quote: string;
}

const richReviews: Record<string, RichReview[]> = {
  "yuridicheskie-aspekty-bfl": [
    {
      author_name: "Елена Смирнова",
      author_role: "Юрист по БФЛ, 3 года практики",
      rating: 5,
      quote:
        "После курса стала видеть дело системно — от оценки рисков на входе до стратегии на торгах. Алгоритмы заменили месяцы самостоятельного изучения.",
    },
    {
      author_name: "Дмитрий Козлов",
      author_role: "Руководитель практики БФЛ",
      rating: 5,
      quote:
        "Курс собрал в одном месте то, что юристу нужно для системной работы. Чек-листы и стандарты подготовки дела забрали в работу с первого кейса.",
    },
    {
      author_name: "Иван Петров",
      author_role: "Начинающий специалист БФЛ",
      rating: 5,
      quote:
        "Пришёл без серьёзной базы — за 12 занятий собрал картину процедуры целиком. Взаимодействие с АУ и торги особенно сильно зашли.",
    },
    {
      author_name: "Мария Сидорова",
      author_role: "Арбитражный управляющий",
      rating: 5,
      quote:
        "Даже с опытом АУ нашла новое — в части стандартов взаимодействия с доверителем и подготовки дел. Сильно юристам на стороне должника.",
    },
    {
      author_name: "Андрей Волков",
      author_role: "Юрист, специализация БФЛ",
      rating: 5,
      quote:
        "Экспертный состав закрывает все ключевые зоны. Отдельно отметил бы практические примеры — это опыт конкретных дел, а не теория.",
    },
    {
      author_name: "Екатерина Лебедева",
      author_role: "Руководитель юрпрактики",
      rating: 5,
      quote:
        "Внедрила стандарты подготовки дел в команду. Качество выросло, ошибок на входе в процедуру стало в разы меньше.",
    },
  ],
};

const richTeacherRoles: Record<string, Record<string, string>> = {
  "yuridicheskie-aspekty-bfl": {
    "Артин Василий Алексеевич": "Судебная практика и сложные кейсы",
    "Пустельнинкас Виолетта Владимировна": "Финансы и взаиморасчёты процедуры",
    "Герасимов Александр Дмитриевич": "Торги и реализация имущества",
    "Дрыгваль Дарья Владимировна": "Стандарты работы с АУ",
  },
};

const richTeacherBios: Record<string, Record<string, string>> = {
  "yuridicheskie-aspekty-bfl": {
    "Абукаев Андрей Александрович": "Старший эксперт",
  },
  "neosvobozhdenie-ot-obyazatelstv": {
    "Абукаев Андрей Александрович": "Старший эксперт",
  },
  "osparivanie-sdelok": {
    "Абукаев Андрей Александрович": "Старший эксперт",
  },
};

interface ToolkitItem {
  icon: LucideIcon;
  title: string;
  desc: string;
  featured?: boolean;
}

const richToolkit: Record<string, ToolkitItem[]> = {
  "yuridicheskie-aspekty-bfl": [
    {
      icon: BookMarked,
      title: "Актуальная практика 2026",
      desc: "Свежие изменения законодательства и судебная практика по БФЛ — готовы к использованию в делах.",
    },
    {
      icon: ListChecks,
      title: "Чек-листы и алгоритмы",
      desc: "Подготовка дела, оценка рисков до подачи в суд и системная работа с документами по стандарту.",
      featured: true,
    },
    {
      icon: FileText,
      title: "Рабочие инструкции",
      desc: "Протоколы взаимодействия с арбитражным управляющим, кредиторами и доверителем.",
    },
  ],
  "neosvobozhdenie-ot-obyazatelstv": [
    {
      icon: Shield,
      title: "Диагностика риска",
      desc: "Чек-листы проверки должника и сделок до подачи заявления в суд.",
      featured: true,
    },
    {
      icon: FileText,
      title: "Шаблоны защиты",
      desc: "Позиция должника и комплект документов для формирования доказательной базы.",
      featured: true,
    },
    {
      icon: ListChecks,
      title: "Ответы на возражения",
      desc: "Отработанные заготовки для кредиторов, ФНС и арбитражного управляющего.",
    },
    {
      icon: BookMarked,
      title: "Регламенты коммуникации",
      desc: "Протоколы работы с доверителем, судом и АУ — единый стандарт поведения в деле.",
    },
  ],
  "osparivanie-sdelok": [
    {
      icon: FileText,
      title: "Список доказательств по типам сделок",
      desc: "Готовые перечни доказательств для каждого основания: подозрительные, неравноценные, сделки с предпочтением.",
      featured: true,
    },
    {
      icon: ListChecks,
      title: "Чек-листы аудита сделок",
      desc: "Пошаговая диагностика риска сделок до и во время процедуры.",
      featured: true,
    },
    {
      icon: Shield,
      title: "Матрица риска сделок",
      desc: "Классификация сделок по срокам подозрительности и уровню доказательной уязвимости.",
    },
    {
      icon: BookMarked,
      title: "Шаблоны заявлений и возражений",
      desc: "Документы для атаки и защиты позиции — под разные типы сделок и стороны процесса.",
    },
    {
      icon: ClipboardCheck,
      title: "Анкета клиента",
      desc: "Единая форма сбора информации о сделках должника на первой встрече.",
    },
  ],
  "effektivnaya-komanda": [
    {
      icon: Users,
      title: "Матрица ролей и ответственности",
      desc: "Полная карта ролей, зон ответственности и уровней принятия решений в команде.",
      featured: true,
    },
    {
      icon: UserPlus,
      title: "Регламенты найма и адаптации",
      desc: "Стандарты подбора, онбординг-маршрут и критерии оценки новых сотрудников.",
      featured: true,
    },
    {
      icon: TrendingUp,
      title: "KPI и метрики команды",
      desc: "Показатели результата и качества по направлениям — привязаны к ролям.",
    },
    {
      icon: BookMarked,
      title: "Сценарии ритуалов и 1-на-1",
      desc: "Шаблоны планёрок, еженедельных встреч и индивидуальных разборов с сотрудниками.",
    },
    {
      icon: ClipboardCheck,
      title: "Чек-листы контроля и обратной связи",
      desc: "Единые стандарты проверки работы и формирования обратной связи команде.",
    },
  ],
};

const richToolkitSubtitles: Record<string, string> = {
  "neosvobozhdenie-ot-obyazatelstv":
    "Четыре группы рабочих инструментов — диагностика, защита, возражения и коммуникации. Применимы в деле с первого дня после обучения.",
  "osparivanie-sdelok":
    "Набор рабочих инструментов оспаривания — от диагностики и матрицы риска до готовых списков доказательств по типам сделок.",
  "effektivnaya-komanda":
    "Рабочий набор для руководителя — от карты ролей и регламентов найма до KPI, ритуалов и стандартов обратной связи.",
};

const richToolkitHeadings: Record<string, string> = {
  "effektivnaya-komanda": "Toolkit для сборки команды",
};

const richPracticeTasks: Record<string, string[]> = {
  "effektivnaya-komanda": [
    "Диагностика действующей команды и узких мест управления",
    "Матрица ролей и зон ответственности под вашу структуру",
    "Регламенты ключевых операционных процессов",
    "Система KPI и метрик по направлениям",
    "Стандарт найма и адаптации новых сотрудников",
    "Сценарий ритуалов команды и обратной связи",
    "Финальная сборка системы управления командой",
  ],
};

const richPracticeHeadings: Record<string, string> = {
  "effektivnaya-komanda": "Что вы соберёте на курсе",
};

const richPracticeSubtitles: Record<string, string> = {
  "effektivnaya-komanda":
    "Вы не просто проходите уроки — собираете конкретные управленческие решения. На выходе — рабочая система управления командой, готовая к внедрению.",
};

interface FormatItem {
  icon: LucideIcon;
  title: string;
  desc: string;
}

const richFormat: Record<string, FormatItem[]> = {
  "yuridicheskie-aspekty-bfl": [
    {
      icon: Monitor,
      title: "Онлайн, в удобном темпе",
      desc: "Учитесь с любого устройства и возвращайтесь к материалам когда нужно.",
    },
    {
      icon: Video,
      title: "Видеоуроки и живые вебинары",
      desc: "Теория в записи, практические разборы на онлайн-встречах с доступом к записи.",
    },
    {
      icon: ClipboardCheck,
      title: "Тесты и практические задания",
      desc: "Проверка знаний после каждого модуля и прикладные кейсы для закрепления.",
    },
    {
      icon: Award,
      title: "Сертификация после обучения",
      desc: "Итоговое тестирование и удостоверение о повышении квалификации.",
    },
  ],
  "neosvobozhdenie-ot-obyazatelstv": [
    {
      icon: Monitor,
      title: "Онлайн в своём темпе",
      desc: "С любого устройства. Доступ к материалам без ограничения по времени.",
    },
    {
      icon: Video,
      title: "Видеоуроки + живые разборы",
      desc: "Теория в записи, практика на онлайн-встречах с экспертами. Записи сохраняются.",
    },
    {
      icon: ClipboardCheck,
      title: "Практика на реальных кейсах",
      desc: "Домашние задания по диагностике риска и разбор дел по неосвобождению.",
    },
    {
      icon: Award,
      title: "Аттестация и удостоверение",
      desc: "Итоговое тестирование и документ о повышении квалификации.",
    },
  ],
  "osparivanie-sdelok": [
    {
      icon: Monitor,
      title: "Онлайн в своём темпе",
      desc: "С любого устройства. Доступ к материалам без ограничения по времени.",
    },
    {
      icon: Video,
      title: "Видеоуроки + живые разборы",
      desc: "Теория в записи, разборы сделок на онлайн-встречах с экспертами. Записи сохраняются.",
    },
    {
      icon: ClipboardCheck,
      title: "Практика на реальных сделках",
      desc: "Домашние задания по аудиту сделок и оспариванию конкретных оснований.",
    },
    {
      icon: Award,
      title: "Аттестация и удостоверение",
      desc: "Итоговое тестирование и документ о повышении квалификации.",
    },
  ],
};

interface ProgramPhase {
  name: string;
  desc: string;
  lessonRange: [number, number];
}

const richProgramPhases: Record<string, ProgramPhase[]> = {
  "yuridicheskie-aspekty-bfl": [
    { name: "Старт", desc: "Основа и игроки", lessonRange: [1, 3] },
    { name: "Процедуры", desc: "Выбор и стратегия", lessonRange: [4, 5] },
    { name: "Защита и практика", desc: "Ведение дела", lessonRange: [6, 10] },
    { name: "Сертификация", desc: "Стандарты и тест", lessonRange: [11, 12] },
  ],
  "neosvobozhdenie-ot-obyazatelstv": [
    { name: "Основа риска", desc: "Право и логика суда", lessonRange: [1, 3] },
    { name: "Аудит", desc: "Диагностика должника", lessonRange: [4, 6] },
    { name: "Защита", desc: "Позиция и доказательства", lessonRange: [7, 10] },
    { name: "Стратегия", desc: "Сложные кейсы", lessonRange: [11, 13] },
    { name: "Аттестация", desc: "Тест и сертификат", lessonRange: [14, 14] },
  ],
  "osparivanie-sdelok": [
    { name: "Основы", desc: "Логика оспаривания", lessonRange: [1, 3] },
    { name: "Типы сделок", desc: "Подозрительные и с предпочтением", lessonRange: [4, 7] },
    { name: "Процесс", desc: "Доказательства и суд", lessonRange: [8, 10] },
    { name: "Стратегии", desc: "Защита и атака", lessonRange: [11, 13] },
    { name: "Практика и итог", desc: "Кейсы + аттестация", lessonRange: [14, 15] },
  ],
  "effektivnaya-komanda": [
    { name: "Диагностика", desc: "Точка старта команды", lessonRange: [1, 2] },
    { name: "Структура", desc: "Роли и процессы", lessonRange: [3, 5] },
    { name: "Люди", desc: "Найм и адаптация", lessonRange: [6, 8] },
    { name: "Управление", desc: "Контроль, KPI, обратная связь", lessonRange: [9, 11] },
    { name: "Система", desc: "Управленческий уровень + сборка", lessonRange: [12, 14] },
  ],
};

const richProgramSubtitles: Record<string, string> = {
  "neosvobozhdenie-ot-obyazatelstv":
    "Полный маршрут по риску неосвобождения — от оснований и судебной логики к аудиту, защите и итоговой аттестации.",
  "osparivanie-sdelok":
    "Полный маршрут по оспариванию сделок в БФЛ — от оснований и типологии сделок до процесса, стратегий сторон и практики.",
  "effektivnaya-komanda":
    "Системный маршрут построения управляемой команды — от диагностики и ролей к найму, управлению, KPI и финальной сборке системы.",
};

interface RichModule {
  title: string;
  desc: string;
  category?: string;
  core?: boolean;
}

const richProgramModules: Record<string, RichModule[]> = {
  "yuridicheskie-aspekty-bfl": [
    {
      title: "Полный цикл процедуры",
      desc: "От старта и подачи заявления до торгов и распределения конкурсной массы — закрываем все этапы дела.",
    },
    {
      title: "Судебная логика и практика",
      desc: "Реальная практика регионов и судей, позиция кредиторов и АУ — вместо вакуумной теории.",
    },
    {
      title: "Технология подготовки дела",
      desc: "Стандарты подготовки, документооборот и чек-листы для масштабирования качества работы.",
    },
    {
      title: "Взаимодействие с АУ",
      desc: "Регламент, инструменты и партнёрская модель работы с арбитражным управляющим.",
    },
  ],
  "neosvobozhdenie-ot-obyazatelstv": [
    {
      category: "Теория и практика",
      title: "Основания неосвобождения",
      desc: "Как суды применяют ст. 213.28, позиция ВС РФ и региональная практика.",
      core: true,
    },
    {
      category: "Аудит риска",
      title: "Диагностика должника до подачи",
      desc: "Оценка уязвимостей, проверка сделок и поведения — ещё до входа в процедуру.",
      core: true,
    },
    {
      category: "Доказательства",
      title: "Позиция должника в деле",
      desc: "Сбор доказательной базы, нарратив и работа с документами под требования суда.",
      core: true,
    },
    {
      category: "Возражения",
      title: "Работа с кредиторами и ФНС",
      desc: "Типовые претензии и отработанные сценарии ответа в практике.",
    },
    {
      category: "Кейсы",
      title: "Разбор реальных дел",
      desc: "Как тактика меняет итог — анализ успешных процедур и отказных решений.",
    },
    {
      category: "Инструменты",
      title: "Toolkit для практики",
      desc: "Чек-листы оценки риска, матрица оснований, шаблоны возражений.",
    },
  ],
  "osparivanie-sdelok": [
    {
      category: "Теория и практика",
      title: "Основания оспаривания",
      desc: "Подозрительные, неравноценные и с предпочтением — позиция ВС и региональная практика.",
      core: true,
    },
    {
      category: "Аудит сделок",
      title: "Диагностика риска сделок",
      desc: "Сроки подозрительности, признаки и анкета клиента — как видеть риск заранее.",
      core: true,
    },
    {
      category: "Стратегия",
      title: "Позиция защиты или атаки",
      desc: "Доказательная база под конкретный тип сделки и тактика под позицию суда.",
      core: true,
    },
    {
      category: "Кейсы",
      title: "Разбор реальных дел",
      desc: "Как суды оценивают сделки — успешные процедуры и отказные решения.",
    },
    {
      category: "Инструменты",
      title: "Toolkit для практики",
      desc: "Чек-листы аудита, матрица риска, шаблоны заявлений и возражений.",
    },
    {
      category: "Анти-ошибки",
      title: "Чего не делать в оспаривании",
      desc: "Типовые провалы практики и как их обойти на старте дела.",
    },
  ],
};

const richLearningResults: Record<string, RichLearningItem[]> = {
  "neosvobozhdenie-ot-obyazatelstv": [
    {
      icon: Shield,
      title: "Система защиты от неосвобождения",
      desc: "Оценка риска на входе, позиция должника в споре с кредиторами и ФНС, управляемый итог процедуры.",
      featured: true,
    },
    {
      icon: FileText,
      title: "Рабочий toolkit в практике",
      desc: "Чек-листы оценки риска, шаблоны возражений, матрица оснований, сценарии защиты — применимы сразу в делах.",
      featured: true,
    },
    {
      icon: BookOpen,
      title: "Конспекты и материалы",
      desc: "Лекции, разборы кейсов, подборка судебной практики. Доступ без ограничения по времени.",
    },
    {
      icon: Award,
      title: "Удостоверение о повышении квалификации",
      desc: "Официальный документ после итогового тестирования.",
    },
  ],
  "osparivanie-sdelok": [
    {
      icon: Shield,
      title: "Система работы с оспариванием",
      desc: "Оценка риска сделок, работа со сроками и презумпциями, готовая позиция защиты или атаки в суде.",
      featured: true,
    },
    {
      icon: FileText,
      title: "Рабочий toolkit оспаривания",
      desc: "Чек-листы аудита, матрица риска, анкета клиента, шаблоны заявлений и возражений, списки доказательств.",
      featured: true,
    },
    {
      icon: BookOpen,
      title: "Конспекты и материалы",
      desc: "Лекции, разборы кейсов, подборка судебной практики. Доступ без ограничения по времени.",
    },
    {
      icon: Award,
      title: "Удостоверение о повышении квалификации",
      desc: "Официальный документ после итогового тестирования.",
    },
  ],
  "effektivnaya-komanda": [
    {
      icon: Users,
      title: "Управляемая команда",
      desc: "Ясные роли, стандарты и рабочие ритуалы. Результат держится без ручного контроля руководителя.",
      featured: true,
    },
    {
      icon: TrendingUp,
      title: "Рост команды без хаоса",
      desc: "Масштабирование на системе, а не на ручном героизме. Компания растёт, а руководитель перестаёт тушить пожары.",
      featured: true,
    },
    {
      icon: FileText,
      title: "Готовые регламенты и процессы",
      desc: "Найм, адаптация, KPI, обратная связь — единый стандарт работы команды.",
    },
    {
      icon: Award,
      title: "Удостоверение о повышении квалификации",
      desc: "Официальный документ после итогового тестирования.",
    },
  ],
  "yuridicheskie-aspekty-bfl": [
    {
      icon: Shield,
      title: "Алгоритмы снижения рисков",
      desc: "Системный подход к сложным кейсам, торгам и оценке рисков на входе в процедуру.",
      featured: true,
    },
    {
      icon: FileText,
      title: "Готовые шаблоны и чек-листы",
      desc: "Рабочие документы от подготовки дела до сопровождения процедуры.",
      featured: true,
    },
    {
      icon: BookOpen,
      title: "Конспекты и материалы курса",
      desc: "Все материалы остаются у вас без ограничения по времени.",
    },
    {
      icon: Award,
      title: "Удостоверение о повышении квалификации",
      desc: "Официальный документ после итогового тестирования.",
    },
  ],
};

const richAudience: Record<string, AudienceSegment[]> = {
  "yuridicheskie-aspekty-bfl": [
    {
      icon: Scale,
      title: "Юристы по БФЛ",
      desc: "Хотят системно поднять качество ведения дел и снизить ошибки входа в процедуру.",
    },
    {
      icon: Briefcase,
      title: "Руководители практики",
      desc: "Строят производство по БФЛ: стандарты, работа с АУ, документооборот, управляемый результат.",
    },
    {
      icon: GraduationCap,
      title: "Специалисты без подготовки",
      desc: "Вошли на рынок без системного обучения и хотят быстро закрыть пробелы в теории и практике.",
    },
  ],
  "neosvobozhdenie-ot-obyazatelstv": [
    {
      icon: Scale,
      title: "Юристы БФЛ с практикой",
      desc: "Сталкивались с отказом суда в списании долгов. Нужен системный подход к защите должника.",
      primary: true,
    },
    {
      icon: ClipboardCheck,
      title: "Арбитражные управляющие",
      desc: "Ведут процедуру и должны исключать основания для неосвобождения ещё на входе.",
    },
    {
      icon: Briefcase,
      title: "Руководители БФЛ-практик",
      desc: "Выстраивают стандарты работы, чтобы снизить риск неосвобождения по всей компании.",
    },
    {
      icon: GraduationCap,
      title: "Начинающие юристы БФЛ",
      desc: "С первых дел работают с правильной защитой и не наступают на типовые ошибки.",
    },
  ],
  "osparivanie-sdelok": [
    {
      icon: Scale,
      title: "Юристы БФЛ",
      desc: "Защищают сделки должника от оспаривания АУ и кредиторами.",
      primary: true,
    },
    {
      icon: ClipboardCheck,
      title: "Арбитражные управляющие",
      desc: "Обязаны оспаривать сделки должника и строить убедительную позицию в суде.",
    },
    {
      icon: FileText,
      title: "Юристы кредиторов",
      desc: "Атакуют подозрительные сделки в интересах банков, ФНС и конкурсной массы.",
    },
    {
      icon: Briefcase,
      title: "Руководители БФЛ-практик",
      desc: "Выстраивают единый стандарт работы со сделками по всей компании.",
    },
  ],
  "effektivnaya-komanda": [
    {
      icon: UserPlus,
      title: "Первые сотрудники",
      desc: "1–3 человека в команде. Важно не повторить типовые ошибки найма и делегирования.",
    },
    {
      icon: Users,
      title: "Команда 4–10",
      desc: "Теряются стандарты и управляемость. Нужны процессы, роли и рабочие ритуалы.",
      primary: true,
    },
    {
      icon: TrendingUp,
      title: "Команда 10–30+",
      desc: "Руководители направлений, KPI, единые стандарты работы по всей практике.",
    },
    {
      icon: Building2,
      title: "Системный юрбизнес",
      desc: "30+ людей и несколько практик. Масштабирование под управляемый рост.",
    },
  ],
  "prodazhi-yuridicheskih-uslug": [
    {
      icon: Scale,
      title: "Консультирующий юрист",
      desc: "Проводит первичные встречи, но теряет клиента перед подписанием договора.",
      primary: true,
    },
    {
      icon: Briefcase,
      title: "Руководитель юркомпании",
      desc: "Строит системные продажи и перестаёт зависеть от личной харизмы сотрудников.",
    },
    {
      icon: Shield,
      title: "Эксперт-практик",
      desc: "Сильный в деле, но не продаёт свою экспертизу в стабильный поток договоров.",
    },
    {
      icon: ClipboardCheck,
      title: "Менеджер / консультант",
      desc: "Ведёт входящий аудит и упускает клиентов на этапе решения.",
    },
  ],
};

const richIntros: Record<string, RichIntro> = {
  "yuridicheskie-aspekty-bfl": {
    eyebrow: "Уровень специалиста",
    titlePre: "Квалифицированный специалист БФЛ",
    titleAccent: "управляет результатом",
    titlePost: "а не надеется на случай",
    lead: "Такой юрист видит дело системно: оценивает риски до входа в процедуру, выстраивает стратегию под позицию суда и кредиторов, ведёт доверителя к прогнозируемому итогу.",
    outcomesLabel: "Что отличает профессионала",
    outcomes: [
      "Видит риски ещё до входа в процедуру",
      "Выстраивает стратегию под позицию суда и кредиторов",
      "Снижает процессуальные ошибки и экономит время",
      "Усиливает доверие клиента и профессиональную репутацию",
    ],
  },
  "neosvobozhdenie-ot-obyazatelstv": {
    eyebrow: "Ключевой риск практики",
    titlePre: "Самый опасный сценарий —",
    titleAccent: "суд не спишет долги",
    titlePost: "и вся процедура теряет смысл",
    lead: "Неосвобождение — редкий, но тяжёлый исход. Клиент остаётся с долгами, а практика — с ошибкой, от которой трудно восстановиться. Курс учит видеть риск заранее и вести дело к управляемому результату.",
    outcomesLabel: "Чему учит курс",
    outcomes: [
      "Выявлять риск неосвобождения ещё до подачи заявления",
      "Готовить позицию должника под требования судебной практики",
      "Работать с возражениями кредиторов, ФНС и управляющего",
      "Выстраивать стратегию на успешное списание долгов",
    ],
  },
  "osparivanie-sdelok": {
    eyebrow: "Одна из сложнейших тем БФЛ",
    titlePre: "Оспаривание сделок требует",
    titleAccent: "системы",
    titlePost: "а не интуиции и отдельных удачных ходов",
    lead: "Каждая сделка накануне банкротства — потенциальный риск для процедуры и конкурсной массы. Курс строит профессиональную логику работы: от выявления рисковых сделок до готовой стратегии защиты или атаки в суде.",
    outcomesLabel: "Чему учит курс",
    outcomes: [
      "Выявлять рисковые сделки до и во время процедуры",
      "Читать логику оспаривания: сроки, презумпции, доказательства",
      "Строить стратегию защиты или атаки под позицию суда",
      "Работать с экономической обоснованностью и документами сделки",
    ],
  },
  "prodazhi-yuridicheskih-uslug": {
    eyebrow: "Главный принцип курса",
    titlePre: "В БФЛ продаёт",
    titleAccent: "доверие клиента",
    titlePost: "а не агрессивная воронка и скидка",
    lead: "Клиент с долгами тревожен и осторожен — он принимает решение не из воронки, а из ощущения, что его слышат и понимают. Курс строит системную работу с доверием: от первой встречи до стабильного потока рекомендаций.",
    outcomesLabel: "Чему учит курс",
    outcomes: [
      "Формировать доверие и готовность клиента действовать",
      "Вести клиента по пути: аудит → встреча → договор",
      "Не конкурировать по цене и удерживать маржинальность",
      "Управлять конверсией и ключевыми метриками продаж",
      "Превращать клиента в источник рекомендаций",
    ],
  },
};

export default function CoursePage() {
  const { slug } = useParams<{ slug: string }>();
  const { toast } = useToast();
  const [course, setCourse] = useState<AcademyCourse | null>(null);
  const [teachers, setTeachers] = useState<AcademyTeacher[]>([]);
  const [reviews, setReviews] = useState<AcademyReview[]>([]);
  const [loading, setLoading] = useState(true);
  const [openLesson, setOpenLesson] = useState<number | null>(0);
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const [reviewPage, setReviewPage] = useState(0);
  const [showForm, setShowForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [formDone, setFormDone] = useState(false);
  const [form, setForm] = useState({ name: "", phone: "", email: "" });

  useEffect(() => {
    if (!slug) return;
    const load = async () => {
      setLoading(true);
      try {
        const [c, t, r] = await Promise.all([
          api.academy.course(slug),
          api.academy.teachers(),
          api.academy.reviews(),
        ]);
        setCourse(c);
        setTeachers(t);
        setReviews(r.filter(rv => !rv.course_id || rv.course_id === c.id));
      } catch {
        setCourse(null);
      } finally {
        setLoading(false);
      }
    };
    load();
    window.scrollTo(0, 0);
  }, [slug]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!course) return;
    setSubmitting(true);
    try {
      await api.academy.register({
        ...form,
        course_id: course.id,
        course_title: course.title,
      });
      setFormDone(true);
    } catch {
      toast({ title: "Ошибка отправки", variant: "destructive" });
    } finally {
      setSubmitting(false);
    }
  };

  const openFormModal = () => {
    setShowForm(true);
    setFormDone(false);
    setForm({ name: "", phone: "", email: "" });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-muted-foreground">Загрузка курса...</div>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center gap-4">
        <p className="text-xl text-muted-foreground">Курс не найден</p>
        <Link to="/" className="text-neon-cyan hover:underline">Вернуться на главную</Link>
      </div>
    );
  }

  const price = Number(course.price);
  const teacherExcludeBySlug: Record<string, string[]> = {
    "yuridicheskie-aspekty-bfl": ["лященко"],
    "neosvobozhdenie-ot-obyazatelstv": ["герасимов"],
    "osparivanie-sdelok": ["герасимов"],
  };
  const teacherIncludeBySlug: Record<string, string[]> = {
    "neosvobozhdenie-ot-obyazatelstv": ["лященко"],
  };

  const baseTeachers = course.team_order?.length
    ? (course.team_order
        .map(key => {
          const byId = teachers.find(t => t.id === key);
          if (byId) return byId;
          const k = key.toLowerCase();
          return teachers.find(t => t.full_name.toLowerCase().startsWith(k));
        })
        .filter(Boolean) as AcademyTeacher[])
    : teachers;

  const excludes = (slug && teacherExcludeBySlug[slug]) || [];
  const filteredTeachers = baseTeachers.filter(
    t => !excludes.some(e => t.full_name.toLowerCase().includes(e))
  );

  const includes = (slug && teacherIncludeBySlug[slug]) || [];
  for (const incKey of includes) {
    const already = filteredTeachers.some(t => t.full_name.toLowerCase().includes(incKey));
    if (!already) {
      const match = teachers.find(t => t.full_name.toLowerCase().includes(incKey));
      if (match) filteredTeachers.push(match);
    }
  }

  const courseTeachers = filteredTeachers;

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Hero */}
      <section className="pt-28 pb-16 relative overflow-hidden">
        {(() => {
          const heroImg = slug ? courseHeroImages[slug] : null;
          if (!heroImg) {
            return <div className="absolute inset-0 bg-gradient-to-b from-neon-magenta/5 to-transparent" />;
          }
          return (
            <div className="absolute inset-0">
              <img
                src={heroImg}
                alt={course.hero_title || course.title}
                className="w-full h-full object-cover object-top opacity-25"
              />
              <div
                className="absolute inset-0"
                style={{ background: "radial-gradient(ellipse at center, transparent 0%, hsl(var(--background) / 0.6) 55%, hsl(var(--background)) 100%)" }}
              />
              <div className="absolute inset-0 bg-gradient-to-b from-background/40 via-transparent to-background" />
              <div className="absolute top-0 right-0 w-96 h-96 bg-neon-magenta/[0.04] rounded-full blur-3xl" />
              <div className="absolute bottom-0 left-0 w-64 h-64 bg-neon-cyan/[0.04] rounded-full blur-3xl" />
            </div>
          );
        })()}
        <div className="container relative z-10">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-3xl mx-auto text-center">
            {/* Level badge with descriptor */}
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-neon-cyan/30 bg-muted/50 backdrop-blur mb-5">
              <GraduationCap size={14} className="text-neon-cyan" />
              <span className="text-xs font-bold uppercase tracking-wider text-neon-cyan">{course.level || "Курс"}</span>
              {course.level && levelDescriptors[course.level] && (
                <>
                  <span className="text-foreground/30">·</span>
                  <span className="text-xs text-foreground/60">{levelDescriptors[course.level]}</span>
                </>
              )}
            </div>

            <h1 className="font-display text-3xl md:text-5xl font-black mb-4 leading-tight">
              {course.hero_title || course.title}
            </h1>
            {course.hero_subtitle && (
              <p className="text-lg md:text-xl text-neon-magenta font-display font-bold mb-3">{course.hero_subtitle}</p>
            )}
            {course.hero_description && (
              <p className="text-muted-foreground text-base md:text-lg mb-8 max-w-2xl mx-auto leading-relaxed">{course.hero_description}</p>
            )}

            {/* Hero highlights — value block */}
            {course.hero_highlights && course.hero_highlights.length > 0 && (
              <div className="grid sm:grid-cols-3 gap-3 mb-8 max-w-3xl mx-auto">
                {course.hero_highlights.slice(0, 3).map((h, i) => (
                  <div
                    key={i}
                    className="flex items-center gap-3 px-4 py-3 rounded-xl border border-border bg-card/50 backdrop-blur-sm text-left"
                  >
                    <CheckCircle2 size={16} className="text-neon-cyan flex-shrink-0" />
                    <p className="text-sm text-foreground/80 leading-snug">{h}</p>
                  </div>
                ))}
              </div>
            )}

            {/* Decision zone — split-pill */}
            <div className="flex flex-col items-center">
              <button
                onClick={openFormModal}
                className="group inline-flex items-stretch rounded-2xl border border-neon-magenta/30 bg-card/50 backdrop-blur-sm overflow-hidden hover:border-neon-magenta/60 transition-colors"
              >
                {price > 0 && (
                  <>
                    <div className="flex flex-col justify-center px-5 md:px-6 py-3.5 text-left">
                      <span className="text-[10px] uppercase tracking-[0.2em] text-foreground/45 mb-1 font-medium">
                        Полная стоимость
                      </span>
                      <span className="font-display text-xl md:text-2xl font-black text-foreground leading-none">
                        {price.toLocaleString("ru-RU")} ₽
                      </span>
                    </div>
                    <div className="w-px bg-white/[0.08]" />
                  </>
                )}
                <div className="flex items-center gap-2 px-6 md:px-7 bg-neon-magenta text-primary-foreground font-display font-bold text-sm uppercase tracking-wider group-hover:bg-neon-magenta/90 transition-colors">
                  Оставить заявку
                  <ArrowRight size={16} className="group-hover:translate-x-0.5 transition-transform" />
                </div>
              </button>
              <p className="text-[11px] text-foreground/40 mt-3 text-center">
                Оплата удобным способом · менеджер свяжется для деталей
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Intro / Description */}
      {(() => {
        const rich = slug ? richIntros[slug] : null;
        if (rich) {
          return (
            <section className="py-20 md:py-24 border-t border-border">
              <div className="container max-w-4xl">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                >
                  <div className="text-neon-cyan text-[10px] font-bold uppercase tracking-[0.3em] mb-5">
                    {rich.eyebrow}
                  </div>
                  <h2 className="font-display text-2xl md:text-4xl font-black leading-[1.15] mb-8 max-w-3xl">
                    {rich.titlePre}{" "}
                    <span className="text-neon-cyan">{rich.titleAccent}</span>,{" "}
                    <br className="hidden md:block" />
                    {rich.titlePost}
                  </h2>
                  <p className="text-foreground/70 text-base md:text-lg leading-relaxed mb-10 max-w-3xl">
                    {rich.lead}
                  </p>

                  <div className="h-px bg-gradient-to-r from-neon-cyan/30 via-border to-transparent max-w-md mb-8" />

                  <div className="text-foreground/40 text-[10px] font-bold uppercase tracking-[0.25em] mb-6">
                    {rich.outcomesLabel}
                  </div>
                  <div className="grid sm:grid-cols-2 gap-x-10 gap-y-5 max-w-3xl">
                    {rich.outcomes.map((o, i) => (
                      <div key={i} className="flex items-start gap-3">
                        <div className="w-6 h-6 rounded-full border border-neon-cyan/40 bg-neon-cyan/5 flex items-center justify-center flex-shrink-0 mt-0.5">
                          <CheckCircle2 size={12} className="text-neon-cyan" />
                        </div>
                        <p className="text-sm md:text-base text-foreground/85 leading-relaxed">{o}</p>
                      </div>
                    ))}
                  </div>
                </motion.div>
              </div>
            </section>
          );
        }

        if (!course.intro_title) return null;
        return (
          <section className="py-16 border-t border-border">
            <div className="container max-w-3xl">
              <h2 className="font-display text-2xl md:text-3xl font-black mb-4">{course.intro_title}</h2>
              {course.intro_description && (
                <p className="text-muted-foreground text-base md:text-lg leading-relaxed">
                  {course.intro_description}
                </p>
              )}
            </div>
          </section>
        );
      })()}

      {/* Target Audience */}
      {(() => {
        const richSegments = slug ? richAudience[slug] : null;
        if (richSegments) {
          const count = richSegments.length;
          const gridCols = count === 4 ? "md:grid-cols-2" : "md:grid-cols-3";
          const eyebrow = slug === "effektivnaya-komanda"
            ? "Этапы роста команды"
            : slug === "prodazhi-yuridicheskih-uslug"
              ? "Роли и типовые задачи"
              : "Целевая аудитория";
          const subtitle = slug === "effektivnaya-komanda"
            ? "Курс работает на каждом этапе роста — от первых сотрудников до системного юрбизнеса."
            : slug === "prodazhi-yuridicheskih-uslug"
              ? "Четыре роли в продажах юридических услуг. У каждой — своя боль, которую курс закрывает."
              : count === 4
                ? "Четыре профессиональные роли. Курс даёт каждой конкретный прикладной результат."
                : "Три профессиональных сегмента, которым курс даёт максимальную практическую отдачу.";
          return (
            <section className="py-20 border-t border-border">
              <div className="container max-w-5xl">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  className="mb-10 max-w-2xl"
                >
                  <div className="text-neon-cyan text-[10px] font-bold uppercase tracking-[0.3em] mb-4">
                    {eyebrow}
                  </div>
                  <h2 className="font-display text-2xl md:text-4xl font-black uppercase leading-[1.05] mb-4">
                    Для кого этот курс
                  </h2>
                  <p className="text-foreground/55 text-sm md:text-base leading-relaxed">
                    {subtitle}
                  </p>
                </motion.div>

                <div className={`grid ${gridCols} gap-5`}>
                  {richSegments.map((s, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: i * 0.08 }}
                      className={`relative flex flex-col p-6 rounded-xl border backdrop-blur-sm transition-colors h-full ${
                        s.primary
                          ? "border-neon-cyan/40 bg-gradient-to-br from-neon-cyan/[0.04] to-card/60 hover:border-neon-cyan/60"
                          : "border-border bg-card/60 hover:border-neon-cyan/30"
                      }`}
                    >
                      <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-5 ${
                        s.primary
                          ? "border border-neon-cyan/50 bg-neon-cyan/10"
                          : "border border-neon-cyan/30 bg-neon-cyan/5"
                      }`}>
                        <s.icon className="w-5 h-5 text-neon-cyan" strokeWidth={1.75} />
                      </div>
                      {s.primary ? (
                        <div className="flex items-center gap-2 mb-2">
                          <div className="w-1 h-1 rounded-full bg-neon-cyan animate-pulse" />
                          <div className="text-[10px] font-bold uppercase tracking-[0.2em] text-neon-cyan">
                            Основной сегмент
                          </div>
                        </div>
                      ) : (
                        <div className="text-[10px] font-bold uppercase tracking-[0.2em] text-foreground/40 mb-2">
                          Сегмент 0{i + 1}
                        </div>
                      )}
                      <h3 className="font-display text-lg md:text-xl font-black mb-3 leading-tight">
                        {s.title}
                      </h3>
                      <p className="text-sm text-foreground/65 leading-relaxed">{s.desc}</p>
                    </motion.div>
                  ))}
                </div>
              </div>
            </section>
          );
        }

        if (!course.target_audience?.length) return null;
        return (
          <section className="py-16 border-t border-border">
            <div className="container">
              <h2 className="font-display text-2xl md:text-3xl font-black mb-8 uppercase">Для кого этот курс</h2>
              <div className="grid md:grid-cols-2 gap-4">
                {course.target_audience.map((item, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.05 }}
                    className="flex items-start gap-4 p-5 rounded-xl border border-border bg-card"
                  >
                    <Users className="w-6 h-6 text-neon-cyan flex-shrink-0 mt-0.5" />
                    <p className="text-sm text-foreground/80">{item}</p>
                  </motion.div>
                ))}
              </div>
            </div>
          </section>
        );
      })()}

      {/* Learning Results */}
      {(() => {
        const richItems = slug ? richLearningResults[slug] : null;
        if (richItems) {
          return (
            <section className="py-20 border-t border-border">
              <div className="container max-w-5xl">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  className="mb-10 max-w-2xl"
                >
                  <div className="text-neon-magenta text-[10px] font-bold uppercase tracking-[0.3em] mb-4">
                    Итог курса
                  </div>
                  <h2 className="font-display text-2xl md:text-4xl font-black uppercase leading-[1.05] mb-4">
                    Что вы получите
                  </h2>
                  <p className="text-foreground/55 text-sm md:text-base leading-relaxed">
                    {slug === "effektivnaya-komanda"
                      ? "Что меняется в работе руководителя и команды после курса — конкретные результаты уже в первые недели."
                      : "Прикладные результаты курса — работают в практике с первого дня после обучения."}
                  </p>
                </motion.div>

                <div className="grid md:grid-cols-2 gap-5">
                  {richItems.map((item, i) => {
                    const featured = item.featured;
                    return (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: i * 0.08 }}
                        className={`relative flex flex-col p-6 md:p-7 rounded-xl backdrop-blur-sm transition-colors h-full ${
                          featured
                            ? "border border-neon-magenta/40 bg-card/80 shadow-[0_0_30px_-10px_rgba(255,0,255,0.15)]"
                            : "border border-border bg-card/50 hover:border-foreground/20"
                        }`}
                      >
                        {featured && (
                          <div className="absolute inset-0 bg-gradient-to-b from-neon-magenta/[0.05] to-transparent rounded-xl pointer-events-none" />
                        )}
                        <div className="relative flex flex-col flex-1">
                          <div className="flex items-center justify-between mb-5">
                            <div
                              className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                                featured
                                  ? "border border-neon-magenta/30 bg-neon-magenta/5"
                                  : "border border-border bg-card/60"
                              }`}
                            >
                              <item.icon
                                className={`w-5 h-5 ${featured ? "text-neon-magenta" : "text-foreground/55"}`}
                                strokeWidth={1.75}
                              />
                            </div>
                            {featured && (
                              <span className="px-2.5 py-1 rounded-full bg-neon-magenta/10 border border-neon-magenta/30 text-neon-magenta text-[9px] font-black uppercase tracking-[0.2em]">
                                Главная ценность
                              </span>
                            )}
                          </div>
                          <h3 className="font-display text-lg md:text-xl font-black mb-2 leading-tight">
                            {item.title}
                          </h3>
                          <p className="text-sm text-foreground/65 leading-relaxed">{item.desc}</p>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              </div>
            </section>
          );
        }

        if (!course.learning_results?.length) return null;
        return (
          <section className="py-16 border-t border-border">
            <div className="container">
              <h2 className="font-display text-2xl md:text-3xl font-black mb-8 uppercase">Что вы получите</h2>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {course.learning_results.map((item: any, i: number) => {
                  const title = typeof item === "string" ? null : item?.title;
                  const text = typeof item === "string" ? item : item?.text || "";
                  return (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, y: 10 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: i * 0.05 }}
                      className="flex items-start gap-3 p-4 rounded-xl border border-border bg-card"
                    >
                      <CheckCircle2 className="w-5 h-5 text-neon-magenta flex-shrink-0 mt-0.5" />
                      <div>
                        {title && <p className="text-sm font-bold mb-1">{title}</p>}
                        <p className="text-sm text-foreground/80">{text}</p>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </div>
          </section>
        );
      })()}

      {/* Selling Points / Program modules */}
      {(() => {
        const richModules = slug ? richProgramModules[slug] : null;
        if (richModules) {
          const count = richModules.length;
          const subtitleMap: Record<string, string> = {
            "osparivanie-sdelok":
              "Шесть модулей программы — от теории оспаривания и аудита сделок до кейсов и разбора типовых ошибок.",
          };
          const subtitle = (slug && subtitleMap[slug])
            || (count >= 6
              ? "Шесть модулей программы — от теории и аудита риска до готового toolkit для практики."
              : "Четыре опорных модуля — от полного цикла процедуры до системной работы с арбитражным управляющим.");
          return (
            <section className="py-20 border-t border-border">
              <div className="container max-w-5xl">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  className="mb-10 max-w-2xl"
                >
                  <div className="text-neon-cyan text-[10px] font-bold uppercase tracking-[0.3em] mb-4">
                    Архитектура программы
                  </div>
                  <h2 className="font-display text-2xl md:text-4xl font-black uppercase leading-[1.05] mb-4">
                    Состав программы
                  </h2>
                  <p className="text-foreground/55 text-sm md:text-base leading-relaxed">
                    {subtitle}
                  </p>
                </motion.div>

                <div className="grid md:grid-cols-2 gap-5">
                  {richModules.map((m, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: i * 0.08 }}
                      className={`flex gap-5 md:gap-6 p-6 md:p-7 rounded-xl border backdrop-blur-sm transition-colors h-full ${
                        m.core
                          ? "border-neon-cyan/30 bg-gradient-to-br from-neon-cyan/[0.03] to-card/60 hover:border-neon-cyan/50"
                          : "border-border bg-card/50 hover:border-neon-cyan/30"
                      }`}
                    >
                      <div className="flex-shrink-0 flex flex-col items-start">
                        <span className={`font-display text-4xl md:text-5xl font-black leading-none mb-3 tabular-nums ${
                          m.core ? "text-neon-cyan/70" : "text-neon-cyan/40"
                        }`}>
                          {String(i + 1).padStart(2, "0")}
                        </span>
                        <div className={`w-10 h-px ${m.core ? "bg-neon-cyan/50" : "bg-neon-cyan/25"}`} />
                      </div>
                      <div className="flex-1 pt-1">
                        <div className={`text-[10px] font-bold uppercase tracking-[0.2em] mb-2 ${
                          m.core ? "text-neon-cyan" : "text-foreground/40"
                        }`}>
                          {m.category ?? "Модуль"}
                        </div>
                        <h3 className="font-display text-lg md:text-xl font-black mb-2.5 leading-tight">
                          {m.title}
                        </h3>
                        <p className="text-sm text-foreground/65 leading-relaxed">{m.desc}</p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </section>
          );
        }

        if (!course.selling_points?.length) return null;
        return (
          <section className="py-16 border-t border-border">
            <div className="container">
              <h2 className="font-display text-2xl md:text-3xl font-black mb-8 uppercase">Что входит в курс</h2>
              <div className="grid md:grid-cols-2 gap-4">
                {course.selling_points.map((item: any, i: number) => {
                  const text = typeof item === "string" ? item : item?.text || item?.title || "";
                  return (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, y: 10 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: i * 0.05 }}
                      className="flex items-start gap-3 p-4 rounded-xl border border-border bg-card"
                    >
                      <CheckCircle2 className="w-5 h-5 text-neon-cyan flex-shrink-0 mt-0.5" />
                      <p className="text-sm text-foreground/80">{text}</p>
                    </motion.div>
                  );
                })}
              </div>
            </div>
          </section>
        );
      })()}

      {/* Program / Lessons */}
      {course.lessons?.length > 0 && (() => {
        const phases = slug ? richProgramPhases[slug] : null;
        const cleanTitle = (t: string) => t.replace(/^Занятие\s+\d+\.\s*/i, "");
        const totalLessons = course.lessons.length;

        const renderLessonAccordion = (lesson: { title: string; points: string[] }, lessonIdx: number) => {
          const isOpen = openLesson === lessonIdx;
          return (
            <div
              key={lessonIdx}
              className="border border-border rounded-xl overflow-hidden bg-card/60 backdrop-blur-sm transition-colors hover:border-neon-cyan/25"
            >
              <button
                onClick={() => setOpenLesson(isOpen ? null : lessonIdx)}
                className="w-full flex items-center gap-4 md:gap-5 p-5 text-left"
              >
                <span className="font-display text-base md:text-lg font-black text-neon-cyan/50 tabular-nums flex-shrink-0 w-9">
                  {String(lessonIdx + 1).padStart(2, "0")}
                </span>
                <span className="font-display font-bold text-sm md:text-base flex-1 pr-2 leading-snug">
                  {cleanTitle(lesson.title)}
                </span>
                <ChevronDown
                  size={18}
                  className={`text-muted-foreground flex-shrink-0 transition-transform ${isOpen ? "rotate-180" : ""}`}
                />
              </button>
              <AnimatePresence>
                {isOpen && lesson.points?.length > 0 && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="overflow-hidden"
                  >
                    <div className="px-5 pb-6 pl-[76px] md:pl-[84px]">
                      <div className="h-px bg-gradient-to-r from-neon-cyan/30 via-border to-transparent mb-4" />
                      <div className="text-[9px] font-bold text-foreground/40 uppercase tracking-[0.25em] mb-3">
                        Что разбираем на занятии
                      </div>
                      <ul className="space-y-2.5">
                        {lesson.points.map((pt, j) => (
                          <li key={j} className="flex items-start gap-3 text-sm text-foreground/75 leading-relaxed">
                            <span className="w-1 h-1 rounded-full bg-neon-cyan mt-[9px] flex-shrink-0" />
                            <span className="flex-1">{pt}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        };

        const subtitleOverride = slug ? richProgramSubtitles[slug] : null;
        const subtitle = subtitleOverride || course.program_format_description;
        return (
          <section className="py-20 border-t border-border">
            <div className="container max-w-4xl">
              {/* Header */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="mb-10"
              >
                <div className="flex items-center gap-3 mb-3">
                  <div className="text-neon-cyan text-[10px] font-bold uppercase tracking-[0.3em]">
                    {phases ? "Маршрут обучения" : "Программа обучения"}
                  </div>
                  <span className="h-px flex-1 max-w-[60px] bg-neon-cyan/30" />
                  {course.program_badge && (
                    <span className="text-[10px] font-bold text-neon-magenta uppercase tracking-[0.2em]">
                      {course.program_badge}
                    </span>
                  )}
                </div>
                <h2 className="font-display text-2xl md:text-4xl font-black uppercase leading-[1.05] mb-5">
                  Программа курса
                </h2>

                {/* Stats strip */}
                <div className="flex flex-wrap items-center gap-x-8 gap-y-3 mb-5 pb-6 border-b border-border">
                  <div className="flex items-baseline gap-2">
                    <span className="font-display text-2xl md:text-3xl font-black text-foreground leading-none">
                      {totalLessons}
                    </span>
                    <span className="text-[11px] uppercase tracking-wider text-foreground/50">занятий</span>
                  </div>
                  {phases && (
                    <div className="flex items-baseline gap-2">
                      <span className="font-display text-2xl md:text-3xl font-black text-neon-cyan leading-none">
                        {phases.length}
                      </span>
                      <span className="text-[11px] uppercase tracking-wider text-foreground/50">фаз маршрута</span>
                    </div>
                  )}
                  <div className="flex items-baseline gap-2">
                    <span className="font-display text-sm font-black text-neon-magenta leading-none uppercase tracking-wider">
                      Тест + сертификат
                    </span>
                    <span className="text-[11px] uppercase tracking-wider text-foreground/50">на выходе</span>
                  </div>
                </div>

                {subtitle && (
                  <p className="text-foreground/55 text-sm md:text-base leading-relaxed">
                    {subtitle}
                  </p>
                )}
              </motion.div>

              {/* Lessons — grouped by phases if available */}
              {phases ? (
                <div className="space-y-10">
                  {phases.map((phase, pi) => {
                    const [start, end] = phase.lessonRange;
                    const phaseLessons = course.lessons.slice(start - 1, end);
                    return (
                      <div key={pi}>
                        <div className="flex items-baseline gap-3 mb-4">
                          <span className="font-display text-sm font-black text-neon-cyan uppercase tracking-[0.2em]">
                            Фаза 0{pi + 1} · {phase.name}
                          </span>
                          <span className="h-px flex-1 bg-gradient-to-r from-neon-cyan/30 to-transparent" />
                          <span className="text-[10px] uppercase tracking-[0.2em] text-foreground/40">
                            {phase.desc}
                          </span>
                        </div>
                        <div className="space-y-2.5">
                          {phaseLessons.map((lesson, li) => renderLessonAccordion(lesson, start - 1 + li))}
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="space-y-2.5">
                  {course.lessons.map((lesson, i) => renderLessonAccordion(lesson, i))}
                </div>
              )}
            </div>
          </section>
        );
      })()}

      {/* Materials / Toolkit */}
      {(() => {
        const toolkit = slug ? richToolkit[slug] : null;
        if (toolkit) {
          const count = toolkit.length;
          const useStack = count >= 5;
          const gridCols = count === 4 ? "md:grid-cols-2" : "md:grid-cols-3";
          const subtitleOverride = slug ? richToolkitSubtitles[slug] : null;
          const subtitle = subtitleOverride || "Готовые материалы и алгоритмы, которые остаются с вами после обучения и применяются в практике с первого дня.";
          const headingOverride = slug ? richToolkitHeadings[slug] : null;
          const heading = headingOverride || "Готовый toolkit для практики";
          const firstFeaturedIdx = toolkit.findIndex(t => t.featured);
          return (
            <section className="py-20 border-t border-border">
              <div className={`container ${useStack ? "max-w-4xl" : "max-w-5xl"}`}>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  className="mb-10 max-w-2xl"
                >
                  <div className="text-neon-magenta text-[10px] font-bold uppercase tracking-[0.3em] mb-4">
                    Практический toolkit
                  </div>
                  <h2 className="font-display text-2xl md:text-4xl font-black uppercase leading-[1.05] mb-4">
                    {heading}
                  </h2>
                  <p className="text-foreground/55 text-sm md:text-base leading-relaxed">
                    {subtitle}
                  </p>
                </motion.div>

                {useStack ? (
                  <div className="space-y-3 md:space-y-4">
                    {toolkit.map((item, i) => {
                      const featured = item.featured;
                      const isStar = featured && i === firstFeaturedIdx;
                      return (
                        <motion.div
                          key={i}
                          initial={{ opacity: 0, y: 15 }}
                          whileInView={{ opacity: 1, y: 0 }}
                          viewport={{ once: true }}
                          transition={{ delay: i * 0.05 }}
                          className={`relative flex items-start gap-5 p-5 md:p-6 rounded-xl backdrop-blur-sm transition-colors ${
                            featured
                              ? "border border-neon-magenta/40 bg-card/80 shadow-[0_0_30px_-10px_rgba(255,0,255,0.15)]"
                              : "border border-border bg-card/50 hover:border-foreground/20"
                          }`}
                        >
                          {featured && (
                            <div className="absolute inset-0 bg-gradient-to-r from-neon-magenta/[0.06] via-transparent to-transparent rounded-xl pointer-events-none" />
                          )}
                          <div className={`relative shrink-0 w-12 h-12 md:w-14 md:h-14 rounded-xl flex items-center justify-center ${
                            featured ? "border border-neon-magenta/30 bg-neon-magenta/5" : "border border-border bg-card/60"
                          }`}>
                            <item.icon className={`w-5 h-5 md:w-6 md:h-6 ${featured ? "text-neon-magenta" : "text-foreground/55"}`} strokeWidth={1.75} />
                          </div>
                          <div className="relative flex-1 min-w-0">
                            <div className="flex items-start justify-between gap-3 mb-1.5 flex-wrap">
                              <h3 className="font-display text-base md:text-lg font-black leading-tight">
                                {item.title}
                              </h3>
                              {featured && (
                                <span className="shrink-0 px-2.5 py-1 rounded-full bg-neon-magenta/10 border border-neon-magenta/30 text-neon-magenta text-[9px] font-black uppercase tracking-[0.2em]">
                                  {isStar ? "Ключевой артефакт" : "Основной"}
                                </span>
                              )}
                            </div>
                            <p className="text-sm text-foreground/65 leading-relaxed">{item.desc}</p>
                          </div>
                        </motion.div>
                      );
                    })}
                  </div>
                ) : (
                  <div className={`grid ${gridCols} gap-5`}>
                    {toolkit.map((item, i) => {
                      const featured = item.featured;
                      return (
                        <motion.div
                          key={i}
                          initial={{ opacity: 0, y: 20 }}
                          whileInView={{ opacity: 1, y: 0 }}
                          viewport={{ once: true }}
                          transition={{ delay: i * 0.08 }}
                          className={`relative flex flex-col p-6 md:p-7 rounded-xl backdrop-blur-sm transition-colors h-full ${
                            featured
                              ? "border border-neon-magenta/40 bg-card/80 shadow-[0_0_30px_-10px_rgba(255,0,255,0.15)]"
                              : "border border-border bg-card/50 hover:border-foreground/20"
                          }`}
                        >
                          {featured && (
                            <div className="absolute inset-0 bg-gradient-to-b from-neon-magenta/[0.05] to-transparent rounded-xl pointer-events-none" />
                          )}
                          <div className="relative flex flex-col flex-1">
                            <div className="flex items-start justify-between mb-5">
                              <div
                                className={`w-11 h-11 rounded-xl flex items-center justify-center ${
                                  featured
                                    ? "border border-neon-magenta/30 bg-neon-magenta/5"
                                    : "border border-border bg-card/60"
                                }`}
                              >
                                <item.icon
                                  className={`w-5 h-5 ${featured ? "text-neon-magenta" : "text-foreground/55"}`}
                                  strokeWidth={1.75}
                                />
                              </div>
                              {featured && (
                                <span className="px-2.5 py-1 rounded-full bg-neon-magenta/10 border border-neon-magenta/30 text-neon-magenta text-[9px] font-black uppercase tracking-[0.2em]">
                                  Основной
                                </span>
                              )}
                            </div>
                            <h3 className="font-display text-base md:text-lg font-black mb-2.5 leading-tight">
                              {item.title}
                            </h3>
                            <p className="text-sm text-foreground/65 leading-relaxed">{item.desc}</p>
                          </div>
                        </motion.div>
                      );
                    })}
                  </div>
                )}
              </div>
            </section>
          );
        }

        if (!course.materials_includes?.length) return null;
        return (
          <section className="py-16 border-t border-border">
            <div className="container max-w-3xl">
              <h2 className="font-display text-2xl md:text-3xl font-black mb-8 uppercase">Материалы курса</h2>
              <div className="space-y-3">
                {course.materials_includes.map((m, i) => (
                  <div key={i} className="flex items-start gap-3 p-4 rounded-xl border border-border bg-card">
                    <CheckCircle2 className="w-5 h-5 text-neon-magenta flex-shrink-0 mt-0.5" />
                    <p className="text-sm text-foreground/80">{m}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>
        );
      })()}

      {/* Practice Tasks */}
      {(() => {
        const overrideTasks = slug ? richPracticeTasks[slug] : null;
        const rawTasks = overrideTasks
          ? overrideTasks.map(t => ({ text: t }))
          : (course.practice_tasks?.map((t: any) => ({ text: typeof t === 'string' ? t : t?.text || t?.title || '' })) || []);
        if (rawTasks.length === 0) return null;
        const heading = (slug && richPracticeHeadings[slug]) || "Практические задания";
        const subtitle = slug ? richPracticeSubtitles[slug] : null;
        return (
          <section className="py-20 border-t border-border">
            <div className="container max-w-3xl">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="mb-10"
              >
                <div className="text-neon-cyan text-[10px] font-bold uppercase tracking-[0.3em] mb-3">
                  Маршрут внедрения
                </div>
                <h2 className="font-display text-2xl md:text-4xl font-black uppercase leading-[1.05] mb-4">
                  {heading}
                </h2>
                {subtitle && (
                  <p className="text-foreground/55 text-sm md:text-base leading-relaxed">
                    {subtitle}
                  </p>
                )}
              </motion.div>
              <div className="space-y-2.5">
                {rawTasks.map((task, i) => {
                  const isLast = i === rawTasks.length - 1;
                  return (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, y: 12 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: i * 0.04 }}
                      className={`flex items-start gap-4 md:gap-5 p-4 md:p-5 rounded-xl border backdrop-blur-sm transition-colors ${
                        isLast
                          ? "border-neon-magenta/40 bg-gradient-to-r from-neon-magenta/[0.06] via-card/60 to-card/60 shadow-[0_0_30px_-10px_rgba(255,0,255,0.15)]"
                          : "border-border bg-card/50 hover:border-neon-cyan/30"
                      }`}
                    >
                      <span
                        className={`font-display text-xl md:text-2xl font-black tabular-nums shrink-0 leading-none pt-1 ${
                          isLast ? "text-neon-magenta" : "text-neon-cyan/60"
                        }`}
                      >
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      <div className="flex-1 min-w-0">
                        {isLast && (
                          <div className="text-[9px] font-bold text-neon-magenta uppercase tracking-[0.25em] mb-1.5">
                            Итог маршрута
                          </div>
                        )}
                        <p
                          className={`leading-relaxed ${
                            isLast ? "text-sm md:text-base text-foreground font-bold" : "text-sm text-foreground/80"
                          }`}
                        >
                          {task.text}
                        </p>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </div>
          </section>
        );
      })()}

      {/* Program Features / Format */}
      {(() => {
        const richItems = slug ? richFormat[slug] : null;
        if (richItems) {
          return (
            <section className="py-20 border-t border-border">
              <div className="container max-w-5xl">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  className="mb-10 max-w-2xl"
                >
                  <div className="text-neon-cyan text-[10px] font-bold uppercase tracking-[0.3em] mb-4">
                    Как проходит обучение
                  </div>
                  <h2 className="font-display text-2xl md:text-4xl font-black uppercase leading-[1.05] mb-4">
                    Формат обучения
                  </h2>
                  <p className="text-foreground/55 text-sm md:text-base leading-relaxed">
                    Онлайн-формат в своём темпе, живые разборы с экспертами, практические задания и итоговая аттестация.
                  </p>
                </motion.div>

                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
                  {richItems.map((item, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: i * 0.06 }}
                      className="flex flex-col p-5 md:p-6 rounded-xl border border-border bg-card/60 backdrop-blur-sm hover:border-neon-cyan/30 transition-colors h-full"
                    >
                      <div className="w-10 h-10 rounded-lg border border-neon-cyan/30 bg-neon-cyan/5 flex items-center justify-center mb-4">
                        <item.icon className="w-4 h-4 text-neon-cyan" strokeWidth={1.75} />
                      </div>
                      <h3 className="font-display text-sm md:text-base font-black mb-2 leading-tight">
                        {item.title}
                      </h3>
                      <p className="text-xs md:text-sm text-foreground/60 leading-relaxed">{item.desc}</p>
                    </motion.div>
                  ))}
                </div>
              </div>
            </section>
          );
        }

        if (!course.program_features?.length) return null;
        return (
          <section className="py-16 border-t border-border">
            <div className="container">
              <h2 className="font-display text-2xl md:text-3xl font-black mb-8 uppercase text-center">
                Формат обучения
              </h2>
              <div className="flex flex-wrap justify-center gap-4">
                {course.program_features.map((f, i) => (
                  <div key={i} className="p-5 rounded-xl border border-border bg-card flex items-start gap-3 max-w-sm">
                    <BookOpen className="w-5 h-5 text-neon-cyan flex-shrink-0 mt-0.5" />
                    <p className="text-sm text-foreground/80">{f}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>
        );
      })()}

      {/* Teachers */}
      {courseTeachers.length > 0 && (
        <section className="py-20 border-t border-border">
          <div className="container max-w-6xl">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="mb-10 max-w-2xl"
            >
              <div className="text-neon-cyan text-[10px] font-bold uppercase tracking-[0.3em] mb-4">
                Состав экспертов курса
              </div>
              <h2 className="font-display text-2xl md:text-4xl font-black uppercase leading-[1.05] mb-4">
                Ведут действующие практики
              </h2>
              <p className="text-foreground/55 text-sm md:text-base leading-relaxed">
                Курс построен на опыте практикующих арбитражных управляющих и руководителей практик БФЛ — каждый эксперт закрывает свою часть программы.
              </p>
            </motion.div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {courseTeachers.map((t, i) => {
                const roleMap = slug ? richTeacherRoles[slug] : undefined;
                const bioMap = slug ? richTeacherBios[slug] : undefined;
                const fullName = t.full_name.trim();
                const lookup = (map?: Record<string, string>) => {
                  if (!map) return undefined;
                  if (map[fullName]) return map[fullName];
                  const lower = fullName.toLowerCase();
                  const hit = Object.keys(map).find(k => {
                    const kLower = k.toLowerCase();
                    return lower === kLower || lower.startsWith(kLower.split(" ")[0]) || kLower.startsWith(lower.split(" ")[0]);
                  });
                  return hit ? map[hit] : undefined;
                };
                const role = lookup(roleMap);
                const bioOverride = lookup(bioMap);
                const bio = (t.bio && t.bio.trim()) || bioOverride;
                return (
                  <motion.div
                    key={t.id}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.06 }}
                    className="group relative rounded-xl border border-border bg-card/60 backdrop-blur-sm overflow-hidden hover:border-neon-cyan/30 transition-colors flex flex-col"
                  >
                    {t.photo_url && (
                      <div className="relative aspect-[4/5] overflow-hidden bg-muted/20">
                        <img
                          src={t.photo_url}
                          alt={t.full_name}
                          className="w-full h-full object-cover object-top transition-transform duration-500 group-hover:scale-[1.02]"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-card via-card/10 to-transparent pointer-events-none" />
                      </div>
                    )}
                    <div className="p-5 flex-1 flex flex-col">
                      {role && (
                        <div className="text-neon-cyan text-[10px] font-bold uppercase tracking-[0.2em] mb-2.5">
                          {role}
                        </div>
                      )}
                      <h3 className="font-display font-black text-base md:text-lg leading-tight mb-1.5">
                        {t.full_name.trim()}
                      </h3>
                      <p className="text-xs text-foreground/60 leading-relaxed mb-3">{t.position}</p>
                      {bio && (
                        <p className="text-[11px] text-foreground/40 leading-relaxed pt-3 border-t border-border/60 mt-auto">
                          {bio}
                        </p>
                      )}
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* Reviews */}
      {(() => {
        const curated = slug ? richReviews[slug] : null;
        const list: Array<{ id: string; author_name: string; author_role?: string; rating: number; quote: string }> = curated
          ? curated.map((r, i) => ({ id: `r${i}`, author_name: r.author_name, author_role: r.author_role, rating: r.rating, quote: r.quote }))
          : reviews.map((r) => ({ id: r.id, author_name: r.author_name, rating: r.rating, quote: r.comment }));

        if (list.length === 0) return null;

        const perPage = 3;
        const totalPages = Math.ceil(list.length / perPage);
        const currentPage = Math.min(reviewPage, totalPages - 1);
        const visible = list.slice(currentPage * perPage, currentPage * perPage + perPage);

        const getInitials = (name: string) => {
          const parts = name.trim().split(/\s+/);
          return (parts[0]?.[0] || "") + (parts[1]?.[0] || "");
        };

        return (
          <section className="py-20 border-t border-border">
            <div className="container max-w-6xl">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="mb-10 flex flex-wrap items-end justify-between gap-6"
              >
                <div className="max-w-2xl">
                  <div className="text-neon-cyan text-[10px] font-bold uppercase tracking-[0.3em] mb-4">
                    Мнения выпускников
                  </div>
                  <h2 className="font-display text-2xl md:text-4xl font-black uppercase leading-[1.05] mb-4">
                    Отзывы
                  </h2>
                  <p className="text-foreground/55 text-sm md:text-base leading-relaxed">
                    Что говорят практики, которые прошли курс и внедрили стандарты в свою работу.
                  </p>
                </div>

                {totalPages > 1 && (
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-1.5">
                      {Array.from({ length: totalPages }).map((_, i) => (
                        <button
                          key={i}
                          onClick={() => setReviewPage(i)}
                          className={`h-1.5 rounded-full transition-all ${
                            i === currentPage
                              ? "w-6 bg-neon-cyan"
                              : "w-1.5 bg-foreground/20 hover:bg-foreground/40"
                          }`}
                          aria-label={`Страница ${i + 1}`}
                        />
                      ))}
                    </div>
                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => setReviewPage((p) => Math.max(0, p - 1))}
                        disabled={currentPage === 0}
                        className="w-9 h-9 rounded-lg border border-border bg-card/60 flex items-center justify-center text-foreground/60 hover:text-foreground hover:border-foreground/30 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                      >
                        <ChevronLeft size={16} />
                      </button>
                      <button
                        onClick={() => setReviewPage((p) => Math.min(totalPages - 1, p + 1))}
                        disabled={currentPage >= totalPages - 1}
                        className="w-9 h-9 rounded-lg border border-border bg-card/60 flex items-center justify-center text-foreground/60 hover:text-foreground hover:border-foreground/30 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                      >
                        <ChevronRight size={16} />
                      </button>
                    </div>
                  </div>
                )}
              </motion.div>

              <div className="grid md:grid-cols-3 gap-5">
                {visible.map((r, i) => (
                  <motion.div
                    key={r.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.06 }}
                    className="flex flex-col h-full p-6 rounded-xl border border-border bg-card/60 backdrop-blur-sm"
                  >
                    {/* Rating */}
                    <div className="flex gap-0.5 mb-5">
                      {Array.from({ length: 5 }).map((_, idx) => (
                        <Star
                          key={idx}
                          size={13}
                          className={idx < r.rating ? "text-neon-cyan fill-neon-cyan" : "text-foreground/15"}
                        />
                      ))}
                    </div>

                    {/* Quote */}
                    <blockquote className="text-sm md:text-[15px] text-foreground/80 leading-relaxed mb-6 flex-1">
                      «{r.quote}»
                    </blockquote>

                    {/* Author */}
                    <div className="flex items-center gap-3 pt-5 border-t border-border/60">
                      <div className="w-11 h-11 rounded-full bg-gradient-to-br from-neon-cyan/15 to-neon-magenta/15 border border-neon-cyan/25 flex items-center justify-center font-display font-black text-sm text-foreground/80 flex-shrink-0">
                        {getInitials(r.author_name)}
                      </div>
                      <div className="min-w-0">
                        <div className="font-display font-bold text-sm leading-tight mb-0.5 truncate">
                          {r.author_name}
                        </div>
                        {r.author_role && (
                          <div className="text-[11px] text-foreground/45 leading-relaxed">{r.author_role}</div>
                        )}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </section>
        );
      })()}

      {/* FAQ */}
      {course.faq_items?.length > 0 && (
        <section className="py-20 border-t border-border">
          <div className="container max-w-3xl">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="mb-10 max-w-2xl"
            >
              <div className="text-neon-cyan text-[10px] font-bold uppercase tracking-[0.3em] mb-4">
                Вопросы по обучению
              </div>
              <h2 className="font-display text-2xl md:text-4xl font-black uppercase leading-[1.05] mb-4">
                Что спрашивают перед курсом
              </h2>
              <p className="text-foreground/55 text-sm md:text-base leading-relaxed">
                Короткие ответы на ключевые вопросы — всё, что нужно знать перед заявкой.
              </p>
            </motion.div>

            <div className="space-y-2.5">
              {course.faq_items.map((faq, i) => {
                const isOpen = openFaq === i;
                return (
                  <div
                    key={i}
                    className={`border rounded-xl bg-card/60 backdrop-blur-sm overflow-hidden transition-colors ${
                      isOpen ? "border-neon-cyan/30" : "border-border hover:border-foreground/20"
                    }`}
                  >
                    <button
                      onClick={() => setOpenFaq(isOpen ? null : i)}
                      className="w-full flex items-center justify-between gap-4 p-5 text-left"
                    >
                      <span className="font-display font-bold text-sm md:text-base leading-snug pr-2">
                        {faq.question}
                      </span>
                      <div
                        className={`w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 transition-all ${
                          isOpen ? "border border-neon-cyan/40 bg-neon-cyan/5 text-neon-cyan rotate-180" : "border border-border text-foreground/50"
                        }`}
                      >
                        <ChevronDown size={14} />
                      </div>
                    </button>
                    <AnimatePresence>
                      {isOpen && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          className="overflow-hidden"
                        >
                          <div className="px-5 pb-5">
                            <div className="h-px bg-border/60 mb-4" />
                            <p className="text-sm md:text-[15px] text-foreground/70 leading-relaxed">{faq.answer}</p>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                );
              })}
            </div>

            {/* Micro-CTA */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="mt-8 flex flex-col md:flex-row md:items-center justify-between gap-4 p-5 md:p-6 rounded-xl border border-border bg-card/40 backdrop-blur-sm"
            >
              <div>
                <div className="font-display font-bold text-sm md:text-base mb-1">Остались вопросы?</div>
                <p className="text-xs md:text-sm text-foreground/55 leading-relaxed">
                  Менеджер ответит персонально на вопросы по формату и условиям обучения.
                </p>
              </div>
              <button
                onClick={openFormModal}
                className="inline-flex items-center justify-center gap-2 px-5 py-2.5 border border-neon-cyan/40 text-neon-cyan font-display font-bold rounded-lg hover:bg-neon-cyan/10 hover:border-neon-cyan/70 transition-colors text-xs uppercase tracking-wider flex-shrink-0"
              >
                Оставить заявку
                <ArrowRight size={14} />
              </button>
            </motion.div>
          </div>
        </section>
      )}

      {/* Final CTA */}
      <section className="py-20 border-t border-border">
        <div className="container max-w-3xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="relative rounded-2xl border border-neon-magenta/30 bg-card/60 backdrop-blur-sm overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-80 h-80 bg-neon-magenta/[0.06] rounded-full blur-3xl pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-neon-cyan/[0.04] rounded-full blur-3xl pointer-events-none" />

            <div className="relative p-8 md:p-12 text-center">
              <div className="text-neon-magenta text-[10px] font-bold uppercase tracking-[0.3em] mb-5">
                Финальный шаг
              </div>

              <h2 className="font-display text-2xl md:text-4xl font-black mb-4 leading-[1.1] max-w-xl mx-auto">
                {course.cta_title || "Соберите системную экспертизу БФЛ"}
              </h2>

              {course.cta_description && (
                <p className="text-foreground/60 text-sm md:text-base mb-7 max-w-lg mx-auto leading-relaxed">
                  {course.cta_description}
                </p>
              )}

              {/* Trust chips */}
              <div className="flex flex-wrap items-center justify-center gap-2 mb-8">
                <span className="px-3 py-1 rounded-full border border-border bg-card/60 text-[11px] text-foreground/70">
                  12 занятий
                </span>
                <span className="px-3 py-1 rounded-full border border-border bg-card/60 text-[11px] text-foreground/70">
                  Практика и тесты
                </span>
                <span className="px-3 py-1 rounded-full border border-border bg-card/60 text-[11px] text-foreground/70">
                  Удостоверение о квалификации
                </span>
              </div>

              {/* Decision zone — split-pill */}
              <div className="flex flex-col items-center">
                <button
                  onClick={openFormModal}
                  className="group inline-flex items-stretch rounded-2xl border border-neon-magenta/30 bg-card/50 backdrop-blur-sm overflow-hidden hover:border-neon-magenta/60 transition-colors"
                >
                  {price > 0 && (
                    <>
                      <div className="flex flex-col justify-center px-5 md:px-6 py-3.5 text-left">
                        <span className="text-[10px] uppercase tracking-[0.2em] text-foreground/45 mb-1 font-medium">
                          Полная стоимость
                        </span>
                        <span className="font-display text-xl md:text-2xl font-black text-foreground leading-none">
                          {price.toLocaleString("ru-RU")} ₽
                        </span>
                      </div>
                      <div className="w-px bg-white/[0.08]" />
                    </>
                  )}
                  <div className="flex items-center gap-2 px-6 md:px-7 bg-neon-magenta text-primary-foreground font-display font-bold text-sm uppercase tracking-wider group-hover:bg-neon-magenta/90 transition-colors">
                    {course.cta_button_text || "Оставить заявку"}
                    <ArrowRight size={16} className="group-hover:translate-x-0.5 transition-transform" />
                  </div>
                </button>
                <p className="text-[11px] text-foreground/40 mt-4 leading-relaxed max-w-sm">
                  Менеджер свяжется в течение рабочего дня, вышлет программу и обсудит формат
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Bundle — Full track of Academy */}
      <section className="py-20 border-t border-border">
        <div className="container max-w-5xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="relative rounded-2xl border border-neon-cyan/25 bg-card/60 backdrop-blur-sm overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-96 h-96 bg-neon-cyan/[0.04] rounded-full blur-3xl pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-neon-magenta/[0.03] rounded-full blur-3xl pointer-events-none" />

            <div className="relative p-8 md:p-10 grid md:grid-cols-[1.5fr_1fr] gap-8 md:gap-10 items-center">
              <div>
                <div className="text-neon-cyan text-[10px] font-bold uppercase tracking-[0.3em] mb-4">
                  Полный трек Академии
                </div>
                <h3 className="font-display text-2xl md:text-3xl font-black mb-4 leading-tight">
                  Комплексное обучение —<br className="hidden md:block" /> все 6 курсов единым пакетом
                </h3>
                <p className="text-foreground/60 text-sm md:text-base leading-relaxed mb-6 max-w-xl">
                  Системный путь Академии: от юридической практики БФЛ до продаж, управления командой и экспертных программ. Единый маршрут обучения без потери темпа.
                </p>

                <div className="flex flex-wrap items-center gap-2 mb-5">
                  <span className="px-3 py-1 rounded-full border border-border bg-card/60 text-xs text-foreground/70">
                    6 курсов Академии
                  </span>
                  <span className="px-3 py-1 rounded-full border border-border bg-card/60 text-xs text-foreground/70">
                    Рассрочка 6 месяцев
                  </span>
                  <span className="px-3 py-1 rounded-full border border-border bg-card/60 text-xs text-foreground/70">
                    Единый трек
                  </span>
                </div>

                <p className="text-[11px] text-foreground/40 leading-relaxed">
                  Для тех, кто проходит всю систему Академии одним маршрутом
                </p>
              </div>

              <div className="flex flex-col gap-5 md:border-l md:border-white/[0.06] md:pl-10">
                <div>
                  <div className="text-[10px] uppercase tracking-[0.2em] text-foreground/40 mb-1.5 font-medium">
                    Стоимость пакета
                  </div>
                  <div className="text-xs text-foreground/30 line-through mb-1">345 000 ₽</div>
                  <div className="font-display text-3xl md:text-4xl font-black text-foreground leading-none">
                    241 500 ₽
                  </div>
                  <div className="text-[11px] text-foreground/50 mt-2">
                    от 40 250 ₽ / мес. в рассрочку
                  </div>
                </div>
                <button
                  onClick={openFormModal}
                  className="inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-neon-cyan text-accent-foreground font-display font-bold rounded-lg hover:bg-neon-cyan/90 transition-colors text-sm uppercase tracking-wider"
                >
                  Обсудить условия трека
                  <ArrowRight size={16} />
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Refund mechanic — investment into practice */}
      <section className="py-20 border-t border-border">
        <div className="container max-w-5xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="relative rounded-2xl border border-neon-magenta/25 bg-card/60 backdrop-blur-sm overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-96 h-96 bg-neon-magenta/[0.05] rounded-full blur-3xl pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-neon-cyan/[0.03] rounded-full blur-3xl pointer-events-none" />

            <div className="relative p-8 md:p-10">
              <div className="grid md:grid-cols-[1.5fr_1fr] gap-8 md:gap-10 items-start mb-8">
                <div>
                  <div className="text-neon-magenta text-[10px] font-bold uppercase tracking-[0.3em] mb-4">
                    Инвестиция в практику
                  </div>
                  <h3 className="font-display text-2xl md:text-3xl font-black mb-4 leading-tight">
                    Стоимость курса засчитывается<br className="hidden md:block" /> в сопровождение дела
                  </h3>
                  <p className="text-foreground/60 text-sm md:text-base leading-relaxed mb-5 max-w-xl">
                    При передаче дела на арбитражное сопровождение банкротства в нашу компанию стоимость обучения полностью зачитывается в стоимость услуг. Оплата — только депозит АУ, предусмотренный законом.
                  </p>
                  <p className="text-[11px] text-foreground/40 leading-relaxed">
                    Для тех, кто рассматривает обучение как часть дальнейшего сопровождения дела
                  </p>
                </div>

                <div className="flex flex-col gap-3 md:border-l md:border-white/[0.06] md:pl-10 md:pt-2">
                  <button
                    onClick={openFormModal}
                    className="inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-neon-magenta text-primary-foreground font-display font-bold rounded-lg hover:bg-neon-magenta/90 transition-colors text-sm uppercase tracking-wider"
                  >
                    Обсудить формат
                    <ArrowRight size={16} />
                  </button>
                  <p className="text-[11px] text-foreground/40 leading-relaxed text-center">
                    Менеджер рассчитает условия под ваше дело
                  </p>
                </div>
              </div>

              <div className="grid sm:grid-cols-3 gap-4 pt-6 border-t border-border/60">
                <div>
                  <div className="font-display text-2xl md:text-3xl font-black text-neon-magenta leading-none mb-2">
                    100%
                  </div>
                  <div className="text-[11px] uppercase tracking-wider text-foreground/50">
                    стоимости курса в зачёт
                  </div>
                </div>
                <div>
                  <div className="font-display text-2xl md:text-3xl font-black text-neon-cyan leading-none mb-2">
                    25 000 ₽
                  </div>
                  <div className="text-[11px] uppercase tracking-wider text-foreground/50">
                    депозит АУ по закону
                  </div>
                </div>
                <div>
                  <div className="font-display text-2xl md:text-3xl font-black text-foreground leading-none mb-2">
                    0 ₽
                  </div>
                  <div className="text-[11px] uppercase tracking-wider text-foreground/50">
                    скрытых доплат и публикаций
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer mini */}
      <footer className="py-8 border-t border-border">
        <div className="container text-center">
          <Link to="/" className="font-display text-lg font-bold">
            <span className="text-neon-cyan">ТЕХНОЛОГ</span><span className="text-neon-magenta">ИИ</span>{" "}
            <span className="text-neon-cyan">ПРАВА</span>
          </Link>
          <p className="text-xs text-muted-foreground mt-2">&copy; 2026 Технологии права. Все права защищены.</p>
        </div>
      </footer>

      {/* Registration Modal */}
      <AnimatePresence>
        {showForm && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[60] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-background/80 backdrop-blur-sm" onClick={() => setShowForm(false)} />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative bg-card border border-border rounded-2xl p-6 md:p-8 max-w-md w-full"
            >
              <button onClick={() => setShowForm(false)} className="absolute top-4 right-4 text-muted-foreground hover:text-foreground transition-colors">
                <X size={20} />
              </button>

              {!formDone ? (
                <>
                  <GraduationCap className="w-8 h-8 text-neon-magenta mb-3" />
                  <h3 className="font-display text-xl font-bold mb-1">Оставить заявку</h3>
                  <p className="text-sm text-muted-foreground mb-6">{course.title}</p>
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                      <label className="text-sm font-medium mb-1 block">Имя <span className="text-neon-magenta">*</span></label>
                      <input required type="text" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })}
                        className="w-full px-4 py-2.5 bg-muted/50 border border-border rounded-lg text-sm focus:outline-none focus:border-neon-cyan transition-colors" placeholder="Ваше имя" />
                    </div>
                    <div>
                      <label className="text-sm font-medium mb-1 block">Телефон <span className="text-neon-magenta">*</span></label>
                      <input required type="tel" value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })}
                        className="w-full px-4 py-2.5 bg-muted/50 border border-border rounded-lg text-sm focus:outline-none focus:border-neon-cyan transition-colors" placeholder="+7 (___) ___-__-__" />
                    </div>
                    <div>
                      <label className="text-sm font-medium mb-1 block">Email <span className="text-neon-magenta">*</span></label>
                      <input required type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })}
                        className="w-full px-4 py-2.5 bg-muted/50 border border-border rounded-lg text-sm focus:outline-none focus:border-neon-cyan transition-colors" placeholder="email@example.com" />
                    </div>
                    <button type="submit" disabled={submitting}
                      className="w-full px-6 py-3 bg-neon-magenta text-primary-foreground font-display font-bold rounded-lg shadow-neon-magenta hover:opacity-90 transition-opacity text-sm uppercase tracking-wider disabled:opacity-50">
                      {submitting ? "Отправка..." : "Отправить заявку"}
                    </button>
                    <p className="text-xs text-muted-foreground text-center">Нажимая кнопку, вы соглашаетесь на обработку персональных данных</p>
                  </form>
                </>
              ) : (
                <div className="text-center py-4">
                  <CheckCircle2 className="w-14 h-14 text-neon-cyan mx-auto mb-4" />
                  <h3 className="font-display text-xl font-bold mb-2">Заявка отправлена!</h3>
                  <p className="text-muted-foreground text-sm mb-6">Мы свяжемся с вами в ближайшее время для уточнения деталей.</p>
                  <button onClick={() => setShowForm(false)}
                    className="px-6 py-2.5 border border-border text-foreground/70 font-display font-bold rounded-lg hover:border-neon-cyan/50 transition-colors text-sm uppercase tracking-wider">
                    Закрыть
                  </button>
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
