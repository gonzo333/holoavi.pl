import { createLogger } from "./logger.js";

const logger = createLogger("i18n");

const translations = {
  global: {
    tooltip_lang_pl: "Polski",
    tooltip_lang_en: "English",
    tooltip_lang_es: "Español",
    tooltip_lang_uk: "Українська",
  },
  pl: {
    // Navigation & Footer
    nav_start: "Start",
    nav_avatars: "Awatary",
    nav_holograms: "Hologramy",
    nav_pricing: "Cennik",
    nav_about: "O nas",
    nav_contact: "Kontakt",
    footer_tagline:
      "Ożywiamy prezentacje każdej firmy, budujemy zaangażowanie i emocje klientów.",
    footer_copy: "© 2026 NAAPP New Advance Applications Paweł Nowaczek.",
    footer_terms: "Regulamin",
    footer_privacy: "Polityka Prywatności",

    // Cookie banner
    cookie_text:
      'Ta strona ładuje zasoby zewnętrzne (CDN) oraz przetwarza dane przesłane przez formularz kontaktowy. Dane te wykorzystujemy wyłącznie w celu obsługi zapytań i zapobiegania spamowi. Więcej w <a href="#" class="cookie-policy-link" data-page="polityka.html">Polityce Prywatności</a>.',
    cookie_decline: "Odrzucam",
    cookie_accept: "Rozumiem",

    // Home
    home_badge: "> AWATARY I HOLOGRAMY PRZYSZŁOŚCI",
    home_title: "Nowoczesne rozwiązania eventowe wsparte AI.",
    home_lead:
      "Interaktywne awatary AI i urządzenia holograficzne dla firm, eventów i showroomów. Działające wdrożenia, nie demonstracje.",
    home_btn_avatars: "Awatary AI",
    home_btn_holograms: "Hologramy",
    home_status_label: "STATUS:",
    home_status_init: "Inicjalizacja...",
    home_questions_label: "Przykładowe pytania:",
    home_presentations_label: "Przykładowe prezentacje:",

    // Avatars page
    avatars_badge: "> CYFROWI ASYSTENCI",
    avatars_title: "Interaktywne Awatary AI nowej generacji",
    avatars_lead:
      "Obniż koszty i zwiększ sprzedaż dzięki interaktywnym awatarom na stronie internetowej i ekranach.",
    avatars_p1:
      "Tworzymy Awatary AI dopasowane do realnych potrzeb Twojego biznesu. Bez gotowych schematów i rozwiązań z półki. Każde wdrożenie projektujemy indywidualnie. Zaczynamy od dokładnego poznania Twojej firmy, jej procesów i klientów. Dzięki temu powstaje rozwiązanie, które pasuje do Twojej organizacji, wspiera codzienną pracę i komunikuje się językiem Twojej branży.",
    avatars_p2:
      "Nasz proces zawsze rozpoczynamy od rzetelnego i szczegółowego zbadania realnych potrzeb Twojej firmy. Każdy wniosek oraz proces operacyjny analizujemy przez pryzmat specyfiki branży, w której działasz, dzięki czemu dostarczona sztuczna inteligencja idealnie wpisuje się w strukturę Twojej organizacji i mówi językiem Twoich klientów.",
    avatars_approach_title: "NASZE PODEJŚCIE DO TWORZENIA AWATARÓW",
    avatars_app1_title: "Wyjątkowa postać:",
    avatars_app1_desc:
      "Tworzymy wygląd, głos i sposób komunikacji dopasowane do Twojej marki.",
    avatars_app2_title: "Wiedza dopasowana do roli:",
    avatars_app2_desc:
      "Wyposażamy awatara w informacje, których potrzebuje, aby odpowiadać klientom, prezentować ofertę lub wspierać pracowników.",
    avatars_app3_title: "Naturalna komunikacja:",
    avatars_app3_desc:
      "Dbamy o to, aby awatar mówił językiem Twojej branży, znał kontekst i zachowywał się zgodnie z wyznaczoną rolą.",
    avatars_spec_badge: "> SPECYFIKACJA SYSTEMU",
    avatars_spec_title: "Wybrane możliwości naszych Agentów AI",
    avatars_c1_title: "Awatar, który pomaga wybrać",
    avatars_c1_desc:
      "Prowadzi naturalną rozmowę, poznaje potrzeby klienta i podpowiada najlepiej dopasowany produkt, usługę lub wariant oferty.",
    avatars_c2_title: "Wiedza Twojej firmy",
    avatars_c2_desc:
      "Umożliwia użytkownikom samodzielne umawianie spotkań, prezentacji handlowych lub usług serwisowych w czasie rzeczywistym dzięki bezpośredniej integracji z systemami CRM.",
    avatars_c3_title: "Rozmowa dopasowana do klienta",
    avatars_c3_desc:
      "Awatar rozpoznaje ton rozmowy i odpowiednio reaguje. Może uspokoić sfrustrowanego klienta, zmienić sposób komunikacji lub przekazać sprawę pracownikowi.",
    avatars_c4_title: "Umawianie wizyt i spotkań",
    avatars_c4_desc:
      "Awatar może sprawdzić dostępne terminy i od razu umówić wizytę, konsultację, prezentację lub serwis.",
    avatars_c5_title: "Połączenie z Twoimi systemami",
    avatars_c5_desc:
      "Integrujemy awatara z CRM, ERP, kalendarzem, magazynem, WhatsAppem i innymi narzędziami. Dzięki temu nie tylko odpowiada, ale też wykonuje konkretne działania.",
    avatars_cta_title: "Zwiększ efektywność swojego biznesu",
    avatars_cta_desc:
      "Przeanalizujmy wspólnie procesy w Twojej firmie. Stwórzmy Agenta AI idealnie dopasowanego do Twoich celów.",
    avatars_cta_btn: "Napisz do nas",

    // Holograms page
    holograms_badge: "> URZĄDZENIA HOLOGRAFICZNE",
    holograms_title: "Hologramy, które zmieniają przestrzeń",
    holograms_lead:
      "Dostarczamy nowoczesne urządzenia holograficzne do eventów, showroomów, recepcji i punktów sprzedaży. Tworzą efekt trójwymiarowej postaci lub obiektu.",
    holograms_p1:
      "Nasze systemy holograficzne pozwalają wyświetlać praktycznie dowolne treści. Postacie 3D, awatary AI, filmy, animacje, prezentacje produktów, transmisje na żywo oraz zawartość stron internetowych. Obraz może być połączony z dźwiękiem, dzięki czemu hologram nie tylko wygląda efektownie, ale także mówi, prezentuje i prowadzi użytkownika przez przygotowany scenariusz.",
    holograms_p2:
      "Urządzenia mogą działać automatycznie lub reagować na odbiorców. Umożliwiają sterowanie treścią, zmianę wyświetlanych materiałów, obsługę dotykową, głosową lub za pomocą czujników ruchu. Całością można zarządzać zdalnie. Planować emisję, aktualizować content i kontrolować urządzenia z jednego miejsca. Podobne rozwiązania rynkowe wykorzystują także kamery, mikrofony, głośniki oraz interaktywne awatary AI prowadzące rozmowy w czasie rzeczywistym.",
    holograms_spec_title: "SPECYFIKACJA TECHNOLOGICZNA",
    holograms_s1_t: "Wyświetlane treści:",
    holograms_s1_d:
      "awatary AI, postacie 3D, filmy, animacje, prezentacje, transmisje live i strony WWW",
    holograms_s2_t: "Dźwięk:",
    holograms_s2_d:
      "wbudowane lub zewnętrzne nagłośnienie, mowa awatara, muzyka i efekty dźwiękowe",
    holograms_s3_t: "Zarządzanie:",
    holograms_s3_d:
      "zdalna aktualizacja treści, harmonogram emisji i kontrola urządzeń w czasie rzeczywistym",
    holograms_s4_t: "Integracje:",
    holograms_s4_d:
      "strony internetowe, systemy firmowe, aplikacje, API, CRM oraz rozwiązania oparte na AI",
    holograms_adv_badge: "> PRZEWAGI TECHNOLOGICZNE",
    holograms_adv_title: "Co wyróżnia nasze systemy projekcji 3D?",
    holograms_c1_title: "Wynajem hologramów na eventy",
    holograms_c1_desc:
      "Dzięki zastosowaniu diod o zagęszczonej strukturze i wysokiej luminancji, wyświetlany hologram zachowuje pełną wyrazistość, głęboki kontrast oraz nasycenie barw nawet w mocno oświetlonych przestrzeniach targowych.",
    holograms_c1_tag: "EVENTY I TARGI",
    holograms_c2_title: "Content przygotowany pod hologram",
    holograms_c2_desc:
      "Tworzymy filmy, animacje 3D, postacie i prezentacje dopasowane do urządzenia, przestrzeni oraz charakteru wydarzenia.",
    holograms_c2_tag: "CONTENT I ANIMACJA",
    holograms_c3_title: "Interaktywny hologram z AI",
    holograms_c3_desc:
      "Łączymy awatara AI z hologramem, tworząc postać, która mówi, odpowiada na pytania i prowadzi rozmowę w czasie rzeczywistym.",
    holograms_c3_tag: "HOLOGRAM AI",
    holograms_cta_title: "Chcesz zobaczyć prezentację na żywo?",
    holograms_cta_desc:
      "Odwiedź nasze showroom lub zamów pokaz technologii bezpośrednio w Twoim biurze.",
    holograms_cta_btn: "Napisz do nas",

    // Pricing page
    pricing_badge: "> CENNIK",
    pricing_main_title: "Transparentne pakiety",
    pricing_subtitle:
      "Wybierz model współpracy dopasowany do skali Twojego wydarzenia lub potrzeb biznesowych.",
    pricing_tab_avatars: "Interaktywne Awatary AI",
    pricing_tab_holograms: "Wynajem i Zakup Hologramów",
    pricing_sec1_title: "// 01. Pakiety wdrożeniowe awatarów",
    pricing_netto: "netto",
    pricing_netto_msc: "netto / msc",
    pricing_netto_day: "netto / dzień",
    pricing_select_pkg: "Wybierz pakiet",
    pricing_select_plan: "Wybierz plan",
    pricing_book_date: "Rezerwuj termin",
    pricing_ask_quote: "Zapytaj o wycenę",
    pricing_consult_proj: "Skonsultuj projekt",
    pricing_most_popular: "Najczęściej wybierany",
    pricing_avatar_std_desc:
      "Gotowy awatar AI na stronę internetową, przygotowany na podstawie zdjęcia i podstawowych informacji o Twojej firmie.",
    pricing_avatar_std_f1: "Utworzenie awatara na podstawie zdjęcia",
    pricing_avatar_std_f2: "Dopasowanie wyglądu, głosu i stylu wypowiedzi",
    pricing_avatar_std_f3: "Podstawowa wiedza o firmie, ofercie lub usłudze",
    pricing_avatar_std_f4: "Prosty scenariusz jednej rozmowy",
    pricing_avatar_std_f5: "Osadzenie na jednej stronie internetowej",
    pricing_avatar_std_f6: "Konfiguracja, uruchomienie i testy",
    pricing_avatar_biz_desc:
      "Spersonalizowany awatar stworzony na podstawie nagrania konkretnej osoby i przygotowany do obsługi wybranej roli biznesowej.",
    pricing_avatar_biz_f1: "Utworzenie awatara na podstawie nagrania wideo",
    pricing_avatar_biz_f2:
      "Dopasowanie głosu, charakteru i sposobu komunikacji",
    pricing_avatar_biz_f3: "Rozbudowana wiedza na podstawie materiałów firmy",
    pricing_avatar_biz_f4: "Scenariusze najczęstszych rozmów",
    pricing_avatar_biz_f5: "Osadzenie na stronie internetowej",
    pricing_avatar_biz_f6: "Konfiguracja, uruchomienie i testy",
    pricing_avatar_biz_f7:
      "Przygotowanie awatara do konkretnej roli biznesowej",
    pricing_avatar_prem_price: "od 11 900 zł",
    pricing_avatar_prem_desc:
      "Zaawansowany awatar AI połączony z procesami i systemami Twojej firmy. Nie tylko rozmawia, ale również wykonuje konkretne działania.",
    pricing_avatar_prem_f1:
      "Spersonalizowany awatar na podstawie nagrania wideo",
    pricing_avatar_prem_f2:
      "Dopasowanie głosu, charakteru i zachowania do roli",
    pricing_avatar_prem_f3: "Rozbudowana wiedza dopasowana do procesów firmy",
    pricing_avatar_prem_f4: "Indywidualne scenariusze rozmów i obsługi klienta",
    pricing_avatar_prem_f5: "Wdrożenie na stronie klienta",
    pricing_avatar_prem_f6: "Testy, optymalizacja i wsparcie przy uruchomieniu",
    pricing_avatar_prem_f7:
      "Integracja z formularzem, kalendarzem, CRM lub API",
    pricing_avatar_prem_f8: "Realizacja jednej uzgodnionej funkcji biznesowej",
    pricing_sec2_title: "// 02. Miesięczne pakiety rozmów z awatarem",
    pricing_sec2_notice:
      "Wybierz pakiet dopasowany do liczby rozmów oraz poziomu wsparcia, jakiego potrzebuje Twój awatar.",
    pricing_sub_std_desc:
      "Dla firm, które chcą uruchomić awatara na stronie i korzystać z niego przy mniejszym ruchu.",
    pricing_sub_std_f1_strong: "90 minut ",
    pricing_sub_std_f1_text: "rozmów z awatarem",
    pricing_sub_std_f2_strong: "Do 10 ",
    pricing_sub_std_f2_text: "równoczesnych rozmów",
    pricing_sub_std_f3: "Utrzymanie i monitoring działania",
    pricing_sub_std_f4: "Podstawowe aktualizacje wiedzy",
    pricing_sub_std_f5: "Miesięczne podsumowanie wykorzystania",
    pricing_sub_std_f6: "Standardowe wsparcie techniczne",
    pricing_sub_biz_desc:
      "Dla firm, które regularnie wykorzystują awatara w sprzedaży, obsłudze klienta lub prezentowaniu oferty.",
    pricing_sub_biz_f1_strong: "200 minut ",
    pricing_sub_biz_f1_text: "rozmów z awatarem",
    pricing_sub_biz_f2_strong: "Do 15 ",
    pricing_sub_biz_f2_text: "równoczesnych rozmów",
    pricing_sub_biz_f3: "Utrzymanie i monitoring działania",
    pricing_sub_biz_f4: "Regularne aktualizacje wiedzy",
    pricing_sub_biz_f5: "Analiza najczęstszych pytań klientów",
    pricing_sub_biz_f6: "Rozszerzone wsparcie techniczne",
    pricing_sub_biz_f7: "Optymalizacja odpowiedzi i scenariuszy rozmów",
    pricing_sub_pro_desc:
      "Dla firm, które intensywnie wykorzystują awatara i chcą stale rozwijać jego wiedzę oraz sposób działania.",
    pricing_sub_pro_f1_strong: "400 minut ",
    pricing_sub_pro_f1_text: "rozmów z awatarem",
    pricing_sub_pro_f2_strong: "Do 15 ",
    pricing_sub_pro_f2_text: "równoczesnych rozmów",
    pricing_sub_pro_f3: "Utrzymanie i monitoring działania",
    pricing_sub_pro_f4: "Stały rozwój wiedzy awatara",
    pricing_sub_pro_f5: "Analiza jakości i tematyki rozmów",
    pricing_sub_pro_f6: "Priorytetowe wsparcie techniczne",
    pricing_sub_pro_f7: "Regularna optymalizacja odpowiedzi",
    pricing_sec3_title: "// 03. Wynajem i zakup hologramu",
    pricing_holo_ready_desc:
      "Dla klientów, którzy mają już gotowy film, animację lub wcześniej przygotowanego awatara.",
    pricing_holo_ready_f1: "Wynajem hologramu na jeden dzień",
    pricing_holo_ready_f2: "Sprawdzenie i dopasowanie materiału do urządzenia",
    pricing_holo_ready_f3: "Konfiguracja i uruchomienie contentu",
    pricing_holo_ready_f4: "Montaż oraz demontaż urządzenia",
    pricing_holo_ready_f5: "Podstawowe wsparcie techniczne podczas wydarzenia",
    pricing_holo_custom_desc:
      "Dla klientów, którzy potrzebują nie tylko hologramu, ale też materiału specjalnie przygotowanego na wydarzenie.",
    pricing_holo_custom_f1: "Wynajem hologramu na jeden dzień lub kilka dni",
    pricing_holo_custom_f2: "Dopasowanie contentu do urządzenia i przestrzeni",
    pricing_holo_custom_f3: "Konfiguracja oraz uruchomienie całości",
    pricing_holo_custom_f4: "Montaż i demontaż urządzenia",
    pricing_holo_custom_f5: "Wsparcie techniczne podczas wydarzenia",
    pricing_holo_buy_price: "Wycena indywidualna",
    pricing_holo_buy_desc:
      "Dla firm, które chcą na stałe korzystać z hologramu w recepcji, showroomie, punkcie sprzedaży lub podczas własnych wydarzeń.",
    pricing_holo_buy_f1: "Dobór urządzenia do przestrzeni i zastosowania",
    pricing_holo_buy_f2: "Przygotowanie pierwszego materiału startowego",
    pricing_holo_buy_f3: "Konfiguracja i uruchomienie contentu",
    pricing_holo_buy_f4: "Dostawa oraz montaż urządzenia",
    pricing_holo_buy_f5: "Serwis, rozwój i wsparcie techniczne",
    pricing_holo_buy_f6:
      "Integracja z awatarem AI, stroną internetową lub systemami firmy",
    pricing_holo_buy_f7: "Szkolenie z obsługi i zarządzania contentem",
    pricing_cta_title: "Potrzebujesz czegoś unikalnego?",
    pricing_cta_desc:
      "Opisz nam czego potrzebujesz, a nasz dział R&D przygotuje darmową specyfikację techniczną i kosztorys rozwiązania szytego na miarę.",
    pricing_cta_btn: "Napisz do nas!",

    // About page
    about_badge: "> O NAS",
    about_title: "Kim jesteśmy?",
    about_lead:
      "Poznaj zespół, który przenosi prezentacje produktowe i eventy w inny wymiar.",
    about_p1:
      "NAAPP to zespół inżynierów i twórców, który od 2020 roku zamienia nowoczesne technologie w konkretne rozwiązania dla biznesu. Wdrażamy je tam, gdzie mają realnie działać — na stronach internetowych, w recepcjach, na stoiskach targowych, eventach i w przestrzeniach firmowych.",
    about_p2:
      "Tworzymy interaktywne awatary AI, które reprezentują marki, rozmawiają z klientami, odpowiadają na pytania i pomagają przejść przez ofertę. Dostarczamy również hologramy na wydarzenia oraz do stałych instalacji w siedzibach firm.",
    about_p3:
      "Nie interesuje nas technologia dla samego efektu. Liczy się dla nas to, czy rozwiązanie jest dopasowane do miejsca, celu i odbiorcy. Dlatego zajmujemy się całym procesem — od pomysłu i przygotowania treści po wdrożenie, uruchomienie i sprawdzenie, że wszystko działa tak, jak powinno.",
    about_card_title: "> PARAMETRY_OPERACYJNE",
    about_l1: "[STAŻ NA RYNKU]:",
    about_v1: "od 2020r.",
    about_l2: "[OBSZAR DZIAŁANIA]:",
    about_v2: "Polska",
    about_l3: "[SEKTORY OBSŁUGIWANE]:",
    about_v3: "Biznes B2B, Edukacja, Bankowość, Instytucje",
    about_l4: "[FILARY FIRMY]:",
    about_v4: "Awatary AI, Hologramy",
    about_l5: "[FUNDAMENT MARKI]:",
    about_v5: "Działające wdrożenia, nie demonstracje",
    about_cta_title: "Chcesz dowiedzieć się, jak możemy odmienić Twój projekt?",
    about_cta_desc: "Skontaktuj się z nami",
    about_cta_btn: "Napisz do nas",

    // Contact page
    contact_badge: "> KONTAKT",
    contact_title: "Napisz do nas",
    contact_lead:
      "Postaramy się odpowiedzieć najszybciej jak to tylko możliwe.",
    contact_lbl_name: "Jak masz na imie?",
    contact_lbl_email: "Adres skrzynki pocztowej do kontaktu z Tobą?",
    contact_lbl_phone:
      "Opcjonalnie: Pod jakim numerem możemy się do Ciebie dodzwonić?",
    contact_lbl_msg: "W czym możemy Ci pomóc?",
    contact_ph_name: "np. Agnieszka",
    contact_ph_email: "np. jankowalski@gmail.com",
    contact_ph_phone: "np. 123456789",
    contact_ph_msg: "Treść wiadomości...",
    contact_btn_send: "Wyślij wiadomość",
    contact_other_title: "Inne sposoby kontaktu",
    contact_other_desc:
      "Możesz też przesłać do nas korespondencję mailowo na adres",
    contact_fb_btn: "Napisz do nas na Facebooku",

    // Legal & Error
    legal_badge: "> DOKUMENTY PRAWNE",
    privacy_title: "Polityka Prywatności",
    terms_title: "Regulamin świadczenia usług",
    legal_info_title: "> INFORMACJA",
    legal_status_label: "[STATUS]:",
    legal_status_val: "Dokument w przygotowaniu",
    legal_entity_label: "[PODMIOT]:",
    legal_contact_label: "[KONTAKT]:",
    privacy_text:
      "Pełna treść polityki prywatności zostanie opublikowana wkrótce. Dane osobowe podane w formularzu kontaktowym wykorzystywane są wyłącznie w celu odpowiedzi na zapytanie i nie są udostępniane podmiotom trzecim.",
    terms_text:
      "Pełna treść regulaminu zostanie opublikowana wkrótce. W sprawach dotyczących warunków świadczenia usług prosimy o kontakt mailowy.",
    privacy_cta_title: "Masz pytania dotyczące danych osobowych?",
    terms_cta_title: "Masz pytania?",
    legal_cta_desc: "Skontaktuj się z nami bezpośrednio.",
    error_title: "Błąd 404",
    error_desc:
      "Przeszukiwaliśmy nasze serwery danych, ale nie udało nam się znaleźć strony, której szukasz...",
    error_link: "Wróć się na stronę główną.",

    // Form validation & status messages
    contact_msg_sending: "Wysyłanie wiadomości...",
    contact_msg_success: "Dziękujemy! Twoja wiadomość została wysłana.",
    contact_msg_error:
      "Wystąpił błąd podczas wysyłania wiadomości. Spróbuj ponownie.",
    contact_err_form: "Formularz zawiera błędy. Popraw zaznaczone pola.",
    contact_err_name: "Poznajmy się! Jak możemy się do Ciebie zwracać?",
    contact_err_email: "Wprowadź poprawny adres e-mail (np. jan@kowalski.pl).",
    contact_err_phone:
      "Wprowadź poprawny numer telefonu (dokładnie 9 cyfr lub format międzynarodowy).",
    contact_err_msg: "Co chciałbyś nam przekazać?",

    // Tooltips & Accessibility
    tooltip_lang: "Wybierz język",
    tooltip_lang_pl: "Polski",
    tooltip_lang_en: "English",
    tooltip_lang_es: "Español",
    tooltip_lang_uk: "Українська",
    tooltip_theme: "Przełącz motyw (jasny/ciemny)",
    tooltip_refresh_anim: "Odtwórz animację od nowa",
    tooltip_mute_sound: "Włącz / wycisz dźwięk",
    tooltip_sound_on: "Włącz dźwięk",
    tooltip_sound_off: "Wycisz dźwięk",
    nav_menu_toggle: "Otwórz / zamknij menu nawigacji",
    contact_title_name: "Twoje imię np. Agnieszka",
    contact_title_email: "Email kontaktowy np. jankowalski@gmail.com",
    contact_title_phone: "Numer telefonu (dokładnie 9 cyfr)",
    contact_title_msg: "Treść wiadomości do zespołu NAAPP",
  },

  en: {
    // Navigation & Footer
    nav_start: "Home",
    nav_avatars: "Avatars",
    nav_holograms: "Holograms",
    nav_pricing: "Pricing",
    nav_about: "About Us",
    nav_contact: "Contact",
    footer_tagline:
      "We bring company presentations to life, building customer engagement and emotions.",
    footer_copy: "© 2026 NAAPP New Advance Applications Paweł Nowaczek.",
    footer_terms: "Terms & Conditions",
    footer_privacy: "Privacy Policy",

    // Cookie banner
    cookie_text:
      'This site loads external resources (CDN) and processes data submitted through the contact form. We use this data solely to handle inquiries and prevent spam. Learn more in our <a href="#" class="cookie-policy-link" data-page="polityka.html">Privacy Policy</a>.',
    cookie_decline: "Decline",
    cookie_accept: "Understand",

    // Home
    home_badge: "> AVATARS & HOLOGRAMS OF THE FUTURE",
    home_title: "Modern event solutions powered by AI.",
    home_lead:
      "Interactive AI avatars and holographic devices for businesses, events, and showrooms. Working implementations, not demos.",
    home_btn_avatars: "AI Avatars",
    home_btn_holograms: "Holograms",
    home_status_label: "STATUS:",
    home_status_init: "Initializing...",
    home_questions_label: "Sample questions:",
    home_presentations_label: "Sample presentations:",

    // Avatars page
    avatars_badge: "> DIGITAL ASSISTANTS",
    avatars_title: "Next-generation Interactive AI Avatars",
    avatars_lead:
      "Reduce costs and boost sales with interactive avatars on your website and digital screens.",
    avatars_p1:
      "We create AI Avatars tailored to the real needs of your business. No templates or off-the-shelf solutions. Every deployment is designed customly. We start by thoroughly understanding your company, processes, and clients. The result is a solution that fits your organization, supports daily work, and speaks your industry language.",
    avatars_p2:
      "Our process always begins with a detailed assessment of your company's actual needs. We analyze operational workflows through the lens of your industry, ensuring the AI perfectly fits your organizational structure and speaks your clients' language.",
    avatars_approach_title: "OUR APPROACH TO CREATING AVATARS",
    avatars_app1_title: "Unique persona:",
    avatars_app1_desc:
      "We design the appearance, voice, and communication style tailored to your brand.",
    avatars_app2_title: "Role-tailored knowledge:",
    avatars_app2_desc:
      "We equip the avatar with the information required to answer customers, present offers, or support staff.",
    avatars_app3_title: "Natural communication:",
    avatars_app3_desc:
      "We ensure the avatar speaks your industry language, understands context, and acts according to its role.",
    avatars_spec_badge: "> SYSTEM SPECIFICATION",
    avatars_spec_title: "Key capabilities of our AI Agents",
    avatars_c1_title: "Avatar that helps choose",
    avatars_c1_desc:
      "Conducts natural conversations, discovers client needs, and recommends the best-suited product, service, or offer variant.",
    avatars_c2_title: "Your company knowledge",
    avatars_c2_desc:
      "Enables users to self-schedule meetings, sales demos, or service appointments in real-time via direct CRM integration.",
    avatars_c3_title: "Customer-tailored conversation",
    avatars_c3_desc:
      "The avatar recognizes tone and responds accordingly. It can calm a frustrated client, adjust style, or escalate to staff.",
    avatars_c4_title: "Booking visits & meetings",
    avatars_c4_desc:
      "The avatar checks calendar availability and immediately books a visit, consultation, demo, or maintenance slot.",
    avatars_c5_title: "Integration with your systems",
    avatars_c5_desc:
      "We integrate the avatar with CRM, ERP, calendars, inventory, WhatsApp, and other tools. It not only answers questions but executes actions.",
    avatars_cta_title: "Boost your business efficiency",
    avatars_cta_desc:
      "Let's analyze your company processes together and build an AI Agent perfectly aligned with your goals.",
    avatars_cta_btn: "Contact us",

    // Holograms page
    holograms_badge: "> HOLOGRAPHIC DEVICES",
    holograms_title: "Holograms that transform spaces",
    holograms_lead:
      "We supply modern holographic equipment for events, showrooms, receptions, and retail spots, creating 3D character or object projections.",
    holograms_p1:
      "Our holographic systems display virtually any content: 3D characters, AI avatars, videos, animations, product presentations, live streams, and web pages. Audio integration lets the hologram talk, present, and guide users through scenarios.",
    holograms_p2:
      "Devices operate automatically or respond to audiences via touch, voice, or motion sensors. Remote management lets you schedule emissions, update content, and control hardware centrally.",
    holograms_spec_title: "TECHNOLOGICAL SPECIFICATION",
    holograms_s1_t: "Displayed content:",
    holograms_s1_d:
      "AI avatars, 3D characters, videos, animations, presentations, live streams, and websites",
    holograms_s2_t: "Sound:",
    holograms_s2_d:
      "built-in or external sound system, avatar speech, music, and sound effects",
    holograms_s3_t: "Management:",
    holograms_s3_d:
      "remote content updates, emission scheduling, and real-time device control",
    holograms_s4_t: "Integrations:",
    holograms_s4_d:
      "websites, corporate systems, apps, APIs, CRMs, and AI solutions",
    holograms_adv_badge: "> TECHNOLOGICAL ADVANTAGES",
    holograms_adv_title: "What sets our 3D projection systems apart?",
    holograms_c1_title: "Hologram rental for events",
    holograms_c1_desc:
      "High-density LEDs and superior luminance ensure full clarity, deep contrast, and vibrant colors even in brightly lit expo halls.",
    holograms_c1_tag: "EVENTS & EXPOS",
    holograms_c2_title: "Custom content for holograms",
    holograms_c2_desc:
      "We create videos, 3D animations, characters, and presentations tailored to the hardware, space, and event theme.",
    holograms_c2_tag: "CONTENT & ANIMATION",
    holograms_c3_title: "Interactive AI Hologram",
    holograms_c3_desc:
      "We combine AI avatars with holograms, creating a persona that speaks, answers questions, and converses in real time.",
    holograms_c3_tag: "AI HOLOGRAM",
    holograms_cta_title: "Want to see a live demonstration?",
    holograms_cta_desc:
      "Visit our showroom or request an on-site technology demonstration directly at your office.",
    holograms_cta_btn: "Contact us",

    // Pricing page
    pricing_badge: "> PRICING",
    pricing_main_title: "Transparent packages",
    pricing_subtitle:
      "Choose a collaboration model tailored to the scale of your event or business needs.",
    pricing_tab_avatars: "Interactive AI Avatars",
    pricing_tab_holograms: "Hologram Rental & Purchase",
    pricing_sec1_title: "// 01. Avatar implementation packages",
    pricing_netto: "net",
    pricing_netto_msc: "net / month",
    pricing_netto_day: "net / day",
    pricing_select_pkg: "Select package",
    pricing_select_plan: "Select plan",
    pricing_book_date: "Book a date",
    pricing_ask_quote: "Request a quote",
    pricing_consult_proj: "Consult project",
    pricing_most_popular: "Most popular",
    pricing_avatar_std_desc:
      "Ready-to-use website AI avatar created from a photo and basic company details.",
    pricing_avatar_std_f1: "Avatar creation based on a photo",
    pricing_avatar_std_f2: "Custom appearance, voice, and speaking style",
    pricing_avatar_std_f3: "Basic knowledge about company, offer, or service",
    pricing_avatar_std_f4: "Simple single-conversation scenario",
    pricing_avatar_std_f5: "Embedding on one website",
    pricing_avatar_std_f6: "Configuration, setup, and testing",
    pricing_avatar_biz_desc:
      "Personalized avatar based on video recording of a real person, trained for a specific business role.",
    pricing_avatar_biz_f1: "Avatar creation based on video recording",
    pricing_avatar_biz_f2: "Voice, personality, and tone matching",
    pricing_avatar_biz_f3: "Extensive knowledge from company documents",
    pricing_avatar_biz_f4: "Scenarios for frequent dialogue flows",
    pricing_avatar_biz_f5: "Website integration",
    pricing_avatar_biz_f6: "Configuration, launch, and testing",
    pricing_avatar_biz_f7: "Training avatar for a specific business role",
    pricing_avatar_prem_price: "from 11 900 PLN",
    pricing_avatar_prem_desc:
      "Advanced AI avatar integrated with your business workflows and software systems to take automated actions.",
    pricing_avatar_prem_f1: "Personalized video-based avatar",
    pricing_avatar_prem_f2: "Custom voice, personality, and role behavior",
    pricing_avatar_prem_f3: "Deep knowledge base mapped to company workflows",
    pricing_avatar_prem_f4:
      "Custom dialogue scenarios and customer service flows",
    pricing_avatar_prem_f5: "Client website deployment",
    pricing_avatar_prem_f6: "Testing, optimization, and launch support",
    pricing_avatar_prem_f7: "Integration with forms, calendar, CRM, or API",
    pricing_avatar_prem_f8: "Execution of one custom business function",
    pricing_sec2_title: "// 02. Monthly conversation subscription packages",
    pricing_sec2_notice:
      "Choose a package matching your conversation volume and desired support level.",
    pricing_sub_std_desc:
      "For companies launching an avatar with lower website traffic.",
    pricing_sub_std_f1_strong: "90 minutes ",
    pricing_sub_std_f1_text: "of avatar conversations",
    pricing_sub_std_f2_strong: "Up to 10 ",
    pricing_sub_std_f2_text: "concurrent chats",
    pricing_sub_std_f3: "Maintenance and health monitoring",
    pricing_sub_std_f4: "Basic knowledge updates",
    pricing_sub_std_f5: "Monthly usage report",
    pricing_sub_std_f6: "Standard technical support",
    pricing_sub_biz_desc:
      "For companies actively using avatars in sales, support, or offer presentations.",
    pricing_sub_biz_f1_strong: "200 minutes ",
    pricing_sub_biz_f1_text: "of avatar conversations",
    pricing_sub_biz_f2_strong: "Up to 15 ",
    pricing_sub_biz_f2_text: "concurrent chats",
    pricing_sub_biz_f3: "Maintenance and system monitoring",
    pricing_sub_biz_f4: "Regular knowledge base updates",
    pricing_sub_biz_f5: "Analysis of top customer questions",
    pricing_sub_biz_f6: "Extended technical support",
    pricing_sub_biz_f7: "Optimization of responses and conversation flows",
    pricing_sub_pro_desc:
      "For high-volume avatar users looking to continuously enhance capabilities.",
    pricing_sub_pro_f1_strong: "400 minutes ",
    pricing_sub_pro_f1_text: "of avatar conversations",
    pricing_sub_pro_f2_strong: "Up to 15 ",
    pricing_sub_pro_f2_text: "concurrent chats",
    pricing_sub_pro_f3: "Maintenance and monitoring",
    pricing_sub_pro_f4: "Continuous avatar knowledge development",
    pricing_sub_pro_f5: "Conversation quality and topic analytics",
    pricing_sub_pro_f6: "Priority technical support",
    pricing_sub_pro_f7: "Regular response optimization",
    pricing_sec3_title: "// 03. Hologram rental & purchase",
    pricing_holo_ready_desc:
      "For clients with pre-existing video, animation, or avatar assets.",
    pricing_holo_ready_f1: "One-day hologram rental",
    pricing_holo_ready_f2:
      "Content review and hardware compatibility formatting",
    pricing_holo_ready_f3: "Content configuration and launch",
    pricing_holo_ready_f4: "Equipment setup and dismantling",
    pricing_holo_ready_f5: "Basic event technical support",
    pricing_holo_custom_desc:
      "For clients needing both holographic hardware and event-tailored 3D content.",
    pricing_holo_custom_f1: "Single or multi-day hologram rental",
    pricing_holo_custom_f2: "Tailoring content to hardware and venue",
    pricing_holo_custom_f3: "Full configuration and commissioning",
    pricing_holo_custom_f4: "Setup and dismantling",
    pricing_holo_custom_f5: "On-site event technical support",
    pricing_holo_buy_price: "Custom quote",
    pricing_holo_buy_desc:
      "For permanent installations in receptions, showrooms, POS, or corporate events.",
    pricing_holo_buy_f1: "Selecting the right device for space and use case",
    pricing_holo_buy_f2: "Initial launch content creation",
    pricing_holo_buy_f3: "Configuration and content deployment",
    pricing_holo_buy_f4: "Delivery and installation",
    pricing_holo_buy_f5: "Service, maintenance, and technical updates",
    pricing_holo_buy_f6:
      "Integration with AI avatar, website, or company systems",
    pricing_holo_buy_f7: "Staff training on content management",
    pricing_cta_title: "Need something custom?",
    pricing_cta_desc:
      "Describe your vision and our R&D team will prepare a free technical spec and quote for a tailored solution.",
    pricing_cta_btn: "Contact us!",

    // About page
    about_badge: "> ABOUT US",
    about_title: "Who we are",
    about_lead:
      "Meet the team taking product presentations and events to a new dimension.",
    about_p1:
      "NAAPP is a team of engineers and creators turning modern technologies into tangible business solutions since 2020. We deploy them where they work in the real world: on websites, receptions, expo booths, and corporate spaces.",
    about_p2:
      "We build interactive AI avatars representing brands, engaging customers, answering queries, and presenting products. We also deliver holograms for events and fixed installations.",
    about_p3:
      "We focus on real utility rather than tech gimmicks. We manage the entire lifecycle: concept, content, deployment, and testing.",
    about_card_title: "> OPERATIONAL_PARAMETERS",
    about_l1: "[MARKET EXPERIENCE]:",
    about_v1: "since 2020",
    about_l2: "[OPERATIONAL REGION]:",
    about_v2: "Poland / EU",
    about_l3: "[SERVED SECTORS]:",
    about_v3: "B2B Business, Education, Banking, Institutions",
    about_l4: "[CORE PILLARS]:",
    about_v4: "AI Avatars, Holograms",
    about_l5: "[BRAND FOUNDATION]:",
    about_v5: "Working implementations, not demos",
    about_cta_title: "Want to learn how we can transform your project?",
    about_cta_desc: "Get in touch with us",
    about_cta_btn: "Contact us",

    // Contact page
    contact_badge: "> CONTACT",
    contact_title: "Get in touch",
    contact_lead: "We will respond as quickly as possible.",
    contact_lbl_name: "What is your name?",
    contact_lbl_email: "What is your contact email address?",
    contact_lbl_phone: "Optional: What phone number can we reach you at?",
    contact_lbl_msg: "How can we help you?",
    contact_ph_name: "e.g. John Smith",
    contact_ph_email: "e.g. john@example.com",
    contact_ph_phone: "e.g. +48 123456789",
    contact_ph_msg: "Describe your message...",
    contact_btn_send: "Send message",
    contact_other_title: "Other ways to contact us",
    contact_other_desc: "You can also send an email to",
    contact_fb_btn: "Message us on Facebook",

    // Legal & Error
    legal_badge: "> LEGAL DOCUMENTS",
    privacy_title: "Privacy Policy",
    terms_title: "Terms of Service",
    legal_info_title: "> INFORMATION",
    legal_status_label: "[STATUS]:",
    legal_status_val: "Document in preparation",
    legal_entity_label: "[ENTITY]:",
    legal_contact_label: "[CONTACT]:",
    privacy_text:
      "The full Privacy Policy will be published soon. Personal data provided in the contact form is used solely to answer your inquiry and is not shared with third parties.",
    terms_text:
      "Full Terms of Service will be published soon. For service condition inquiries, please contact us by email.",
    privacy_cta_title: "Questions about personal data?",
    terms_cta_title: "Have questions?",
    legal_cta_desc: "Contact us directly.",
    error_title: "Error 404",
    error_desc:
      "We searched our servers, but couldn't find the page you are looking for...",
    error_link: "Return to homepage.",

    // Form validation & status messages
    contact_msg_sending: "Sending message...",
    contact_msg_success: "Thank you! Your message has been sent.",
    contact_msg_error:
      "An error occurred while sending the message. Please try again.",
    contact_err_form:
      "The form contains errors. Please correct the highlighted fields.",
    contact_err_name:
      "Let's get to know each other! How should we address you?",
    contact_err_email:
      "Please enter a valid e-mail address (e.g. john@gmail.com).",
    contact_err_phone:
      "Please enter a valid phone number (9 digits or international format).",
    contact_err_msg: "What would you like to share with us?",

    // Tooltips & Accessibility
    tooltip_lang: "Select language",
    tooltip_lang_pl: "Polski",
    tooltip_lang_en: "English",
    tooltip_lang_es: "Español",
    tooltip_lang_uk: "Українська",
    tooltip_theme: "Toggle theme (light/dark)",
    tooltip_refresh_anim: "Restart animation sequence",
    tooltip_mute_sound: "Toggle sound on / off",
    tooltip_sound_on: "Turn sound on",
    tooltip_sound_off: "Mute sound",
    nav_menu_toggle: "Open / close navigation menu",
    contact_title_name: "Your name e.g. Alice",
    contact_title_email: "Contact email e.g. john@gmail.com",
    contact_title_phone: "Phone number (exactly 9 digits)",
    contact_title_msg: "Message content for NAAPP team",
  },

  es: {
    // Navigation & Footer
    nav_start: "Inicio",
    nav_avatars: "Avatares",
    nav_holograms: "Hologramas",
    nav_pricing: "Precios",
    nav_about: "Nosotros",
    nav_contact: "Contacto",
    footer_tagline:
      "Damos vida a las presentaciones de cualquier empresa, creando compromiso y emociones en los clientes.",
    footer_copy: "© 2026 NAAPP New Advance Applications Paweł Nowaczek.",
    footer_terms: "Términos y Condiciones",
    footer_privacy: "Política de Privacidad",

    // Cookie banner
    cookie_text:
      'Este sitio carga recursos externos (CDN) y procesa datos enviados a través del formulario de contacto. Usamos estos datos únicamente para responder consultas y prevenir spam. Más información en la <a href="#" class="cookie-policy-link" data-page="polityka.html">Política de Privacidad</a>.',
    cookie_decline: "Rechazar",
    cookie_accept: "Entendido",

    // Home
    home_badge: "> AVATARES Y HOLOGRAMAS DEL FUTURO",
    home_title: "Soluciones modernas para eventos impulsadas por IA.",
    home_lead:
      "Avatares de IA interactivos y dispositivos holográficos para empresas, eventos y showrooms. Implementaciones reales, no demostraciones.",
    home_btn_avatars: "Avatares de IA",
    home_btn_holograms: "Hologramas",
    home_status_label: "ESTADO:",
    home_status_init: "Inicializando...",
    home_questions_label: "Preguntas de ejemplo:",
    home_presentations_label: "Presentaciones de ejemplo:",

    // Avatars page
    avatars_badge: "> ASISTENTES DIGITALES",
    avatars_title: "Avatares interactivos de IA de última generación",
    avatars_lead:
      "Reduce costes y aumenta ventas con avatares interactivos en tu sitio web y pantallas.",
    avatars_p1:
      "Creamos Avatares de IA adaptados a las necesidades reales de tu negocio. Sin plantillas ni soluciones genéricas. Diseñamos cada implementación a medida a partir de un profundo conocimiento de tu empresa, sus procesos y sus clientes.",
    avatars_p2:
      "Siempre comenzamos con un estudio detallado de las necesidades de tu empresa. Analizamos cada flujo operativo desde la perspectiva de tu sector para garantizar que la IA se integre perfectamente.",
    avatars_approach_title: "NUESTRO ENFOQUE EN LA CREACIÓN DE AVATARES",
    avatars_app1_title: "Persona única:",
    avatars_app1_desc:
      "Diseñamos la apariencia, la voz y el estilo de comunicación adaptados a tu marca.",
    avatars_app2_title: "Conocimiento adaptado al rol:",
    avatars_app2_desc:
      "Equipamos al avatar con la información necesaria para responder clientes, presentar ofertas o apoyar al personal.",
    avatars_app3_title: "Comunicación natural:",
    avatars_app3_desc:
      "Nos aseguramos de que el avatar hable el lenguaje de tu industria y entienda el contexto.",
    avatars_spec_badge: "> ESPECIFICACIÓN DEL SISTEMA",
    avatars_spec_title: "Capacidades destacadas de nuestros Agentes de IA",
    avatars_c1_title: "Avatar que ayuda a elegir",
    avatars_c1_desc:
      "Mantiene conversaciones naturales, descubre necesidades y recomienda el producto o servicio ideal.",
    avatars_c2_title: "Conocimiento de tu empresa",
    avatars_c2_desc:
      "Permite a los usuarios agendar reuniones o presentaciones en tiempo real mediante integración con CRM.",
    avatars_c3_title: "Conversación adaptada al cliente",
    avatars_c3_desc:
      "El avatar reconoce el tono y reacciona de forma adecuada. Puede calmar a un cliente o derivarlo a un agente.",
    avatars_c4_title: "Programación de citas y reuniones",
    avatars_c4_desc:
      "Verifica disponibilidad en el calendario y reserva inmediatamente una cita o demostración.",
    avatars_c5_title: "Conexión con tus sistemas",
    avatars_c5_desc:
      "Integramos el avatar con CRM, ERP, calendarios, inventario, WhatsApp y otras herramientas.",
    avatars_cta_title: "Aumenta la eficiencia de tu negocio",
    avatars_cta_desc:
      "Analicemos juntos los procesos de tu empresa y creemos un Agente de IA adaptado a tus objetivos.",
    avatars_cta_btn: "Escríbenos",

    // Holograms page
    holograms_badge: "> DISPOSITIVOS HOLOGRÁFICOS",
    holograms_title: "Hologramas que transforman el espacio",
    holograms_lead:
      "Suministramos equipos holográficos modernos para eventos, showrooms, recepciones y puntos de venta. Crean proyecciones 3D impactantes.",
    holograms_p1:
      "Nuestros sistemas holográficos permiten mostrar casi cualquier contenido: personajes 3D, avatares IA, vídeos, animaciones, presentaciones y transmisiones en vivo con sonido integrado.",
    holograms_p2:
      "Los dispositivos funcionan automáticamente o responden al público mediante sensores táctiles, de voz o movimiento, con gestión remota centralizada.",
    holograms_spec_title: "ESPECIFICACIÓN TECNOLÓGICA",
    holograms_s1_t: "Contenido mostrado:",
    holograms_s1_d:
      "avatares IA, personajes 3D, vídeos, animaciones, presentaciones, transmisiones en directo y webs",
    holograms_s2_t: "Sonido:",
    holograms_s2_d:
      "sistema de sonido integrado o externo, voz de avatar, música y efectos sonoros",
    holograms_s3_t: "Gestión:",
    holograms_s3_d:
      "actualización remota de contenidos, programación de emisiones y control en tiempo real",
    holograms_s4_t: "Integraciones:",
    holograms_s4_d:
      "sitios web, sistemas corporativos, aplicaciones, API, CRM y soluciones basadas en IA",
    holograms_adv_badge: "> VENTAJAS TECNOLÓGICAS",
    holograms_adv_title: "¿Qué destaca nuestros sistemas de proyección 3D?",
    holograms_c1_title: "Alquiler de hologramas para eventos",
    holograms_c1_desc:
      "Los LED de alta densidad y luminancia garantizan nitidez, alto contraste y colores vivos incluso en pabellones feriales muy iluminados.",
    holograms_c1_tag: "EVENTOS Y FERIAS",
    holograms_c2_title: "Contenido diseñado para hologramas",
    holograms_c2_desc:
      "Creamos vídeos, animaciones 3D, personajes y presentaciones adaptados al equipo, espacio y tipo de evento.",
    holograms_c2_tag: "CONTENIDO Y ANIMACIÓN",
    holograms_c3_title: "Holograma interactivo con IA",
    holograms_c3_desc:
      "Combinamos avatares de IA con hologramas para crear personajes que hablan y responden preguntas en tiempo real.",
    holograms_c3_tag: "HOLOGRAMA IA",
    holograms_cta_title: "¿Quieres ver una demostración en vivo?",
    holograms_cta_desc:
      "Visita nuestro showroom o solicita una demostración directamente en tu oficina.",
    holograms_cta_btn: "Escríbenos",

    // Pricing page
    pricing_badge: "> TARIFAS",
    pricing_main_title: "Paquetes transparentes",
    pricing_subtitle:
      "Elige el modelo de colaboración que mejor se adapte a tu evento o necesidades de negocio.",
    pricing_tab_avatars: "Avatares de IA interactivos",
    pricing_tab_holograms: "Alquiler y Compra de Hologramas",
    pricing_sec1_title: "// 01. Paquetes de implementación de avatares",
    pricing_netto: "neto",
    pricing_netto_msc: "neto / mes",
    pricing_netto_day: "neto / día",
    pricing_select_pkg: "Elegir paquete",
    pricing_select_plan: "Elegir plan",
    pricing_book_date: "Reservar fecha",
    pricing_ask_quote: "Solicitar presupuesto",
    pricing_consult_proj: "Consultar proyecto",
    pricing_most_popular: "Más popular",
    pricing_avatar_std_desc:
      "Avatar listo para web creado a partir de una foto e información básica de tu empresa.",
    pricing_avatar_std_f1: "Creación de avatar basada en foto",
    pricing_avatar_std_f2: "Adaptación de imagen, voz y estilo de habla",
    pricing_avatar_std_f3: "Conocimiento básico sobre la empresa y oferta",
    pricing_avatar_std_f4: "Escenario sencillo de una conversación",
    pricing_avatar_std_f5: "Integración en un sitio web",
    pricing_avatar_std_f6: "Configuración, puesta en marcha y pruebas",
    pricing_avatar_biz_desc:
      "Avatar personalizado basado en grabación de vídeo para un rol de negocio específico.",
    pricing_avatar_biz_f1: "Creación de avatar basada en vídeo",
    pricing_avatar_biz_f2: "Voz, personalidad y tono adaptados",
    pricing_avatar_biz_f3:
      "Conocimiento amplio basado en documentos de la empresa",
    pricing_avatar_biz_f4: "Escenarios para conversaciones frecuentes",
    pricing_avatar_biz_f5: "Integración en sitio web",
    pricing_avatar_biz_f6: "Configuración, lanzamiento y pruebas",
    pricing_avatar_biz_f7: "Capacitación del avatar para un rol específico",
    pricing_avatar_prem_price: "desde 11 900 PLN",
    pricing_avatar_prem_desc:
      "Avatar de IA avanzado integrado con los sistemas de tu empresa para realizar acciones automáticas.",
    pricing_avatar_prem_f1: "Avatar personalizado en vídeo",
    pricing_avatar_prem_f2: "Adaptación total de voz y comportamiento",
    pricing_avatar_prem_f3: "Conocimiento profundo adaptado a procesos",
    pricing_avatar_prem_f4: "Escenarios personalizados de atención al cliente",
    pricing_avatar_prem_f5: "Despliegue en sitio del cliente",
    pricing_avatar_prem_f6: "Pruebas, optimización y soporte",
    pricing_avatar_prem_f7:
      "Integración con formularios, calendarios, CRM o API",
    pricing_avatar_prem_f8: "Ejecución de una función de negocio acordada",
    pricing_sec2_title: "// 02. Paquetes mensuales de conversación",
    pricing_sec2_notice:
      "Selecciona el paquete adecuado para tu volumen de conversaciones y soporte.",
    pricing_sub_std_desc:
      "Para empresas que lanzan un avatar con menor tráfico web.",
    pricing_sub_std_f1_strong: "90 minutos ",
    pricing_sub_std_f1_text: "de conversación con avatar",
    pricing_sub_std_f2_strong: "Hasta 10 ",
    pricing_sub_std_f2_text: "chats concurrentes",
    pricing_sub_std_f3: "Mantenimiento y supervisión del sistema",
    pricing_sub_std_f4: "Actualizaciones básicas de conocimiento",
    pricing_sub_std_f5: "Informe mensual de uso",
    pricing_sub_std_f6: "Soporte técnico estándar",
    pricing_sub_biz_desc:
      "Para empresas que usan el avatar activamente en ventas y atención al cliente.",
    pricing_sub_biz_f1_strong: "200 minutos ",
    pricing_sub_biz_f1_text: "de conversación con avatar",
    pricing_sub_biz_f2_strong: "Hasta 15 ",
    pricing_sub_biz_f2_text: "chats concurrentes",
    pricing_sub_biz_f3: "Mantenimiento y monitoreo del sistema",
    pricing_sub_biz_f4: "Actualizaciones periódicas de conocimiento",
    pricing_sub_biz_f5: "Análisis de las preguntas más frecuentes",
    pricing_sub_biz_f6: "Soporte técnico extendido",
    pricing_sub_biz_f7: "Optimización de respuestas y diálogos",
    pricing_sub_pro_desc:
      "Para empresas con alto volumen que buscan mejora continua.",
    pricing_sub_pro_f1_strong: "400 minutos ",
    pricing_sub_pro_f1_text: "de conversación con avatar",
    pricing_sub_pro_f2_strong: "Hasta 15 ",
    pricing_sub_pro_f2_text: "chats concurrentes",
    pricing_sub_pro_f3: "Mantenimiento y monitoreo",
    pricing_sub_pro_f4: "Desarrollo continuo de conocimientos",
    pricing_sub_pro_f5: "Análisis de calidad y temas de chat",
    pricing_sub_pro_f6: "Soporte técnico prioritario",
    pricing_sub_pro_f7: "Optimización continua de respuestas",
    pricing_sec3_title: "// 03. Alquiler y compra de hologramas",
    pricing_holo_ready_desc:
      "Para clientes que ya disponen de vídeo, animación o avatar listo.",
    pricing_holo_ready_f1: "Alquiler de holograma por 1 día",
    pricing_holo_ready_f2: "Revisión y adaptación de contenidos",
    pricing_holo_ready_f3: "Configuración y puesta en marcha de contenidos",
    pricing_holo_ready_f4: "Montaje y desmontaje del equipo",
    pricing_holo_ready_f5: "Soporte técnico básico durante el evento",
    pricing_holo_custom_desc:
      "Para clientes que requieren equipo holográfico y contenido personalizado.",
    pricing_holo_custom_f1: "Alquiler por uno o varios días",
    pricing_holo_custom_f2: "Adaptación de contenido al dispositivo y espacio",
    pricing_holo_custom_f3: "Configuración completa y pruebas",
    pricing_holo_custom_f4: "Montaje y desmontaje",
    pricing_holo_custom_f5: "Soporte técnico presencial durante el evento",
    pricing_holo_buy_price: "Presupuesto a medida",
    pricing_holo_buy_desc:
      "Para instalaciones permanentes en recepciones, showrooms o puntos de venta.",
    pricing_holo_buy_f1: "Selección de equipo según espacio y uso",
    pricing_holo_buy_f2: "Creación del primer contenido inicial",
    pricing_holo_buy_f3: "Configuración y lanzamiento de contenido",
    pricing_holo_buy_f4: "Entrega e instalación",
    pricing_holo_buy_f5: "Servicio técnico, desarrollo y mantenimiento",
    pricing_holo_buy_f6: "Integración con avatar IA, sitio web o CRM",
    pricing_holo_buy_f7: "Capacitación en gestión de contenidos",
    pricing_cta_title: "¿Necesitas algo personalizado?",
    pricing_cta_desc:
      "Cuéntanos lo que necesitas y nuestro equipo de I+D preparará una propuesta gratuita a medida.",
    pricing_cta_btn: "¡Escríbenos!",

    // About page
    about_badge: "> SOBRE NOSOTROS",
    about_title: "¿Quiénes somos?",
    about_lead:
      "Conoce al equipo que lleva las presentaciones y eventos a otra dimensión.",
    about_p1:
      "NAAPP es un equipo de ingenieros y creadores que transforma tecnología en soluciones reales para negocios desde 2020. Desplegamos soluciones donde realmente funcionan: páginas web, recepciones, ferias y espacios corporativos.",
    about_p2:
      "Creamos avatares IA interactivos para representar marcas y entregamos hologramas para eventos e instalaciones fijas.",
    about_p3:
      "Nos enfocamos en el valor real. Gestionamos todo el proceso desde el concepto hasta la puesta en marcha.",
    about_card_title: "> PARÁMETROS_OPERATIVOS",
    about_l1: "[EXPERIENCIA EN MERCADO]:",
    about_v1: "desde 2020",
    about_l2: "[ÁREA DE ACTUACIÓN]:",
    about_v2: "Polonia / UE",
    about_l3: "[SECTORES]:",
    about_v3: "Negocio B2B, Educación, Banca, Instituciones",
    about_l4: "[PILARES DE LA EMPRESA]:",
    about_v4: "Avatares de IA, Hologramas",
    about_l5: "[FUNDAMENTO DE MARCA]:",
    about_v5: "Implementaciones reales, no demos",
    about_cta_title: "¿Quieres saber cómo podemos transformar tu proyecto?",
    about_cta_desc: "Ponte en contacto con nosotros",
    about_cta_btn: "Escríbenos",

    // Contact page
    contact_badge: "> CONTACTO",
    contact_title: "Escríbenos",
    contact_lead: "Responderemos lo antes posible.",
    contact_lbl_name: "¿Cuál es tu nombre?",
    contact_lbl_email: "¿Cuál es tu correo de contacto?",
    contact_lbl_phone: "Opcional: ¿A qué número de teléfono te llamamos?",
    contact_lbl_msg: "¿En qué podemos ayudarte?",
    contact_ph_name: "ej. Juan Pérez",
    contact_ph_email: "ej. juan@ejemplo.com",
    contact_ph_phone: "ej. 600123456",
    contact_ph_msg: "Escribe tu mensaje...",
    contact_btn_send: "Enviar mensaje",
    contact_other_title: "Otras formas de contacto",
    contact_other_desc: "También puedes enviarnos un correo a",
    contact_fb_btn: "Mensaje en Facebook",

    // Legal & Error
    legal_badge: "> DOCUMENTOS LEGALES",
    privacy_title: "Política de Privacidad",
    terms_title: "Términos del Servicio",
    legal_info_title: "> INFORMACIÓN",
    legal_status_label: "[ESTADO]:",
    legal_status_val: "Documento en preparación",
    legal_entity_label: "[ENTIDAD]:",
    legal_contact_label: "[CONTACTO]:",
    privacy_text:
      "La Política de Privacidad completa se publicará pronto. Los datos se usan exclusivamente para responder a tu consulta.",
    terms_text:
      "Los Términos de Servicio completos se publicarán pronto. Para consultas, contáctanos por email.",
    privacy_cta_title: "¿Preguntas sobre datos personales?",
    terms_cta_title: "¿Tienes preguntas?",
    legal_cta_desc: "Ponte en contacto con nosotros.",
    error_title: "Error 404",
    error_desc:
      "Buscamos en nuestros servidores, pero no pudimos encontrar la página...",
    error_link: "Volver a la página principal.",

    // Form validation & status messages
    contact_msg_sending: "Enviando mensaje...",
    contact_msg_success: "¡Gracias! Tu mensaje ha sido enviado.",
    contact_msg_error:
      "Ocurrió un error al enviar el mensaje. Inténtalo de nuevo.",
    contact_err_form:
      "El formulario contiene errores. Corrige los campos marcados.",
    contact_err_name: "¡Conozcámonos! ¿Cómo debemos dirigirnos a ti?",
    contact_err_email:
      "Introduce una dirección de correo válida (ej. juan@gmail.com).",
    contact_err_phone:
      "Introduce un número de teléfono válido (9 dígitos o formato internacional).",
    contact_err_msg: "¿Qué te gustaría decirnos?",

    // Tooltips & Accessibility
    tooltip_lang: "Seleccionar idioma",
    tooltip_lang_pl: "Polski",
    tooltip_lang_en: "English",
    tooltip_lang_es: "Español",
    tooltip_lang_uk: "Українська",
    tooltip_theme: "Cambiar tema (claro/oscuro)",
    tooltip_refresh_anim: "Reiniciar secuencia de animación",
    tooltip_mute_sound: "Activar / silenciar sonido",
    tooltip_sound_on: "Activar sonido",
    tooltip_sound_off: "Silenciar sonido",
    nav_menu_toggle: "Abrir / cerrar menú de navegación",
    contact_title_name: "Tu nombre ej. María",
    contact_title_email: "Correo de contacto ej. juan@gmail.com",
    contact_title_phone: "Número de teléfono (exactamente 9 dígitos)",
    contact_title_msg: "Contenido del mensaje para el equipo NAAPP",
  },

  uk: {
    // Navigation & Footer
    nav_start: "Головна",
    nav_avatars: "Аватари",
    nav_holograms: "Голограми",
    nav_pricing: "Ціни",
    nav_about: "Про нас",
    nav_contact: "Контакти",
    footer_tagline:
      "Ми оживляємо презентації кожної компанії, створюючи залученість та емоції клієнтів.",
    footer_copy: "© 2026 NAAPP New Advance Applications Paweł Nowaczek.",
    footer_terms: "Умови використання",
    footer_privacy: "Політика конфіденційності",

    // Cookie banner
    cookie_text:
      'Цей сайт завантажує зовнішні ресурси (CDN) та обробляє дані, надіслані через контактну форму. Ми використовуємо ці дані виключно для обробки запитів та запобігання спаму. Детальніше у <a href="#" class="cookie-policy-link" data-page="polityka.html">Політиці конфіденційності</a>.',
    cookie_decline: "Відхилити",
    cookie_accept: "Зрозуміло",

    // Home
    home_badge: "> АВАТАРИ ТА ГОЛОГРАМИ МАЙБУТНЬОГО",
    home_title: "Сучасні івент-рішення на базі ШІ.",
    home_lead:
      "Інтерактивні ШІ-аватари та голографічні пристрої для бізнесу, заходів та шоурумів. Реальні впровадження, а не демонстрації.",
    home_btn_avatars: "ШІ-Аватари",
    home_btn_holograms: "Голограми",
    home_status_label: "СТАТУС:",
    home_status_init: "Ініціалізація...",
    home_questions_label: "Приклади запитань:",
    home_presentations_label: "Приклади презентацій:",

    // Avatars page
    avatars_badge: "> ЦИФРОВІ АСИСТЕНТИ",
    avatars_title: "Інтерактивні ШІ-аватари нового покоління",
    avatars_lead:
      "Знижуйте витрати та збільшуйте продажі завдяки інтерактивним аватарам на сайті та екранах.",
    avatars_p1:
      "Ми створюємо ШІ-аватарів, адаптованих до реальних потреб вашого бізнесу. Без готових шаблонів та коробочних рішень. Кожне впровадження проектується індивідуально. Ми починаємо з детального вивчення вашої компанії, її процесів та клієнтів.",
    avatars_p2:
      "Наш процес завжди починається з ретельного дослідження реальних потреб вашої компанії. Ми аналізуємо операційні процеси крізь призму специфіки вашої галузі, завдяки чому штучний інтелект ідеально вписується в структуру вашої організації.",
    avatars_approach_title: "НАШ ПІДХІД ДО СТВОРЕННЯ АВАТАРІВ",
    avatars_app1_title: "Унікальна персона:",
    avatars_app1_desc:
      "Створюємо зовнішність, голос та стиль спілкування, адаптовані до вашого бренду.",
    avatars_app2_title: "Знання під конкретну роль:",
    avatars_app2_desc:
      "Наповнюємо аватара інформацією, необхідною для відповідей клієнтам, презентації пропозицій або підтримки працівників.",
    avatars_app3_title: "Природна комунікація:",
    avatars_app3_desc:
      "Ми дбаємо про те, щоб аватар розмовляв мовою вашої галузі, розумів контекст та поводився відповідно до своєї ролі.",
    avatars_spec_badge: "> СПЕЦИФІКАЦІЯ СИСТЕМИ",
    avatars_spec_title: "Ключові можливості наших ШІ-агентів",
    avatars_c1_title: "Аватар, який допомагає обрати",
    avatars_c1_desc:
      "Веде природну розмову, дізнається про потреби клієнта та пропонує найбільш відповідний продукт, послугу чи варіант.",
    avatars_c2_title: "База знань вашої компанії",
    avatars_c2_desc:
      "Дозволяє користувачам самостійно призначати зустрічі, презентації чи сервіс у реальному часі завдяки інтеграції з CRM.",
    avatars_c3_title: "Діалог, адаптований під клієнта",
    avatars_c3_desc:
      "Аватар розпізнає тон розмови та відповідно реагує. Він може заспокоїти клієнта, змінити стиль або передати справу менеджеру.",
    avatars_c4_title: "Запис на візити та зустрічі",
    avatars_c4_desc:
      "Аватар може перевірити вільні дати та одразу записати на візит, консультацію, презентацію чи сервіс.",
    avatars_c5_title: "Інтеграція з вашими системами",
    avatars_c5_desc:
      "Інтегруємо аватара з CRM, ERP, календарем, складом, WhatsApp та іншими інструментами для виконання конкретних дій.",
    avatars_cta_title: "Підвищуйте ефективність вашого бізнесу",
    avatars_cta_desc:
      "Проаналізуємо разом процеси вашої компанії та створимо ШІ-агента, що ідеально відповідає вашим цілям.",
    avatars_cta_btn: "Напишіть нам",

    // Holograms page
    holograms_badge: "> ГОЛОГРАФІЧНІ ПРИСТРОЇ",
    holograms_title: "Голограми, що змінюють простір",
    holograms_lead:
      "Ми постачаємо сучасні голографічні пристрої для заходів, шоурумів, рецепцій та точок продажу. Вони створюють ефект 3D-фігури.",
    holograms_p1:
      "Наші голографічні системи дозволяють відображати практично будь-який контент: 3D-персонажів, ШІ-аватарів, відео, анімації, презентації продуктів та трансляції з аудіосупроводом.",
    holograms_p2:
      "Пристрої можуть працювати автоматично або реагувати на відвідувачів через сенсори, голос або датчики руху з можливістю віддаленого керування.",
    holograms_spec_title: "ТЕХНОЛОГІЧНА СПЕЦИФІКАЦІЯ",
    holograms_s1_t: "Контент, що відображається:",
    holograms_s1_d:
      "ШІ-аватари, 3D-персонажі, відео, анімації, презентації, live-трансляції та вебсайти",
    holograms_s2_t: "Звук:",
    holograms_s2_d:
      "вбудована або зовнішня акустика, мова аватара, музика та звукові ефекти",
    holograms_s3_t: "Керування:",
    holograms_s3_d:
      "віддалене оновлення контенту, розклад трансляцій та контроль у реальному часі",
    holograms_s4_t: "Інтеграції:",
    holograms_s4_d:
      "вебсайти, корпоративні системи, додатки, API, CRM та ШІ-рішення",
    holograms_adv_badge: "> ТЕХНОЛОГІЧНІ ПЕРЕВАГИ",
    holograms_adv_title: "Що вирізняє наші системи 3D-проекції?",
    holograms_c1_title: "Оренда голограм на заходи",
    holograms_c1_desc:
      "Завдяки високій щільності світлодіодів та яскравості голограма зберігає чіткість і насиченість кольорів навіть у добре освітлених виставкових залах.",
    holograms_c1_tag: "ЗАХОДИ ТА ВИСТАВКИ",
    holograms_c2_title: "Контент, адаптований під голограми",
    holograms_c2_desc:
      "Створюємо відео, 3D-анімації, персонажів та презентації, адаптовані під пристрій, простір та тематику події.",
    holograms_c2_tag: "КОНТЕНТ ТА АНІМАЦІЯ",
    holograms_c3_title: "Інтерактивна ШІ-голограма",
    holograms_c3_desc:
      "Ми поєднуємо ШІ-аватара з голограмою, створюючи персонажа, який розмовляє та відповідає на запитання в реальному часі.",
    holograms_c3_tag: "ШІ-ГОЛОГРАМА",
    holograms_cta_title: "Бажаєте побачити презентацію наживо?",
    holograms_cta_desc:
      "Завітайте до нашого шоуруму або замовте демонстрацію безпосередньо у вашому офісі.",
    holograms_cta_btn: "Напишіть нам",

    // Pricing page
    pricing_badge: "> ЦІНИ",
    pricing_main_title: "Прозорі пакети",
    pricing_subtitle:
      "Оберіть модель співпраці, адаптовану до масштабу вашого заходу чи бізнес-потреб.",
    pricing_tab_avatars: "Інтерактивні ШІ-аватари",
    pricing_tab_holograms: "Оренда та купівля голограм",
    pricing_sec1_title: "// 01. Пакети впровадження аватарів",
    pricing_netto: "нетто",
    pricing_netto_msc: "нетто / міс",
    pricing_netto_day: "нетто / день",
    pricing_select_pkg: "Обрати пакет",
    pricing_select_plan: "Обрати план",
    pricing_book_date: "Забронювати дату",
    pricing_ask_quote: "Запитати розрахунок",
    pricing_consult_proj: "Проконсультуватися",
    pricing_most_popular: "Найпопулярніший",
    pricing_avatar_std_desc:
      "Готовий ШІ-аватар для сайту, створений на основі фотографії та базової інформації про компанію.",
    pricing_avatar_std_f1: "Створення аватара на основі фотографії",
    pricing_avatar_std_f2: "Налаштування зовнішності, голосу та стилю",
    pricing_avatar_std_f3: "Базові знання про компанію та послуги",
    pricing_avatar_std_f4: "Простий сценарій однієї розмови",
    pricing_avatar_std_f5: "Розміщення на одному вебсайті",
    pricing_avatar_std_f6: "Налаштування, запуск та тестування",
    pricing_avatar_biz_desc:
      "Персоналізований аватар на основі відеозапису реальної людини для конкретної бізнес-ролі.",
    pricing_avatar_biz_f1: "Створення аватара на основі відеозапису",
    pricing_avatar_biz_f2: "Налаштування голосу, характеру та тону",
    pricing_avatar_biz_f3: "Розширена база знань з матеріалів компанії",
    pricing_avatar_biz_f4: "Сценарії найчастіших діалогів",
    pricing_avatar_biz_f5: "Інтеграція на вебсайт",
    pricing_avatar_biz_f6: "Конфігурація, запуск та тестування",
    pricing_avatar_biz_f7: "Підготовка аватара до конкретної бізнес-ролі",
    pricing_avatar_prem_price: "від 11 900 PLN",
    pricing_avatar_prem_desc:
      "Удосконалений ШІ-аватар, інтегрований у процеси та системи вашої компанії для автоматичних дій.",
    pricing_avatar_prem_f1: "Персоналізований відеоаватар",
    pricing_avatar_prem_f2: "Повна адаптація голосу та поведінки",
    pricing_avatar_prem_f3: "Глибока база знань за бізнес-процесами",
    pricing_avatar_prem_f4: "Індивідуальні сценарії обслуговування",
    pricing_avatar_prem_f5: "Впровадження на сайті клієнта",
    pricing_avatar_prem_f6: "Тестування, оптимізація та підтримка",
    pricing_avatar_prem_f7: "Інтеграція з формами, календарем, CRM чи API",
    pricing_avatar_prem_f8: "Реалізація однієї бізнес-функції",
    pricing_sec2_title: "// 02. Щомісячні пакети розмов",
    pricing_sec2_notice:
      "Оберіть пакет відповідно до обсягу розмов та необхідної підтримки.",
    pricing_sub_std_desc:
      "Для компаній, які запускають аватара при помірному трафіку.",
    pricing_sub_std_f1_strong: "90 хвилин ",
    pricing_sub_std_f1_text: "розмов з аватаром",
    pricing_sub_std_f2_strong: "До 10 ",
    pricing_sub_std_f2_text: "одночасних розмов",
    pricing_sub_std_f3: "Технічна підтримка та моніторинг",
    pricing_sub_std_f4: "Базове оновлення бази знань",
    pricing_sub_std_f5: "Щомісячний звіт використання",
    pricing_sub_std_f6: "Стандартна техпідтримка",
    pricing_sub_biz_desc:
      "Для компаній, які регулярно використовують аватара в продажах та обслуговуванні.",
    pricing_sub_biz_f1_strong: "200 хвилин ",
    pricing_sub_biz_f1_text: "розмов з аватаром",
    pricing_sub_biz_f2_strong: "До 15 ",
    pricing_sub_biz_f2_text: "одночасних розмов",
    pricing_sub_biz_f3: "Підтримка та моніторинг роботи",
    pricing_sub_biz_f4: "Регулярні оновлення бази знань",
    pricing_sub_biz_f5: "Аналіз найпоширеніших запитань",
    pricing_sub_biz_f6: "Розширена технічна підтримка",
    pricing_sub_biz_f7: "Оптимізація відповідей та сценаріїв",
    pricing_sub_pro_desc: "Для компаній з інтенсивним використанням аватара.",
    pricing_sub_pro_f1_strong: "400 хвилин ",
    pricing_sub_pro_f1_text: "розмов з аватаром",
    pricing_sub_pro_f2_strong: "До 15 ",
    pricing_sub_pro_f2_text: "одночасних розмов",
    pricing_sub_pro_f3: "Підтримка та моніторинг",
    pricing_sub_pro_f4: "Постійне розширення бази знань",
    pricing_sub_pro_f5: "Аналіз якості та тематики діалогів",
    pricing_sub_pro_f6: "Пріоритетна техпідтримка",
    pricing_sub_pro_f7: "Регулярна оптимізація відповідей",
    pricing_sec3_title: "// 03. Оренда та купівля голограми",
    pricing_holo_ready_desc:
      "Для клієнтів із готовим відео, анімацією або аватаром.",
    pricing_holo_ready_f1: "Оренда голограми на 1 день",
    pricing_holo_ready_f2: "Перевірка та адаптація матеріалів",
    pricing_holo_ready_f3: "Налаштування та запуск контенту",
    pricing_holo_ready_f4: "Монтаж та демонтаж обладнання",
    pricing_holo_ready_f5: "Стандартна підтримка під час заходу",
    pricing_holo_custom_desc:
      "Для клієнтів, яким потрібні обладнання та індивідуальний контент.",
    pricing_holo_custom_f1: "Оренда голограми на один або кілька днів",
    pricing_holo_custom_f2: "Адаптація контенту під пристрій та простір",
    pricing_holo_custom_f3: "Повна конфігурація та запуск",
    pricing_holo_custom_f4: "Монтаж та демонтаж",
    pricing_holo_custom_f5: "Технічна підтримка під час заходу",
    pricing_holo_buy_price: "Індивідуальний розрахунок",
    pricing_holo_buy_desc:
      "Для постійного використання на рецепціях, у шоурумах та точках продажу.",
    pricing_holo_buy_f1: "Підбір обладнання під простір та завдання",
    pricing_holo_buy_f2: "Створення стартового відеоконтенту",
    pricing_holo_buy_f3: "Налаштування та розгортання контенту",
    pricing_holo_buy_f4: "Доставка та монтаж обладнання",
    pricing_holo_buy_f5: "Сервіс, оновлення та техпідтримка",
    pricing_holo_buy_f6: "Інтеграція з ШІ-аватором, сайтом або CRM",
    pricing_holo_buy_f7: "Навчання персоналу керуванню контентом",
    pricing_cta_title: "Потрібно щось унікальне?",
    pricing_cta_desc:
      "Опишіть ваше завдання, і наш R&D відділ підготує безкоштовний технічний розрахунок.",
    pricing_cta_btn: "Напишіть нам!",

    // About page
    about_badge: "> ПРО НАС",
    about_title: "Хто ми такі?",
    about_lead:
      "Познайомтеся з командою, яка переносить презентації та заходи в новий вимір.",
    about_p1:
      "NAAPP — це команда інженерів та креаторів, яка з 2020 року втілює сучасні технології у рішення для бізнесу. Ми розгортаємо рішення там, де вони дійсно працюють: на вебсайтах, рецепціях, виставках та у корпоративних просторах.",
    about_p2:
      "Ми створюємо інтерактивних ШІ-аватарів та голограми для подій і корпоративних приміщень.",
    about_p3:
      "Ми орієнтуємося на практичну користь та ведемо увесь процес — від ідеї до повного впровадження.",
    about_card_title: "> ОПЕРАЦІЙНІ_ПАРАМЕТРИ",
    about_l1: "[ДОСВІД НА РИНКУ]:",
    about_v1: "з 2020р.",
    about_l2: "[ГЕОГРАФІЯ ДІЯЛЬНОСТІ]:",
    about_v2: "Польща / ЄС",
    about_l3: "[СЕКТОРИ ОБСЛУГОВУВАННЯ]:",
    about_v3: "B2B Бізнес, Освіта, Банки, Інституції",
    about_l4: "[КЛЮЧОВІ НАПРЯМКИ]:",
    about_v4: "ШІ-Аватари, Голограми",
    about_l5: "[ФУНДАМЕНТ БРЕНДУ]:",
    about_v5: "Реальні впровадження, а не демо",
    about_cta_title: "Бажаєте дізнатися, як ми можемо змінити ваш проект?",
    about_cta_desc: "Зв'яжіться з нами",
    about_cta_btn: "Напишіть нам",

    // Contact page
    contact_badge: "> КОНТАКТИ",
    contact_title: "Напишіть нам",
    contact_lead: "Ми відповімо якомога швидше.",
    contact_lbl_name: "Як вас звати?",
    contact_lbl_email: "Ваш контактний email?",
    contact_lbl_phone: "Опціонально: За яким номером вам зателефонувати?",
    contact_lbl_msg: "Чим ми можемо допомогти?",
    contact_ph_name: "напр. Іван",
    contact_ph_email: "напр. ivan@gmail.com",
    contact_ph_phone: "напр. 0971234567",
    contact_ph_msg: "Опишіть ваш запит...",
    contact_btn_send: "Надіслати повідомлення",
    contact_other_title: "Інші способи зв'язку",
    contact_other_desc: "Ви також можете надіслати нам email на",
    contact_fb_btn: "Напишіть нам у Facebook",

    // Legal & Error
    legal_badge: "> ЮРИДИЧНІ ДОКУМЕНТИ",
    privacy_title: "Політика конфіденційності",
    terms_title: "Умови надання послуг",
    legal_info_title: "> ІНФОРМАЦІЯ",
    legal_status_label: "[СТАТУС]:",
    legal_status_val: "Документ у розробці",
    legal_entity_label: "[СУБ'ЄКТ]:",
    legal_contact_label: "[КОНТАКТ]:",
    privacy_text:
      "Повна версія Політики конфіденційності буде опублікована незабаром. Персональні дані використовуються виключно для відповіді.",
    terms_text: "Повний текст умов послуг буде опубліковано незабаром.",
    privacy_cta_title: "Запитання щодо персональних даних?",
    terms_cta_title: "Маєте запитання?",
    legal_cta_desc: "Зв'яжіться з нами напряму.",
    error_title: "Помилка 404",
    error_desc:
      "Ми шукали на наших серверах, але не змогли знайти потрібну сторінку...",
    error_link: "Повернутися на головну.",

    // Form validation & status messages
    contact_msg_sending: "Надсилання повідомлення...",
    contact_msg_success: "Дякуємо! Ваше повідомлення надіслано.",
    contact_msg_error: "Сталася помилка під час надсилання. Спробуйте ще раз.",
    contact_err_form: "Форма містить помилки. Виправте виділені поля.",
    contact_err_name: "Давайте познайомимося! Як до вас звертатися?",
    contact_err_email: "Введіть коректну адресу e-mail (напр. ivan@gmail.com).",
    contact_err_phone:
      "Введіть коректний номер телефону (9 цифр або міжнародний формат).",
    contact_err_msg: "Що б ви хотіли нам повідомити?",

    // Tooltips & Accessibility
    tooltip_lang: "Вибрати мову",
    tooltip_lang_pl: "Polski",
    tooltip_lang_en: "English",
    tooltip_lang_es: "Español",
    tooltip_lang_uk: "Українська",
    tooltip_theme: "Переключити тему (світла/темна)",
    tooltip_refresh_anim: "Перезапустити анімацію",
    tooltip_mute_sound: "Увімкнути / вимкнути звук",
    tooltip_sound_on: "Увімкнути звук",
    tooltip_sound_off: "Вимкнути звук",
    nav_menu_toggle: "Відкрити / закрити меню навігації",
    contact_title_name: "Ваше ім'я напр. Оксана",
    contact_title_email: "Контактний email напр. ivan@gmail.com",
    contact_title_phone: "Номер телефону (точна кількість - 9 цифр)",
    contact_title_msg: "Текст повідомлення для команди NAAPP",
  },
};

