import React from "react";
import { WithChildren } from "@shared/interfaces";

const styles = {
  main: "transition duration-300 ease-out bg-violet-800 hover:bg-violet-700",
  secondary: "bg-purple-700",
};

interface Props extends WithChildren {
  onClick: VoidFunction;
  type?: keyof typeof styles;
}

export const Button = ({ onClick, type = "main", children }: Props) => (
  <button
    className={`w-content text-md mb-4 rounded-lg p-4 font-medium text-white ${styles[type]}`}
    onClick={onClick}
  >
    {children}
  </button>
);
