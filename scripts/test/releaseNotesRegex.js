// test of .github/workflows/release.yml
const { readFileSync } = require("fs");
const changelog = readFileSync("./CHANGELOG.md", "utf8");
const version = "1.0.4";

// This regex escapes special characters in the version string to ensure it's treated as a literal.
// It matches: ., *, +, ?, ^, $, {, }, (, ), |, [, ], \
const escapedVersion = version.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

// This regex extracts release notes for the current version from CHANGELOG.md.
// It looks for a heading like '## [VERSION] - YYYY-MM-DD' and captures content until the next heading or end of file.
const regex = new RegExp(
  "##\\s*\\[\\s*" +
    escapedVersion +
    "\\s*\\]\\s*-\\s*\\d{4}-\\d{2}-\\d{2}\\s*\\n([\\s\\S]*?)(?=(?:\\n##\\s*\\[|$))",
  "u"
);

const match = changelog.match(regex);
console.log(
  "Test result for existing regex:",
  match ? match[1].trim() : "not found"
);

// Check the regex from .github/workflows/release.yml
const workflowRegexString =
  "## \\[" +
  escapedVersion +
  "\\] - \\d{4}-\\d{2}-\\d{2}\\n([\\s\\S]*?)(?=## \\[|$)";
const workflowRegex = new RegExp(workflowRegexString, "u");
const workflowMatch = changelog.match(workflowRegex);
console.log(
  "Test result for workflow regex:",
  workflowMatch ? workflowMatch[1].trim() : "not found"
);