// expose for other scripts (e.g. contact form status message)
window.naappTranslations = translations;

const FLAG_MAP = {
  pl: { img: "assets/translations/pl.svg", alt: "PL" },
  en: { img: "assets/translations/gb-eng.svg", alt: "EN" },
  es: { img: "assets/translations/es.svg", alt: "ES" },
  uk: { img: "assets/translations/ua.svg", alt: "UA" },
};

let shakeTimer = null;
let shakeInterval = null;
let shakeCount = 0;
let userHasChosenLanguage = false;

function stopShakeSequence() {
  if (!userHasChosenLanguage) {
    logger.log(
      "Stopping unchosen language shake sequence due to user interaction.",
    );
  }
  userHasChosenLanguage = true;
  if (shakeTimer) {
    clearTimeout(shakeTimer);
    shakeTimer = null;
  }
  if (shakeInterval) {
    clearInterval(shakeInterval);
    shakeInterval = null;
  }
  const trigger = document.getElementById("langTrigger");
  if (trigger) {
    trigger.classList.remove("shake-flag");
  }
}

function triggerFlagShake() {
  const trigger = document.getElementById("langTrigger");
  if (!trigger) return;
  logger.log(`Triggering flag shake animation #${shakeCount} of 3.`);
  trigger.classList.remove("shake-flag");
  void trigger.offsetWidth;
  trigger.classList.add("shake-flag");
  shakeTimer = setTimeout(() => {
    trigger.classList.remove("shake-flag");
  }, 900);
}

