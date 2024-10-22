import { experimental_withState } from "@astrojs/react/actions";
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
import { actions, isInputError } from "astro:actions";
import { useActionState, useRef, useState } from "react";

interface MarkdownEditorProps {
  noteData: NoteData;
}

export const MarkdownEditor = ({ noteData }: MarkdownEditorProps) => {
  const [notes, setNotes] = useState<string>(noteData.notes || "");
  const ref = useRef<MDXEditorMethods>(null);
  const [state, action, pending] = useActionState(
    experimental_withState(actions.notes.save),
    { data: { success: false }, error: undefined }
  );

  const fieldErrors = isInputError(state.error) ? state.error.fields : {};

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
        markdown={notes || ""}
      />
      <form action={action}>
        <label htmlFor="liUrl">LinkedIn URL:</label>
        <input
          id="liUrl"
          name="liUrl"
          type="text"
          required
          defaultValue={noteData.url}
        />
        {fieldErrors.liUrl && <p>{fieldErrors.liUrl}</p>}
        <label htmlFor="liName">Name:</label>
        <input
          id="liName"
          name="liName"
          type="text"
          required
          defaultValue={noteData.name}
        />
        {fieldErrors.liName && <p>{fieldErrors.liName}</p>}
        <textarea id="notes" name="notes" value={notes} readOnly hidden />
        {fieldErrors.notes && <p>{fieldErrors.notes}</p>}
        <input
          id="userId"
          name="userId"
          type="hidden"
          defaultValue={noteData.userId}
        />
        {fieldErrors.notes && <p>{fieldErrors.notes}</p>}
        <button disabled={pending}>Save</button>
      </form>
    </>
  );
};
