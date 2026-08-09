-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "email" TEXT NOT NULL,
    "name" TEXT,
    "passwordHash" TEXT,
    "role" TEXT NOT NULL DEFAULT 'STUDENT',
    "country" TEXT NOT NULL DEFAULT 'PE',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "FeedbackReport" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "type" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'NEW',
    "title" TEXT NOT NULL,
    "body" TEXT NOT NULL,
    "sectionId" TEXT,
    "pagePath" TEXT,
    "userAgent" TEXT,
    "email" TEXT,
    "userId" TEXT,
    "adminNote" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "FeedbackReport_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Progress" (
    "userId" TEXT NOT NULL,
    "sectionId" TEXT NOT NULL,
    "subStep" TEXT NOT NULL,
    "completed" BOOLEAN NOT NULL DEFAULT false,
    "completedAt" DATETIME,
    "bookmarked" BOOLEAN NOT NULL DEFAULT false,

    PRIMARY KEY ("userId", "sectionId", "subStep"),
    CONSTRAINT "Progress_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "QuestionBank" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "sectionId" TEXT NOT NULL,
    "concept" TEXT NOT NULL,
    "variant" INTEGER NOT NULL,
    "question" TEXT NOT NULL,
    "options" TEXT NOT NULL,
    "correctIndex" INTEGER NOT NULL,
    "explanation" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "ExamAttempt" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "sectionId" TEXT NOT NULL,
    "attemptNumber" INTEGER NOT NULL,
    "answers" TEXT NOT NULL,
    "score" REAL NOT NULL,
    "startedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "completedAt" DATETIME,
    "timeSpentSec" INTEGER NOT NULL DEFAULT 0,
    "variantSeed" TEXT NOT NULL,
    CONSTRAINT "ExamAttempt_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "ExerciseAttempt" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "sectionId" TEXT NOT NULL,
    "exerciseId" TEXT NOT NULL,
    "usedHint" BOOLEAN NOT NULL DEFAULT false,
    "correct" BOOLEAN NOT NULL DEFAULT false,
    "attemptedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "ExerciseAttempt_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "SubscriptionPlan" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "code" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "pricingJSON" TEXT NOT NULL,
    "featuresJSON" TEXT NOT NULL,
    "maxSections" INTEGER NOT NULL DEFAULT -1,
    "hasExams" BOOLEAN NOT NULL DEFAULT true,
    "hasPlayground" BOOLEAN NOT NULL DEFAULT true,
    "hasCertificate" BOOLEAN NOT NULL DEFAULT false,
    "hasMentorship" BOOLEAN NOT NULL DEFAULT false,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "Subscription" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "planId" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'ACTIVE',
    "billingCycle" TEXT NOT NULL DEFAULT 'MONTHLY',
    "currency" TEXT NOT NULL DEFAULT 'PEN',
    "amount" REAL NOT NULL,
    "provider" TEXT NOT NULL DEFAULT 'MANUAL',
    "providerSubId" TEXT,
    "currentPeriodStart" DATETIME NOT NULL,
    "currentPeriodEnd" DATETIME NOT NULL,
    "cancelAtPeriodEnd" BOOLEAN NOT NULL DEFAULT false,
    "trialEnd" DATETIME,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Subscription_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "Subscription_planId_fkey" FOREIGN KEY ("planId") REFERENCES "SubscriptionPlan" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Payment" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "subscriptionId" TEXT,
    "amount" REAL NOT NULL,
    "currency" TEXT NOT NULL DEFAULT 'PEN',
    "provider" TEXT NOT NULL,
    "providerPaymentId" TEXT,
    "status" TEXT NOT NULL DEFAULT 'PENDING',
    "failureReason" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Payment_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "Payment_subscriptionId_fkey" FOREIGN KEY ("subscriptionId") REFERENCES "Subscription" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "SupervisorProfile" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'NOT_REQUESTED',
    "entitlement" TEXT NOT NULL DEFAULT 'PRO',
    "useCase" TEXT,
    "organization" TEXT,
    "anticipatedSize" INTEGER NOT NULL DEFAULT 10,
    "termsVersion" TEXT NOT NULL DEFAULT '1.0',
    "requestedAt" DATETIME,
    "approvedAt" DATETIME,
    "approvedBy" TEXT,
    "suspendedAt" DATETIME,
    "suspendReason" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "SupervisorProfile_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Cohort" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "ownerId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "status" TEXT NOT NULL DEFAULT 'ACTIVE',
    "visibilityJSON" TEXT NOT NULL DEFAULT '{}',
    "reportingJSON" TEXT NOT NULL DEFAULT '{}',
    "maxMembers" INTEGER NOT NULL DEFAULT 25,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "archivedAt" DATETIME,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Cohort_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "CohortMembership" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "cohortId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "scopedRole" TEXT NOT NULL DEFAULT 'COHORT_LEARNER',
    "status" TEXT NOT NULL DEFAULT 'ACTIVE',
    "consentVersion" TEXT NOT NULL DEFAULT '1.0',
    "invitedBy" TEXT,
    "removedBy" TEXT,
    "removalReason" TEXT,
    "joinedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "leftAt" DATETIME,
    CONSTRAINT "CohortMembership_cohortId_fkey" FOREIGN KEY ("cohortId") REFERENCES "Cohort" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "CohortMembership_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "CohortInvitation" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "cohortId" TEXT NOT NULL,
    "invitedBy" TEXT NOT NULL,
    "intendedUserId" TEXT,
    "intendedEmail" TEXT,
    "tokenHash" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'PENDING',
    "expiresAt" DATETIME NOT NULL,
    "acceptedAt" DATETIME,
    "declinedAt" DATETIME,
    "cancelledAt" DATETIME,
    "deduplicationKey" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "CohortInvitation_cohortId_fkey" FOREIGN KEY ("cohortId") REFERENCES "Cohort" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Notification" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "recipientId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "body" TEXT NOT NULL,
    "actionRoute" TEXT,
    "isRead" BOOLEAN NOT NULL DEFAULT false,
    "isDismissed" BOOLEAN NOT NULL DEFAULT false,
    "readAt" DATETIME,
    "dismissedAt" DATETIME,
    "deduplicationKey" TEXT,
    "expiresAt" DATETIME,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Notification_recipientId_fkey" FOREIGN KEY ("recipientId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "NotificationPreference" (
    "userId" TEXT NOT NULL PRIMARY KEY,
    "emailEnabled" BOOLEAN NOT NULL DEFAULT true,
    "inAppEnabled" BOOLEAN NOT NULL DEFAULT true,
    "digestFrequency" TEXT NOT NULL DEFAULT 'WEEKLY',
    "quietHoursStart" INTEGER NOT NULL DEFAULT 22,
    "quietHoursEnd" INTEGER NOT NULL DEFAULT 7,
    "locale" TEXT NOT NULL DEFAULT 'es',
    CONSTRAINT "NotificationPreference_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "CohortAuditEvent" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "cohortId" TEXT NOT NULL,
    "actorId" TEXT NOT NULL,
    "action" TEXT NOT NULL,
    "targetType" TEXT,
    "targetId" TEXT,
    "beforeState" TEXT,
    "afterState" TEXT,
    "reason" TEXT,
    "requestId" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "CohortAuditEvent_cohortId_fkey" FOREIGN KEY ("cohortId") REFERENCES "Cohort" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "ReportExport" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "requesterId" TEXT NOT NULL,
    "cohortId" TEXT NOT NULL,
    "reportType" TEXT NOT NULL,
    "filtersJSON" TEXT NOT NULL DEFAULT '{}',
    "status" TEXT NOT NULL DEFAULT 'PENDING',
    "artifactPath" TEXT,
    "rowCount" INTEGER NOT NULL DEFAULT 0,
    "expiresAt" DATETIME,
    "failureReason" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "completedAt" DATETIME,
    CONSTRAINT "ReportExport_cohortId_fkey" FOREIGN KEY ("cohortId") REFERENCES "Cohort" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Credential" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "credentialId" TEXT NOT NULL,
    "verificationId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "badgeId" TEXT NOT NULL,
    "badgeName" TEXT NOT NULL,
    "specificationVersion" TEXT NOT NULL,
    "credentialClass" TEXT NOT NULL DEFAULT 'D',
    "capabilityStatement" TEXT NOT NULL,
    "issuedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "expiresAt" DATETIME,
    "revocationStatus" TEXT NOT NULL DEFAULT 'active',
    "holderReference" TEXT NOT NULL,
    "issuer" TEXT NOT NULL DEFAULT 'PyArcana',
    "signature" TEXT NOT NULL,
    "signingKeyVersion" TEXT NOT NULL DEFAULT '1'
);

-- CreateTable
CREATE TABLE "CredentialEvidence" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "credentialId" TEXT NOT NULL,
    "evidenceType" TEXT NOT NULL,
    "evidenceRefId" TEXT NOT NULL,
    "evidenceSummary" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "CredentialEvidence_credentialId_fkey" FOREIGN KEY ("credentialId") REFERENCES "Credential" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "CredentialRevocation" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "credentialId" TEXT NOT NULL,
    "revokedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "revokedBy" TEXT NOT NULL,
    "reason" TEXT NOT NULL,
    "revokedByAdmin" BOOLEAN NOT NULL DEFAULT true,
    CONSTRAINT "CredentialRevocation_credentialId_fkey" FOREIGN KEY ("credentialId") REFERENCES "Credential" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "SubscriptionEvent" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "subscriptionId" TEXT,
    "eventType" TEXT NOT NULL,
    "eventTimestamp" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "planCode" TEXT,
    "statusBefore" TEXT,
    "statusAfter" TEXT,
    "provider" TEXT,
    "providerEventId" TEXT,
    "metadataJSON" TEXT NOT NULL DEFAULT '{}',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "SubscriptionPeriod" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "subscriptionId" TEXT,
    "periodStart" DATETIME NOT NULL,
    "periodEnd" DATETIME NOT NULL,
    "amount" REAL NOT NULL,
    "currency" TEXT NOT NULL DEFAULT 'PEN',
    "provider" TEXT NOT NULL DEFAULT 'MANUAL',
    "providerPaymentId" TEXT,
    "status" TEXT NOT NULL DEFAULT 'ACTIVE',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "Entitlement" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "entitlementKey" TEXT NOT NULL,
    "entitlementValue" TEXT NOT NULL,
    "source" TEXT NOT NULL DEFAULT 'subscription',
    "sourceId" TEXT,
    "startsAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "endsAt" DATETIME,
    "priority" INTEGER NOT NULL DEFAULT 0,
    "revokedAt" DATETIME,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "PaymentEvent" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "paymentId" TEXT,
    "userId" TEXT NOT NULL,
    "eventType" TEXT NOT NULL,
    "provider" TEXT NOT NULL,
    "providerEventId" TEXT,
    "rawPayload" TEXT NOT NULL,
    "amount" REAL,
    "currency" TEXT,
    "eventTimestamp" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "processedAt" DATETIME,
    "processingError" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "WebhookEvent" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "provider" TEXT NOT NULL,
    "eventType" TEXT NOT NULL,
    "providerEventId" TEXT,
    "signature" TEXT,
    "rawBody" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'RECEIVED',
    "processingError" TEXT,
    "processedAt" DATETIME,
    "receivedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "SelfCheckAttempt" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "sectionId" TEXT NOT NULL,
    "questionIndex" INTEGER NOT NULL,
    "selectedIndex" INTEGER NOT NULL,
    "correctIndex" INTEGER NOT NULL,
    "isCorrect" BOOLEAN NOT NULL,
    "contentVersion" TEXT,
    "attemptedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "ContentVersion" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "sectionId" TEXT NOT NULL,
    "version" TEXT NOT NULL,
    "contentHash" TEXT NOT NULL,
    "publishedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "publishedBy" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true
);

