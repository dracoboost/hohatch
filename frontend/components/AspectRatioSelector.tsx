import {Tab, Tabs} from "@heroui/react";
import React from "react";

import {I18N} from "@/config/consts";

interface AspectRatioSelectorProps {
  selectedRatio: "none" | "53x64";
  onRatioChange: (ratio: "none" | "53x64") => void;
  languageData: typeof I18N.en | typeof I18N.ja;
}

export const AspectRatioSelector: React.FC<AspectRatioSelectorProps> = ({
  selectedRatio,
  onRatioChange,
  languageData,
}) => {
  return (
    <Tabs
      aria-label={languageData.aspect_ratio_setting || "Aspect Ratio"}
      classNames={{tabList: "border-gray-300 dark:border-gray-700"}}
      color="secondary"
      selectedKey={selectedRatio}
      variant="bordered"
      onSelectionChange={(key) => onRatioChange(key as "none" | "53x64")}
    >
      <Tab key="53x64" title={languageData.aspect_ratio_53x64 || "53x64"} />
      <Tab key="none" title={languageData.aspect_ratio_none || "None"} />
    </Tabs>
  );
};
