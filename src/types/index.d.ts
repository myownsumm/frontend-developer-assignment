declare module "*.svg" {
  import React = require("react");
  export const ReactComponent: React.FC<React.SVGProps<SVGSVGElement>>;
  const src: string;
  export default src;
}

declare module "*.json" {
  import { RawRecipient } from "../data-pipeline";
  const value: RawRecipient[];
  export default value;
}
