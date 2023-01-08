import React from "react";
import { WithChildren } from "@shared/interfaces";

type Props = WithChildren;
export const MainTemplate = ({ children }: Props) => (
  <div className="flex flex-col justify-center h-screen">{children}</div>
);
