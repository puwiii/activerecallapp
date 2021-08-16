import React from "react";
import Head from "next/head";

function HeadCEO() {
  return (
    <Head>
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <meta name="title" content="Liza - Flashcards para siempe" />
      <meta
        name="description"
        content="Comienza a utilizar Liza. Regístrate Iniciar sesión. Encuentra y comparte apuntes de otras personas. Estudia de manera mas eficiente."
      />
      <meta
        name="keywords"
        content="flashcards,flashcard,decks,mazo,tarjetas,estudiar,eficiente,eficaz,active recall,active,recall,spaced repetition,spaced,repetition,repeticion,espaciada,apuntes,estudio,material"
      />
      <meta name="robots" content="index, follow" />
      {/* <meta http-equiv="Content-Type" content="text/html; charset=utf-8" /> */}
      <meta name="language" content="Spanish" />
      <meta name="author" content="JunkoDevs" />
    </Head>
  );
}

export default HeadCEO;
