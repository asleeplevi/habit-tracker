import clsx from "clsx";
import FlagBrazil from "../assets/flag-brazil.svg";
import FlagUSA from "../assets/flag-usa.svg";

const flags = {
  "pt-BR": FlagBrazil,
  "en-US": FlagUSA,
};

type FlagButtonProps = {
  onClick: () => void;
  language: keyof typeof flags;
  active?: boolean;
};

export const FlagButton = ({ onClick, language, active }: FlagButtonProps) => {
  return (
    <button
      className={clsx("h-5 w-5 flex justify-center items-center", {
        "saturate-0": !active,
      })}
      onClick={onClick}
    >
      <img className="w-full h-full" src={flags[language]} alt="Flag" />
    </button>
  );
};
