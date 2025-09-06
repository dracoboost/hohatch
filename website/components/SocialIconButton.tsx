import { Button, Link, Tooltip } from "@heroui/react";
import Image from "next/image";
import React from "react";

type SocialIconType = "reddit" | "discord" | "x" | "github";

interface SocialIconButtonProps {
  type: SocialIconType;
}

const socialData = {
  reddit: {
    tooltip: "Join the Mod Community on Reddit",
    href: "https://www.reddit.com/r/ShadowverseMods/",
    src: "/images/icons/reddit-white.svg",
    alt: "Reddit",
  },
  discord: {
    tooltip: "Join the Mod Community",
    href: "https://discord.gg/fEUMrTGb23",
    src: "/images/icons/discord-white.svg",
    alt: "Discord",
  },
  x: {
    tooltip: "Share HoHatch",
    href: "https://x.com/intent/tweet?text=HoHatch%3A%20A%20JPG/DDS%20image%20converter%20for%20Shadowverse%3A%20Worlds%20Beyond.%20%23HoHatch%20%23ShadowverseWB%20https://hohatch.draco.moe",
    src: "/images/icons/x-white.svg",
    alt: "X",
  },
  github: {
    tooltip: "View Source Code",
    href: "https://github.com/dracoboost/hohatch",
    src: "/images/icons/github-white.svg",
    alt: "GitHub",
  },
};

export const SocialIconButton: React.FC<SocialIconButtonProps> = ({ type }) => {
  const { tooltip, href, src, alt } = socialData[type];

  return (
    <Tooltip content={tooltip}>
      <Link href={href} isExternal>
        <Button isIconOnly variant="light" className="rounded-full">
          <Image src={src} alt={alt} width={32} height={32} />
        </Button>
      </Link>
    </Tooltip>
  );
};