-- CreateTable
CREATE TABLE "AdminAuditEvent" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "actorId" TEXT NOT NULL,
    "action" TEXT NOT NULL,
    "targetType" TEXT,
    "targetId" TEXT,
    "beforeState" TEXT,
    "afterState" TEXT,
    "reason" TEXT,
    "requestId" TEXT,
    "ipAddress" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "UserPreferenceEvent" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "preferenceKey" TEXT NOT NULL,
    "oldValue" TEXT,
    "newValue" TEXT,
    "changedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "BadgeDefinition" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "badgeId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "badgeClass" TEXT NOT NULL DEFAULT 'B',
    "specificationVersion" TEXT NOT NULL,
    "criteriaJSON" TEXT NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "BadgeAward" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "badgeDefinitionId" TEXT NOT NULL,
    "awardedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "awardedBy" TEXT,
    "evidenceJSON" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'active',
    "revokedAt" DATETIME,
    "revokeReason" TEXT,
    CONSTRAINT "BadgeAward_badgeDefinitionId_fkey" FOREIGN KEY ("badgeDefinitionId") REFERENCES "BadgeDefinition" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "AnalyticsEvent" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT,
    "eventName" TEXT NOT NULL,
    "eventCategory" TEXT NOT NULL,
    "sectionId" TEXT,
    "propertiesJSON" TEXT NOT NULL DEFAULT '{}',
    "clientTimestamp" DATETIME,
    "serverTimestamp" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "sessionId" TEXT
);

