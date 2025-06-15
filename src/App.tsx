import './App.css'
import { useState } from 'react'
import Siri from './component/voice'

function App() {
  const [publicKey, setPublicKey] = useState('')
  const [assistantId, setAssistantId] = useState('')

  const isConfigured = publicKey.trim() !== '' && assistantId.trim() !== ''

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 min-h-screen">
          {/* Left Side - Configuration and Instructions */}
          <div className="space-y-8 flex flex-col justify-center">
            {/* Configuration Card */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 max-w-md min-w-md mx-auto ">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Configuration</h2>
              <div className="space-y-4">
                <div>
                  <label htmlFor="publicKey" className="block text-sm font-medium text-gray-700 mb-2">
                    Public Key
                  </label>
                  <input
                    id="publicKey"
                    type="text"
                    value={publicKey}
                    onChange={(e) => setPublicKey(e.target.value)}
                    placeholder="Enter your Vapi public key"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label htmlFor="assistantId" className="block text-sm font-medium text-gray-700 mb-2">
                    Assistant ID
                  </label>
                  <input
                    id="assistantId"
                    type="text"
                    value={assistantId}
                    onChange={(e) => setAssistantId(e.target.value)}
                    placeholder="Enter your assistant ID"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>
            </div>

            {/* Instructions Card */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 max-w-md min-w-md mx-auto max-h-96 overflow-y-auto">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Example Template for Prompt</h2>
              <div className="space-y-4 text-sm text-gray-600">
                <div>
                  <h3 className="font-semibold text-gray-800 mb-2">1. Professional Snapshot</h3>
                  <p className="mb-2"><strong>Role:</strong> [Primary role(s)—e.g., Engineer, Designer]</p>
                  <p className="mb-2"><strong>Current Focus Areas:</strong></p>
                  <ul className="list-disc list-inside ml-4 space-y-1">
                    <li>[Focus area 1]</li>
                    <li>[Focus area 2]</li>
                    <li>[Focus area 3]</li>
                  </ul>
                </div>

                <div>
                  <h3 className="font-semibold text-gray-800 mb-2">2. Personal Interests</h3>
                  <p className="mb-2">In free time, this person enjoys:</p>
                  <ul className="list-disc list-inside ml-4 space-y-1">
                    <li>[Interest / Hobby 1]</li>
                    <li>[Interest / Hobby 2]</li>
                    <li>[Interest / Hobby 3]</li>
                    <li>[Well-being / creative practice]</li>
                  </ul>
                </div>

                <div>
                  <h3 className="font-semibold text-gray-800 mb-2">3. Project Portfolio</h3>
                  <div className="mb-3">
                    <h4 className="font-medium text-gray-700 mb-2">Large Projects</h4>
                    <p className="text-xs text-gray-500 mb-2">(List in reverse-chronological order)</p>
                    <div className="overflow-x-auto">
                      <table className="w-full text-xs border-collapse">
                        <thead>
                          <tr className="border-b border-gray-200">
                            <th className="text-left py-1 pr-4">Project</th>
                            <th className="text-left py-1 pr-4">Year</th>
                            <th className="text-left py-1">Description</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr className="border-b border-gray-100">
                            <td className="py-1 pr-4">[Project Name]</td>
                            <td className="py-1 pr-4">[YYYY]</td>
                            <td className="py-1">[Brief blurb]</td>
                          </tr>
                          <tr className="border-b border-gray-100">
                            <td className="py-1 pr-4">[Project Name]</td>
                            <td className="py-1 pr-4">[YYYY]</td>
                            <td className="py-1">[Brief blurb]</td>
                          </tr>
                          <tr className="border-b border-gray-100">
                            <td className="py-1 pr-4">[Project Name]</td>
                            <td className="py-1 pr-4">[YYYY]</td>
                            <td className="py-1">[Brief blurb]</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-700 mb-2">Small Projects</h4>
                    <div className="overflow-x-auto">
                      <table className="w-full text-xs border-collapse">
                        <thead>
                          <tr className="border-b border-gray-200">
                            <th className="text-left py-1 pr-4">Project</th>
                            <th className="text-left py-1 pr-4">Year</th>
                            <th className="text-left py-1">Description</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr className="border-b border-gray-100">
                            <td className="py-1 pr-4">[Project Name]</td>
                            <td className="py-1 pr-4">[YYYY]</td>
                            <td className="py-1">[Brief blurb]</td>
                          </tr>
                          <tr className="border-b border-gray-100">
                            <td className="py-1 pr-4">[Project Name]</td>
                            <td className="py-1 pr-4">[YYYY]</td>
                            <td className="py-1">[Brief blurb]</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold text-gray-800 mb-2">4. Privacy & Disclosure Rules</h3>
                  <p className="mb-2">Hidden by default – age, education history, and location are omitted unless the user explicitly asks.</p>
                  <p className="mb-2"><strong>Family / personal relationships</strong> – if queried, reply:</p>
                  <p className="italic bg-gray-50 p-2 rounded text-gray-700">
                    "I'm sorry, I don't have access to personal or family-related information."
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Side - AI Interface */}
          <div className="flex items-center justify-center min-h-full">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 w-full max-w-md">
              {isConfigured ? (
                <div className="flex flex-col gap-4 items-center">
                  <p className="text-lg font-light text-zinc-700 text-center">Talk to my AI</p>
                  <Siri theme="ios9" publicKey={publicKey} assistantId={assistantId} />
                </div>
              ) : (
                <div className="text-center py-12">
                  <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                    <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Please enter your configuration</h3>
                  <p className="text-gray-500 text-sm">Enter your Vapi public key and assistant ID to start using the Personal AI.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default App
