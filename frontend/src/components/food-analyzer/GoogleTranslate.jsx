import React, { useEffect, useRef } from "react";

const GoogleTranslate = () => {
  const translatorLoaded = useRef(false);

  useEffect(() => {
    // If translator is already loaded, don't initialize again
    if (translatorLoaded.current) {
      return;
    }

    // Add Google Translate script if not already added
    const addScript = () => {
      if (document.querySelector('script[src*="translate_a/element.js"]')) {
        // Script already exists, just initialize the element
        if (window.google && window.google.translate) {
          initTranslator();
        }
        return;
      }

      const script = document.createElement("script");
      script.src =
        "//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit";
      script.async = true;
      document.body.appendChild(script);
    };

    // Initialize Google Translate
    window.googleTranslateElementInit = () => {
      initTranslator();
    };

    const initTranslator = () => {
      // Only initialize if the element exists and hasn't been initialized
      const element = document.getElementById("google_translate_element");
      if (
        element &&
        element.innerHTML === "" &&
        window.google &&
        window.google.translate
      ) {
        new window.google.translate.TranslateElement(
          {
            pageLanguage: "en",
            // layout: window.google.translate.TranslateElement.InlineLayout.SIMPLE,
          },
          "google_translate_element"
        );
        translatorLoaded.current = true;
      }
    };

    // Check if element exists
    if (document.getElementById("google_translate_element")) {
      addScript();
    }

    // Cleanup function
    return () => {
      // Don't remove the global function to prevent re-initialization issues
    };
  }, []);

  return (
    <div className="translate-container">
      <div id="google_translate_element"></div>
    </div>
  );
};

export default GoogleTranslate;
