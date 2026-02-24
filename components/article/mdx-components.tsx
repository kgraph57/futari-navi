import type { MDXComponents } from "mdx/types";
import { QaBubble } from "@/components/article/qa-block";

function extractSpeaker(
  text: string,
): { speaker: string; message: string } | null {
  const match = text.match(/^\*\*(.+?)\*\*[「『](.+)[」』]$/);
  if (match) {
    return { speaker: match[1], message: match[2] };
  }

  const matchSimple = text.match(/^\*\*(.+?)\*\*(.+)$/);
  if (matchSimple) {
    return { speaker: matchSimple[1], message: matchSimple[2] };
  }

  return null;
}

function isKeyPointsBlockquote(children: React.ReactNode): boolean {
  if (!children) return false;
  const text = getTextContent(children);
  return text.includes("今号のポイント") || text.includes("ポイント");
}

function getTextContent(node: React.ReactNode): string {
  if (typeof node === "string") return node;
  if (typeof node === "number") return String(node);
  if (!node) return "";
  if (Array.isArray(node)) return node.map(getTextContent).join("");
  if (typeof node === "object" && "props" in node) {
    const element = node as { props: { children?: React.ReactNode } };
    return getTextContent(element.props.children);
  }
  return "";
}

export function createMdxComponents(): MDXComponents {
  return {
    h1: (props) => (
      <h1
        className="mb-6 mt-12 font-heading text-2xl font-semibold text-foreground sm:text-3xl"
        {...props}
      />
    ),
    h2: (props) => (
      <h2
        className="mb-5 mt-12 font-heading text-xl font-semibold text-foreground sm:text-2xl"
        {...props}
      />
    ),
    h3: (props) => (
      <h3
        className="mb-4 mt-8 font-heading text-lg font-semibold text-foreground"
        {...props}
      />
    ),
    p: (props) => {
      const text = getTextContent(props.children);

      const qaMatch = extractSpeaker(text);
      if (qaMatch) {
        return (
          <div className="my-4">
            <QaBubble speaker={qaMatch.speaker}>
              <span
                dangerouslySetInnerHTML={{
                  __html: qaMatch.message
                    .replace(
                      /\*\*(.+?)\*\*/g,
                      '<strong class="font-bold">$1</strong>',
                    )
                    .replace(
                      /\[(\d+)\]/g,
                      '<sup class="text-xs text-sage-600">[$1]</sup>',
                    ),
                }}
              />
            </QaBubble>
          </div>
        );
      }

      return (
        <p
          className="my-5 text-base leading-[1.95] text-foreground"
          {...props}
        />
      );
    },
    strong: (props) => (
      <strong className="font-bold text-foreground" {...props} />
    ),
    em: (props) => <em className="italic text-muted" {...props} />,
    blockquote: (props) => {
      const isKeyPoints = isKeyPointsBlockquote(props.children);

      if (isKeyPoints) {
        return (
          <div className="my-8 rounded-xl border-2 border-sage-200 bg-sage-50/50 p-6">
            <div className="text-foreground [&>p]:my-2 [&>p]:text-base [&>p]:leading-relaxed [&_strong]:font-bold [&_strong]:text-sage-800 [&_ol]:mt-3 [&_ol]:space-y-2 [&_ol]:text-base [&_li]:text-base [&_li]:leading-relaxed">
              {props.children}
            </div>
          </div>
        );
      }

      return (
        <blockquote className="my-7 rounded-lg border-l-4 border-sage-400 bg-sage-50/40 py-4 pl-5 pr-4 text-base leading-[1.9] text-foreground [&>p]:my-2 [&>p]:leading-[1.9] [&_strong]:font-bold [&_strong]:text-sage-800 [&_ul]:mt-3 [&_ul]:space-y-2 [&_li]:text-base [&_li]:leading-relaxed">
          {props.children}
        </blockquote>
      );
    },
    ul: (props) => (
      <ul
        className="my-6 space-y-3 pl-6 text-base leading-[1.9] text-foreground [&>li]:list-disc"
        {...props}
      />
    ),
    ol: (props) => (
      <ol
        className="my-6 space-y-3 pl-6 text-base leading-[1.9] text-foreground [&>li]:list-decimal"
        {...props}
      />
    ),
    li: (props) => <li className="pl-1.5 leading-[1.9]" {...props} />,
    hr: () => (
      <div className="my-10 flex items-center gap-4">
        <div className="h-px flex-1 bg-border" />
        <div className="flex gap-1">
          <span className="h-1.5 w-1.5 rounded-full bg-sage-300" />
          <span className="h-1.5 w-1.5 rounded-full bg-sage-300" />
          <span className="h-1.5 w-1.5 rounded-full bg-sage-300" />
        </div>
        <div className="h-px flex-1 bg-border" />
      </div>
    ),
    a: (props) => (
      <a
        className="text-sage-600 underline underline-offset-2 hover:text-sage-700"
        target="_blank"
        rel="noopener noreferrer"
        {...props}
      />
    ),
    table: (props) => (
      <div className="my-7 overflow-x-auto rounded-xl border border-border shadow-sm">
        <table className="w-full text-sm" {...props} />
      </div>
    ),
    th: (props) => (
      <th
        className="border-b-2 border-sage-200 bg-sage-600 px-5 py-3 text-left text-sm font-semibold text-white"
        {...props}
      />
    ),
    td: (props) => (
      <td
        className="border-b border-border px-5 py-3 text-sm leading-relaxed text-foreground odd:bg-white even:bg-sage-50/30"
        {...props}
      />
    ),
    sup: (props) => <sup className="text-xs text-sage-600" {...props} />,
  };
}
