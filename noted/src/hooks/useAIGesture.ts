import { useEffect } from "react";
import {
  useEditor,
  type TLShapeId,
  type TLDrawShape,
  createShapeId,
  toRichText,
} from "tldraw";
import { askGemini } from "./aiService";

export function useAIGesture() {
  const editor = useEditor();

  useEffect(() => {
    const cleanup = editor.sideEffects.registerAfterChangeHandler(
      "shape",
      (prev, next) => {
        if (next.type !== "draw") return;

        const prevShape = prev as TLDrawShape;
        const nextShape = next as TLDrawShape;

        // Only trigger exactly when the user lifts their pen
        if (prevShape.props.isComplete || !nextShape.props.isComplete) return;

        const bounds = editor.getShapePageBounds(nextShape);
        if (!bounds) return;

        const geometry = editor.getShapeGeometry(nextShape);
        const vertices = geometry.vertices;

        let isSloppyLoop = false;
        if (vertices && vertices.length > 0) {
          const firstPoint = vertices[0];
          const lastPoint = vertices[vertices.length - 1];
          const gapDistance = Math.hypot(
            lastPoint.x - firstPoint.x,
            lastPoint.y - firstPoint.y,
          );
          isSloppyLoop = gapDistance < Math.max(bounds.w, bounds.h) * 0.35;
        }

        // min width
        const hasMeaningfulWidth = bounds.w > 80;

        // aspect ratio
        const isVeryFlat = bounds.w > bounds.h * 4;

        // size threshold
        const lowJitter = bounds.h < 35;

        const isUnderline =
          isVeryFlat &&
          hasMeaningfulWidth &&
          lowJitter &&
          !nextShape.props.isClosed &&
          !isSloppyLoop;

        // detect box
        const isLargeEnoughBox = bounds.w > 40 && bounds.h > 40;
        const isBox =
          (nextShape.props.isClosed || isSloppyLoop) && isLargeEnoughBox;

        if (isBox) {
          handleGestureTrigger("box", next.id, bounds);
        } else if (isUnderline) {
          handleGestureTrigger("underline", next.id, bounds);
        }
      },
    );

    return () => cleanup();
  }, [editor]);

  const handleGestureTrigger = async (
    type: "box" | "underline",
    shapeId: TLShapeId,
    bounds: any,
  ) => {
    // confirm detection visually
    editor.updateShape({
      id: shapeId,
      type: "draw",
      props: { color: type === "box" ? "blue" : "red" },
    });

    // capture shapes logic
    const allShapes = editor.getCurrentPageShapes();
    const shapesToCapture = allShapes.filter((s) => {
      if (s.id === shapeId) return false;
      const sBounds = editor.getShapePageBounds(s);
      if (!sBounds) return false;
      return type === "box"
        ? bounds.collides(sBounds) || bounds.contains(sBounds)
        : sBounds.maxX > bounds.minX &&
            sBounds.minX < bounds.maxX &&
            sBounds.maxY > bounds.minY - 150 &&
            sBounds.minY < bounds.maxY + 20;
    });

    if (shapesToCapture.length === 0) return;

    // thinking note for user
    const responseNoteId = createShapeId();
    editor.createShape({
      id: responseNoteId,
      type: "text",
      x: bounds.maxX + 40,
      y: bounds.minY,
      props: {
        richText: toRichText("Thinking..."),
        color: "grey",
      },
    } as any);

    // 4. Export to b64
    const result = await editor.toImage(
      shapesToCapture.map((s) => s.id),
      { format: "png", background: true, padding: 16 },
    );
    if (!result || !result.blob) return;

    const reader = new FileReader();
    reader.readAsDataURL(result.blob);
    reader.onloadend = async () => {
      const base64data = reader.result as string;

      try {
        // 5. Prompt Gemini
        const answer = await askGemini(base64data, type);

        // 6. updates thinking note with answer
        editor.updateShape({
          id: responseNoteId,
          type: "text",
          props: {
            richText: toRichText(answer ?? "No response from AI"),
            color: "blue",
          },
        } as any);
      } catch (err) {
        console.error(err);
        // Update the note to show the error
        editor.updateShape({
          id: responseNoteId,
          type: "text",
          props: {
            richText: toRichText(
              `AI Error: ${err instanceof Error ? err.message : "Unknown"}`,
            ),
            color: "red",
          },
        } as any);
      }
    };
  };
}
