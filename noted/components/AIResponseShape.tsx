"use client";

import { useEffect, useRef } from "react";
import {
  BaseBoxShapeUtil,
  HTMLContainer,
  useEditor,
  type TLBaseShape,
} from "@tldraw/editor";
import { T } from "@tldraw/validate";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

export type AIResponseShapeProps = {
  markdown: string;
  w: number;
  h: number;
  isThinking: boolean;
};

export type AIResponseShape = TLBaseShape<"ai-response", AIResponseShapeProps>;

const CARD_WIDTH = 380;
const PADDING = 24;

// @ts-expect-error
export class AIResponseShapeUtil extends BaseBoxShapeUtil<AIResponseShape> {
  static override type = "ai-response" as const;
  static override props = {
    markdown: T.string,
    w: T.number,
    h: T.number,
    isThinking: T.boolean,
  };

  getDefaultProps(): AIResponseShapeProps {
    return { markdown: "", w: CARD_WIDTH, h: 60, isThinking: true };
  }

  component(shape: AIResponseShape) {
    const editor = useEditor();
    const contentRef = useRef<HTMLDivElement>(null);
    const isDark = document.documentElement.classList.contains("dark");

    useEffect(() => {
      if (!contentRef.current) return;
      const measured = contentRef.current.scrollHeight + PADDING;
      if (Math.abs(measured - shape.props.h) > 4) {
        editor.updateShape({
          id: shape.id,
          type: "ai-response",
          props: { h: measured },
        } as any);
      }
    }, [shape.props.markdown, shape.props.isThinking]);

    return (
      <HTMLContainer
        id={shape.id}
        style={{ pointerEvents: "none", userSelect: "none" }}
      >
        <div
          ref={contentRef}
          style={{
            width: shape.props.w,
            padding: "14px 16px",
            background: isDark
              ? "rgba(43,45,49,0.97)"
              : "rgba(255,255,255,0.97)",
            border: `1px solid ${isDark ? "#1e1f22" : "#e4e4e7"}`,
            borderRadius: "14px",
            boxShadow: "0 4px 20px rgba(0,0,0,0.15)",
            color: isDark ? "#f4f4f5" : "#18181b",
            fontSize: "13px",
            lineHeight: "1.65",
            fontFamily: "system-ui, -apple-system, sans-serif",
            boxSizing: "border-box",
          }}
        >
          {shape.props.isThinking ? (
            <span
              style={{
                color: isDark ? "#71717a" : "#a1a1aa",
                fontStyle: "italic",
              }}
            >
              Thinking…
            </span>
          ) : (
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              components={{
                h1: ({ children }) => (
                  <h1
                    style={{
                      fontSize: "1.3em",
                      fontWeight: 700,
                      margin: "0 0 8px",
                    }}
                  >
                    {children}
                  </h1>
                ),
                h2: ({ children }) => (
                  <h2
                    style={{
                      fontSize: "1.15em",
                      fontWeight: 700,
                      margin: "10px 0 6px",
                    }}
                  >
                    {children}
                  </h2>
                ),
                h3: ({ children }) => (
                  <h3
                    style={{
                      fontSize: "1.05em",
                      fontWeight: 600,
                      margin: "8px 0 4px",
                    }}
                  >
                    {children}
                  </h3>
                ),
                p: ({ children }) => (
                  <p style={{ margin: "0 0 8px" }}>{children}</p>
                ),
                ul: ({ children }) => (
                  <ul style={{ margin: "0 0 8px", paddingLeft: "18px" }}>
                    {children}
                  </ul>
                ),
                ol: ({ children }) => (
                  <ol style={{ margin: "0 0 8px", paddingLeft: "18px" }}>
                    {children}
                  </ol>
                ),
                li: ({ children }) => (
                  <li style={{ margin: "2px 0" }}>{children}</li>
                ),
                code: ({ children, className }) => {
                  const isBlock = !className?.includes("inline");
                  return isBlock ? (
                    <code
                      style={{
                        display: "block",
                        background: isDark ? "#111113" : "#f4f4f5",
                        border: `1px solid ${isDark ? "#2b2d31" : "#e4e4e7"}`,
                        borderRadius: "8px",
                        padding: "10px 12px",
                        fontFamily: "monospace",
                        fontSize: "0.88em",
                        whiteSpace: "pre-wrap",
                        wordBreak: "break-all",
                        margin: "4px 0 8px",
                      }}
                    >
                      {children}
                    </code>
                  ) : (
                    <code
                      style={{
                        background: isDark ? "#111113" : "#f4f4f5",
                        border: `1px solid ${isDark ? "#2b2d31" : "#e4e4e7"}`,
                        borderRadius: "4px",
                        padding: "1px 5px",
                        fontFamily: "monospace",
                        fontSize: "0.88em",
                      }}
                    >
                      {children}
                    </code>
                  );
                },
                pre: ({ children }) => (
                  <pre style={{ margin: "4px 0 8px", overflow: "visible" }}>
                    {children}
                  </pre>
                ),
                blockquote: ({ children }) => (
                  <blockquote
                    style={{
                      borderLeft: `3px solid ${isDark ? "#5865F2" : "#5865F2"}`,
                      margin: "4px 0 8px",
                      paddingLeft: "10px",
                      color: isDark ? "#a1a1aa" : "#71717a",
                      fontStyle: "italic",
                    }}
                  >
                    {children}
                  </blockquote>
                ),
                strong: ({ children }) => (
                  <strong style={{ fontWeight: 700 }}>{children}</strong>
                ),
                table: ({ children }) => (
                  <table
                    style={{
                      borderCollapse: "collapse",
                      width: "100%",
                      margin: "4px 0 8px",
                      fontSize: "0.9em",
                    }}
                  >
                    {children}
                  </table>
                ),
                th: ({ children }) => (
                  <th
                    style={{
                      border: `1px solid ${isDark ? "#2b2d31" : "#e4e4e7"}`,
                      padding: "4px 8px",
                      background: isDark ? "#1e1f22" : "#f4f4f5",
                      fontWeight: 700,
                      textAlign: "left",
                    }}
                  >
                    {children}
                  </th>
                ),
                td: ({ children }) => (
                  <td
                    style={{
                      border: `1px solid ${isDark ? "#2b2d31" : "#e4e4e7"}`,
                      padding: "4px 8px",
                    }}
                  >
                    {children}
                  </td>
                ),
              }}
            >
              {shape.props.markdown}
            </ReactMarkdown>
          )}
        </div>
      </HTMLContainer>
    );
  }

  indicator(shape: AIResponseShape) {
    return <rect width={shape.props.w} height={shape.props.h} rx={14} />;
  }
}
