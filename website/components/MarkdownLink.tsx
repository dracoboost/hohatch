import {type LinkProps, useLink} from "@heroui/react";
import {forwardRef} from "react";

const MarkdownLink = forwardRef<HTMLAnchorElement, LinkProps>((props, ref) => {
  const {Component, getLinkProps, children} = useLink({...props, ref});

  return (
    <Component
      {...getLinkProps({
        className:
          "inline-flex items-center text-link-color hover:opacity-75 active:opacity-50 transition-opacity duration-200",
      })}
    >
      {children}
    </Component>
  );
});

MarkdownLink.displayName = "MarkdownLink";

export {MarkdownLink};
