import { experimental_withState } from "@astrojs/react/actions";
import {
  BlockTypeSelect,
  BoldItalicUnderlineToggles,
  CreateLink,
  linkPlugin,
  ListsToggle,
  MDXEditor,
  UndoRedo,
  headingsPlugin,
  linkDialogPlugin,
  listsPlugin,
  quotePlugin,
  thematicBreakPlugin,
  toolbarPlugin,
  type MDXEditorMethods,
} from "@mdxeditor/editor";
import "@mdxeditor/editor/style.css";
import { actions, isInputError } from "astro:actions";
import { useActionState, useEffect, useRef, useState } from "react";

interface MarkdownEditorProps {
  noteData: NoteData;
}

export const MarkdownEditor = ({ noteData }: MarkdownEditorProps) => {
  const [notes, setNotes] = useState<string>(noteData.notes || "");
  const [enableSave, setEnableSave] = useState(false);
  const [formSaveState, formSaveAction, isFormSavePending] = useActionState(
    experimental_withState(actions.notes.save),
    { data: { success: false }, error: undefined }
  );
  const [showSaveResult, setShowSaveResult] = useState(false);
  const mdxEditorRef = useRef<MDXEditorMethods>(null);
  const fieldErrors = isInputError(formSaveState.error)
    ? formSaveState.error.fields
    : {};
  let saveResultInterval: number;

  useEffect(() => {
    if (showSaveResult) {
      saveResultInterval = setTimeout(() => {
        setEnableSave(true);
        setShowSaveResult(false);
      }, 1250);
    }
  }, [showSaveResult]);

  useEffect(() => {
    setEnableSave(!isFormSavePending);
    if (!isFormSavePending && !showSaveResult && formSaveState.data?.success) {
      setShowSaveResult(true);
    }
  }, [isFormSavePending]);

  useEffect(() => {
    mdxEditorRef.current?.setMarkdown(notes);
  }, [notes]);

  return (
    <>
      <MDXEditor
        ref={mdxEditorRef}
        onChange={() => {
          clearTimeout(saveResultInterval);
          setNotes(mdxEditorRef.current?.getMarkdown() || "");
          setEnableSave(true);
          setShowSaveResult(false);
        }}
        plugins={[
          linkDialogPlugin(),
          headingsPlugin(),
          linkPlugin(),
          listsPlugin(),
          quotePlugin(),
          thematicBreakPlugin(),
          toolbarPlugin({
            toolbarContents: () => (
              <>
                <UndoRedo />
                <BoldItalicUnderlineToggles />
                <BlockTypeSelect />
                <ListsToggle />
                <CreateLink />
              </>
            ),
          }),
        ]}
        // Note: Cannot set this to {notes} here, must use the useEffect that
        //       calls setMarkdown on the mdxEditorRef. This is due to how the
        //       mdx editor works where it will try to set the state of the
        //       editor before the component mounts.
        markdown=""
      />
      <form action={formSaveAction}>
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
        {showSaveResult ? (
          <p
            style={{
              backgroundColor: "green",
              color: "white",
              marginBlockStart: "1rem",
              minWidth: "100%",
              padding: ".5rem",
              textAlign: "center",
            }}
          >
            Note Saved!
          </p>
        ) : (
          <button disabled={isFormSavePending || !enableSave}>
            {isFormSavePending ? "..." : "Save"}
          </button>
        )}
      </form>
    </>
  );
};