function startUnchosenLanguageShakeSequence() {
  let saved = null;
  try {
    saved = localStorage.getItem("naapp-lang");
  } catch (err) {
    logger.warn("LocalStorage unavailable while checking language:", err);
  }

  if (saved) {
    logger.log("Found saved language preference in storage:", saved);
    userHasChosenLanguage = true;
    return;
  }

  logger.log(
    "No saved language in storage. Starting unchosen language shake sequence (up to 3 shakes, 5-minute interval, initial delay 10s).",
  );

  // Initial shake after 10 seconds
  shakeTimer = setTimeout(() => {
    if (userHasChosenLanguage) return;
    shakeCount = 1;
    triggerFlagShake();

    // Shake every 5 minutes (300 000 ms) up to 3 total shakes
    shakeInterval = setInterval(
      () => {
        if (userHasChosenLanguage) {
          clearInterval(shakeInterval);
          return;
        }
        if (shakeCount < 3) {
          shakeCount++;
          triggerFlagShake();
          if (shakeCount >= 3) {
            logger.log(
              "Shake sequence reached max attempts (3). Finalizing default language 'pl' to storage.",
            );
            clearInterval(shakeInterval);
            try {
              localStorage.setItem("naapp-lang", "pl");
            } catch (err) {
              logger.warn(
                "LocalStorage unavailable while saving default language:",
                err,
              );
            }
          }
        } else {
          clearInterval(shakeInterval);
        }
      },
      5 * 60 * 1000,
    );
  }, 10000);
}

