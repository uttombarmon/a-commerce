"use client";

import { useState } from "react";
import type { ProductDetail, QAItem } from "@/types/product";
import { ReviewsSection } from "./ReviewsSection";
import { ChevronDown, ChevronUp } from "lucide-react";

// ─── Sub-tab: Description ─────────────────────────────────────────────────────

function DescriptionTab({ description, features }: { description: string; features: string[] }) {
  return (
    <div className="pdp-tab-panel">
      <div
        className="pdp-description"
        dangerouslySetInnerHTML={{ __html: description }}
      />
      {features.length > 0 && (
        <>
          <h3 className="pdp-section-subtitle">Key Features</h3>
          <ul className="pdp-features-list">
            {features.map((f, i) => (
              <li key={i} className="pdp-features-list__item">
                <span className="pdp-features-list__check" aria-hidden="true">✓</span>
                {f}
              </li>
            ))}
          </ul>
        </>
      )}
    </div>
  );
}

// ─── Sub-tab: Specifications ──────────────────────────────────────────────────

function SpecsTab({ specs }: { specs: { label: string; value: string }[] }) {
  return (
    <div className="pdp-tab-panel">
      <table className="pdp-specs-table" aria-label="Product specifications">
        <tbody>
          {specs.map((s, i) => (
            <tr key={i} className="pdp-specs-table__row">
              <th className="pdp-specs-table__label" scope="row">{s.label}</th>
              <td className="pdp-specs-table__value">{s.value}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// ─── Sub-tab: Q&A ─────────────────────────────────────────────────────────────

function QAAccordion({ qa }: { qa: QAItem[] }) {
  const [open, setOpen] = useState<string | null>(null);
  return (
    <div className="pdp-tab-panel">
      <div className="pdp-qa">
        {qa.map((item) => (
          <div key={item.id} className="pdp-qa__item">
            <button
              className="pdp-qa__question"
              onClick={() => setOpen(open === item.id ? null : item.id)}
              aria-expanded={open === item.id}
            >
              <span>Q: {item.question}</span>
              {open === item.id ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
            </button>
            {open === item.id && (
              <div className="pdp-qa__answer">
                <p><strong>A:</strong> {item.answer}</p>
                <div className="pdp-qa__meta">
                  Asked by <em>{item.askedBy}</em> · Answered by <strong>{item.answeredBy}</strong> · {item.date}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Main Tabs component ──────────────────────────────────────────────────────

type TabId = "description" | "specs" | "reviews" | "qa";

const TABS: { id: TabId; label: string }[] = [
  { id: "description", label: "Description" },
  { id: "specs", label: "Specifications" },
  { id: "reviews", label: "Reviews" },
  { id: "qa", label: "Q&A" },
];

export function ProductTabs({ product }: { product: ProductDetail }) {
  const [active, setActive] = useState<TabId>("description");

  return (
    <div className="pdp-tabs" id="product-tabs">
      {/* Tab bar */}
      <div className="pdp-tabs__bar" role="tablist" aria-label="Product information tabs">
        {TABS.map((tab) => (
          <button
            key={tab.id}
            id={`tab-${tab.id}`}
            role="tab"
            aria-selected={active === tab.id}
            aria-controls={`tabpanel-${tab.id}`}
            onClick={() => setActive(tab.id)}
            className={`pdp-tabs__tab ${active === tab.id ? "pdp-tabs__tab--active" : ""}`}
          >
            {tab.label}
            {tab.id === "reviews" && (
              <span className="pdp-tabs__count">
                {product.totalReviews.toLocaleString()}
              </span>
            )}
            {tab.id === "qa" && (
              <span className="pdp-tabs__count">{product.qa.length}</span>
            )}
          </button>
        ))}
      </div>

      {/* Panels */}
      <div
        id={`tabpanel-${active}`}
        role="tabpanel"
        aria-labelledby={`tab-${active}`}
        className="pdp-tabs__content"
      >
        {active === "description" && (
          <DescriptionTab description={product.description} features={product.features} />
        )}
        {active === "specs" && <SpecsTab specs={product.specs} />}
        {active === "reviews" && (
          <ReviewsSection
            rating={product.rating}
            totalReviews={product.totalReviews}
            breakdown={product.ratingBreakdown}
            reviews={product.reviewList}
          />
        )}
        {active === "qa" && <QAAccordion qa={product.qa} />}
      </div>
    </div>
  );
}
