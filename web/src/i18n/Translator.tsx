import { useTranslation } from "react-i18next";

export const Translator = ({ path }: { path: string }) => {
  const { t } = useTranslation();

  return <>{t(path)}</>;
};

export const translator = (path: string) => {
  const { t } = useTranslation();

  return t(path);
};
