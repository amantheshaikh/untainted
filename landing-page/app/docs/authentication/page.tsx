
export const metadata = {
  title: "Authentication - Untainted Docs",
  description: "How to authenticate with the Untainted API.",
}

export default function AuthenticationPage() {
  return (
    <div className="space-y-6">
      <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl">Authentication</h1>
      <p className="leading-7 [&:not(:first-child)]:mt-6 text-lg text-muted-foreground">
        The Untainted API uses API keys to authenticate requests. You can view and manage your API keys in your dashboard.
      </p>

      <div className="p-4 bg-muted/50 rounded-lg border border-border my-6">
          <p className="text-sm">
            <strong>Note:</strong> Your API keys carry many privileges, so be sure to keep them secure! Do not share your secret API keys in publicly accessible areas such as GitHub, client-side code, etc.
          </p>
      </div>

      <h2 className="scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight mt-10">
        API Keys
      </h2>
      <p className="leading-7 [&:not(:first-child)]:mt-6">
        Include your key in the <code>x-api-key</code> header of your request.
      </p>
      
      <div className="language-bash rounded-lg border bg-muted px-4 py-3 font-mono text-sm mt-4">
        curl https://api.untainted.io/check \<br/>
        &nbsp;&nbsp;-H "x-api-key: sk_live_..." \<br/>
        &nbsp;&nbsp;-d ...
      </div>

      <h3 className="scroll-m-20 text-xl font-semibold tracking-tight mt-8">
        Key Variants
      </h3>
       <ul className="list-disc pl-6 space-y-2 mt-4">
        <li><strong>Live (<code>sk_live_...</code>)</strong>: Production environment. Hits are billed and affect production data.</li>
        <li><strong>Test (<code>sk_test_...</code>)</strong>: Sandbox environment. Use these for development and testing integration.</li>
       </ul>
    </div>
  )
}
