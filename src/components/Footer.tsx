import type { ReactNode } from "react";
import { BrandTitle } from "@/components/BrandTitle";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

type LegalDialogLinkProps = {
  title: string;
  description: string;
  children: ReactNode;
};

const LegalDialogLink = ({ title, description, children }: LegalDialogLinkProps) => (
  <Dialog>
    <DialogTrigger asChild>
      <button
        type="button"
        className="text-sm text-muted-foreground transition-colors hover:text-neon-cyan"
      >
        {title}
      </button>
    </DialogTrigger>
    <DialogContent className="max-h-[85vh] max-w-3xl overflow-hidden border-border bg-card p-0">
      <div className="custom-scrollbar max-h-[85vh] overflow-y-auto p-6 sm:p-8">
        <DialogHeader className="mb-6 text-left">
          <DialogTitle className="font-display text-xl text-foreground">{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
        <div className="space-y-5 text-sm leading-6 text-muted-foreground">{children}</div>
      </div>
    </DialogContent>
  </Dialog>
);

export const Footer = () => {
  return (
    <footer className="border-t border-border py-12">
      <div className="container">
        <div className="flex flex-col items-center justify-between gap-6 md:flex-row">
          <div>
            <BrandTitle className="font-display text-lg font-bold" uppercase />
            <p className="mt-1 text-sm text-muted-foreground">Технологии в сфере права • 2026</p>
          </div>

          <div className="flex gap-8 text-sm text-muted-foreground">
            <a href="#streams" className="transition-colors hover:text-neon-cyan">
              Потоки
            </a>
            <a href="#exhibition" className="transition-colors hover:text-neon-cyan">
              Выставка
            </a>
            <a href="#sponsors" className="transition-colors hover:text-neon-cyan">
              Спонсорам
            </a>
            <a href="#become-speaker" className="transition-colors hover:text-neon-cyan">
              Спикерам
            </a>
          </div>
        </div>

        <div className="mt-8 border-t border-border pt-6">
          <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
            <p className="text-center text-xs text-muted-foreground md:text-left">
              © 2026 LegalTech Conference. Все права защищены.
            </p>

            <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2">
              <LegalDialogLink
                title="Обработка ПД"
                description="Сведения о порядке обработки персональных данных пользователей сайта."
              >
                <section className="space-y-2">
                  <h3 className="font-display text-base text-foreground">1. Общие положения</h3>
                  <p>
                    Настоящее уведомление определяет порядок обработки персональных данных,
                    передаваемых пользователями сайта конференции LegalTech Conference при
                    заполнении форм обратной связи, заявок на участие, партнерство и выступление.
                  </p>
                </section>

                <section className="space-y-2">
                  <h3 className="font-display text-base text-foreground">2. Какие данные обрабатываются</h3>
                  <p>
                    Оператор может обрабатывать фамилию, имя, отчество, адрес электронной почты,
                    номер телефона, должность, название компании, сведения о профессиональной
                    деятельности, а также иные данные, которые пользователь добровольно указывает в
                    форме на сайте.
                  </p>
                </section>

                <section className="space-y-2">
                  <h3 className="font-display text-base text-foreground">3. Цели обработки</h3>
                  <p>
                    Персональные данные используются для обработки заявок, обратной связи с
                    пользователем, организации участия в мероприятии, рассмотрения партнерских и
                    спикерских предложений, а также для исполнения требований законодательства.
                  </p>
                </section>

                <section className="space-y-2">
                  <h3 className="font-display text-base text-foreground">4. Правовые основания</h3>
                  <p>
                    Обработка осуществляется на основании согласия субъекта персональных данных, а
                    также в случаях, предусмотренных действующим законодательством Российской
                    Федерации.
                  </p>
                </section>

                <section className="space-y-2">
                  <h3 className="font-display text-base text-foreground">5. Действия с данными</h3>
                  <p>
                    Оператор вправе собирать, записывать, систематизировать, хранить, уточнять,
                    использовать, передавать в пределах, необходимых для достижения указанных целей,
                    блокировать и удалять персональные данные в соответствии с законодательством.
                  </p>
                </section>

                <section className="space-y-2">
                  <h3 className="font-display text-base text-foreground">6. Срок хранения</h3>
                  <p>
                    Персональные данные хранятся не дольше, чем этого требуют цели обработки или
                    нормы законодательства, после чего подлежат удалению либо обезличиванию.
                  </p>
                </section>

                <section className="space-y-2">
                  <h3 className="font-display text-base text-foreground">7. Права пользователя</h3>
                  <p>
                    Пользователь вправе запросить уточнение, блокирование или удаление своих
                    персональных данных, а также отозвать согласие на их обработку, направив
                    обращение по контактам организатора, указанным на сайте.
                  </p>
                </section>
              </LegalDialogLink>

              <LegalDialogLink
                title="Политика конфиденциальности"
                description="Информация о сборе, использовании и защите данных пользователей сайта."
              >
                <section className="space-y-2">
                  <h3 className="font-display text-base text-foreground">1. Назначение политики</h3>
                  <p>
                    Политика конфиденциальности регулирует порядок получения, использования и защиты
                    информации, которую сайт получает от посетителей при использовании страниц,
                    сервисов и форм сайта.
                  </p>
                </section>

                <section className="space-y-2">
                  <h3 className="font-display text-base text-foreground">2. Источники данных</h3>
                  <p>
                    Информация поступает непосредственно от пользователя при заполнении форм, а
                    также автоматически в ограниченном объеме через технические журналы сервера,
                    cookie и иные средства аналитики, если они используются на сайте.
                  </p>
                </section>

                <section className="space-y-2">
                  <h3 className="font-display text-base text-foreground">3. Использование информации</h3>
                  <p>
                    Полученные данные используются для обеспечения работы сайта, связи с
                    пользователями, улучшения качества сервиса, подготовки предложений об участии в
                    мероприятии и соблюдения обязательных требований законодательства.
                  </p>
                </section>

                <section className="space-y-2">
                  <h3 className="font-display text-base text-foreground">4. Передача третьим лицам</h3>
                  <p>
                    Данные не передаются третьим лицам без законных оснований или согласия
                    пользователя, за исключением случаев, когда такая передача необходима для
                    исполнения закона, защиты прав оператора или организации мероприятия.
                  </p>
                </section>

                <section className="space-y-2">
                  <h3 className="font-display text-base text-foreground">5. Защита информации</h3>
                  <p>
                    Оператор принимает разумные организационные и технические меры для защиты данных
                    от утраты, неправомерного доступа, изменения, раскрытия или уничтожения.
                  </p>
                </section>

                <section className="space-y-2">
                  <h3 className="font-display text-base text-foreground">6. Cookie и технические данные</h3>
                  <p>
                    Сайт может использовать cookie и иные технические средства для корректной работы
                    интерфейсов, сохранения пользовательских настроек и анализа посещаемости. При
                    необходимости пользователь может ограничить использование cookie в настройках
                    браузера.
                  </p>
                </section>

                <section className="space-y-2">
                  <h3 className="font-display text-base text-foreground">7. Изменение политики</h3>
                  <p>
                    Оператор вправе обновлять настоящую политику. Актуальная версия размещается на
                    сайте и применяется с момента публикации.
                  </p>
                </section>
              </LegalDialogLink>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};
