interface Props {
  price: number;
  oldPrice: number;
}

const ProductPrice = ({ price, oldPrice }: Props) => {
  const discount =
    oldPrice > price ? Math.round(((oldPrice - price) / oldPrice) * 100) : 0;

  return (
    <div className="mt-7 flex flex-wrap items-center gap-3">
      <span className="text-3xl font-semibold text-[#26372e]">
        ৳{price.toLocaleString("en-BD")}
      </span>

      {discount > 0 && (
        <>
          <span className="text-lg text-neutral-400 line-through">
            ৳{oldPrice.toLocaleString("en-BD")}
          </span>

          <span className="rounded-md bg-[#e7eee7] px-2.5 py-1 text-xs font-semibold text-[#315c49]">
            Save {discount}%
          </span>
        </>
      )}
    </div>
  );
};

export default ProductPrice;
