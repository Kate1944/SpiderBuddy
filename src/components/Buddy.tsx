// import { useEffect, useRef } from 'react';
// import { useNavigate } from 'react-router-dom';

// const BuddyOverlay = () => {
//   const navigate = useNavigate();
//   const widgetContainerRef = useRef<HTMLDivElement>(null);

//   useEffect(() => {
//     // Load ElevenLabs Convai Widget script
//     const script = document.createElement('script');
//     script.src = 'https://elevenlabs.io/convai-widget/index.js';
//     script.async = true;
//     document.body.appendChild(script);

//     script.onload = () => {
//       // Initialize the widget once script is loaded
//       if (widgetContainerRef.current && (window as any).ElevenLabsConvai) {
//         const widget = (window as any).ElevenLabsConvai;
//         widget.init({
//           agentId: 'agent_6601k6rkq328fjh80dfvcz3y4ea6', // Replace with your actual agent ID
//           // Optional configuration
//           // avatar: 'https://your-avatar-url.com/avatar.png',
//           // onMessage: (message: any) => console.log('Message:', message),
//           // onConnect: () => console.log('Connected to agent'),
//           // onDisconnect: () => console.log('Disconnected from agent'),
//         });
//       }
//     };

//     return () => {
//       // Cleanup script on unmount
//       if (document.body.contains(script)) {
//         document.body.removeChild(script);
//       }
//     };
//   }, []);

//   return (
//     <div className="flex flex-col h-screen bg-gradient-to-br from-purple-50 to-blue-50">
//       {/* Header */}
//       <div className="flex items-center justify-between p-4 bg-white shadow-sm">
//         <div className="flex items-center gap-3">
//           <button
//             onClick={() => navigate('/notepad')}
//             className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
//             aria-label="Back to notepad"
//           >
//             <svg
//               className="w-6 h-6 text-gray-600"
//               fill="none"
//               stroke="currentColor"
//               viewBox="0 0 24 24"
//             >
//               <path
//                 strokeLinecap="round"
//                 strokeLinejoin="round"
//                 strokeWidth={2}
//                 d="M15 19l-7-7 7-7"
//               />
//             </svg>
//           </button>
//           <h1 className="text-2xl font-bold text-gray-800">Buddy Assistant</h1>
//         </div>
//         <div className="flex items-center gap-2">
//           <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
//           <span className="text-sm text-gray-600">Online</span>
//         </div>
//       </div>

//       {/* Chat Container */}
//       <div className="flex-1 flex items-center justify-center p-6">
//         <div className="w-full max-w-4xl h-full bg-white rounded-2xl shadow-xl overflow-hidden">
//           {/* Widget Container */}
//           <div
//             ref={widgetContainerRef}
//             id="elevenlabs-convai-widget"
//             className="w-full h-full flex items-center justify-center"
//           >
//             {/* Loading state */}
//             <div className="text-center">
//               <div className="inline-block w-12 h-12 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mb-4"></div>
//               <p className="text-gray-600">Loading Buddy Assistant...</p>
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Footer */}
//       <div className="p-4 bg-white border-t border-gray-200">
//         <p className="text-center text-sm text-gray-500">
//           Powered by ElevenLabs Conversational AI
//         </p>
//       </div>
//     </div>
//   );
// };

// export default BuddyOverlay;