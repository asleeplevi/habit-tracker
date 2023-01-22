import ptBr from "./pt-br";
import enUs from "./en-us";

const langs = {
  "pt-BR": ptBr,
  "en-US": enUs,
} as const;

export default langs;
export type AvailableI18nLanguages = keyof typeof langs;
