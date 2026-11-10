import { Brand } from "@prisma/client";
import { ArrowLeftIcon } from "lucide-react";
import Link from "next/link";
import Body from "../Body";
import Heading from "../Heading";
import SafeImage from "../SafeImage";

const PopularBrandCard = ({ name, logo, description, slug }: Brand) => {
  return (
    <div className="bg-site-gray-50 group overflow-hidden rounded-[10px]">
      {/* Responsive Optimized Image */}
      <div className="w-full overflow-clip">
        <SafeImage
          src={logo as string}
          alt={name}
          width={400}
          height={400}
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
          className="h-auto w-full object-contain transition-all duration-500 group-hover:scale-110"
        />
      </div>

      {/* Content */}
      <div className="bg-site-gray-50 dark:bg-site-gray-100 flex items-end justify-between p-2 md:p-4">
        <div className="space-y-1">
          <Heading level="h5" variant="semibold" className="line-clamp-1">
            {name || "Brand Name"}
          </Heading>
          {description && (
            <Body
              variant="b2"
              weight="medium"
              className="text-site-gray-500! line-clamp-1"
            >
              {description}
            </Body>
          )}
        </div>

        <Link
          href={true ? `/brand/${slug}` : `${slug}`}
          aria-label={`Go to ${name}`}
          className="border-site-gray-200 dark:border-site-gray-400 hover:border-site-primary-500 dark:hover:border-site-primary-500 group/arrow flex h-7 w-7 shrink-0 items-center justify-center rounded-[8px] border transition-colors md:h-8.5 md:w-8.5"
        >
          <ArrowLeftIcon
            className="group-hover/arrow:text-site-primary-500 h-5 w-5 rotate-145"
            aria-hidden="true"
          />
        </Link>
      </div>
    </div>
  );
};

export default PopularBrandCard;
