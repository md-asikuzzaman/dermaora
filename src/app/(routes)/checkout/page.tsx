import Container from "@/components/Container";
import SectionHeader from "@/components/AnimatedHeader";
import CheckoutContent from "./_components/CheckoutContent";

const CheckOutPage = () => {
  return (
    <main className="py-12 md:py-16">
      <Container>
        <SectionHeader
          title="Secure Checkout"
          description="Complete your order with your shipping information and preferred payment method."
        />

        <CheckoutContent />
      </Container>
    </main>
  );
};

export default CheckOutPage;
