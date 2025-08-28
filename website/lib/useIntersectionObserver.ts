import React, { useEffect, useRef } from 'react';

export const useIntersectionObserver = (
  setActiveId: React.Dispatch<React.SetStateAction<string | undefined>>,
  activeId: string | undefined,
) => {
  const headingElementsRef = useRef<Record<string, IntersectionObserverEntry>>({});

  useEffect(() => {
    const headingElements = Array.from(document.querySelectorAll('h2, h3'));

    const callback = (headings: IntersectionObserverEntry[]) => {
      headingElementsRef.current = headings.reduce((map, headingElement) => {
        map[headingElement.target.id] = headingElement;
        return map;
      }, headingElementsRef.current);

      const visibleHeadings: IntersectionObserverEntry[] = [];
      Object.values(headingElementsRef.current).forEach((headingElement) => {
        if (headingElement.isIntersecting) {
          visibleHeadings.push(headingElement);
        }
      });

      const getIndexFromId = (id: string) =>
        headingElements.findIndex((heading) => heading.id === id);

      if (visibleHeadings.length === 1) {
        setActiveId(visibleHeadings[0].target.id);
      } else if (visibleHeadings.length > 1) {
        const sortedVisibleHeadings = visibleHeadings.sort(
          (a, b) => getIndexFromId(a.target.id) - getIndexFromId(b.target.id),
        );
        setActiveId(sortedVisibleHeadings[0].target.id);
      } else if (activeId) {
        const activeElement = headingElements.find((el) => el.id === activeId);
        const activeIndex = headingElements.findIndex((el) => el.id === activeId);
        if (!activeElement) return;

        const activeIdYcoord = activeElement.getBoundingClientRect().y;
        if (activeIdYcoord > 150 && activeIndex > 0) {
          setActiveId(headingElements[activeIndex - 1].id);
        }
      }
    };

    const observer = new IntersectionObserver(callback, {
      rootMargin: '0px 0px -70% 0px',
    });

    headingElements.forEach((element) => observer.observe(element));

    return () => {
      observer.disconnect();
    };
  }, [activeId, setActiveId]);
};