-- CreateTable
CREATE TABLE "DataExportRequest" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'PENDING',
    "format" TEXT NOT NULL DEFAULT 'JSON',
    "artifactPath" TEXT,
    "rowCount" INTEGER NOT NULL DEFAULT 0,
    "requestedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "completedAt" DATETIME,
    "expiresAt" DATETIME,
    "failureReason" TEXT
);

-- CreateTable
CREATE TABLE "AccountDeletionRequest" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'PENDING',
    "reason" TEXT,
    "requestedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "processedAt" DATETIME,
    "processedBy" TEXT,
    "anonymizedAt" DATETIME,
    "failureReason" TEXT
);

-- CreateTable
CREATE TABLE "OutboxEvent" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "aggregateType" TEXT NOT NULL,
    "aggregateId" TEXT NOT NULL,
    "eventType" TEXT NOT NULL,
    "payloadJSON" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'PENDING',
    "attempts" INTEGER NOT NULL DEFAULT 0,
    "maxAttempts" INTEGER NOT NULL DEFAULT 5,
    "lastAttemptAt" DATETIME,
    "lastError" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "processedAt" DATETIME
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE INDEX "FeedbackReport_status_createdAt_idx" ON "FeedbackReport"("status", "createdAt");

-- CreateIndex
CREATE INDEX "FeedbackReport_type_createdAt_idx" ON "FeedbackReport"("type", "createdAt");

