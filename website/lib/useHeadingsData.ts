import { useState, useEffect } from 'react';

export interface HeadingItem {
  id: string;
  title: string;
  items: HeadingItem[];
}

const getNestedHeadings = (headingElements: Element[]): HeadingItem[] => {
  const nestedHeadings: HeadingItem[] = [];

  headingElements.forEach((heading) => {
    const { innerText: title, id } = heading as HTMLElement;

    if (heading.nodeName === 'H2') {
      nestedHeadings.push({ id, title, items: [] });
    } else if (heading.nodeName === 'H3' && nestedHeadings.length > 0) {
      nestedHeadings[nestedHeadings.length - 1].items.push({
        id,
        title,
        items: [],
      });
    }
  });

  return nestedHeadings;
};

export const useHeadingsData = () => {
  const [nestedHeadings, setNestedHeadings] = useState<HeadingItem[]>([]);

  useEffect(() => {
    const headingElements = Array.from(
      document.querySelectorAll('h2, h3:not(#table-of-contents-heading)'),
    );

    const visibleHeadings = headingElements.filter(
      (el) => (el as HTMLElement).offsetParent !== null,
    );

    const newNestedHeadings = getNestedHeadings(visibleHeadings);
    setNestedHeadings(newNestedHeadings);
  }, []);

  return { nestedHeadings };
};