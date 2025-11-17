import { useState } from "react";
import { OnboardingScreen } from "./components/OnboardingScreen";
import { ConsentScreen } from "./components/ConsentScreen";
import { QuestionnaireScreen } from "./components/QuestionnaireScreen";
import { FaceScanScreen } from "./components/FaceScanScreen";
import { ResultsScreen } from "./components/ResultsScreen";
import { RecommendationsScreen } from "./components/RecommendationsScreen";
import { BookingConfirmationScreen } from "./components/BookingConfirmationScreen";
import { MLDashboardScreen } from "./components/MLDashboardScreen";
import { SystemTestScreen } from "./components/SystemTestScreen";
import { CredentialsHelpScreen } from "./components/CredentialsHelpScreen";
import { CredentialsUploadScreen } from "./components/CredentialsUploadScreen";
import { SimpleSetupScreen } from "./components/SimpleSetupScreen";
import { SigninScreen } from "./components/SigninScreen";
import { SignupScreen } from "./components/SignupScreen";
import {
  checkSession,
  storeSession,
  signOutUser,
} from "./lib/auth";

type Screen =
  | "signin"
  | "signup"
  | "system-test"
  | "onboarding"
  | "consent"
  | "questionnaire"
  | "facescan"
  | "results"
  | "recommendations"
  | "booking"
  | "ml-dashboard"
  | "credentials-help"
  | "credentials-upload";

