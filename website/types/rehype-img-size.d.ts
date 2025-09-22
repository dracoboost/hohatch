declare module "rehype-img-size" {
  import type {Plugin} from "unified";
  interface RehypeImgSizeOptions {
    dir?: string;
  }
  const rehypeImgSize: Plugin<[RehypeImgSizeOptions?]>;
  export default rehypeImgSize;
}
