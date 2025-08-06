import React from 'react';

const DataDeletionInstructionsPage = () => {
  return (
    <div className="container mx-auto p-8">
      <h1 className="text-3xl font-bold mb-6">Requesting Data Deletion</h1>
      <p className="mb-4">
        The smartchatbot.click platform processes data on behalf of businesses you interact with on Facebook and WhatsApp. If you wish to have your conversation data deleted from our platform, please follow these instructions:
      </p>

      <h2 className="text-2xl font-semibold mb-4">1. Contact the Business Directly</h2>
      <p className="mb-4">
        The most direct way to request data deletion is to contact the specific business or Facebook Page you were communicating with and request that they delete your data. As a data processor, we act on their instructions.
      </p>

      <h2 className="text-2xl font-semibold mb-4">2. Email Us Directly</h2>
      <p className="mb-4">
        Alternatively, you can email us directly at <a href="mailto:support@smartchatbot.click" className="text-blue-600 hover:underline">support@smartchatbot.click</a> with the subject &quot;Data Deletion Request&quot;. Please provide your name and clearly identify the business you were talking to (e.g., by providing the name of their Facebook Page or WhatsApp Business account) so we can process your request efficiently.
      </p>

      <h2 className="text-2xl font-semibold mb-4">Important Information</h2>
      <ul className="list-disc list-inside mb-4">
        <li>We will process all deletion requests in accordance with applicable privacy laws and our agreements with our business clients.</li>
        <li>Please note that deleting data from our platform may not remove it from Facebook&apos;s or WhatsApp&apos;s own systems. You may need to contact those platforms directly for their data deletion procedures.</li>
      </ul>
    </div>
  );
};

export default DataDeletionInstructionsPage;