import SubscriptionPlans from "~/components/subscription-plans/SubscriptionPlans";

export default function SubscriptionPage() {
  return (
    <div className="w-fit h-screen mx-auto px-4 py-8 flex flex-col justify-center items-center">
      <h1 className="text-3xl font-bold mb-8">Join our network</h1>
      <SubscriptionPlans />
    </div>
  )
}