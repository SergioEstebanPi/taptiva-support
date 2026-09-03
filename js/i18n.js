const supportedLanguages = [
    "en",
    "es",
    "de",
    "fr",
    "it",
    "ja",
    "ko",
    "pt",
    "zh"
];

const selector = document.getElementById("languageSelector");

async function setLanguage(language) {

    // Si el idioma no existe, usamos inglés
    if (!supportedLanguages.includes(language)) {
        language = "en";
    }

    try {

        const response = await fetch(
            `locales/${language}.json`
        );

        if (!response.ok) {
            throw new Error(
                `Could not load ${language}.json`
            );
        }

        const translations = await response.json();

        /*
         * Busca todos los elementos que tengan:
         *
         * data-i18n="hero.title"
         *
         * y obtiene:
         *
         * translations.hero.title
         */
        document.querySelectorAll("[data-i18n]").forEach(element => {

            const key = element.dataset.i18n;

            const value = key
                .split(".")
                .reduce(
                    (object, property) =>
                        object?.[property],
                    translations
                );

            if (value !== undefined) {

                // Para elementos normales
                element.textContent = value;
            }
        });

        // Actualizar idioma del documento
        document.documentElement.lang = language;

        // Guardar idioma
        localStorage.setItem(
            "language",
            language
        );

        // Actualizar selector
        if (selector) {
            selector.value = language;
        }

    } catch (error) {

        console.error(
            "Translation error:",
            error
        );
    }
}


/* =========================
   LANGUAGE SELECTOR
========================= */

if (selector) {

    selector.addEventListener(
        "change",
        () => {
            setLanguage(selector.value);
        }
    );
}


/* =========================
   INITIAL LANGUAGE
========================= */

const savedLanguage =
    localStorage.getItem("language");

const browserLanguage =
    navigator.language
        .toLowerCase()
        .split("-")[0];

const initialLanguage =
    savedLanguage ||
    (
        supportedLanguages.includes(browserLanguage)
            ? browserLanguage
            : "en"
    );

setLanguage(initialLanguage);
