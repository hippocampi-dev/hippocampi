// app/features/page.tsx
export default function Features() {
    return (
      <div className="py-16 px-4 md:px-20 bg-white">
        <h1 className="text-3xl font-bold text-gray-800 mb-8 text-center">Features & Services</h1>
        <ul className="max-w-3xl mx-auto list-disc space-y-4 text-lg text-gray-700">
          <li><strong>Virtual Consultations:</strong> Secure telehealth platform for specialists.</li>
          <li><strong>AI-Powered Assessments:</strong> Smart diagnostic tools for cognitive health.</li>
          <li><strong>Insurance & Hospital Partnerships:</strong> Direct integration with leading care networks.</li>
          <li><strong>Automated Admin Tools:</strong> Reduces doctors' paperwork by 20%.</li>
        </ul>
      </div>
    );
  }
  