-- CreateIndex
CREATE INDEX "FeedbackReport_userId_idx" ON "FeedbackReport"("userId");

-- CreateIndex
CREATE INDEX "Progress_userId_sectionId_idx" ON "Progress"("userId", "sectionId");

-- CreateIndex
CREATE INDEX "QuestionBank_sectionId_concept_idx" ON "QuestionBank"("sectionId", "concept");

-- CreateIndex
CREATE UNIQUE INDEX "QuestionBank_sectionId_concept_variant_key" ON "QuestionBank"("sectionId", "concept", "variant");

-- CreateIndex
CREATE INDEX "ExamAttempt_userId_sectionId_idx" ON "ExamAttempt"("userId", "sectionId");

-- CreateIndex
CREATE UNIQUE INDEX "ExamAttempt_userId_sectionId_attemptNumber_key" ON "ExamAttempt"("userId", "sectionId", "attemptNumber");

-- CreateIndex
CREATE INDEX "ExerciseAttempt_userId_sectionId_exerciseId_idx" ON "ExerciseAttempt"("userId", "sectionId", "exerciseId");

-- CreateIndex
CREATE UNIQUE INDEX "SubscriptionPlan_code_key" ON "SubscriptionPlan"("code");

-- CreateIndex
CREATE UNIQUE INDEX "Subscription_userId_key" ON "Subscription"("userId");

-- CreateIndex
CREATE INDEX "Subscription_status_idx" ON "Subscription"("status");

-- CreateIndex
CREATE INDEX "Subscription_provider_idx" ON "Subscription"("provider");

-- CreateIndex
CREATE INDEX "Payment_userId_status_idx" ON "Payment"("userId", "status");

-- CreateIndex
CREATE INDEX "Payment_provider_status_idx" ON "Payment"("provider", "status");

-- CreateIndex
CREATE UNIQUE INDEX "SupervisorProfile_userId_key" ON "SupervisorProfile"("userId");

-- CreateIndex
CREATE INDEX "SupervisorProfile_status_idx" ON "SupervisorProfile"("status");

