import React from "react";

interface ProfileHeaderSectionProps {
  profile: any | null;
  loading: boolean;
  onEditPhoto: (file: File) => Promise<any>;
}

export const ProfileHeaderSection: React.FC<ProfileHeaderSectionProps> = ({
  profile,
  loading,
  onEditPhoto,
}) => {
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  if (loading && !profile) {
    return (
      <div className="profile-header">
        <div className="profile-avatar skeleton" />
        <div>
          <div className="profile-name skeleton" />
          <div className="profile-meta skeleton" />
        </div>
      </div>
    );
  }

  const fullName = profile?.name || "Unnamed User";
  const firstLetter = fullName.charAt(0).toUpperCase();
  const mobile = profile?.mobile || "—";
  const email = profile?.email || "—";
  const location = profile?.location || "—";
  const bankName = profile?.bank_name || "—";
  const branchName = profile?.branch_name || "—";
  const status = profile?.status || "pending";
  const createdAt = profile?.created_at
    ? new Date(profile.created_at).toLocaleDateString("en-IN", {
        month: "short",
        year: "numeric",
      })
    : "—";

  const handlePhotoClick = () => {
    fileInputRef.current?.click();
  };

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onEditPhoto(file);
    }
    e.target.value = "";
  };

  return (
    <div className="profile-header">
      <div className="profile-avatar-container">
        <div className="profile-avatar">
          {profile?.photo_signed_url ? (
            <img
              src={profile.photo_signed_url}
              alt={`${fullName}'s profile`}
              className="profile-img"
            />
          ) : (
            <div className="avatar-letter">{firstLetter}</div>
          )}
        </div>
       
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          style={{ display: "none" }}
          onChange={handlePhotoChange}
        />
      </div>

      <div className="profile-info">
        <div className="profile-name">{fullName}</div>
        <div className="profile-meta">
          📞 {mobile} | 📧 {email} | CSP Operator since {createdAt}
        </div>

        <div className="profile-badges">
          <span className={`profile-badge status-${status}`}>
            {(status || "pending").toUpperCase()}
          </span>
          <span className="profile-badge bank-badge">
            🏦 {bankName} — {branchName}
          </span>
          <span className="profile-badge location-badge">
            📍 {location}
          </span>
        </div>
      </div>
      <div>
         <button
          className="edit-photo-btn"
          onClick={handlePhotoClick}
          title="Edit profile photo"
        >
          ✏️
        </button>
      </div>
    </div>
  );
};