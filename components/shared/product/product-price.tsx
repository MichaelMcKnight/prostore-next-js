import { cn } from "@/lib/utils";

const ProductPrice = ({
  value,
  className,
}: {
  value: number;
  className?: string;
}) => {
  const num = Number(value);

  if (!Number.isFinite(num)) {
    return <p className={cn("text-2xl", className)}>-</p>;
  }

  const [intValue, floatValue] = num.toFixed(2).split(".");

  return (
    <p className={cn("text-2xl", className)}>
      <span className="text-xs align-super">$</span>
      {intValue}
      <span className="text-xs align-super">.{floatValue}</span>
    </p>
  );
};

export default ProductPrice;
