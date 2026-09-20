import { GoldCalculator } from "@/components/GoldCalculator";

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "Mizan",
  applicationCategory: "FinanceApplication",
  operatingSystem: "Any",
  description:
    "Break a gold jewelry quote into raw gold value, making charge, tax, and markup, in five currencies and two languages.",
  inLanguage: ["en", "ar"],
  offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
  featureList: [
    "18K, 21K, 22K and 24K rates from one market price",
    "Making charge per gram or as a percentage",
    "Markup percentage over raw gold value",
    "Shop by shop comparison",
    "Reverse calculation of an implied making charge",
  ],
};

export default function Home() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <GoldCalculator />
    </>
  );
}
