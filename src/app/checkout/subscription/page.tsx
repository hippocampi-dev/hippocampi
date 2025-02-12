import SubscriptionPlans from "~/components/subscription-plans/page";

export default function SubscriptionPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Join the patient network</h1>
      <SubscriptionPlans />
    </div>
  )
}