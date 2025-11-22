import { useState } from "react";
import { OnboardingScreen } from "./components/OnboardingScreen";
import { ConsentScreen } from "./components/ConsentScreen";
import { QuestionnaireScreen } from "./components/QuestionnaireScreen";
import { ResultsScreen } from "./components/ResultsScreen";
import { RecommendationsScreen } from "./components/RecommendationsScreen";
import { BookingConfirmationScreen } from "./components/BookingConfirmationScreen";
import { SelfCareResourcesScreen } from "./components/SelfCareResourcesScreen";
import { PersonalityTestScreen } from "./components/PersonalityTestScreen";
import { PersonalityResultsScreen } from "./components/PersonalityResultsScreen";
import type { PersonalityResults } from "./components/PersonalityTestScreen";
import { MLDashboardScreen } from "./components/MLDashboardScreen";
import { CredentialsHelpScreen } from "./components/CredentialsHelpScreen";
import { CredentialsUploadScreen } from "./components/CredentialsUploadScreen";
import { SigninScreen } from "./components/SigninScreen";
import { SignupScreen } from "./components/SignupScreen";
import { StroopTest } from "./components/stroop/StroopTest";
import { DetailedReportScreen } from "./components/DetailedReportScreen";
import { ProfileDashboardScreen } from "./components/ProfileDashboardScreen";
import { AboutUsScreen } from "./components/AboutUsScreen";
import { ConnectWithUsScreen } from "./components/ConnectWithUsScreen";
import { AIChatScreen } from "./components/AIChatScreen";
import type { ProfileData } from "./components/ProfileDashboardScreen";
import {
  checkSession,
  storeSession,
  signOutUser,
} from "./lib/auth";
import "./lib/debug-auth"; // Load debug utilities

