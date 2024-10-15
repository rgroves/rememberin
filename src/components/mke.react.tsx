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
  jsonData: NoteData | undefined;
}

export const MarkdownEditor = ({ content, jsonData }: MarkdownEditorProps) => {
  const [notes, setNotes] = useState<string>(jsonData?.notes || "");
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
        markdown={jsonData?.notes || ""}
      />
      <form method="POST">
        <label htmlFor="liUrl">LinkedIn URL:</label>
        <input
          id="liUrl"
          name="liUrl"
          type="text"
          required
          defaultValue={jsonData?.url}
        />
        <label htmlFor="liName">Name:</label>
        <input
          id="liName"
          name="liName"
          type="text"
          required
          defaultValue={jsonData?.name}
        />
        <textarea id="notes" name="notes" value={notes} readOnly />
        <button type="submit">Save</button>
      </form>
    </>
  );
};
