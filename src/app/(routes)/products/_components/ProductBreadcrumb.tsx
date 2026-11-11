import Link from "next/link";

interface Props {
  category: string;
  productName: string;
}

const ProductBreadcrumb = ({ category, productName }: Props) => {
  return (
    <nav className="mb-8 flex flex-wrap items-center gap-2 text-sm text-neutral-400">
      <Link href="/" className="transition hover:text-[#315c49]">
        Home
      </Link>

      <span>/</span>

      <span>{category}</span>

      <span>/</span>

      <span className="text-neutral-800">{productName}</span>
    </nav>
  );
};

export default ProductBreadcrumb;
