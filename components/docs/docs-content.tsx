import { CodeBlock } from "./code-block"
import { AlertCircle, Info } from "lucide-react"

const curlExample = `curl --location 'https://audionix-production.up.railway.app/transcribe' \\
--header 'X-API-Key: YOUR_API_KEY' \\
--form 'file=@"/path/to/audio.mp3"'`

const responseExample = `{
  "text": "Hello this is the transcribed audio text."
}`

const headerExample = `X-API-Key: YOUR_API_KEY`

export function DocsContent() {
  return (
    <main className="lg:pl-64 min-h-screen">
      <div className="max-w-3xl mx-auto px-6 py-12 lg:py-16">
        {/* Introduction */}
        <section id="introduction" className="mb-16">
          <h1 className="text-4xl font-bold tracking-tight mb-4 text-balance">
            AUDIONIX Speech-to-Text API
          </h1>
          <p className="text-lg text-muted-foreground leading-relaxed">
            The AUDIONIX API allows developers to easily convert speech audio into text. 
            Simply upload an audio file and receive an accurate transcription using our 
            simple REST API. Perfect for building voice-enabled applications, transcription 
            services, and accessibility features.
          </p>
        </section>

        {/* Endpoint Overview */}
        <section id="endpoint" className="mb-16">
          <h2 className="text-2xl font-semibold mb-4">Endpoint Overview</h2>
          <p className="text-muted-foreground mb-4">
            All transcription requests are made to a single endpoint:
          </p>
          <div className="flex items-center gap-3 p-4 rounded-lg border border-border bg-secondary/30">
            <span className="px-2 py-1 rounded text-xs font-semibold bg-accent text-accent-foreground">
              POST
            </span>
            <code className="font-mono text-sm text-foreground">
              https://audionix-production.up.railway.app/transcribe
            </code>
          </div>
          <p className="text-muted-foreground mt-4">
            This endpoint accepts audio files and returns the transcribed text in JSON format.
          </p>
        </section>

        {/* Authentication */}
        <section id="authentication" className="mb-16">
          <h2 className="text-2xl font-semibold mb-4">Authentication</h2>
          <p className="text-muted-foreground mb-4">
            All requests to the API must include an API key in the request headers. 
            Include your API key using the <code className="px-1.5 py-0.5 rounded bg-secondary font-mono text-sm">X-API-Key</code> header:
          </p>
          <CodeBlock code={headerExample} language="http" />
          <p className="text-muted-foreground mt-4">
            Replace <code className="px-1.5 py-0.5 rounded bg-secondary font-mono text-sm">YOUR_API_KEY</code> with 
            your actual API key.
          </p>
        </section>

        {/* Request Format */}
        <section id="request-format" className="mb-16">
          <h2 className="text-2xl font-semibold mb-4">Request Format</h2>
          <p className="text-muted-foreground mb-4">
            Requests must be sent as <code className="px-1.5 py-0.5 rounded bg-secondary font-mono text-sm">multipart/form-data</code> with 
            the audio file attached.
          </p>

          <h3 className="text-lg font-medium mb-3 mt-6">Parameters</h3>
          <div className="border border-border rounded-lg overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="bg-secondary/50">
                  <th className="px-4 py-3 text-left text-sm font-semibold">Name</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold">Type</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold">Required</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold">Description</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-t border-border">
                  <td className="px-4 py-3 font-mono text-sm">file</td>
                  <td className="px-4 py-3 text-sm text-muted-foreground">File</td>
                  <td className="px-4 py-3">
                    <span className="px-2 py-0.5 rounded text-xs font-medium bg-accent/20 text-accent">
                      Yes
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm text-muted-foreground">
                    Audio file to transcribe (mp3, wav, m4a supported)
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="flex items-start gap-3 mt-4 p-4 rounded-lg border border-border bg-secondary/20">
            <Info className="h-5 w-5 text-accent shrink-0 mt-0.5" />
            <p className="text-sm text-muted-foreground">
              Maximum file size: <strong className="text-foreground">25MB</strong>
            </p>
          </div>
        </section>

        {/* Example Request */}
        <section id="example-request" className="mb-16">
          <h2 className="text-2xl font-semibold mb-4">Example Request</h2>
          <p className="text-muted-foreground mb-4">
            Here is an example of how to make a transcription request using cURL:
          </p>
          <CodeBlock code={curlExample} language="bash" />
        </section>

        {/* Example Response */}
        <section id="example-response" className="mb-16">
          <h2 className="text-2xl font-semibold mb-4">Example Response</h2>
          <p className="text-muted-foreground mb-4">
            A successful request returns a JSON object containing the transcribed text:
          </p>
          <CodeBlock code={responseExample} language="json" />
        </section>

        {/* Notes & Limitations */}
        <section id="notes" className="mb-16">
          <h2 className="text-2xl font-semibold mb-4">Notes & Limitations</h2>
          <div className="p-5 rounded-lg border border-border bg-secondary/20">
            <div className="flex items-start gap-3">
              <AlertCircle className="h-5 w-5 text-accent shrink-0 mt-0.5" />
              <div className="space-y-3">
                <p className="font-medium">Important Information</p>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li className="flex items-start gap-2">
                    <span className="text-accent">•</span>
                    Maximum audio file size is 25MB
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-accent">•</span>
                    This demo runs on limited resources
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-accent">•</span>
                    High concurrency may cause slower responses
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-accent">•</span>
                    Accuracy may vary because a lightweight speech model is used
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="pt-8 border-t border-border">
          <p className="text-sm text-muted-foreground text-center">
            © 2026 Audionix – Voice to Text API Demo
          </p>
        </footer>
      </div>
    </main>
  )
}