export default function App() {
  // Check for existing session on load
  const session = checkSession();

  const [currentScreen, setCurrentScreen] = useState<Screen>(
    session.isAuthenticated ? "onboarding" : "signin",
  );
  const [userId, setUserId] = useState<string | undefined>(
    session.userId,
  );
  const [userEmail, setUserEmail] = useState<
    string | undefined
  >(session.email);
  const [responses, setResponses] = useState<number[]>([]);
  const [scanCompleted, setScanCompleted] = useState(false);
  const [selectedCounselor, setSelectedCounselor] =
    useState("Dr. Sarah Chen");
  const [showSetup, setShowSetup] = useState(true);

  const handleStartAssessment = () => {
    setCurrentScreen("consent");
  };

  const handleConsentContinue = () => {
    setCurrentScreen("questionnaire");
  };

  const handleQuestionnaireSubmit = (data: number[]) => {
    setResponses(data);
    setCurrentScreen("facescan");
  };

  const handleScanComplete = () => {
    setScanCompleted(true);
    setCurrentScreen("results");
  };

  const handleViewRecommendations = () => {
    setCurrentScreen("recommendations");
  };

  const handleBookSession = (counselorId: string) => {
    // Map counselor ID to name (in production, this would come from backend)
    const counselorNames: Record<string, string> = {
      "1": "Dr. Sarah Chen",
      "2": "Dr. Michael Torres",
      "3": "Dr. Priya Sharma",
    };
    setSelectedCounselor(
      counselorNames[counselorId] || "Dr. Sarah Chen",
    );
    setCurrentScreen("booking");
  };

  const handleEmergencyContact = () => {
    console.log("Emergency contact initiated");
  };

  const handleBookingComplete = () => {
    // Return to onboarding (in production, this would go to user dashboard)
    setCurrentScreen("onboarding");
  };

  const handleViewMLDashboard = () => {
    setCurrentScreen("ml-dashboard");
  };

  const handleSystemTestComplete = () => {
    setCurrentScreen("onboarding");
  };

  const handleShowCredentialsHelp = () => {
    setCurrentScreen("credentials-help");
  };

  const handleShowCredentialsUpload = () => {
    setCurrentScreen("credentials-upload");
  };

  const handleFixCredentialsFromTest = () => {
    setCurrentScreen("credentials-upload");
  };

  const handleSigninSuccess = (
    userId: string,
    email: string,
  ) => {
    setUserId(userId);
    setUserEmail(email);
    storeSession(userId, "auto-signin", email);
    setCurrentScreen("onboarding");
  };

  const handleSignupSuccess = (
    userId: string,
    email: string,
  ) => {
    setUserId(userId);
    setUserEmail(email);
    storeSession(userId, "auto-signin", email);
    setCurrentScreen("onboarding");
  };

  const handleSwitchToSignup = () => {
    setCurrentScreen("signup");
  };

  const handleSwitchToSignin = () => {
    setCurrentScreen("signin");
  };

  const handleSignOut = async () => {
    await signOutUser();
    setUserId(undefined);
    setUserEmail(undefined);
    setCurrentScreen("signin");
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      {/* Simple Setup Screen - Shows once after auth */}
      {showSetup &&
        currentScreen === "onboarding" &&
        userId && (
          <SimpleSetupScreen
            onContinue={() => setShowSetup(false)}
          />
        )}

      <div className="w-full max-w-md">
        {/* Authentication Screens */}
        {currentScreen === "signin" && (
          <SigninScreen
            onSigninSuccess={handleSigninSuccess}
            onSwitchToSignup={handleSwitchToSignup}
          />
        )}

        {currentScreen === "signup" && (
          <SignupScreen
            onSignupSuccess={handleSignupSuccess}
            onSwitchToSignin={handleSwitchToSignin}
          />
        )}

        {/* System Test Screen (First Run) */}
        {currentScreen === "system-test" && (
          <SystemTestScreen
            onComplete={handleSystemTestComplete}
            onFixCredentials={handleFixCredentialsFromTest}
          />
        )}

        {/* Credentials Help Screen */}
        {currentScreen === "credentials-help" && (
          <CredentialsHelpScreen
            onClose={() => setCurrentScreen("system-test")}
          />
        )}

        {/* Credentials Upload Screen */}
        {currentScreen === "credentials-upload" && (
          <CredentialsUploadScreen
            onClose={() => setCurrentScreen("system-test")}
          />
        )}

        {/* Admin: ML Dashboard Access Button */}
        {currentScreen === "onboarding" && !showSetup && (
          <div className="mb-4 space-y-2">
            <div className="flex items-center justify-between p-2 bg-white rounded border border-slate-200">
              <span className="text-sm text-slate-600">
                Signed in as: <strong>{userEmail}</strong>
              </span>
              <button
                onClick={handleSignOut}
                className="text-xs text-red-600 hover:text-red-700 underline"
              >
                Sign Out
              </button>
            </div>
            <button
              onClick={handleViewMLDashboard}
              className="w-full p-2 text-sm text-slate-600 hover:text-cyan-600 transition-colors"
            >
              🧠 Admin: View ML Training Dashboard
            </button>
            <button
              onClick={handleShowCredentialsUpload}
              className="w-full p-2 text-sm text-slate-600 hover:text-cyan-600 transition-colors"
            >
              🔧 Configure BigQuery (Optional)
            </button>
            <button
              onClick={() => setShowSetup(true)}
              className="w-full p-2 text-sm text-slate-600 hover:text-cyan-600 transition-colors"
            >
              ℹ️ Show Setup Info Again
            </button>
          </div>
        )}

        {currentScreen === "onboarding" && (
          <OnboardingScreen onStart={handleStartAssessment} />
        )}
        {currentScreen === "consent" && (
          <ConsentScreen onContinue={handleConsentContinue} />
        )}
        {currentScreen === "questionnaire" && (
          <QuestionnaireScreen
            onSubmit={handleQuestionnaireSubmit}
          />
        )}
        {currentScreen === "facescan" && (
          <FaceScanScreen onCapture={handleScanComplete} />
        )}
        {currentScreen === "results" && (
          <ResultsScreen
            phqScore={responses.reduce((a, b) => a + b, 0)}
            onViewRecommendations={handleViewRecommendations}
          />
        )}
        {currentScreen === "recommendations" && (
          <RecommendationsScreen
            phqScore={responses.reduce((a, b) => a + b, 0)}
            onBookSession={handleBookSession}
            onEmergencyContact={handleEmergencyContact}
          />
        )}
        {currentScreen === "booking" && (
          <BookingConfirmationScreen
            counselorName={selectedCounselor}
            onComplete={handleBookingComplete}
          />
        )}
        {currentScreen === "ml-dashboard" && (
          <MLDashboardScreen
            onBack={() => setCurrentScreen("onboarding")}
          />
        )}
        {currentScreen === "credentials-upload" && (
          <CredentialsUploadScreen
            onClose={() => setCurrentScreen("onboarding")}
          />
        )}
      </div>
    </div>
  );
}