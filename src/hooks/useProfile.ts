import { changePassword, clearError, loadDashboard, loadProfile, updateProfile, uploadKYC, uploadPhoto } from "@/redux/slices/profileSlice";
import { useAppDispatch } from "./useRedux";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";

export const useProfile = () => {
  const dispatch = useAppDispatch();
  const profileState = useSelector((state: RootState) => state.profile);

  return {
    profile: profileState.profile,
    dashboard: profileState.dashboard,
    loading: profileState.loading,
    error: profileState.error,

    loadProfile: () => dispatch(loadProfile()),
    loadDashboard: () => dispatch(loadDashboard()),

    updateProfile: (data: { name?: string; location?: string }) =>
      dispatch(updateProfile(data)),

    // ✅ FIXED PHOTO UPLOAD
    uploadPhoto: async (file: File) => {
      const formData = new FormData();
      formData.append("photo", file);

      try {
        const res = await dispatch(uploadPhoto(formData)).unwrap();
        console.log("Photo uploaded:", res);
        return res;
      } catch (err) {
        console.error("Photo upload failed:", err);
        throw err;
      }
    },

    // ✅ FIXED KYC UPLOAD - Matches component + backend perfectly
    uploadKYC: async (files: { outlet_photo?: File; bank_letter?: File }) => {
      const formData = new FormData();
      if (files.outlet_photo) formData.append("kyc_doc", files.outlet_photo);     // Backend expects "kyc_doc"
      if (files.bank_letter) formData.append("kyc_doc2", files.bank_letter);      // Backend expects "kyc_doc2"

      try {
        const res = await dispatch(uploadKYC(formData)).unwrap();
        await dispatch(loadProfile());  // Refresh profile with new URLs
        console.log("KYC uploaded:", res);
        return res;
      } catch (err) {
        console.error("KYC upload failed:", err);
        throw err;
      }
    },

    changePassword: (data: { currentPassword: string; newPassword: string }) =>
      dispatch(changePassword(data)),

    clearError: () => dispatch(clearError()),
  };
};