function setLanguage(lang, isExplicitUserAction = false) {
  logger.log(`setLanguage('${lang}', explicit=${isExplicitUserAction})`);
  const globalDict = translations.global || {};
  const langDict = translations[lang];
  if (!langDict) {
    logger.warn("No translation dictionary found for language:", lang);
    return;
  }
  const dict = { ...globalDict, ...langDict };

  document.documentElement.lang = lang;

  const i18nElements = document.querySelectorAll("[data-i18n]");
  i18nElements.forEach((el) => {
    const key = el.dataset.i18n;
    if (dict[key] !== undefined) el.textContent = dict[key];
  });

  const htmlElements = document.querySelectorAll("[data-i18n-html]");
  htmlElements.forEach((el) => {
    const key = el.dataset.i18nHtml;
    if (dict[key] !== undefined) el.innerHTML = dict[key];
  });

  const placeholderElements = document.querySelectorAll(
    "[data-i18n-placeholder]",
  );
  placeholderElements.forEach((el) => {
    const key = el.dataset.i18nPlaceholder;
    if (dict[key] !== undefined) {
      el.placeholder = dict[key];
      el.setAttribute("aria-label", dict[key]);
    }
  });

  const titleElements = document.querySelectorAll("[data-i18n-title]");
  titleElements.forEach((el) => {
    const key = el.dataset.i18nTitle;
    if (dict[key] !== undefined) {
      el.setAttribute("title", dict[key]);
    }
  });

  const ariaElements = document.querySelectorAll("[data-i18n-aria-label]");
  ariaElements.forEach((el) => {
    const key = el.dataset.i18nAriaLabel;
    if (dict[key] !== undefined) {
      el.setAttribute("aria-label", dict[key]);
    }
  });

  logger.log(
    `Translated ${i18nElements.length} text elements and ${placeholderElements.length} placeholders to '${lang}'.`,
  );

  const currentFlagImg = document.getElementById("currentFlagImg");
  if (currentFlagImg && FLAG_MAP[lang]) {
    currentFlagImg.src = FLAG_MAP[lang].img;
    currentFlagImg.alt = FLAG_MAP[lang].alt;
  }

  document.querySelectorAll(".lang-option, .flag").forEach((opt) => {
    opt.classList.toggle("active", opt.dataset.lang === lang);
  });

  window.updateHeroHeight?.();

  if (isExplicitUserAction) {
    stopShakeSequence();
    try {
      localStorage.setItem("naapp-lang", lang);
      logger.log("Saved language choice to storage:", lang);
    } catch (err) {
      logger.warn(
        "LocalStorage unavailable while saving language choice:",
        err,
      );
    }
  } else {
    let saved = null;
    try {
      saved = localStorage.getItem("naapp-lang");
    } catch {
      /* storage unavailable */
    }
    if (saved) {
      stopShakeSequence();
    }
  }
}

