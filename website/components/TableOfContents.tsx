'use client';

import React, { useState } from 'react';
import { useHeadingsData, HeadingItem } from '../lib/useHeadingsData';
import { useIntersectionObserver } from '../lib/useIntersectionObserver';
import { Link } from "@heroui/react";

interface HeadingsProps {
  headings: HeadingItem[];
  activeId?: string;
}

const Headings: React.FC<HeadingsProps> = ({ headings, activeId }) => (
  <ul className="list-none p-0">
    {headings.map((heading) => (
      <li key={heading.id} className={heading.id === activeId ? "active" : ""}>
        <Link
          href={`#${heading.id}`}
          onClick={(e) => {
            e.preventDefault();
            document.querySelector(`#${heading.id}`)?.scrollIntoView({
              behavior: "smooth"
            });
          }}
          className={`flex items-center text-link-color active:font-bold ${heading.id === activeId ? '' : 'opacity-50'} hover:opacity-75 active:opacity-50`}
        >
          <svg width="8" height="8" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" className="mr-2">
            <circle cx="50" cy="50" r="45" fill="currentColor" strokeWidth="10" />
          </svg>
          {heading.title}
        </Link>
        {heading.items.length > 0 && (
          <ul className="list-none p-0">
            {heading.items.map((child) => (
              <li key={child.id} className={child.id === activeId ? "active" : ""}>
                <Link
                  href={`#${child.id}`}
                  onClick={(e) => {
                    e.preventDefault();
                    document.querySelector(`#${child.id}`)?.scrollIntoView({
                      behavior: "smooth"
                    });
                  }}
                  className={`flex items-center text-link-color ${child.id === activeId ? '' : 'opacity-50'} hover:opacity-75 active:opacity-50 ml-2`}
                >
                  <svg width="8" height="8" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" className="mr-2">
                    <circle cx="50" cy="50" r="45" fill="none" stroke="currentColor" strokeWidth="10" />
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
  const { nestedHeadings } = useHeadingsData();
  useIntersectionObserver(setActiveId, activeId);

  return (
    <nav aria-label="Table of contents" className="sticky top-6 max-h-[calc(100vh-40px)] overflow-y-auto">
      <Headings headings={nestedHeadings} activeId={activeId} />
    </nav>
  );
};