type Screen =
  | "signin"
  | "signup"
  | "onboarding"
  | "consent"
  | "questionnaire"
  | "results"
  | "recommendations"
  | "booking"
  | "self-care"
  | "personality-test"
  | "personality-results"
  | "ml-dashboard"
  | "credentials-help"
  | "credentials-upload"
  | "stroop-test"
  | "detailed-report"
  | "profile"
  | "about-us"
  | "connect-with-us"
  | "ai-chat";

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
  const [selectedCounselor, setSelectedCounselor] =
    useState("Dr. Sarah Chen");
  const [showSetup, setShowSetup] = useState(true);
  const [personalityResults, setPersonalityResults] =
    useState<PersonalityResults | undefined>(undefined);
  const [profileData, setProfileData] = useState<ProfileData | undefined>(undefined);

  const handleStartAssessment = () => {
    setCurrentScreen("consent");
  };

  const handleConsentContinue = () => {
    setCurrentScreen("questionnaire");
  };

  const handleQuestionnaireSubmit = (data: number[]) => {
    setResponses(data);
    // Simulate camera emotion analysis in the background
    // In production, this would be collected during the questionnaire or in a separate step
    console.log(
      "PHQ-9 responses submitted. Camera-based emotion analysis included in model.",
    );
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
    accessToken: string,
  ) => {
    console.log('🎉 Sign in success! Storing session:', {
      userId: userId.substring(0, 8) + '***',
      email,
      accessTokenLength: accessToken?.length,
      accessTokenStart: accessToken?.substring(0, 30) + '...',
    });
    
    setUserId(userId);
    setUserEmail(email);
    storeSession(userId, accessToken, email);
    
    console.log('✅ Session stored in localStorage');
    
    setCurrentScreen("onboarding");
  };

  const handleSignupSuccess = (
    userId: string,
    email: string,
    accessToken: string,
  ) => {
    console.log('🎉 Sign up success! Storing session:', {
      userId: userId.substring(0, 8) + '***',
      email,
      accessTokenLength: accessToken?.length,
      accessTokenStart: accessToken?.substring(0, 30) + '...',
    });
    
    setUserId(userId);
    setUserEmail(email);
    storeSession(userId, accessToken, email);
    
    console.log('✅ Session stored in localStorage');
    
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

  const handleViewSelfCare = () => {
    setCurrentScreen("self-care");
  };

  const handleStartPersonalityTest = () => {
    setCurrentScreen("personality-test");
  };

  const handlePersonalityTestSubmit = (
    results: PersonalityResults,
  ) => {
    setPersonalityResults(results);
    setCurrentScreen("personality-results");
  };

  const handleStartStroopTest = () => {
    setCurrentScreen("stroop-test");
  };

  const handleViewDetailedReport = () => {
    setCurrentScreen("detailed-report");
  };

  const handleViewProfile = () => {
    setCurrentScreen("profile");
  };

  const handleViewAboutUs = () => {
    setCurrentScreen("about-us");
  };

  const handleViewConnectWithUs = () => {
    setCurrentScreen("connect-with-us");
  };

  const handleStartAIChat = () => {
    setCurrentScreen("ai-chat");
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className={`w-full ${currentScreen === "ai-chat" ? "max-w-4xl" : "max-w-md"}`}>
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

        {/* Credentials Help Screen */}
        {currentScreen === "credentials-help" && (
          <CredentialsHelpScreen
            onClose={() => setCurrentScreen("onboarding")}
          />
        )}

        {/* Credentials Upload Screen */}
        {currentScreen === "credentials-upload" && (
          <CredentialsUploadScreen
            onClose={() => setCurrentScreen("onboarding")}
          />
        )}

        {/* Admin: ML Dashboard Access Button */}
        {currentScreen === "onboarding" && (
          <div className="mb-4 space-y-2">
            {" "}
            {/* User Info Bar */}
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
          </div>
        )}

        {currentScreen === "onboarding" && (
          <OnboardingScreen 
            onStart={handleStartAssessment}
            onStartPersonalityTest={handleStartPersonalityTest}
            onStartStroopTest={handleStartStroopTest}
            onViewProfile={handleViewProfile}
            onViewAboutUs={handleViewAboutUs}
            onViewConnectWithUs={handleViewConnectWithUs}
            onViewDetailedReport={responses.length > 0 ? handleViewDetailedReport : undefined}
            onStartAIChat={handleStartAIChat}
          />
        )}
        {currentScreen === "consent" && (
          <ConsentScreen onContinue={handleConsentContinue} />
        )}
        {currentScreen === "questionnaire" && (
          <QuestionnaireScreen
            onSubmit={handleQuestionnaireSubmit}
          />
        )}
        {currentScreen === "results" && (
          <ResultsScreen
            phqScore={responses.reduce((a, b) => a + b, 0)}
            onViewRecommendations={handleViewRecommendations}
            onViewSelfCare={handleViewSelfCare}
          />
        )}
        {currentScreen === "recommendations" && (
          <RecommendationsScreen
            phqScore={responses.reduce((a, b) => a + b, 0)}
            onBookSession={handleBookSession}
            onEmergencyContact={handleEmergencyContact}
            onViewSelfCare={handleViewSelfCare}
          />
        )}
        {currentScreen === "booking" && (
          <BookingConfirmationScreen
            counselorName={selectedCounselor}
            onComplete={handleBookingComplete}
            onViewSelfCare={handleViewSelfCare}
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
        {currentScreen === "self-care" && (
          <SelfCareResourcesScreen
            onBack={() => setCurrentScreen("onboarding")}
          />
        )}
        {currentScreen === "personality-test" && (
          <PersonalityTestScreen
            onComplete={handlePersonalityTestSubmit}
            onBack={() => setCurrentScreen("onboarding")}
          />
        )}
        {currentScreen === "personality-results" && personalityResults && (
          <PersonalityResultsScreen
            results={personalityResults}
            onReturnHome={() => setCurrentScreen("onboarding")}
            onRetakeTest={() => setCurrentScreen("personality-test")}
          />
        )}
        {currentScreen === "stroop-test" && (
          <StroopTest
            onBack={() => setCurrentScreen("onboarding")}
          />
        )}
        {currentScreen === "detailed-report" && (
          <DetailedReportScreen
            phqScore={responses.reduce((a, b) => a + b, 0)}
            responses={responses}
            userEmail={userEmail}
            onBack={() => setCurrentScreen("onboarding")}
          />
        )}
        {currentScreen === "profile" && (
          <ProfileDashboardScreen
            userEmail={userEmail}
            onBack={() => setCurrentScreen("onboarding")}
            onSave={(data: ProfileData) => {
              setProfileData(data);
              console.log('Profile data saved:', data);
            }}
          />
        )}
        {currentScreen === "about-us" && (
          <AboutUsScreen
            onBack={() => setCurrentScreen("onboarding")}
          />
        )}
        {currentScreen === "connect-with-us" && (
          <ConnectWithUsScreen
            onBack={() => setCurrentScreen("onboarding")}
          />
        )}
        {currentScreen === "ai-chat" && (
          <AIChatScreen
            onBack={() => setCurrentScreen("onboarding")}
            onSignOut={handleSignOut}
          />
        )}
      </div>
    </div>
  );
}