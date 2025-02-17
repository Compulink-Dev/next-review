import React from "react";

function Title({ title, subtitle }: any) {
  return (
    <div>
      <p className="text-color font-bold text-2xl">{title}</p>
      <p className="text-sm text-slate-600">{subtitle}</p>
    </div>
  );
}

export default Title;
