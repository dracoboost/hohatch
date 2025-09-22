import {remark} from "remark";
import {Node} from "unist";
import {visit} from "unist-util-visit";

// Import generic Node from unist

// Define a more specific type for heading nodes from mdast
interface MdastHeading extends Node {
  type: "heading";
  depth: 1 | 2 | 3 | 4 | 5 | 6;
  children: Node[];
}

// Define a more specific type for text nodes from mdast
interface MdastText extends Node {
  type: "text";
  value: string;
}

export interface HeadingItem {
  id: string;
  title: string;
  items: HeadingItem[];
}

const getNestedHeadings = (
  rawHeadings: {depth: number; text: string; id: string}[],
): HeadingItem[] => {
  const nestedHeadings: HeadingItem[] = [];

  rawHeadings.forEach((heading) => {
    if (heading.depth === 2) {
      nestedHeadings.push({id: heading.id, title: heading.text, items: []});
    } else if (heading.depth === 3 && nestedHeadings.length > 0) {
      nestedHeadings[nestedHeadings.length - 1].items.push({
        id: heading.id,
        title: heading.text,
        items: [],
      });
    }
  });

  return nestedHeadings;
};

export async function getHeadingsFromMarkdown(markdownContent: string): Promise<HeadingItem[]> {
  const headings: {depth: number; text: string; id: string}[] = [];

  await remark()
    .use(() => (tree) => {
      visit(tree, ["heading"], (node: Node) => {
        // Let visit infer Node type
        const headingNode = node as MdastHeading; // Cast to MdastHeading inside
        if (headingNode.depth === 2 || headingNode.depth === 3) {
          const text = (headingNode.children[0] as MdastText).value || "";
          const id = text.toLowerCase().replace(/\s/g, "-");
          headings.push({depth: headingNode.depth, text, id});
        }
      });
    })
    .process(markdownContent);

  return getNestedHeadings(headings);
}
