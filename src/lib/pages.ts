import type { Locale } from "./types";

export type StaticPage = {
  title: string;
  lead: string;
  blocks: { h: string; p: string }[];
};

export function pricingPage(locale: Locale): StaticPage {
  if (locale === "bg") {
    return {
      title: "Цени",
      lead:
        "Същият файл. Платената версия маха реда Prima16 Extras в колонтитула. Плащаш на екрана за изтегляне. Paddle.com е търговец по сделката. 30 дни за връщане.",
      blocks: [
        {
          h: "Безплатно",
          p: "Неограничени чернови. 2 финални PDF на браузър на календарен месец с колонтитул. Един локален обект. Без лого на изпълнителя върху бланката като платена услуга — просто шаблон.",
        },
        {
          h: "Чист PDF — този вид, това устройство · €1.99",
          p: "Еднократно през Paddle. Маха колонтитула за протокол или за труд-и-материали — който си платил — в този браузър. 30 дни за връщане.",
        },
        {
          h: "Това устройство — Prima16 Extras · €19.99",
          p: "Еднократно. Маха колонтитула за всички генератори на extras.prima16.com в този браузър. Не отключва docs.prima16.com. 30 дни за връщане.",
        },
        {
          h: "Запазен обект",
          p: "Безплатно в този браузър засега. Облачен акаунт с magic link е предвиден по-късно. Чистият PDF пак следва отключването по-горе.",
        },
      ],
    };
  }
  return {
    title: "Pricing",
    lead:
      "Same file. The paid version drops the Prima16 Extras footer line. Pay on the download screen. Paddle.com is the merchant of record. 30-day refund.",
    blocks: [
      {
        h: "Free",
        p: "Unlimited drafts. 2 finalised PDFs per browser per calendar month with the footer. One local job file. No subscription.",
      },
      {
        h: "Clean PDF — this type, this device · €1.99",
        p: "One-time via Paddle. Removes the footer for change orders or for T&M — whichever you paid — on this browser. 30-day refund.",
      },
      {
        h: "This device — Prima16 Extras · €19.99",
        p: "One-time. Removes the footer for every generator on extras.prima16.com on this browser. Does not unlock docs.prima16.com. 30-day refund.",
      },
      {
        h: "Saved job file",
        p: "Free in this browser for launch. A later magic-link account may sync jobs. Clean PDF still follows the Paddle unlock above.",
      },
    ],
  };
}

export function faqPage(locale: Locale): StaticPage {
  if (locale === "bg") {
    return {
      title: "Въпроси",
      lead: "Кратко. Без маркетингови суперлативи.",
      blocks: [
        { h: "Това фактура ли е?", p: "Не. Не е данъчна фактура и не замества счетоводен софтуер." },
        { h: "Трябва ли акаунт?", p: "Не. Попълваш и сваляш. Обектът е по желание и стои в браузъра." },
        { h: "Какво отключва €1.99?", p: "Маха колонтитула за този вид документ на това устройство." },
        { h: "Отключва ли Документи?", p: "Не. extras.prima16.com и docs.prima16.com са отделни продукти." },
        { h: "Кой събира парите?", p: "Paddle.com е търговец по сделката. Прилагат се условията на Paddle за купувача." },
        { h: "Има ли абонамент?", p: "Не в тази версия." },
      ],
    };
  }
  return {
    title: "FAQ",
    lead: "Short answers. No slogans.",
    blocks: [
      { h: "Is this an invoice?", p: "No. It is not a VAT invoice and it does not replace bookkeeping software." },
      { h: "Do I need an account?", p: "No. Fill the form and download. The job file is optional and stays in the browser." },
      { h: "What does €1.99 unlock?", p: "It drops the footer for that document type on this device." },
      { h: "Does it unlock Документи?", p: "No. extras.prima16.com and docs.prima16.com are separate products." },
      { h: "Who takes the payment?", p: "Paddle.com is the merchant of record. Paddle buyer terms apply." },
      { h: "Is there a subscription?", p: "Not in this version." },
    ],
  };
}

export function vsExcelPage(locale: Locale): StaticPage {
  if (locale === "bg") {
    return {
      title: "Защо не Excel",
      lead: "Excel държи числа. На обекта трябва лист с номер, страни и място за подпис.",
      blocks: [
        { h: "Номер", p: "Протоколът излиза с номер и дата, не като Sheet1." },
        { h: "Стойност по договора", p: "Първоначална сума, предишни допълнителни, този лист, нова стойност." },
        { h: "A4", p: "Готово за принтер на обекта. Letter е опция, не е подразбиране." },
        { h: "Без акаунт", p: "Отваряш страницата и пишеш. Както Документи." },
      ],
    };
  }
  return {
    title: "Why not Excel",
    lead: "Excel holds numbers. On site you need a numbered sheet with parties and a signature line.",
    blocks: [
      { h: "A number", p: "The sheet leaves with a number and a date, not as Sheet1." },
      { h: "Reconciliation", p: "Original, previous extras, this document, revised total." },
      { h: "A4", p: "Ready for the site printer. Letter is a toggle, not the default." },
      { h: "No account", p: "Open the page and type. Same wedge as Документи." },
    ],
  };
}

