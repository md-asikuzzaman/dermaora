import { Truck, ShieldCheck, RotateCcw } from "lucide-react";

const benefits = [
  {
    label: "Fast Delivery",
    icon: Truck,
  },
  {
    label: "Authentic Product",
    icon: ShieldCheck,
  },
  {
    label: "Easy Returns",
    icon: RotateCcw,
  },
];

const ProductBenefits = () => {
  return (
    <div className="mt-9 grid grid-cols-3 gap-3 border-y border-neutral-200 py-6">
      {benefits.map(({ label, icon: Icon }) => (
        <div
          key={label}
          className="flex flex-col items-center gap-2 text-center"
        >
          <Icon size={21} className="text-[#66836d]" />

          <span className="text-xs text-neutral-600">{label}</span>
        </div>
      ))}
    </div>
  );
};

export default ProductBenefits;
