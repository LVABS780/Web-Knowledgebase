"use client";

import {
  // useEffect,
  useMemo,
  useState,
} from "react";
import { useResourceById } from "@/hooks/useResources";
import { useSearchParams } from "next/navigation";
import { BookOpen } from "lucide-react";

export default function PublicKnowledgeBasePage() {
  const searchParams = useSearchParams();
  const selectedId = searchParams.get("r") || undefined;
  const { data: selected } = useResourceById(selectedId, !!selectedId);
  const [activeSection, setActiveSection] = useState<string>("title");

  const outline = useMemo(() => {
    if (!selected) return [] as { id: string; label: string }[];
    const items: { id: string; label: string }[] = [
      { id: "title", label: selected.title },
    ];
    (selected.sections || []).forEach((s, idx) => {
      if (s.subtitle) items.push({ id: `s-${idx}`, label: s.subtitle });
    });
    return items;
  }, [selected]);

  const handleLinkClick = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      const contentArea = document.querySelector(".content-scroll-area");
      if (contentArea) {
        const elementTop = element.offsetTop;
        contentArea.scrollTo({
          top: elementTop - 100,
          behavior: "smooth",
        });
      }
    }
  };

  // useEffect(() => {
  //   const contentArea = document.querySelector(
  //     ".content-scroll-area"
  //   ) as HTMLElement | null;
  //   if (!contentArea) return;

  //   const handleScroll = () => {
  //     const scrollPosition = contentArea.scrollTop + 10;
  //     const ids = outline.map((o) => o.id);
  //     let current = "title";
  //     for (const id of ids) {
  //       const el = document.getElementById(id);
  //       if (!el) continue;
  //       if (el.offsetTop <= scrollPosition) {
  //         current = id;
  //       } else {
  //         break;
  //       }
  //     }
  //     setActiveSection(current);
  //   };

  //   handleScroll();
  //   contentArea.addEventListener("scroll", handleScroll, { passive: true });
  //   return () => {
  //     contentArea.removeEventListener("scroll", handleScroll as EventListener);
  //   };
  // }, [outline]);

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row">
        <main className="flex-1 px-4 sm:px-6 lg:px-8 py-8 lg:py-12 max-w-4xl w-full">
          <div className="content-scroll-area">
            {!selected && (
              <div className="flex flex-col items-center justify-center h-64 text-center">
                <BookOpen className="h-16 w-16 text-gray-300 mb-4" />
                <p className="text-gray-500 text-lg">
                  Select a resource to view details.
                </p>
              </div>
            )}

            {selected && (
              <article className="prose prose-base sm:prose-lg max-w-none">
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
                  {(selected.sections || []).map((s, idx) => (
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
                            dangerouslySetInnerHTML={{
                              __html: s.description,
                            }}
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

        <aside className="w-full lg:w-64 flex-shrink-0 border-t lg:border-t-0 lg:border-l border-gray-200 mt-6 lg:mt-0 lg:pl-6">
          <div className="fixed top-40 p-4 sm:p-6">
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
                          onClick={() => handleLinkClick(item.id)}
                          className={`
                            block w-full text-left text-sm leading-relaxed py-1 px-2 rounded transition-colors duration-200
                            ${
                              isActive
                                ? "text-blue-600 bg-blue-50 font-medium border-l-2 border-blue-600 pl-3"
                                : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                            }
                            ${isTitle ? "font-medium" : ""}
                          `}
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
