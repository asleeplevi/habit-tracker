import Logo from "../assets/Logo.svg";
import { Plus, X } from "phosphor-react";
import * as Dialog from "@radix-ui/react-dialog";
import { NewHabitForm } from "./NewHabitForm";
import { Translator } from "../i18n/Translator";
import { useTranslation } from "react-i18next";
import { FlagButton } from "./FlagButton";

export const Header = () => {
  const { i18n } = useTranslation();
  const handleChangeLanguage = (lang: string) => {
    i18n.changeLanguage(lang);
  };

  return (
    <header className="w-full max-w-3xl mx-auto flex items-center justify-between">
      <div className="flex gap-2 ">
        <img src={Logo} alt="logo image" />
        <FlagButton
          language="pt-BR"
          onClick={() => handleChangeLanguage("pt-BR")}
          active={i18n.language === "pt-BR"}
        />
        <FlagButton
          language="en-US"
          onClick={() => handleChangeLanguage("en-US")}
          active={i18n.language === "en-US"}
        />
      </div>
      <Dialog.Root>
        <div className="group">
          <Dialog.Trigger
            type="button"
            className="border border-violet-500 font-semibold rounded-lg px-6 py-4 flex gap-3 items-center group-hover:border-violet-300 transition-colors outline-custom"
          >
            <Plus
              size={20}
              className="text-violet-500 group-hover:text-violet-300"
            />
            <Translator path="home.header.newHabit" />
          </Dialog.Trigger>
        </div>
        <Dialog.Portal>
          <Dialog.Overlay className="w-screen h-screen bg-black/80 fixed inset-0" />
          <Dialog.Content className="absolute p-10 bg-zinc-900 rounded-2xl w-full max-w-md top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
            <Dialog.Close className="absolute rounded-lg right-6 top-6 text-zinc-400 hover:text-zinc-200 outline-custom">
              <X size={24} aria-label="Fechar" />
            </Dialog.Close>
            <Dialog.Title className="text-3xl leading-tight font-bold">
              <Translator path="home.header.title" />
            </Dialog.Title>
            <NewHabitForm />
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    </header>
  );
};
