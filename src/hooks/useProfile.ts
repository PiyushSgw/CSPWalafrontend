import {
  changePassword,
  clearError,
  loadDashboard,
  loadProfile,
  updateProfile,
  updateBankDetails,
  uploadKYC,
  uploadPhoto,
} from "@/redux/slices/profileSlice";
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

    updatePersonalInfo: (data: {
      name?: string;
      mobile?: string;
      location?: string;
    }) => dispatch(updateProfile(data)).unwrap(),

    onUpdateBank: (data: {
      outletName?: string;
      cspCode?: string;
      primaryBank?: string;
      branch?: string;
      ifsc?: string;
      agentCode?: string;
      address?: string;
    }) =>
      dispatch(
        updateBankDetails({
          outlet_name: data.outletName,
          bank_name: data.primaryBank,
          branch_name: data.branch,
          ifsc: data.ifsc,
          agent_code: data.agentCode,
          location: data.address,
        })
      ).unwrap(),

    uploadPhoto: async (file: File) => {
      const formData = new FormData();
      formData.append("photo", file);

      const res = await dispatch(uploadPhoto(formData)).unwrap();
      return res;
    },

    uploadKYC: async (files: { outlet_photo?: File; bank_letter?: File }) => {
      const formData = new FormData();
      if (files.outlet_photo) formData.append("kyc_doc", files.outlet_photo);
      if (files.bank_letter) formData.append("kyc_doc2", files.bank_letter);

      const res = await dispatch(uploadKYC(formData)).unwrap();
      await dispatch(loadProfile());
      return res;
    },

    change_Password: (data: { current_Password: string; new_Password: string;}) =>
      dispatch(changePassword(data)),

    clearError: () => dispatch(clearError()),
  };
};