export function legalPage(locale: Locale, slug: string): StaticPage {
  const operator =
    locale === "bg"
      ? "Оператор е Цанко Валентинов Цанков, търгуващ като Prima16, България."
      : "The operator is Tsanko Valentinov Tsankov, trading as Prima16, Bulgaria.";
  if (slug === "privacy") {
    return locale === "bg"
      ? {
          title: "Поверителност",
          lead: operator,
          blocks: [
            { h: "Какво пазим в браузъра", p: "Чернови, един обект, ценоразпис и отключвания стоят в localStorage на твоето устройство. Не пращаме съдържанието на документа към сървър в тази версия." },
            { h: "Плащане", p: "Paddle обработва картата. Ние не виждаме пълни картови данни." },
            { h: "Бисквитки", p: "Само технически, нужни за сайта и за отключването на устройството." },
            { h: "Контакт", p: "Пишете на основателя през контактната форма на prima16.com." },
          ],
        }
      : {
          title: "Privacy",
          lead: operator,
          blocks: [
            { h: "What stays in the browser", p: "Drafts, one job file, the pricebook and unlocks live in localStorage on your device. This version does not upload document contents." },
            { h: "Payment", p: "Paddle processes the card. We do not see full card details." },
            { h: "Cookies", p: "Technical cookies only, for the site and the device unlock." },
            { h: "Contact", p: "Write to the founder via the contact path on prima16.com." },
          ],
        };
  }
  if (slug === "disclaimer") {
    return locale === "bg"
      ? {
          title: "Отказ от отговорност",
          lead: "Това е бизнес шаблон от Prima16 Extras. Не е правна, данъчна или счетоводна консултация и не е данъчна фактура.",
          blocks: [
            { h: "Употреба", p: "Ти отговаряш за съдържанието, номерацията и дали листът отговаря на договора ти." },
            { h: "Не е Документи", p: "Оферти, стокови разписки и гаранционни карти са на docs.prima16.com." },
          ],
        }
      : {
          title: "Disclaimer",
          lead: "This is a business template from Prima16 Extras. It is not legal, tax or accounting advice and it is not a VAT invoice.",
          blocks: [
            { h: "Use", p: "You are responsible for the content, numbering and whether the sheet matches your contract." },
            { h: "Not Документи", p: "Quotes, delivery notes and warranty cards live on docs.prima16.com." },
          ],
        };
  }
  if (slug === "refunds") {
    return locale === "bg"
      ? {
          title: "Връщания",
          lead: "30 дни. Същото обещание като Документи.",
          blocks: [
            { h: "Как", p: "Пишете през Paddle или към оператора. Отключването е за устройство, не за абонамент." },
            { h: "Търговец", p: "Paddle.com е търговец по сделката за платените отключвания." },
          ],
        }
      : {
          title: "Refunds",
          lead: "30 days. The same promise as Документи.",
          blocks: [
            { h: "How", p: "Write through Paddle or to the operator. The unlock is per device, not a subscription." },
            { h: "Merchant", p: "Paddle.com is the merchant of record for paid unlocks." },
          ],
        };
  }
  return locale === "bg"
    ? {
        title: "Общи условия",
        lead: operator + " Приложимо право: България.",
        blocks: [
          { h: "Услуга", p: "Prima16 Extras генерира шаблони за допълнителни работи и труд-и-материали. Не генерира оферти, стокови разписки или данъчни фактури." },
          { h: "Плащане", p: "Платените отключвания се обработват от Paddle.com. Важат условията на Paddle за купувача." },
          { h: "Акаунт", p: "Не е задължителен. Локалните данни са във твоя браузър." },
        ],
      }
    : {
        title: "Terms",
        lead: operator + " Governing law: Bulgaria.",
        blocks: [
          { h: "Service", p: "Prima16 Extras generates extra-work and T&M templates. It does not generate quotes, delivery notes or VAT invoices." },
          { h: "Payment", p: "Paid unlocks are processed by Paddle.com. Paddle buyer terms apply." },
          { h: "Account", p: "Not required. Local data stays in your browser." },
        ],
      };
}

export const blogs = {
  en: [
    {
      slug: "change-order-vs-email",
      title: "A change order is not an email thread",
      body: "The extra socket starts in a voice note and ends in an argument about the original quote. A numbered sheet with a running total is slower to type and faster to close.",
    },
    {
      slug: "tm-ticket-on-site",
      title: "T&M tickets that a site manager will sign",
      body: "Hours, materials, the instruction, and a signature line. Keep the footer if you must. Remove it when the sheet goes on the job file.",
    },
  ],
  bg: [
    {
      slug: "dopalnitelni-ne-viber",
      title: "Допълнителната работа не е съобщение във Viber",
      body: "Започва с „само още една стена“ и свършва без номер. Листът с основание, редове и нова стойност е по-бавен за писане и по-бърз за приключване.",
    },
  ],
};