window.setLanguage = setLanguage;

document.addEventListener("DOMContentLoaded", () => {
  logger.log("Translation module DOMContentLoaded initialized.");
  const dropdown = document.getElementById("langDropdown");
  const trigger = document.getElementById("langTrigger");

  if (trigger && dropdown) {
    trigger.addEventListener("click", (e) => {
      e.stopPropagation();
      const isOpen = dropdown.classList.toggle("is-open");
      trigger.setAttribute("aria-expanded", String(isOpen));
      logger.log("Language dropdown toggled. Is open:", isOpen);
    });

    document.addEventListener("click", (e) => {
      if (
        !dropdown.contains(e.target) &&
        dropdown.classList.contains("is-open")
      ) {
        dropdown.classList.remove("is-open");
        trigger.setAttribute("aria-expanded", "false");
        logger.log("Language dropdown closed (clicked outside).");
      }
    });
  }

  document.querySelectorAll(".lang-option, .flag").forEach((opt) => {
    opt.addEventListener("click", () => {
      const selectedLang = opt.dataset.lang;
      logger.log("User selected language from dropdown:", selectedLang);
      setLanguage(selectedLang, true);
      if (dropdown) {
        dropdown.classList.remove("is-open");
        if (trigger) trigger.setAttribute("aria-expanded", "false");
      }
    });
  });

  let saved = "pl";
  try {
    saved = localStorage.getItem("naapp-lang") || "pl";
  } catch {
    /* storage unavailable */
  }
  setLanguage(saved, false);
  startUnchosenLanguageShakeSequence();
});
