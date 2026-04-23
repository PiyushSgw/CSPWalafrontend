import { useSelector } from 'react-redux'
import type { RootState } from '../redux/store'
import { useAppDispatch } from './useRedux'
import {
  fetchWalletBalance,
  fetchLedger,
  fetchRechargeRequests,
  fetchPaymentDetails,
  submitRechargeRequest,
  clearPaymentDetails,
  clearError,
} from '../redux/slices/walletSlice'

export const useWallet = () => {
  const dispatch = useAppDispatch()
  const wallet = useSelector((state: RootState) => state.wallet)

  return {
    ...wallet,

    loadWallet: () => {
      dispatch(fetchWalletBalance())
      dispatch(fetchLedger({ limit: 20 }))
      dispatch(fetchRechargeRequests({ limit: 10 }))
    },

    loadLedger: (params = {}) => dispatch(fetchLedger(params)),
    loadRequests: (params = {}) => dispatch(fetchRechargeRequests(params)),
    loadPaymentDetails: (amount: number) => dispatch(fetchPaymentDetails(amount)),
    submitRecharge: (data: {
      amount: number
      utr: string
      payment_mode: string
    }) => dispatch(submitRechargeRequest(data)),

    resetPaymentDetails: () => dispatch(clearPaymentDetails()),
    clearWalletError: () => dispatch(clearError()),
  }
}