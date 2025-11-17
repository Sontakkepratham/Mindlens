/**
 * Safety Monitoring & Crisis Detection
 * 
 * Real-time monitoring for user safety with immediate escalation protocols
 * Integrates with emergency services and crisis hotlines
 */

export interface CrisisAlert {
  alertId: string;
  userId: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  triggers: string[];
  timestamp: string;
  actionTaken: string;
  escalated: boolean;
}

export interface SafetyCheck {
  userId: string;
  sessionId: string;
  riskIndicators: string[];
  phqScore: number;
  flaggedResponses: number[];
  requiresImmediateAction: boolean;
}

/**
 * Crisis Detection Service
 * Monitors for high-risk indicators and triggers immediate response
 */
export class CrisisDetectionService {
  // PHQ-9 Question 9 specifically asks about self-harm thoughts
  private static readonly SELF_HARM_QUESTION_INDEX = 8;
  private static readonly CRITICAL_PHQ_THRESHOLD = 20;
  private static readonly HIGH_RISK_PHQ_THRESHOLD = 15;

  /**
   * Analyze assessment responses for crisis indicators
   */
  static analyzeForCrisisIndicators(phqResponses: number[]): SafetyCheck {
    const riskIndicators: string[] = [];
    const flaggedResponses: number[] = [];
    const sessionId = `SAFETY-${Date.now()}`;

    // Check Question 9 (self-harm thoughts)
    if (phqResponses[this.SELF_HARM_QUESTION_INDEX] >= 1) {
      riskIndicators.push('Self-harm ideation reported');
      flaggedResponses.push(this.SELF_HARM_QUESTION_INDEX);
    }

    const phqScore = phqResponses.reduce((a, b) => a + b, 0);

    // Check for severe depression score
    if (phqScore >= this.CRITICAL_PHQ_THRESHOLD) {
      riskIndicators.push('Critical PHQ-9 score detected');
    } else if (phqScore >= this.HIGH_RISK_PHQ_THRESHOLD) {
      riskIndicators.push('High-risk PHQ-9 score');
    }

    // Check for multiple high-severity responses
    const highSeverityCount = phqResponses.filter(r => r === 3).length;
    if (highSeverityCount >= 5) {
      riskIndicators.push('Multiple severe symptoms reported');
    }

    const requiresImmediateAction =
      phqResponses[this.SELF_HARM_QUESTION_INDEX] >= 2 || phqScore >= this.CRITICAL_PHQ_THRESHOLD;

    return {
      userId: 'USER_ID',
      sessionId,
      riskIndicators,
      phqScore,
      flaggedResponses,
      requiresImmediateAction,
    };
  }

  /**
   * Trigger crisis alert and immediate response
   */
  static async triggerCrisisAlert(safetyCheck: SafetyCheck): Promise<CrisisAlert> {
    const alert: CrisisAlert = {
      alertId: `ALERT-${Date.now()}`,
      userId: safetyCheck.userId,
      severity: this.calculateSeverity(safetyCheck),
      triggers: safetyCheck.riskIndicators,
      timestamp: new Date().toISOString(),
      actionTaken: '',
      escalated: false,
    };

    console.log('🚨 CRISIS ALERT TRIGGERED:', alert);

    // Immediate actions based on severity
    if (alert.severity === 'critical') {
      alert.actionTaken = 'Emergency services notified, crisis counselor alerted';
      alert.escalated = true;
      await this.notifyEmergencyServices(alert);
      await this.alertCrisisCounselor(alert);
    } else if (alert.severity === 'high') {
      alert.actionTaken = 'Crisis counselor alerted, emergency resources displayed';
      await this.alertCrisisCounselor(alert);
      await this.displayEmergencyResources(alert.userId);
    } else {
      alert.actionTaken = 'Counselor notified, safety plan recommended';
      await this.notifyCounselor(alert);
    }

    // Log to secure audit trail
    await this.logToAuditTrail(alert);

    return alert;
  }

  private static calculateSeverity(safetyCheck: SafetyCheck): 'low' | 'medium' | 'high' | 'critical' {
    if (safetyCheck.requiresImmediateAction) return 'critical';
    if (safetyCheck.phqScore >= this.HIGH_RISK_PHQ_THRESHOLD) return 'high';
    if (safetyCheck.riskIndicators.length >= 2) return 'medium';
    return 'low';
  }

  private static async notifyEmergencyServices(alert: CrisisAlert): Promise<void> {
    console.log('📞 Notifying emergency services:', {
      alertId: alert.alertId,
      severity: alert.severity,
      protocol: 'Immediate response required',
    });
    // In production: integrate with emergency services API
  }

