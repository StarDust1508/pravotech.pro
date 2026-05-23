import { InlineKeyboard } from 'grammy';

/**
 * Main menu keyboard shown after /start and as a navigation hub.
 */
export function mainMenuKeyboard(): InlineKeyboard {
  return new InlineKeyboard()
    .text('📚 Получить книгу', 'menu:book')
    .text('📋 Чек-листы', 'menu:checklists')
    .row()
    .text('📊 Исследования', 'menu:research')
    .text('🎓 Академия', 'menu:courses')
    .row()
    .text('🏛 Конференция 2026', 'menu:conference')
    .row()
    .text('📁 Мои материалы', 'menu:my')
    .text('💬 Обратная связь', 'menu:feedback')
    .row()
    .text('ℹ️ О платформе', 'menu:about')
    .text('❓ Помощь', 'menu:help');
}

/**
 * "Back to main menu" keyboard — single button to return.
 */
export function backToMenuKeyboard(): InlineKeyboard {
  return new InlineKeyboard()
    .text('⬅️ Главное меню', 'menu:main');
}

/**
 * After sending the book — suggest related content.
 */
export function afterBookKeyboard(): InlineKeyboard {
  return new InlineKeyboard()
    .text('📋 Чек-листы для практики', 'menu:checklists')
    .row()
    .text('🎓 Курсы Академии', 'menu:courses')
    .row()
    .text('⬅️ Главное меню', 'menu:main');
}

/**
 * After sending a checklist — suggest courses.
 */
export function afterChecklistKeyboard(): InlineKeyboard {
  return new InlineKeyboard()
    .text('🎓 Курсы по этой теме', 'menu:courses')
    .row()
    .text('📊 Исследования', 'menu:research')
    .row()
    .text('⬅️ Главное меню', 'menu:main');
}

/**
 * After sending research — suggest courses.
 */
export function afterResearchKeyboard(): InlineKeyboard {
  return new InlineKeyboard()
    .text('🎓 Курсы Академии', 'menu:courses')
    .row()
    .text('📋 Чек-листы', 'menu:checklists')
    .row()
    .text('⬅️ Главное меню', 'menu:main');
}

/**
 * Site URL constant used across bot messages.
 */
export const SITE_URL = 'https://pravotech.pro';
