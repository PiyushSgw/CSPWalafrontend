"use client";

import React, { useEffect, useState } from "react";
import { useProfile } from "@/hooks/useProfile";

import { ProfileHeaderSection } from "./ProfileHeaderSection";
import { ProfileTabBarSection } from "./ProfileTabBarSection";
import { PersonalInfoTabSection } from "./PersonalInfoTabSection";
import { CspBankSetupTabSection } from "./CspBankSetupTabSection";
import { DocumentTabSection } from "./DocumentTabSection";
import { SecurityTabSection } from "./SecurityTabSection";
import { PageHeaderSection } from "./PageHeaderSection";

export type TabId = "pt-personal" | "pt-bank" | "pt-docs" | "pt-security";

export default function ProfilePage() {
  const [activeTab, setActiveTab] = useState<TabId>("pt-personal");
  const profileHook = useProfile();

  useEffect(() => {
    profileHook.loadProfile();
    profileHook.loadDashboard();
  }, []);

  // ✅ Calculate completion percentage locally (no hook changes needed)
  const getCompletionPercentage = () => {
    const profile = profileHook.profile;
    if (!profile) return 0;

    const fields = [
      profile.name,
      profile.email,
      profile.mobile,
      profile.bio,
      profile.kyc_status !== 'pending'
    ];

    const completed = fields.filter(Boolean).length;
    return Math.round((completed / fields.length) * 100);
  };

  // const completionPercentage = getCompletionPercentage();

  const renderTab = () => {
    switch (activeTab) {
      case "pt-personal":
        return (
          <PersonalInfoTabSection
            profile={profileHook.profile}
            loading={profileHook.loading}
            error={profileHook.error}
            onClearError={profileHook.clearError}
          />
        );

      case "pt-bank":
        return (
          <CspBankSetupTabSection
            profile={profileHook.profile}
            dashboard={profileHook.dashboard}
            loading={profileHook.loading}
            onUpdateBank={profileHook.onUpdateBank}
          />
        );

      case "pt-docs":
        return (
          <DocumentTabSection
            profile={profileHook.profile}   // ✅ MUST
            loading={profileHook.loading}
            onUploadKYC={profileHook.uploadKYC}
          />
        );

      case "pt-security":
        return (
          <SecurityTabSection
            loading={profileHook.loading}
            onChangePassword={profileHook.changePassword}
            onClearError={profileHook.clearError}
            loginActivity={profileHook.loginActivity || []}
          />
        );

      default:
        return null;
    }
  };

  return (
    <div className="profile-page">
      {/* ✅ Added PageHeaderSection as requested */}
      <PageHeaderSection onSave={function (): void {
        throw new Error("Function not implemented.");
      }} />

      <ProfileHeaderSection
        profile={profileHook.profile}
        loading={profileHook.loading}
        onEditPhoto={profileHook.uploadPhoto}   // ✅ ADD THIS
      />

      <ProfileTabBarSection
        activeTab={activeTab}
        onTabChange={setActiveTab}
      />

      {renderTab()}
    </div>
  );
}