import { NotionToMarkdown } from "notion-to-md";
import { HierarchicalNamedLayoutStrategy } from "./HierarchicalNamedLayoutStrategy";
import { LayoutStrategy } from "./LayoutStrategy";
import { NotionPage } from "./NotionPage";

import { doNotionToMarkdown } from "./transform";

import { IDocuNotionContext } from "./plugins/pluginTypes";
import { getBlockChildren } from "./pull";
import { convertInternalUrl } from "./plugins/internalLinks";

import { initNotionClient } from "./pull";
import { NotionBlock } from "./types";

test("Latex Rendering", () => {
    let layoutStrategy: LayoutStrategy;
    const pages = new Array<NotionPage>();
    const counts = {
    output_normally: 0,
    skipped_because_empty: 0,
    skipped_because_status: 0,
    skipped_because_level_cannot_have_content: 0,
    };

    const notionClient = initNotionClient("");

    layoutStrategy = new HierarchicalNamedLayoutStrategy();

    const context: IDocuNotionContext = {
        getBlockChildren: getBlockChildren,
        directoryContainingMarkdown: "", // this changes with each page
        relativeFilePathToFolderContainingPage: "", // this changes with each page
        layoutStrategy: layoutStrategy,
        notionToMarkdown: new NotionToMarkdown({ notionClient }),
        options: {notionToken: "", rootPage: "", locales: [""], markdownOutputPath: "", imgOutputPath: "", imgPrefixInMarkdown: "", statusTag: ""},
        
        pages: pages,
        counts: counts, // review will this get copied or pointed to?
        imports: [],
        convertNotionLinkToLocalDocusaurusLink: (url: string) =>
        convertInternalUrl(context, url),
    };

    const blocks: Array<NotionBlock> = [{
        object: 'block',
        id: '169e1c47-6706-4518-adca-73086b2738ac',
        parent: { type: 'page_id', page_id: '2acc11a4-82a9-4759-b429-fa011c164888' },
        created_time: '2023-08-18T15:51:00.000Z',
        last_edited_time: '2023-08-18T15:51:00.000Z',
        created_by: { object: 'user', id: 'af5c163e-82b1-49d1-9f1c-539907bb9fb9' },
        last_edited_by: { object: 'user', id: 'af5c163e-82b1-49d1-9f1c-539907bb9fb9' },
        has_children: false,
        archived: false,
        type: 'paragraph',
        paragraph: { rich_text: [ {
            type: 'equation',
            equation: { expression: 'x' },
            annotations: {
                bold: false,
                italic: false,
                strikethrough: false,
                underline: false,
                code: false,
                color: 'default'
            },
            plain_text: 'x',
            href: null
        } ], color: 'default' }
    }];
   
    expect(doNotionToMarkdown(context, blocks)).resolves.toContain("$x$");
  });