-- CreateIndex
CREATE INDEX "Cohort_ownerId_status_idx" ON "Cohort"("ownerId", "status");

-- CreateIndex
CREATE INDEX "CohortMembership_userId_status_idx" ON "CohortMembership"("userId", "status");

-- CreateIndex
CREATE INDEX "CohortMembership_cohortId_status_idx" ON "CohortMembership"("cohortId", "status");

-- CreateIndex
CREATE UNIQUE INDEX "CohortMembership_cohortId_userId_key" ON "CohortMembership"("cohortId", "userId");

-- CreateIndex
CREATE UNIQUE INDEX "CohortInvitation_tokenHash_key" ON "CohortInvitation"("tokenHash");

-- CreateIndex
CREATE INDEX "CohortInvitation_cohortId_status_idx" ON "CohortInvitation"("cohortId", "status");

-- CreateIndex
CREATE INDEX "CohortInvitation_intendedEmail_idx" ON "CohortInvitation"("intendedEmail");

-- CreateIndex
CREATE INDEX "CohortInvitation_intendedUserId_idx" ON "CohortInvitation"("intendedUserId");

-- CreateIndex
CREATE INDEX "Notification_recipientId_isRead_createdAt_idx" ON "Notification"("recipientId", "isRead", "createdAt");

-- CreateIndex
CREATE INDEX "Notification_recipientId_type_createdAt_idx" ON "Notification"("recipientId", "type", "createdAt");

-- CreateIndex
CREATE INDEX "NotificationPreference_userId_idx" ON "NotificationPreference"("userId");

-- CreateIndex
CREATE INDEX "CohortAuditEvent_cohortId_createdAt_idx" ON "CohortAuditEvent"("cohortId", "createdAt");

-- CreateIndex
CREATE INDEX "CohortAuditEvent_actorId_createdAt_idx" ON "CohortAuditEvent"("actorId", "createdAt");

-- CreateIndex
CREATE INDEX "ReportExport_cohortId_status_idx" ON "ReportExport"("cohortId", "status");

