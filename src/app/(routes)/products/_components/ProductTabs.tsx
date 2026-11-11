"use client";

import { useState } from "react";
import { ProductDetails } from "./test";

interface Props {
  product: ProductDetails;
}

const ProductTabs = ({ product }: Props) => {
  const [activeTab, setActiveTab] = useState<
    "description" | "ingredients" | "usage"
  >("description");

  const tabs = [
    { key: "description", label: "Description" },
    { key: "ingredients", label: "Ingredients" },
    { key: "usage", label: "How to Use" },
  ] as const;

  const content = {
    description: product.description,
    ingredients: product.ingredients,
    usage: product.usage,
  };

  return (
    <section className="mt-20 border-t border-neutral-200 pt-10">
      <div className="flex flex-wrap gap-8 border-b border-neutral-200">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`pb-4 text-sm font-medium transition ${
              activeTab === tab.key
                ? "border-b-2 border-[#315c49] text-[#315c49]"
                : "text-neutral-400 hover:text-neutral-800"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="max-w-3xl py-8 text-sm leading-8 text-neutral-600">
        {content[activeTab]}
      </div>
    </section>
  );
};

export default ProductTabs;
