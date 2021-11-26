import { Document, Text, Block, Inline } from '@contentful/rich-text-types';
export declare type CommonNode = Text | Block | Inline;
export interface Next {
    (nodes: CommonNode[]): string;
}
export interface NodeRenderer {
    (node: Block | Inline, next: Next): string;
}
export interface RenderNode {
    [k: string]: NodeRenderer;
}
export interface RenderMark {
    [k: string]: (text: string) => string;
}
export interface Options {
    /**
     * Node renderers
     */
    renderNode?: RenderNode;
    /**
     * Mark renderers
     */
    renderMark?: RenderMark;
}
/**
 * Serialize a Contentful Rich Text `document` to an html string.
 */
export declare function documentToHtmlString(richTextDocument: Document, options?: Partial<Options>): string;
