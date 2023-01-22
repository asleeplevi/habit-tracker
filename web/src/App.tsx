import dayjs from "dayjs";
import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { Header } from "./components/Header";
import { SummaryTable } from "./components/SummaryTable";
import "./i18n";
import "dayjs/locale/pt-br";

function App() {
  const { i18n } = useTranslation();

  useMemo(() => {
    dayjs.locale(i18n.language);
  }, [i18n.language]);

  return (
    <div className="w-screen h-screen flex justify-center items-center">
      <div className="w-full max-w-5xl px-6 flex flex-col gap-16">
        <Header />
        <SummaryTable />
      </div>
    </div>
  );
}

export default App;
