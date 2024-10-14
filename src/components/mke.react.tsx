import {
  BlockTypeSelect,
  BoldItalicUnderlineToggles,
  CreateLink,
  DiffSourceToggleWrapper,
  ListsToggle,
  MDXEditor,
  UndoRedo,
  headingsPlugin,
  diffSourcePlugin,
  linkDialogPlugin,
  listsPlugin,
  quotePlugin,
  thematicBreakPlugin,
  toolbarPlugin,
  type MDXEditorMethods,
} from "@mdxeditor/editor";
import "@mdxeditor/editor/style.css";
import { useRef, useState } from "react";

interface MarkdownEditorProps {
  content: string | undefined;
}

export const MarkdownEditor = ({ content }: MarkdownEditorProps) => {
  const [notes, setNotes] = useState<string>(content || "");
  const ref = useRef<MDXEditorMethods>(null);

  return (
    <>
      <MDXEditor
        ref={ref}
        onBlur={() => setNotes(ref.current?.getMarkdown() || "")}
        plugins={[
          linkDialogPlugin(),
          headingsPlugin(),
          listsPlugin(),
          diffSourcePlugin({
            diffMarkdown: "An older version",
            viewMode: "rich-text",
          }),
          quotePlugin(),
          thematicBreakPlugin(),
          toolbarPlugin({
            toolbarContents: () => (
              <DiffSourceToggleWrapper>
                <UndoRedo />
                <BoldItalicUnderlineToggles />
                <BlockTypeSelect />
                <ListsToggle />
                <CreateLink />
              </DiffSourceToggleWrapper>
            ),
          }),
        ]}
        markdown={content || ""}
      />
      <form method="POST">
        <label htmlFor="liUrl">LinkedIn URL:</label>
        <input id="liUrl" name="liUrl" type="text" required />
        <label htmlFor="liName">Name:</label>
        <input id="liName" name="liName" type="text" required />
        <textarea id="notes" name="notes" value={notes} readOnly />
        <button type="submit">Save</button>
      </form>
    </>
  );
};