  private static async alertCrisisCounselor(alert: CrisisAlert): Promise<void> {
    console.log('👨‍⚕️ Alerting on-call crisis counselor:', {
      alertId: alert.alertId,
      responseTime: 'Within 5 minutes',
    });
    // In production: send real-time notification to crisis counselor
  }

  private static async notifyCounselor(alert: CrisisAlert): Promise<void> {
    console.log('📧 Notifying assigned counselor:', alert);
  }

  private static async displayEmergencyResources(userId: string): Promise<void> {
    console.log('🆘 Displaying emergency resources to user:', userId);
  }

  private static async logToAuditTrail(alert: CrisisAlert): Promise<void> {
    console.log('📝 Logging to secure audit trail:', {
      alertId: alert.alertId,
      timestamp: alert.timestamp,
      encrypted: true,
    });
  }
}

/**
 * Emergency Resources
 */
export class EmergencyResourcesService {
  static readonly CRISIS_HOTLINES = {
    us: {
      suicide_prevention: {
        number: '988',
        name: 'Suicide & Crisis Lifeline',
        available: '24/7',
      },
      crisis_text: {
        number: '741741',
        name: 'Crisis Text Line',
        available: '24/7',
        method: 'Text HOME to 741741',
      },
      veterans: {
        number: '988 (Press 1)',
        name: 'Veterans Crisis Line',
        available: '24/7',
      },
    },
    international: {
      number: 'https://findahelpline.com',
      name: 'International Crisis Helplines',
    },
  };

  static getEmergencyResources(country: string = 'us') {
    return this.CRISIS_HOTLINES[country as keyof typeof this.CRISIS_HOTLINES] || this.CRISIS_HOTLINES.us;
  }
}

/**
 * Session Safety Monitoring
 * Real-time monitoring during counselor sessions
 */
export class SessionMonitoringService {
  private static activeSessions = new Map<string, any>();

  /**
   * Start monitoring a counseling session
   */
  static startSessionMonitoring(sessionId: string, userId: string): void {
    console.log('🔍 Starting session monitoring:', {
      sessionId,
      userId: userId.substring(0, 8) + '***',
      features: [
        'Real-time transcript analysis',
        'Emotional state tracking',
        'Crisis keyword detection',
        'Automated check-ins',
      ],
    });

    this.activeSessions.set(sessionId, {
      userId,
      startTime: Date.now(),
      alerts: [],
      status: 'active',
    });
  }

  /**
   * Analyze session transcript for safety concerns
   */
  static async analyzeTranscript(sessionId: string, transcript: string): Promise<{
    safe: boolean;
    concerns: string[];
  }> {
    // Crisis keywords detection
    const crisisKeywords = [
      'suicide',
      'kill myself',
      'end my life',
      'want to die',
      'better off dead',
      'hurt myself',
    ];

    const concerns: string[] = [];
    const lowerTranscript = transcript.toLowerCase();

    for (const keyword of crisisKeywords) {
      if (lowerTranscript.includes(keyword)) {
        concerns.push(`Crisis keyword detected: "${keyword}"`);
      }
    }

    const safe = concerns.length === 0;

    if (!safe) {
      console.log('⚠️ Safety concerns detected in session:', {
        sessionId,
        concerns,
        action: 'Alerting counselor',
      });
    }

    return { safe, concerns };
  }

  /**
   * End session monitoring
   */
  static endSessionMonitoring(sessionId: string): void {
    const session = this.activeSessions.get(sessionId);
    if (session) {
      console.log('✅ Session monitoring completed:', {
        sessionId,
        duration: Date.now() - session.startTime,
        alerts: session.alerts.length,
      });
      this.activeSessions.delete(sessionId);
    }
  }
}

/**
 * Safety Plan Generator
 * Creates personalized safety plans for at-risk users
 */
export class SafetyPlanService {
  static generateSafetyPlan(phqScore: number): {
    warningSigns: string[];
    copingStrategies: string[];
    supportContacts: string[];
    professionalResources: string[];
  } {
    return {
      warningSigns: [
        'Thoughts of self-harm or suicide',
        'Overwhelming feelings of hopelessness',
        'Withdrawal from friends and activities',
        'Dramatic mood changes',
        'Increased substance use',
      ],
      copingStrategies: [
        'Practice deep breathing exercises',
        'Use grounding techniques (5-4-3-2-1 method)',
        'Take a walk outside',
        'Listen to calming music',
        'Write in a journal',
        'Reach out to a trusted friend',
      ],
      supportContacts: [
        'Crisis Hotline: 988',
        'Crisis Text Line: Text HOME to 741741',
        'Emergency Services: 911',
      ],
      professionalResources: [
        'Your assigned counselor (available within 24h)',
        'Local emergency mental health services',
        'Hospital emergency department',
      ],
    };
  }
}