-- CreateIndex
CREATE INDEX "ReportExport_requesterId_createdAt_idx" ON "ReportExport"("requesterId", "createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "Credential_credentialId_key" ON "Credential"("credentialId");

-- CreateIndex
CREATE UNIQUE INDEX "Credential_verificationId_key" ON "Credential"("verificationId");

-- CreateIndex
CREATE INDEX "Credential_userId_idx" ON "Credential"("userId");

-- CreateIndex
CREATE INDEX "Credential_badgeId_idx" ON "Credential"("badgeId");

-- CreateIndex
CREATE INDEX "Credential_revocationStatus_idx" ON "Credential"("revocationStatus");

-- CreateIndex
CREATE INDEX "CredentialEvidence_credentialId_idx" ON "CredentialEvidence"("credentialId");

-- CreateIndex
CREATE INDEX "CredentialEvidence_evidenceType_evidenceRefId_idx" ON "CredentialEvidence"("evidenceType", "evidenceRefId");

-- CreateIndex
CREATE INDEX "CredentialRevocation_credentialId_idx" ON "CredentialRevocation"("credentialId");

-- CreateIndex
CREATE INDEX "SubscriptionEvent_userId_eventTimestamp_idx" ON "SubscriptionEvent"("userId", "eventTimestamp");

-- CreateIndex
CREATE INDEX "SubscriptionEvent_eventType_eventTimestamp_idx" ON "SubscriptionEvent"("eventType", "eventTimestamp");

-- CreateIndex
CREATE INDEX "SubscriptionEvent_providerEventId_idx" ON "SubscriptionEvent"("providerEventId");

-- CreateIndex
CREATE INDEX "SubscriptionPeriod_userId_periodStart_idx" ON "SubscriptionPeriod"("userId", "periodStart");

-- CreateIndex
CREATE INDEX "SubscriptionPeriod_subscriptionId_idx" ON "SubscriptionPeriod"("subscriptionId");

-- CreateIndex
CREATE INDEX "Entitlement_userId_entitlementKey_idx" ON "Entitlement"("userId", "entitlementKey");

-- CreateIndex
CREATE INDEX "Entitlement_userId_endsAt_idx" ON "Entitlement"("userId", "endsAt");

-- CreateIndex
CREATE UNIQUE INDEX "PaymentEvent_providerEventId_key" ON "PaymentEvent"("providerEventId");

-- CreateIndex
CREATE INDEX "PaymentEvent_paymentId_idx" ON "PaymentEvent"("paymentId");

-- CreateIndex
CREATE INDEX "PaymentEvent_userId_eventTimestamp_idx" ON "PaymentEvent"("userId", "eventTimestamp");

-- CreateIndex
CREATE INDEX "PaymentEvent_provider_eventType_idx" ON "PaymentEvent"("provider", "eventType");

-- CreateIndex
CREATE UNIQUE INDEX "WebhookEvent_providerEventId_key" ON "WebhookEvent"("providerEventId");

-- CreateIndex
CREATE INDEX "WebhookEvent_provider_eventType_idx" ON "WebhookEvent"("provider", "eventType");

-- CreateIndex
CREATE INDEX "WebhookEvent_status_receivedAt_idx" ON "WebhookEvent"("status", "receivedAt");

-- CreateIndex
CREATE INDEX "SelfCheckAttempt_userId_sectionId_attemptedAt_idx" ON "SelfCheckAttempt"("userId", "sectionId", "attemptedAt");

-- CreateIndex
CREATE INDEX "ContentVersion_sectionId_version_idx" ON "ContentVersion"("sectionId", "version");

-- CreateIndex
CREATE INDEX "ContentVersion_isActive_idx" ON "ContentVersion"("isActive");

-- CreateIndex
CREATE INDEX "AdminAuditEvent_actorId_createdAt_idx" ON "AdminAuditEvent"("actorId", "createdAt");

-- CreateIndex
CREATE INDEX "AdminAuditEvent_action_createdAt_idx" ON "AdminAuditEvent"("action", "createdAt");

-- CreateIndex
CREATE INDEX "AdminAuditEvent_targetType_targetId_idx" ON "AdminAuditEvent"("targetType", "targetId");

-- CreateIndex
CREATE INDEX "UserPreferenceEvent_userId_changedAt_idx" ON "UserPreferenceEvent"("userId", "changedAt");

-- CreateIndex
CREATE UNIQUE INDEX "BadgeDefinition_badgeId_key" ON "BadgeDefinition"("badgeId");

-- CreateIndex
CREATE INDEX "BadgeDefinition_badgeClass_isActive_idx" ON "BadgeDefinition"("badgeClass", "isActive");

-- CreateIndex
CREATE INDEX "BadgeAward_userId_status_idx" ON "BadgeAward"("userId", "status");

-- CreateIndex
CREATE INDEX "BadgeAward_badgeDefinitionId_idx" ON "BadgeAward"("badgeDefinitionId");

-- CreateIndex
CREATE INDEX "AnalyticsEvent_eventName_serverTimestamp_idx" ON "AnalyticsEvent"("eventName", "serverTimestamp");

-- CreateIndex
CREATE INDEX "AnalyticsEvent_userId_serverTimestamp_idx" ON "AnalyticsEvent"("userId", "serverTimestamp");

-- CreateIndex
CREATE INDEX "AnalyticsEvent_eventCategory_serverTimestamp_idx" ON "AnalyticsEvent"("eventCategory", "serverTimestamp");

-- CreateIndex
CREATE INDEX "DataExportRequest_userId_status_idx" ON "DataExportRequest"("userId", "status");

-- CreateIndex
CREATE INDEX "DataExportRequest_status_requestedAt_idx" ON "DataExportRequest"("status", "requestedAt");

-- CreateIndex
CREATE INDEX "AccountDeletionRequest_userId_status_idx" ON "AccountDeletionRequest"("userId", "status");

-- CreateIndex
CREATE INDEX "AccountDeletionRequest_status_requestedAt_idx" ON "AccountDeletionRequest"("status", "requestedAt");

-- CreateIndex
CREATE INDEX "OutboxEvent_status_createdAt_idx" ON "OutboxEvent"("status", "createdAt");

-- CreateIndex
CREATE INDEX "OutboxEvent_aggregateType_aggregateId_idx" ON "OutboxEvent"("aggregateType", "aggregateId");
