
export const metadata = {
  title: "Introduction - Untainted Docs",
  description: "Introduction to the Untainted Food Intelligence Layer.",
}

export default function IntroductionPage() {
  return (
    <div className="space-y-6">
      <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl">Introduction</h1>
      <p className="leading-7 [&:not(:first-child)]:mt-6 text-lg text-muted-foreground">
        Untainted provides a robust <strong>food intelligence layer</strong> for platforms.
        Our API enables quick-commerce, grocery, and health apps to deliver personalized safety checks for millions of users.
      </p>

      <h2 className="scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight first:mt-0 mt-10">
        Core Capability: Safety Checks
      </h2>
      <p className="leading-7 [&:not(:first-child)]:mt-6">
        The <code>/check</code> endpoint is the heart of the Untainted stack. It determines if a product is "safe" or "not_safe" for a specific customer based on their unique profile (diets, allergies, health goals).
      </p>

      <div className="my-6 w-full overflow-y-auto">
        <h3 className="text-xl font-semibold mb-2">Workflow:</h3>
        <ul className="list-disc pl-6 space-y-2">
            <li><strong>Identify</strong>: Analyze a product's ingredient list.</li>
            <li><strong>Contextualize</strong>: Apply the customer's specific profile (passed as preferences or via UID).</li>
            <li><strong>Decide</strong>: Receive a binary <code>status</code> ("safe" | "not_safe") along with detailed conflict reasoning.</li>
        </ul>
      </div>

       <h2 className="scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight mt-10">
        Product Contribution
      </h2>
      <p className="leading-7 [&:not(:first-child)]:mt-6">
         Untainted maintains a comprehensive database of food products. We encourage partners to contribute missing data to expand the shared intelligence network.
      </p>
    </div>
  )
}
