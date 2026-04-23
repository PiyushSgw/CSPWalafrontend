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

type PersonalForm = {
  firstName: string;
  lastName: string;
  mobile: string;
  email: string;
  address: string;
};

type BankForm = {
  outletName: string;
  cspCode: string;
  primaryBank: string;
  branch: string;
  ifsc: string;
  agentCode: string;
  address: string;
};

const defaultPersonalForm: PersonalForm = {
  firstName: "",
  lastName: "",
  mobile: "",
  email: "",
  address: "",
};

const defaultBankForm: BankForm = {
  outletName: "",
  cspCode: "",
  primaryBank: "",
  branch: "",
  ifsc: "",
  agentCode: "",
  address: "",
};

export default function ProfilePage() {
  const [activeTab, setActiveTab] = useState<TabId>("pt-personal");
  const [saving, setSaving] = useState(false);
  const profileHook = useProfile();

  const [personalForm, setPersonalForm] = useState<PersonalForm>(defaultPersonalForm);
  const [bankForm, setBankForm] = useState<BankForm>(defaultBankForm);

  const [alert, setAlert] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);

  useEffect(() => {
    profileHook.loadProfile();
    profileHook.loadDashboard();
  }, []);

  useEffect(() => {
    if (!profileHook.profile) return;

    const profile = profileHook.profile;
    const nameParts = (profile.name || "").trim().split(" ");

    setPersonalForm({
      firstName: nameParts[0] || "",
      lastName: nameParts.slice(1).join(" ") || "",
      mobile: profile.mobile || "",
      email: profile.email || "",
      address: profile.location || "",
    });

    setBankForm({
      outletName: profile.outlet_name || "",
      cspCode: profile.csp_code || "",
      primaryBank: profile.bank_name || "",
      branch: profile.branch_name || "",
      ifsc: profile.ifsc || "",
      agentCode: profile.agent_code || "",
      address: profile.location || "",
    });
  }, [profileHook.profile]);

  const handleSave = async () => {
    try {
      setSaving(true);
      setAlert(null);

      if (activeTab === "pt-personal") {
        const fullName = `${personalForm.firstName} ${personalForm.lastName}`.trim();

        await profileHook.updatePersonalInfo({
          name: fullName,
          mobile: personalForm.mobile,
          location: personalForm.address,
        });

        setAlert({
          type: "success",
          message: "Personal information updated successfully.",
        });
      }

      if (activeTab === "pt-bank") {
        await profileHook.onUpdateBank(bankForm);

        setAlert({
          type: "success",
          message: "CSP & bank details updated successfully.",
        });
      }

      await profileHook.loadProfile();
    } catch (error: any) {
      setAlert({
        type: "error",
        message: error?.message || "Failed to save changes.",
      });
    } finally {
      setSaving(false);
    }
  };

  const renderTab = () => {
    switch (activeTab) {
      case "pt-personal":
        return (
          <PersonalInfoTabSection
            profile={profileHook.profile}
            dashboard={profileHook.dashboard}
            loading={profileHook.loading}
            error={profileHook.error}
            onClearError={profileHook.clearError}
            form={personalForm}
            setForm={setPersonalForm}
          />
        );

      case "pt-bank":
        return (
          <CspBankSetupTabSection
            profile={profileHook.profile}
            dashboard={profileHook.dashboard}
            loading={profileHook.loading}
            form={bankForm}
            setForm={setBankForm}
          />
        );

      case "pt-docs":
        return (
          <DocumentTabSection
            profile={profileHook.profile}
            loading={profileHook.loading}
            onUploadKYC={profileHook.uploadKYC}
          />
        );

      case "pt-security":
        return (
          <SecurityTabSection
            loading={profileHook.loading}
            onChange_Password={profileHook.change_Password}
            onClearError={profileHook.clearError}
            loginActivity={[]}
          />
        );

      default:
        return null;
    }
  };

  return (
    <div className="profile-page">
      <PageHeaderSection
        onSave={handleSave}
        saving={saving}
        loading={profileHook.loading}
      />

      {alert && (
        <div className={`alert-box ${alert.type}`} style={{ marginBottom: 16 }}>
          <div className="alert-body">{alert.message}</div>
        </div>
      )}

      <ProfileHeaderSection
        profile={profileHook.profile}
        loading={profileHook.loading}
        onEditPhoto={profileHook.uploadPhoto}
      />

      <ProfileTabBarSection
        activeTab={activeTab}
        onTabChange={setActiveTab}
      />

      {renderTab()}
    </div>
  );
}