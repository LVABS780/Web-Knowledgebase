"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useResourceById } from "@/hooks/useResources";
import { useSearchParams } from "next/navigation";
import { BookOpen, ChevronRight } from "lucide-react";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
} from "@/components/ui/breadcrumb";

export default function PublicKnowledgeBasePage() {
  const searchParams = useSearchParams();
  const selectedId = searchParams.get("r") || undefined;
  const { data: selected } = useResourceById(selectedId, !!selectedId);
  const contentRef = useRef<HTMLDivElement | null>(null);
  const [activeSection, setActiveSection] = useState<string>("title");

  const outline = useMemo(() => {
    if (!selected) return [] as { id: string; label: string }[];
    const items: { id: string; label: string }[] = [
      { id: "title", label: selected.title },
    ];
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (selected.sections || []).forEach((s: any, idx: number) => {
      if (s.subtitle) items.push({ id: `s-${idx}`, label: s.subtitle });
    });
    return items;
  }, [selected]);

  const handleLinkClick = useCallback((id: string) => {
    const content = contentRef.current;
    const element = document.getElementById(id);
    if (!content || !element) return;

    const contentRect = content.getBoundingClientRect();
    const elRect = element.getBoundingClientRect();

    const offset = elRect.top - contentRect.top + content.scrollTop - 12;

    content.scrollTo({ top: offset, behavior: "smooth" });
    setActiveSection(id);
  }, []);

  useEffect(() => {
    const onKbScroll = (e: Event) => {
      const detail = (e as CustomEvent)?.detail;
      if (detail) handleLinkClick(detail as string);
    };
    window.addEventListener("kb-scroll-to", onKbScroll as EventListener);
    return () =>
      window.removeEventListener("kb-scroll-to", onKbScroll as EventListener);
  }, [handleLinkClick]);

  useEffect(() => {
    if (!selected) return;
    const hash = window.location.hash?.replace("#", "");
    if (hash) {
      requestAnimationFrame(() => handleLinkClick(hash));
    } else {
      contentRef.current?.scrollTo({ top: 0 });
      setActiveSection("title");
    }
  }, [selected, handleLinkClick]);

  useEffect(() => {
    const content = contentRef.current;
    if (!content) return;
    let raf = 0;

    const onScroll = () => {
      if (raf) cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const contentRect = content.getBoundingClientRect();
        let current = "title";
        for (const item of outline) {
          const el = document.getElementById(item.id);
          if (!el) continue;
          const elRect = el.getBoundingClientRect();
          if (elRect.top - contentRect.top <= 60) {
            current = item.id;
          } else {
            break;
          }
        }
        setActiveSection(current);
      });
    };

    content.addEventListener("scroll", onScroll, { passive: true });
    onScroll();

    return () => {
      content.removeEventListener("scroll", onScroll as EventListener);
      if (raf) cancelAnimationFrame(raf);
    };
  }, [outline]);

  const currentLabel = useMemo(() => {
    const found = outline.find((o) => o.id === activeSection);
    return found ? found.label : selected?.title || "";
  }, [activeSection, outline, selected]);

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-7xl flex flex-col lg:flex-row">
        <main
          className="flex-1 px-4 sm:px-6 lg:px-8
          py-8
        lg:py-12
         max-w-6xl"
        >
          <div
            ref={contentRef}
            className="content-scroll-area overflow-auto max-h-[calc(100vh-8rem)]"
            style={{ scrollBehavior: "smooth" }}
          >
            {!selected && (
              <div className="flex flex-col items-center justify-center h-64 text-center">
                <BookOpen className="h-16 w-16 text-gray-300 mb-4" />
                <p className="text-gray-500 text-lg">
                  Select a resource to view details.
                </p>
              </div>
            )}

            {selected && (
              <article className="prose prose-base sm:prose-lg max-w-5xl flex flex-col flex-wrap">
                <div className="mb-6">
                  <Breadcrumb className="text-sm">
                    <BreadcrumbItem>
                      <button
                        onClick={() => {
                          window.history.replaceState(null, "", `#title`);
                          handleLinkClick("title");
                        }}
                        className="inline-flex items-center gap-2"
                      >
                        {selected.categoryName}
                        <ChevronRight className="h-4 w-4 opacity-40" />
                      </button>
                    </BreadcrumbItem>
                    <BreadcrumbItem>
                      <button
                        onClick={() => {
                          window.history.replaceState(null, "", `#title`);
                          handleLinkClick("title");
                        }}
                        className="inline-flex items-center gap-2"
                      >
                        {selected.title}
                        <ChevronRight className="h-4 w-4 opacity-40" />
                      </button>
                    </BreadcrumbItem>
                    {activeSection !== "title" && (
                      <BreadcrumbItem>
                        <BreadcrumbLink
                          asChild
                          href={`#${activeSection}`}
                          onClick={(e: React.MouseEvent<HTMLAnchorElement>) => {
                            e.preventDefault();
                            window.history.replaceState(
                              null,
                              "",
                              `#${activeSection}`
                            );
                            handleLinkClick(activeSection);
                          }}
                        >
                          <span>{currentLabel}</span>
                        </BreadcrumbLink>
                      </BreadcrumbItem>
                    )}
                  </Breadcrumb>
                </div>

                <header className="mb-8 lg:mb-12">
                  <h1
                    id="title"
                    className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-4 leading-tight"
                  >
                    {selected.title}
                  </h1>
                  {selected.description && (
                    <div className="text-base sm:text-lg text-gray-700 leading-relaxed border-l-4 border-gray-200 pl-4 sm:pl-6 bg-gray-50 p-4 sm:p-6 rounded-r-lg">
                      <div
                        dangerouslySetInnerHTML={{
                          __html: selected.description,
                        }}
                      />
                    </div>
                  )}
                </header>

                <div className="space-y-8 lg:space-y-12">
                  {(selected.sections || []).map((s: any, idx: number) => (
                    <section key={idx}>
                      {s.subtitle && (
                        <h2
                          id={`s-${idx}`}
                          className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 mb-4 lg:mb-6 pb-2 border-b border-gray-200"
                        >
                          {s.subtitle}
                        </h2>
                      )}
                      {s.description && (
                        <div className="text-gray-700 leading-relaxed space-y-4">
                          <div
                            dangerouslySetInnerHTML={{ __html: s.description }}
                          />
                        </div>
                      )}
                    </section>
                  ))}
                </div>
              </article>
            )}
          </div>
        </main>
        <aside className="hidden lg:flex flex-col justify-between min-h-[calc(100vh-2rem)]  bg-zinc-100 w-full md:w-80 flex-shrink-0 lg:border-l border-gray-200 mt-6 lg:mt-0 lg:pl-6 md:fixed md:top-10 md:right-0">
          <div className="mt-20 sm:p-6 overflow-y-auto ">
            {outline.length > 0 && (
              <nav>
                <h3 className="text-sm font-semibold text-gray-900 mb-4 pb-2 border-b border-gray-200">
                  On this page
                </h3>
                <ul className="space-y-2">
                  {outline.map((item) => {
                    const isActive = activeSection === item.id;
                    const isTitle = item.id === "title";

                    return (
                      <li key={item.id}>
                        <button
                          onClick={() => {
                            window.history.replaceState(
                              null,
                              "",
                              `#${item.id}`
                            );
                            handleLinkClick(item.id);
                          }}
                          className={`block w-full text-left text-sm leading-relaxed py-1 px-2 rounded transition-colors duration-200
                    ${
                      isActive
                        ? "text-blue-600 bg-blue-50 font-medium border-l-2 border-blue-600 pl-3"
                        : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                    }
                    ${isTitle ? "font-medium" : ""}`}
                        >
                          {item.label}
                        </button>
                      </li>
                    );
                  })}
                </ul>
              </nav>
            )}
          </div>
        </aside>
      </div>
    </div>
  );
}
