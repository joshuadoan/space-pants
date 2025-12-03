import React from "react";

type StatValueProps = {
  children: React.ReactNode;
};

export function StatValue({ children }: StatValueProps) {
  return <div className="font-medium text-sm text-base-content">{children}</div>;
}

type StatTitleProps = {
  children: React.ReactNode;
};

export function StatTitle({ children }: StatTitleProps) {
  return <div className="text-xs text-base-content/60 font-medium">{children}</div>;
}

type StatDescProps = {
  children: React.ReactNode;
};

export function StatDesc({ children }: StatDescProps) {
  return <div className="text-xs text-base-content/70">{children}</div>;
}

type StatRowProps = {
  children: React.ReactNode;
  separator?: string;
};

export function StatRow({ children, separator = " | " }: StatRowProps) {
  const childrenArray = React.Children.toArray(children).filter(Boolean);
  if (childrenArray.length === 0) return null;
  
  return (
    <div className="flex flex-wrap items-center gap-1 text-xs text-base-content/70">
      {childrenArray.map((child, index) => (
        <React.Fragment key={index}>
          {index > 0 && <span className="text-base-content/40">{separator}</span>}
          {child}
        </React.Fragment>
      ))}
    </div>
  );
}

