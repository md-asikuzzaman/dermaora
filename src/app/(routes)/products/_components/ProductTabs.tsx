"use client";

import { ProductDetails } from "@/types/product-details.prisma";
import { useState } from "react";

interface Props {
  product: ProductDetails;
}

const ProductTabs = ({ product }: Props) => {
  const [activeTab, setActiveTab] = useState<
    "description" | "benefits" | "ingredients" | "usage" | "details"
  >("description");

  const tabs = [
    { key: "description", label: "Description" },
    { key: "benefits", label: "Benefits" },
    { key: "ingredients", label: "Ingredients" },
    { key: "usage", label: "How to Use" },
    { key: "details", label: "Product Details" },
  ] as const;

  return (
    <section className="mt-20 border-t border-neutral-200 pt-10">
      {/* Tabs Navigation */}
      <div className="flex flex-wrap gap-x-8 gap-y-4 border-b border-neutral-200">
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

      {/* Tab Content */}
      <div className="max-w-3xl py-8 text-sm leading-8 text-neutral-600">
        {activeTab === "description" && (
          <div className="space-y-4">
            {product.description ? (
              <p className="whitespace-pre-line">{product.description}</p>
            ) : (
              <p>No description available.</p>
            )}
          </div>
        )}

        {activeTab === "benefits" && (
          <div>
            {product.benefits.length > 0 ? (
              <ul className="space-y-3">
                {product.benefits.map((benefit, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[#315c49]" />
                    <span>{benefit}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <p>No benefits information available.</p>
            )}

            {product.keyFeatures.length > 0 && (
              <div className="mt-8">
                <h3 className="mb-4 font-semibold text-neutral-900">
                  Key Features
                </h3>

                <ul className="space-y-3">
                  {product.keyFeatures.map((feature, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[#315c49]" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}

        {activeTab === "ingredients" &&
          (product.ingredients ? (
            <p className="whitespace-pre-line">{product.ingredients}</p>
          ) : (
            <p>No ingredients information available.</p>
          ))}

        {activeTab === "usage" &&
          (product.howToUse ? (
            <p className="whitespace-pre-line">{product.howToUse}</p>
          ) : (
            <p>No usage information available.</p>
          ))}

        {activeTab === "details" && (
          <div className="divide-y divide-neutral-100">
            {[
              { label: "Product Name", value: product.name },
              { label: "Brand", value: product.brand.name },
              { label: "Category", value: product.category.name },
              { label: "SKU", value: product.sku },
              { label: "Volume", value: product.volume },
              {
                label: "Skin Type",
                value: product.skinType.join(", "),
              },
            ]
              .filter((item) => item.value)
              .map((item) => (
                <div key={item.label} className="grid grid-cols-3 gap-4 py-3">
                  <span className="font-medium text-neutral-800">
                    {item.label}
                  </span>

                  <span className="col-span-2">{item.value}</span>
                </div>
              ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default ProductTabs;
