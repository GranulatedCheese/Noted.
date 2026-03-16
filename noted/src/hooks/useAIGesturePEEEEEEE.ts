import { useEffect } from "react";
import { useEditor, type TLShapeId, type TLDrawShape } from "tldraw";

export function useAIGesture() {
  const editor = useEditor();

  const boxDetectionSensitivity = 0.35;

  useEffect(() => {
    const cleanup = editor.sideEffects.registerAfterChangeHandler(
      "shape",
      (prev, next) => {
        if (next.type !== "draw") return;

        const prevShape = prev as TLDrawShape;
        const nextShape = next as TLDrawShape;

        // trigger on pen lift
        if (prevShape.props.isComplete || !nextShape.props.isComplete) return;

        const bounds = editor.getShapePageBounds(nextShape);
        if (!bounds) return;

        // Sloppy Box Detection
        const geometry = editor.getShapeGeometry(nextShape);
        const vertices = geometry.vertices;

        let isSloppyLoop = false;

        if (vertices && vertices.length > 0) {
          const firstPoint = vertices[0];
          const lastPoint = vertices[vertices.length - 1];

          // pixel distance between start and pen life
          const gapDistance = Math.hypot(
            lastPoint.x - firstPoint.x,
            lastPoint.y - firstPoint.y,
          );

          // if gap < than boxDetectionSensitivity% of the shape's largest dimension, counts as loop
          const maxDimension = Math.max(bounds.w, bounds.h);
          isSloppyLoop = gapDistance < maxDimension * boxDetectionSensitivity;
        }

        // Math Helpers
        const isLargeEnough = bounds.w > 40 && bounds.h > 40;
        const isFlat = bounds.w > 40 && bounds.h < bounds.w * 0.4;

        // detect box using sloppy detection
        if ((nextShape.props.isClosed || isSloppyLoop) && isLargeEnough) {
          handleGestureTrigger("box", next.id, bounds);
        }
        // detect underline flat and no loop
        else if (isFlat && !nextShape.props.isClosed && !isSloppyLoop) {
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
    editor.updateShape({
      id: shapeId,
      type: "draw",
      props: { color: type === "box" ? "blue" : "red" },
    });

    // find data inside or above box/line
    const allShapes = editor.getCurrentPageShapes();
    const shapesToCapture = allShapes.filter((s) => {
      if (s.id === shapeId) return false; // DOES NOT INCLUDE GESTURE

      const sBounds = editor.getShapePageBounds(s);
      if (!sBounds) return false;

      if (type === "box") {
        return bounds.collides(sBounds) || bounds.contains(sBounds);
      } else {
        // underline - grabs shapes above line
        return (
          sBounds.maxX > bounds.minX &&
          sBounds.minX < bounds.maxX &&
          sBounds.maxY > bounds.minY - 150 &&
          sBounds.minY < bounds.maxY + 20
        );
      }
    });

    if (shapesToCapture.length === 0) {
      console.log("No notes found inside the gesture!");
      return;
    }

    console.log(
      `Found ${shapesToCapture.length} shapes. Generating image snapshot...`,
    );

    // export shapes to image
    const shapeIdsToExport = shapesToCapture.map((s) => s.id);
    const result = await editor.toImage(shapeIdsToExport, {
      format: "png",
      background: true, // white bg for ai to easily read
      padding: 16,
    });

    if (!result || !result.blob) {
      console.error("Failed to generate image snapshot.");
      return;
    }

    // Convert Blob to Base64
    const reader = new FileReader();
    reader.readAsDataURL(result.blob);
    reader.onloadend = () => {
      const base64data = reader.result as string;
      console.log("Base64 Image Ready!");

      // Unit Testing - opens image in new tab
      const newWindow = window.open();
      newWindow?.document.write(
        `<img src="${base64data}" style="border: 2px solid #5865F2; border-radius: 8px; box-shadow: 0 4px 12px rgba(0,0,0,0.1); margin: 20px;" />`,
      );
    };
  };
}
