"use client";

import {Link} from "@heroui/react";
import React, {useEffect, useState} from "react";

import {HeadingItem, useHeadingsData} from "../lib/useHeadingsData";
import {useIntersectionObserver} from "../lib/useIntersectionObserver";

interface HeadingsProps {
  headings: HeadingItem[];
  activeId?: string;
}

const Headings: React.FC<HeadingsProps> = ({headings, activeId}) => (
  <ul className="list-none p-0">
    {headings.map((heading) => (
      <li key={heading.id} className={heading.id === activeId ? "active" : ""}>
        <Link
          className={`text-link-color flex items-start active:font-bold ${heading.id === activeId ? "" : "opacity-50"} hover:opacity-75 active:opacity-50`}
          href={`#${heading.id}`}
          onClick={(e) => {
            e.preventDefault();
            document.querySelector(`#${heading.id}`)?.scrollIntoView({
              behavior: "smooth",
            });
          }}
        >
          <svg
            className="mt-2 mr-2 flex-shrink-0"
            height="8"
            viewBox="0 0 100 100"
            width="8"
            xmlns="http://www.w3.org/2000/svg"
          >
            <circle cx="50" cy="50" fill="currentColor" r="45" strokeWidth="10" />
          </svg>
          {heading.title}
        </Link>
        {heading.items.length > 0 && (
          <ul className="list-none p-0">
            {heading.items.map((child) => (
              <li key={child.id} className={child.id === activeId ? "active" : ""}>
                <Link
                  className={`text-link-color flex items-start ${child.id === activeId ? "" : "opacity-50"} ml-2 hover:opacity-75 active:opacity-50`}
                  href={`#${child.id}`}
                  onClick={(e) => {
                    e.preventDefault();
                    document.querySelector(`#${child.id}`)?.scrollIntoView({
                      behavior: "smooth",
                    });
                  }}
                >
                  <svg
                    className="mt-2 mr-2 flex-shrink-0"
                    height="8"
                    viewBox="0 0 100 100"
                    width="8"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <circle
                      cx="50"
                      cy="50"
                      fill="none"
                      r="45"
                      stroke="currentColor"
                      strokeWidth="10"
                    />
                  </svg>
                  {child.title}
                </Link>
              </li>
            ))}
          </ul>
        )}
      </li>
    ))}
  </ul>
);

export const TableOfContents: React.FC = () => {
  const [activeId, setActiveId] = useState<string>();
  const {nestedHeadings} = useHeadingsData();
  useIntersectionObserver(setActiveId, activeId);

  useEffect(() => {
    if (nestedHeadings.length > 0 && !activeId) {
      setActiveId(nestedHeadings[0].id);
    }
  }, [nestedHeadings, activeId]);

  return (
    <nav
      aria-label="Table of contents"
      className="sticky top-6 max-h-[calc(100vh-40px)] overflow-y-auto"
    >
      <Headings activeId={activeId} headings={nestedHeadings} />
    </nav>
  );
};
